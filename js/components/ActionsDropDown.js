import { useState } from "react";
import useStickyState from "../../utils/useStickyState";
import { accept } from "/js/emails/accept.js";
import { reject } from "/js/emails/reject.js";
import { teacher } from "/js/emails/teacher.js";
import { postData } from "/js/postData.js";

const EMAILS = {
  accept,
  reject,
  teacher,
}

const EMAILS_SUBJECTS = {
  accept: "Welcome to Hack Club",
  reject: "Regarding Your Hack Club Application",
  teacher: "Regarding Your Hack Club Application",
}

export const ActionsDropDown = ({ id, entry }) => {
  const [appStatus, setAppStatus] = useState(entry["Status"]);
  const [open, setOpen] = useState(false);
  const [formStatus, setFormStatus] = useState("ready");
  const [to, setTo] = useState(entry["Leaders' Emails"], 'to')
  const [responseModal, setResponseModal] = useState({ open: false, type: "" });
  const [responseEmail, setResponseEmail] = useState("")
  const [bcc, setBcc] = useStickyState('bcc', '')
  const [cc, setCc] = useStickyState('cc', 'clubs@hackclub.com')
  const [from, setFrom] = useStickyState('from', 'clubs@hackclub.com')

  const setModal = (open, type) => {
    setResponseModal({ open, type });
    setResponseEmail(type !== "" ? EMAILS[type](entry["Leader(s)"]) : "");
  }

  const onRespond = async () => {
    // if accept, create channel, generate invite link
    // for all send response email

    // disable the send button
    setFormStatus("loading")

    // check if the "from" field is verified on amazon SES
    const email = {
      to: to.split(","),
      from,
      cc,
      bcc,
      subject: EMAILS_SUBJECTS[responseModal.type],
      message: responseEmail, 
    }

    let res, pendingStatus
    if (responseModal.type === "accept") {
      res = await postData("/api/acceptTrackedApp", { 
        recordID: id,
        email
      })
      pendingStatus = "awaiting onboarding"
    } else { // reject | teacher
      res = await postData("/api/rejectTrackedApp", { 
        recordID: id,
        teacher: responseModal.type === "teacher",
        email
      })
      pendingStatus = "rejected"
    }

    if (!res.ok) {
      if (res.err === "verify email") {
        alert(`We sent you a verification link to ${res.email}, once you click it, come back here and press send again.`)
      } else {
        alert('Something went wrong. Please grab an adult.')
      }
    } else {
      setAppStatus(pendingStatus)
      setResponseModal({ open: false, type: ""})
    }
    setFormStatus("ready")
  }

  return <>
    <div className="application-link" onClick={() => setOpen(!open)}>
      <span>Actions</span>
      <span className="app-link-arrow noselect">{open ? "▽" : "▷"}</span>
    </div>
    { open && <>
        <div className="item-key"><b>Current Status:</b> {appStatus}</div>
        <div className="actions-buttons">
          <button 
            className="action-button accept" 
            onClick={() => setModal(true, "accept")}>
            accept
          </button>
          <button 
            className="action-button reject"
            onClick={() => setModal(true, "reject")}>
            reject
          </button>
          <button 
            className="action-button teacher"
            onClick={() => setModal(true, "teacher")}>
            teacher
          </button>
        </div> 
        <div className="item-key">
          <b>accept:</b> sends acceptance email, creates slack channel, changes status to awaiting onboarding
        </div>
        <div className="item-key"><b>reject:</b> sends rejection email, changes status to rejected</div>
        <div className="item-key"><b>teacher:</b> sends teacher rejection email, changes status to rejected, adds "teacher" to note</div>
      </>
    }
    { responseModal.open && <div className="response-modal">
        <fieldset>
          <legend>Email settings</legend>
          <label for="to">Recipients (comma seperated</label>
          <input name="to" className="to" placeholder="to (comma seperated)" type="text" value={to} onInput={e => setTo(e.target.value)}/>
          <br />
          <label for="from">Sender email</label>
          <input name="from" className="from" placeholder="from" type="email" value={from} onInput={e => setFrom(e.target.value)}/>
          <br />
          <label for="cc">CC (comma seperated)</label>
          <input name="cc" className="cc" placeholder="cc (comma seperated)" type="text" value={cc} onInput={e => setCc(e.target.value)}/>
          <br />
          <label for="bcc">BCC (comma seperated)</label>
          <input className="bcc" placeholder="BCC (comma seperated)" type="text" value={bcc} onInput={e => setBcc(e.target.value)}/>
        </fieldset>
        <fieldset>
          <legend>Message</legend>
        Here is the <b>{responseModal.type}</b> email you will respond with:
        <textarea className="response-email" value={responseEmail} onInput={(e) => setResponseEmail(e.target.value)}></textarea>
        </fieldset>
        <div className="response-modal-buttons">
          <button 
            className="action-button"
            style={{ background: formStatus=="loading" ? "#333" : "blue" }}
            disabled={formStatus!=="ready"}
            onClick={onRespond}>
            send
          </button>
          <button 
            className="action-button"
            style={{ background: formStatus=="loading" ? "#333" : "grey" }}
            disabled={formStatus!=="ready"}
            onClick={() => setResponseModal({ open: false, type: ""})}>
            cancel
          </button>
        </div>
      </div>
    }
  </>
}

// email should include link to give to bouncer on slack which will mark slack account as leader
// will automatically add them to leader channel
// will give them leader permissions?
// can they make leaders
// should they make their own club channel
