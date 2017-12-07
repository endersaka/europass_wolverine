//import * as hogan from 'hogan';
//import * as request from 'request';

var hogan = require('hogan.js');
var request = require('request');

console.log('Hogan ', hogan);
console.log('Request ', request);

function europassJSONReceived(json, response) {
  var jsonCV = JSON.parse(json);
  console.log('jsonCV ', jsonCV);
}

function htmlTemplateReceived(html, response) {
  console.log('html template ', html);
}

var jsonCallback = function (error, response, content) {
  if (error) {
    console.log('error ', error);
    return null;
  } else {
    if (response && response.statusCode === 200) {
      console.log('json: ', content);
      console.log('response: ', response);
      var contentType = response.headers['content-type'].split(';')[0];
      switch (contentType) {
        case 'application/json':
          europassJSONReceived(content, response);
          break;
        case 'application/xml':
          htmlTemplateReceived(content, response);
          break;
        default:

      }


    } else {
      console.log('statusCode: ', response.statusCode);
    }
  }
}

var requestEuropasXML = request(
  'http://localhost:8080/CV-Europass-20170407-IT.xml',
  function (error, response, body) {
    if (error) {
      console.log('error ', error);
      return null;
    } else {
      if (response && response.statusCode === 200) {
        //console.log('body: ', body);

        var jsonOptions = {
          url: 'https://europass.cedefop.europa.eu/rest/v1/document/to/json',
          headers: {
            'Content-Type': 'application/xml'
          },
          body: body
        };

        var requestEuropassJSON = request.post(jsonOptions, jsonCallback);
      } else {
        console.log('statusCode: ', response.statusCode);
      }
    }

  }
);
