import { useState } from "react";
import { accept } from "/js/emails/accept.js";
import { reject } from "/js/emails/reject.js";
import { teacher } from "/js/emails/teacher.js";
import { postData } from "/js/postData.js";
import airtable from "../../utils/airtable";

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
  const [responseModal, setResponseModal] = useState({ open: false, type: "" });
  const [responseEmail, setResponseEmail] = useState("")
  
  const setModal = (open, type) => {
    setResponseModal({ open, type });
    setResponseEmail(type !== "" ? EMAILS[type](entry["Leader(s)"]) : "");
  }

  const onRespond = async () => {
    // if accept, create channel, generate invite link
    // for all send response email

    const email = {
      adresses: entry["Leaders' Emails"] + ",clubs@hackclub.com",
      subject: EMAILS_SUBJECTS[responseModal.type],
      content: responseEmail, 
    }

    if (responseModal.type === "accept") {
      const res = await postData("/api/acceptTrackedApp", { 
        recordID: id,
        email
      })

      setAppStatus("awaiting onboarding");
    } else { // reject | teacher
      await postData("/api/rejectTrackedApp", { 
        recordID: id,
        teacher: responseModal.type === "teacher",
        email
      })

      setAppStatus("rejected");
    }
    
    setResponseModal({ open: false, type: ""})
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
          <b>accept:</b> sends acceptance email, creates slack channel, creates leader check-in link, changes status to awaiting onboarding
        </div>
        <div className="item-key"><b>reject:</b> sends rejection email, changes status to rejected</div>
        <div className="item-key"><b>teacher:</b> sends teacher rejection email, changes status to rejected, adds "teacher" to note</div>
      </>
    }
    { responseModal.open && <div className="response-modal">
        Here is the <b>{responseModal.type}</b> email you will respond with:
        <textarea className="response-email" value={responseEmail} onInput={(e) => setResponseEmail(e.target.value)}></textarea>
        <div className="response-modal-buttons">
          <button 
            className="action-button"
            style={{ background: "blue" }}
            onClick={onRespond}>
            send
          </button>
          <button 
            className="action-button"
            style={{ background: "grey" }}
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
