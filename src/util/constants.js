module.exports = {
  /** @type {Number} The value returned when there is no need to cooldown. */
  INVALID_TIME: -1,

  /** @type {Number} One second, in milliseconds */
  ONE_SECOND: 1000,
  /** @type {Number} One minute, in milliseconds */
  ONE_MINUTE: 60000,
  /** @type {Number} One hour, in milliseconds */
  ONE_HOUR: 3600000,
  
  /** @type {Number} An extra short amount of time to wait: 10,000
   * milliseconds.
   */
  XSHORT_WAIT: 10000,
  /** @type {Number} A short amount of time to wait: 20,000 milliseconds. */
  SHORT_WAIT: 20000,
  /** @type {Number} A medium amount of time to wait: 60,000 milliseconds. */
  MED_WAIT: 60000,
  /** @type {Number} A long amount of time to wait: 120,000 milliseconds. */
  LONG_WAIT: 120000,
};
