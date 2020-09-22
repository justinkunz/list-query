class Query {
  constructor(returnKeys) {
    this._conditions = [];
    this._returnKeys = returnKeys;
    this._transform = (itm) => itm;
  }

  where(key) {
    this._currentKey = key;
    return this;
  }

  is(val) {
    const key = this._currentKey;
    this._conditions.push((itm) => itm[key] === val);
    return this;
  }

  startsWith(str) {
    const key = this._currentKey;
    this._conditions.push((itm) => (itm[key] + "").startsWith(str));
    return this;
  }

  endsWith(str) {
    const key = this._currentKey;
    this._conditions.push((itm) => (itm[key] + "").endsWith(str));
    return this;
  }

  isNot(val) {
    const key = this._currentKey;
    this._conditions.push((itm) => itm[key] !== val);
    return this;
  }

  isGreaterThan(val) {
    const key = this._currentKey;
    this._conditions.push((itm) => itm[key] > val);
    return this;
  }

  isLessThan(val) {
    const key = this._currentKey;
    this._conditions.push((itm) => itm[key] < val);
    return this;
  }

  isGreaterThanOrEqualTo(val) {
    const key = this._currentKey;
    this._conditions.push((itm) => itm[key] >= val);
    return this;
  }

  isLessThanOrEqualTo(val) {
    const key = this._currentKey;
    this._conditions.push((itm) => itm[key] <= val);
    return this;
  }

  contains(val) {
    const key = this._currentKey;
    this._conditions.push((itm) => Array.isArray(itm[key]) && itm[key].includes(val));
    return this;
  }

  within(arr) {
    const key = this._currentKey;
    this._conditions.push((itm) => Array.isArray(arr) && arr.includes(itm[key]));
    return this;
  }

  and(key) {
    if (key !== undefined && key !== null) {
      this._currentKey = key;
    }
    return this;
  }

  limit(num) {
    if (isNaN(num)) throw Error("Limit must be a number");
    this._limit = num;
    return this;
  }

  from(arr) {
    this._arr = arr;
    return this;
  }

  run() {
    let limitCounter = 0;
    const results = this._arr.map(this._transform).filter((itm) => {
      const hasLimit = !isNaN(this._limit);
      if (hasLimit && limitCounter >= this._limit) return false;

      const itmResult = this._conditions.every((condition) => condition(itm));
      if (hasLimit && itmResult) limitCounter++;

      return itmResult;
    });

    if (this._returnKeys === "*" || !this._returnKeys) return results;

    if (typeof this._returnKeys === "string") {
      return results.map((r) => r[this._returnKeys]);
    }
    return results.map((r) => {
      return this._returnKeys.reduce((acc, key) => {
        acc[key] = r[key];
        return acc;
      }, {});
    });
  }
}

module.exports = (key) => new Query(key);
