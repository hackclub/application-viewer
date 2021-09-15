import nc from "next-connect";
import cors from "cors";

// this is sensative information
const airtableHook = process.env.EMAIL_HOOK;

const handler = nc()
  // use connect based middleware
  .use(cors())
  .post(async (req, res) => {
    const response = await fetch(airtableHook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    }).then(r => r.json());
    
    res.json(response);
  });

export default handler;