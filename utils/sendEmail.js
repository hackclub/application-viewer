// this is sensative information
const airtableHook = process.env.EMAIL_HOOK;

const handler = async (email) => {
  console.log("I'm trying to send an email", email);
  
  const response = await fetch(airtableHook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(email)
  }).then(r => r.json());
  
  return response;
}



export default handler;