//import * as hogan from 'hogan';
//import * as request from 'request';

const hogan = require('hogan.js');
const request = require('request');

console.log('Hogan ', hogan);
console.log('Request ', request);

var data = null;

var utility = {
    escapeQuotes: function(string) {
        return string.replace(/"/g, '\\"');
    },
    unescapeQuotes: function(string) {
        return string.replace(/\\"/g, '"');
    }
};

function europassJSONReceived(json, response) {
  console.log('JSON content: ', response.body);
  console.log('response: ', response);

  var logJSON = JSON.parse(json);
  console.log('Object from JSON ', logJSON);

  data = logJSON;
  var requestHTMLTemplate = request('http://localhost:8080/templates/html/ender.mustache', jsonCallback);
}

function htmlTemplateReceived(html, response) {
  console.log('html template ', html);

  if (data) {
    var template = hogan.compile(html);
    document.querySelector('body').innerHTML = template.render(data);
  }
}

var jsonCallback = function (error, response, content) {
  if (error) {
    console.log('error ', error);
    return null;
  } else {
    if (response && response.statusCode === 200) {
      var contentType = response.headers['content-type'].split(';')[0];

      switch (contentType) {
        case 'application/json':
          europassJSONReceived(content, response);
          break;
        case 'application/xml':
          htmlTemplateReceived(content, response);
          break;
        default:
          htmlTemplateReceived(content, response);
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
