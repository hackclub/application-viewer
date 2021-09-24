/** @format */

import { getSession } from 'next-auth/client';
import { signIn } from 'next-auth/dist/client';

const Test = (props) => {
  console.log(props);
  return <div>signed in</div>;
};

export default Test;
