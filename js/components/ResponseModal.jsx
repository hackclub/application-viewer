import { useState } from "react";
import useStickyState from "../../utils/useStickyState";
import { accept } from "/js/emails/accept.js";
import { reject } from "/js/emails/reject.js";
import { postData } from "/js/postData.js";

const EMAILS = {
	accept,
	reject,
}

const EMAILS_SUBJECTS = {
	accept: "Welcome to Hack Club",
	reject: "Regarding Your Hack Club Application",
}

const REJECTION_REASONS = [
	"Reject - Adult",
	"Reject - AI",
	"Reject - Low Effort Answers"
]

export const ResponseModal = ({ id, entry, setAppStatus, setResponseModal, responseModal, refers }) => {
	const [formStatus, setFormStatus] = useState("ready");
	const [rejectionReason, setRejectionReason] = useState(REJECTION_REASONS[0]);
	
	// Map new field names to old expected format
	const leaderEmail = entry["submission_email"] || entry["leader_email"] || ""
	const leaderName = entry["calc_contact"] || `${entry["leader_first_name"] || ""} ${entry["leader_last_name"] || ""}`.trim()
	
	const [to, setTo] = useState(leaderEmail, 'to')
	const [from, setFrom] = useStickyState('from', 'clubs@hackclub.com')
	const [responseEmail, setResponseEmail] = useState(responseModal.type !== "" ? EMAILS[responseModal.type](leaderName, from) : "")
	const [subject, setSubject] = useState(`${EMAILS_SUBJECTS[responseModal.type]}: ${leaderName}`)
	const [bcc, setBcc] = useStickyState('bcc', '')
	const [cc, setCc] = useStickyState('cc', 'clubs@hackclub.com')

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
			subject,
			message: responseEmail,
		}

		let res, pendingStatus
		if (responseModal.type === "accept") {
			res = await postData("/api/acceptTrackedApp", {
				recordID: id,
				email,
				refers
			})
			pendingStatus = "accepted"
		} else { // reject
			res = await postData("/api/rejectTrackedApp", {
				recordID: id,
				rejectionReason,
				email,
				refers
			})
			pendingStatus = "rejected"
		}

		if (!res.ok) {
			if (res.err === "verify email") {
				alert(`We sent you a verification link to ${res.email}, once you click it, come back here and press send again.`)
			} else {
				alert('Something went wrong D:')
			}
		} else {
			setAppStatus(pendingStatus)
			setResponseModal({ open: false, type: "" })
		}
		setFormStatus("ready")
	}

	return <div className="response-modal" onClick={() => setResponseModal({ open: false, type: "" })}>
		<div className="response-modal-content" onClick={e => e.stopPropagation()}>
			<fieldset>
				<legend>Email settings</legend>
				{responseModal.type === "reject" && (
					<>
						<label htmlFor="rejectionReason">Rejection Reason</label>
						<select 
							name="rejectionReason" 
							className="rejection-reason" 
							value={rejectionReason} 
							onChange={e => setRejectionReason(e.target.value)}
							style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}>
							{REJECTION_REASONS.map(reason => (
								<option key={reason} value={reason}>{reason}</option>
							))}
						</select>
					</>
				)}
				<label htmlFor="from">Sender email</label>
				<input name="from" className="from" placeholder="from" type="email" value={from} onInput={e => setFrom(e.target.value)} />
				<br />
				<label htmlFor="to">Recipients (comma seperated)</label>
				<input name="to" className="to" placeholder="to (comma seperated)" type="text" value={to} onInput={e => setTo(e.target.value)} />
				<br />
				<label htmlFor="cc">CC (comma seperated)</label>
				<input name="cc" className="cc" placeholder="cc (comma seperated)" type="text" value={cc} onInput={e => setCc(e.target.value)} />
				<br />
				<label htmlFor="bcc">BCC (comma seperated)</label>
				<input className="bcc" placeholder="BCC (comma seperated)" type="text" value={bcc} onInput={e => setBcc(e.target.value)} />
				<br />
				<label htmlFor="subject">Subject</label>
				<input className="subject" placeholder="subject" type="text" value={subject} onInput={e => setSubject(e.target.value)} />
			</fieldset>
			<fieldset>
				<legend>Message</legend>
				Here is the <b>{responseModal.type}</b> email you will respond with:
				<textarea className="response-email" value={responseEmail} onInput={(e) => setResponseEmail(e.target.value)}></textarea>
			</fieldset>
			<div className="response-modal-buttons">
				<button
					className="action-button accept"
					disabled={formStatus !== "ready"}
					onClick={onRespond}
					style={{ 
						background: formStatus === "loading" ? "#94a3b8" : "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
						border: "none",
						color: "white",
						cursor: formStatus === "loading" ? "not-allowed" : "pointer"
					}}>
					{formStatus === "loading" ? "Sending..." : "send it"}
				</button>
				<button
					className="action-button"
					disabled={formStatus !== "ready"}
					onClick={() => setResponseModal({ open: false, type: "" })}
					style={{ 
						background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
						border: "none",
						color: "white",
						cursor: formStatus === "loading" ? "not-allowed" : "pointer"
					}}>
					nah
				</button>
			</div>
		</div>
	</div>
}