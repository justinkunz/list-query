class Query {
  #conditions = []; // [fn] of conditions
  #returnKeys; // Keys to return
  #currentKey; // key to focus on (set with .where() & .and())
  #sourceArray = null; // Source array (set from .from())
  #limit; // Optional limit on returned results

  constructor(returnKeys) {
    // VALID RETURN KEYS: "*", undefined, any string value, array value
    if (['undefined', 'string'].includes(typeof returnKeys) || Array.isArray(returnKeys)) {
      this.#returnKeys = returnKeys;
    } else {
      throw Error(
        'Return keys must be set with either "*", a string representing a single key to return, or an array of keys to return'
      );
    }
  }

  where(key) {
    this.#currentKey = key;
    return this;
  }

  is(val) {
    const key = this.#currentKey;
    this.#conditions.push((itm) => itm[key] === val);
    return this;
  }

  equals(val) {
    return this.is(val);
  }

  isNot(val) {
    const key = this.#currentKey;
    this.#conditions.push((itm) => itm[key] !== val);
    return this;
  }

  doesNotEqual(val) {
    return this.isNot(val);
  }

  startsWith(str) {
    const key = this.#currentKey;
    this.#conditions.push((itm) => (itm[key] + '').startsWith(str));
    return this;
  }

  endsWith(str) {
    const key = this.#currentKey;
    this.#conditions.push((itm) => (itm[key] + '').endsWith(str));
    return this;
  }

  isGreaterThan(val) {
    const key = this.#currentKey;
    this.#conditions.push((itm) => itm[key] > val);
    return this;
  }

  isLessThan(val) {
    const key = this.#currentKey;
    this.#conditions.push((itm) => itm[key] < val);
    return this;
  }

  isGreaterThanOrEqualTo(val) {
    const key = this.#currentKey;
    this.#conditions.push((itm) => itm[key] >= val);
    return this;
  }

  isLessThanOrEqualTo(val) {
    const key = this.#currentKey;
    this.#conditions.push((itm) => itm[key] <= val);
    return this;
  }

  contains(val) {
    const key = this.#currentKey;
    this.#conditions.push((itm) => Array.isArray(itm[key]) && itm[key].includes(val));
    return this;
  }

  within(arr) {
    const key = this.#currentKey;
    if (!Array.isArray(arr)) throw Error('`within` method must take in type: Array');
    this.#conditions.push((itm) => arr.includes(itm[key]));
    return this;
  }

  in(arr) {
    return this.within(arr);
  }

  and(key) {
    // Strictly compare to undefined (property could be 0 or '')
    if (key !== undefined) {
      this.#currentKey = key;
    }
    return this;
  }

  limit(num) {
    if (Number.isNaN(num)) throw Error('Limit must be a number');
    this.#limit = num;
    return this;
  }

  from(arr) {
    if (!Array.isArray(arr)) throw Error('`from` method must take in type: Array');
    this.#sourceArray = arr;
    return this;
  }

  run() {
    if (!this.#sourceArray) throw Error('`from` method must be called before `run` method');

    let limitCounter = 0;
    const hasLimit = !Number.isNaN(this.#limit);
    const results = this.#sourceArray.filter((itm) => {
      // Past limit > don't include
      if (hasLimit && limitCounter >= this.#limit) return false;

      // Test on call collected conditions
      const conditionsResult = this.#conditions.every((condition) => condition(itm));

      // Add to limit if limit set
      if (hasLimit && conditionsResult) limitCounter++;

      return conditionsResult;
    });

    // Return all keys if "*" or nothing provided
    if (this.#returnKeys === '*' || typeof this.#returnKeys === 'undefined') return results;

    if (typeof this.#returnKeys === 'string') {
      return results.map((r) => r[this.#returnKeys]);
    }

    return results.map((r) => {
      return this.#returnKeys.reduce((acc, key) => {
        acc[key] = r[key];
        return acc;
      }, {});
    });
  }
}

module.exports = (key) => new Query(key);
