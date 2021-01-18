/**
 * Creates an ID by reversing a timestamp.
 *
 * @param {Date} time The time in milliseconds since epoch.
 *
 * @returns {String} The ID
 */
function createIdByTime(time = new Date()) {
  return time
    .getTime()
    .toString()
    .split('')
    .reverse()
    .join('');
}

/**
 * Formats an ID with separators.
 *
 * @param {String} id An ID without separators.
 * @param {String} sep String to insert in the ID.
 * @param {Number} step The space between separators.
 *
 * @returns {String} The ID with separators.
 */
function decorateId(id, sep = ' ', step = 4) {
  if (id.length <= step) {
    return id;
  }
  const decorated = [];
  let i = 0;
  for (; i + 2 * step < id.length; i += step) {
    decorated.push(id.substr(i, step));
  }
  const half = Math.ceil((id.length - i) / 2);
  decorated.push(id.substr(i, half));
  decorated.push(id.substr(i + half));
  return decorated.join(sep);
}

/**
 *  Removes separators from an ID.
 *
 * @param {String} id An ID with separators to remove.
 * @param {RegExp} regex A regular expression matching the separators. Must be
 * global.
 *
 * @returns {String} The ID without separators.
 */
function undecorateId(id, regex = /[\s-]/g) {
  return id.replace(regex, '');
}

module.exports = { createIdByTime, decorateId, undecorateId };
