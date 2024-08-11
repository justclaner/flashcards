const allowCors = (req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Origin', 'https://to-do-client-teal.vercel.app')
    res.header('Access-Control-Allow-Methods', 'GET,PATCH,DELETE,POST,PUT,OPTIONS')
    res.header(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
      }
    next();
  }
 
  export default allowCors;
  
  