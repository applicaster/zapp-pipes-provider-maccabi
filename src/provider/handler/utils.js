const convert = require('xml-js');
const moment = require('moment');

function parseXML(xml) {
  const converted = convert.xml2json(xml, { compact: true, spaces: 2 });
  return JSON.parse(converted);
}

function parseDate(date, format) {
  const event = moment(date, format);
  return event.toISOString();
}

module.exports = { parseXML, parseDate };
