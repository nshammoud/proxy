const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const { sendSoapRequest } = require('./services/soapRequests');

const app = express();

// ---------------------------------------------------------------------
//                  application-level  middlewares
// ---------------------------------------------------------------------

app.use(helmet()); //Helmet helps secure the Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
app.use(cors()); // set some cors headers in each response

/*
 *  Use a middleware to parse json request-payload
 *  There are 2 ways, either use express.json() method (which internally uses body-parser to parse the body)
 *  Or use body-parser directly,
 *
 *
 * if 'content-type' is 'application/json;   ==> use express.json() OR bodyParser.json()
 * if 'content-type' is 'application/x-www-form-urlencoded;   ==> use express.urlencoded() OR bodyParser.urlencoded()
 */

//  parse json and urlencoded data in req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ---------------------------------------------------------------------
//                         Starting Server
// ---------------------------------------------------------------------

const PROXY_SERVER_PORT = 4000;
app.listen(PROXY_SERVER_PORT, () => {
  console.log(`Starting proxy-server, listening on port: ${PROXY_SERVER_PORT}`);
});

// ---------------------------------------------------------------------
//                          Server Routes
// ---------------------------------------------------------------------

app.get('/', (req, res) => {
  console.log('req.ip', req.ip);
  console.log('get request to test-route');
  console.log('res.locals', res.locals);
  return res.json('Welcome to proxy-server');
});

app.post('/', async (req, res) => {
  // console.log('this is the post route');
  console.log('headers', req.headers);

  // res.send('post route');

  try {
    console.log('****************************');
    console.log('*** incoming request ***');
    console.log(' req.body', req.body);
    console.log('****************************');
    const headers = req.headers;
    const { xml, serviceUrl } = req.body;
    if (!xml || !serviceUrl) throw new Error('Missing required arguments');
    const response = await sendSoapRequest(xml, serviceUrl, headers);
    return res.send(response);
  } catch (error) {
    console.log(`error`, error);
    const resp = error.response.data || error;
    return res.status(500).send(resp);
  }
});
