const convert = require('xml-js');
const moment = require('moment');

function parseXML(xml) {
  const converted = convert.xml2json(xml, {
    compact: true,
    spaces: 2
  });
  return JSON.parse(converted);
}

function parseDate(date, format) {
  const event = moment(date, format);
  return event.format('YYYY-MM-DD');
}

function urlEncode(url) {
  return `maccabi://present?linkUrl=${encodeURIComponent(url)}&showContext=true`
}

function sliceWrap(list, payload_size = 1, validator) {
  if (payload_size > list.length) return list
  const validatedItemId = validator ? list.findIndex(validator) : 0;
  const extraItemsLeft = Math.floor((payload_size - 1) / 2);
  const extraItemsRight = Math.ceil((payload_size - 1) / 2);
  const leftOutOfBound = extraItemsLeft > validatedItemId ? Math.abs(validatedItemId - extraItemsLeft) : 0
  const rightOutOfBound = extraItemsRight > (list.length - 1 - validatedItemId) ? Math.abs(list.length - 1 - validatedItemId - extraItemsRight) : 0
  const left = extraItemsLeft - leftOutOfBound + rightOutOfBound;
  const right = extraItemsRight - rightOutOfBound + leftOutOfBound;
  return list.slice(validatedItemId - left, validatedItemId + right + 1)
}


function compareTimes(a, b) {
  const A = moment(a, "YYYY/MM/DD HH:mm:ss Z");
  const B = moment(b, "YYYY/MM/DD HH:mm:ss Z");
  if (A.isSame(B)) return 0
  return A.isBefore(B) ? -1 : 1;
}

module.exports = {
  parseXML,
  parseDate,
  urlEncode,
  sliceWrap,
  compareTimes
};