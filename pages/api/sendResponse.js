import nc from "next-connect";
import cors from "cors";
import { postData } from "/js/postData.js";

// this is sensative information
const airtableHook = process.env.EMAIL_HOOK;

const handler = nc()
  // use connect based middleware
  .use(cors())
  .post(async (req, res) => {
    const response = await postData(airtableHook, req.body);
    
    res.json(response);
  });

export default handler;