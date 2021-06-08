const axios = require('axios');

const sendSoapRequest = (xml, serviceUrl, headers) => {
  const requestHeaders = {
    Authorization: headers.authorization,
    SOAPAction: headers.soapaction,
    'Content-Type': 'text/xml',
  };

  return new Promise(async (resolve, reject) => {
    try {
      const responseFromWebService = await axios.post(serviceUrl, xml, {
        headers: requestHeaders,
      });
      console.log('responseFromWebService', responseFromWebService);
      resolve(responseFromWebService.data);
    } catch (error) {
      console.log('error', error);
      reject(error);
    }
  });
};

module.exports = {
  sendSoapRequest,
};
