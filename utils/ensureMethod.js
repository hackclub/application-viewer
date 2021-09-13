export default ({req, methods = [], method = ''}) => {
  console.log('ensureMethod', methods, method)
  if (method !== '') {
    methods = [method];
  }
  console.log('ensureMethod2', methods, method)
  switch (req.method.toUpperCase()) {
    case 'OPTIONS':
      // OPTIONS should always be allowed
      req.respond(
        {
          status: 204,
          body: JSON.stringify(
            { status: "YIPPE YAY. YOU HAVE CLEARANCE TO PROCEED." },
          ),
        },
      );
      break;
    case 'GET':
      if (!methods.includes('GET')) {
        let error = new Error(`GET out of here! (Only '${methods.join(',')}' method(s) are allowed)`);
        error.status = 405;
        throw error
      }
      break;
    case 'PUT':
      if (!methods.includes('PUT')) {
        let error = new Error(`PUT that request back where you found it! (Only '${methods.join(',')}' method(s) are allowed)`);
        error.status = 405;
        throw error
      }
      break;
    default:
      if (!methods.includes(req.method)) {
        let error = new Error(`Method '${req.method}' not allowed! (Only '${methods.join(',')}' method(s) are allowed)`);
        error.status = 405;
        throw error
      }
      break;
  }
}