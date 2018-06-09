//import * as hogan from 'hogan';
//import * as request from 'request';

const hogan = require('hogan.js');
const request = require('request');
// console.log('Hogan ', hogan);
// console.log('Request ', request);

const domain = 'localhost';
const port = '8080';
const path = [
  'CV-Europass-20170407-IT.xml',
  'templates/html/ender.mustache',
  'json/skills.json',
  'templates/html/ender-skills.mustache'
];

var phase = -1;

var data = null;
var skills = null;

function computeURL(domain, path, port = null) {
  return 'http://' + domain + (port ? (':' + port) : '') + '/' + path;
}

var utility = {
    escapeQuotes: function(string) {
        return string.replace(/"/g, '\\"');
    },
    unescapeQuotes: function(string) {
        return string.replace(/\\"/g, '"');
    }
};

function requestEuropassJSON(xml) {
  let options = {
    url: 'https://europass.cedefop.europa.eu/rest/v1/document/to/json',
    headers: {
      'Content-Type': 'application/xml'
    },
    body: xml
  };

  let req = request.post(options, requestCallback);
}

var requestCallback = function (error, response, body) {
  if (error) {
    console.log('Error ', error);
  } else {
    if (response && response.statusCode === 200) {
      switch (phase) {
        case 0:
          phase++;
          requestEuropassJSON(body);
          break;
        case 1:
          phase++;
          data = JSON.parse(body);
          console.log('Object from JSON ', data);
          var requestHTMLTemplate = request(computeURL(domain, path[1], port), requestCallback);
          break;
        case 2:
          phase++;
          console.log('HTML Template: ', body);
          if (data) {
            let template = hogan.compile(body);
            document.querySelector('body').innerHTML = template.render(data);
          }
          let skillsRequest = request(computeURL(domain, path[2], port), requestCallback);
          break;
        case 3:
          phase++;
          skills = JSON.parse(body);
          var requestSkillsTemplate = request(computeURL(domain, path[3], port), requestCallback);
          break;
        case 4:
          phase++;
          let template = hogan.compile(body);
          document.querySelector('.side').innerHTML = template.render(skills);

          let skillsDOM = document.querySelectorAll('.skill');
          for (var i = 0; i < skillsDOM.length; i++) {
            let skillBar = skillsDOM.item(i).querySelector('.skill-bar');
            let percentage = skills.skills[i].value * 100;
            skillBar.width = percentage + '%';
          }
          break;
        default:

      }
    } else {
      console.log('statusCode: ', response.statusCode);
    }
  }
}

phase++;
var europassRequest = request(computeURL(domain, path[0], port), requestCallback);

// Esempio di estrazione e verifica del mime-type
// var contentType = response.headers['content-type'].split(';')[0];
//
// switch (contentType) {
//   case 'application/json':
//     europassJSONReceived(content, response);
//     break;
//   case 'application/xml':
//     htmlTemplateReceived(content, response);
//     break;
//   default:
//     htmlTemplateReceived(content, response);
