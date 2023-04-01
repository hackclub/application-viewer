import { useState } from "react";
import { ResponseModal } from "./ResponseModal.jsx";



export const ActionsDropDown = ({ id, entry, refers="apply" }) => {
  const [appStatus, setAppStatus] = useState(entry["Status"]);
  const [open, setOpen] = useState(false);
  const [responseModal, setResponseModal] = useState({ open: false, type: "" });

  const setModal = (open, type) => {
    setResponseModal({ open, type });
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
    { responseModal.open && <ResponseModal {...{ id, entry, setAppStatus, setResponseModal, responseModal, refers }}/> }
  </>
}

// email should include link to give to bouncer on slack which will mark slack account as leader
// will automatically add them to leader channel
// will give them leader permissions?
// can they make leaders
// should they make their own club channel
