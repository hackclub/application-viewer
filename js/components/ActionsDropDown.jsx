import { useState } from "react";
import { ResponseModal } from "./ResponseModal.jsx";



export const ActionsDropDown = ({ id, entry, refers="apply" }) => {
  const [appStatus, setAppStatus] = useState(entry["Status"]);
  const [responseModal, setResponseModal] = useState({ open: false, type: "" });

  const setModal = (open, type) => {
    setResponseModal({ open, type });
  }

  return <>
    <h2 className="section-header" style={{ cursor: 'default' }}>the big guns</h2>
    
    <div className="item">
      <div className="question">status</div>
      <div style={{ 
        fontWeight: 'bold',
        color: '#ec3750',
        textTransform: 'capitalize',
        fontSize: '0.9rem'
      }}>
        {appStatus}
      </div>
    </div>
    
    <div className="actions-buttons" style={{ flexDirection: 'column', gap: '0.5rem' }}>
      <button 
        className="action-button accept" 
        onClick={() => setModal(true, "accept")}
        style={{ width: '100%', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
        let them in
      </button>
      <button 
        className="action-button reject"
        onClick={() => setModal(true, "reject")}
        style={{ width: '100%', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
        reject
      </button>
      <button 
        className="action-button teacher"
        onClick={() => setModal(true, "teacher")}
        style={{ width: '100%', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
        teacher
      </button>
    </div> 
    
    <div className="item">
      <div style={{ fontSize: '0.7rem', color: '#666', lineHeight: '1.3' }}>
        <div style={{ marginBottom: '0.25rem' }}>
          <strong>accept:</strong> welcome email + leader books call
        </div>
        <div style={{ marginBottom: '0.25rem' }}>
          <strong>reject:</strong> rejection email, add a reason!
        </div>
        <div>
          <strong>teacher:</strong> teacher rejection email
        </div>
      </div>
    </div>
    
    { responseModal.open && <ResponseModal {...{ id, entry, setAppStatus, setResponseModal, responseModal, refers }}/> }
  </>
}

// email should include link to give to bouncer on slack which will mark slack account as leader
// will automatically add them to leader channel
// will give them leader permissions?
// can they make leaders
// should they make their own club channel
