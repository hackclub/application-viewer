import { checkEmail, sendEmail, sendVerification } from "./ses"

export default async ({ from, to, cc, bcc, message, subject }) => {
  const verifiedSender = await checkEmail({ email: from })
  if (!verifiedSender) {
    await sendVerification({ email: from })
    return 'verifying'
  } else {
    await sendEmail({ from, to, cc, bcc, message, subject })
    return 'sent'
  }
}