# List Query

Lightweight, dependency free node module for SQL Like querying on arrays of objects.

![list query logo](./docs/list-query.png)

## Usage

Require the `list-query` npm package like so:

```js
const select = require('list-query');
```

The module returns a function that when chained with the available methods will read in a SQL-like syntax.

For example:

```js
const select = require('list-query');

const recentlyLoggedInAdmins = select('*')
  .from(users)
  .where('isAccountLocked')
  .is(false)
  .and('roleList')
  .contains('admin')
  .and('lastLogin')
  .isGreaterThan(1600473600)
  .and()
  .isLessThanOrEqualTo(1600473900)
  .run();
```

## Query Set Up

Queries must be chained with the following structure:

- Start with the `select()` function
- Include a `.from()` method
- `.where()` or `.and()` prefixing chained query methods
- End with `.run()`

###### Example:

```js
const select = require('list-query');

const recentlyLoggedInAdmins = select('*') // SELECT STATEMENT
  .from(users) // FROM METHOD INCLUDING ARRAY

  // QUERY METHODS
  .where('isAccountLocked')
  .is(false)

  .and('roleList')
  .contains('admin')

  .and('lastLogin')
  .isGreaterThan(1600473600)
  .and()
  .isLessThanOrEqualTo(1600473900)

  // ENDS WITH '.run()' METHOD
  .run();
```

### Select

The `select()` function controls the format to return the query results and can take in the following types:

- **" \* "** - Return entire object

###### Example:

```js
const select = require('list-query');

const locations = [
  { city: 'Dallas', state: 'Texas', zip: 75001 },
  { city: 'San Diego', state: 'California', zip: 22434 },
  { city: 'Seattle', state: 'Washington', zip: 98101 },
  { city: 'Houston', state: 'Texas', zip: 77001 },
];

const texasCities = select('*').from(locations).where('state').is('Texas').run();

// Expected: [{ city: 'Dallas', state: 'Texas', zip: 75001 }, { city: 'Houston', state: 'Texas', zip: 77001 }]
```

- **{String of Object Key}** - Return a list of only the specified key's value .

###### Example:

```js
const select = require('list-query');

const locations = [
  { city: 'Dallas', state: 'Texas', zip: 75001 },
  { city: 'San Diego', state: 'California', zip: 22434 },
  { city: 'Seattle', state: 'Washington', zip: 98101 },
  { city: 'Houston', state: 'Texas', zip: 77001 },
];
const texasCities = select('city').from(locations).where('state').is('Texas').run();

// Expected: ['Dallas', 'Houston']
```

- **{Array of Object Keys}** - Returns an object containing only the specified keys

###### Example

```js
const select = require('list-query');

const locations = [
  { city: 'Dallas', state: 'Texas', zip: 75001 },
  { city: 'San Diego', state: 'California', zip: 22434 },
  { city: 'Seattle', state: 'Washington', zip: 98101 },
  { city: 'Houston', state: 'Texas', zip: 77001 },
];
const texasCities = select(['city', 'zip']).from(locations).where('state').is('Texas').run();

// Expected: [ { city: 'Dallas', zip: 75001 }, { city: 'Houston', zip: 77001 }]
```

### From

The `.from()` method provides the array source for the query _(passed in as an argument)_. It must be included in the query chain.

## Querying

### Key Setters

`.where()` and `.and()` are key setter methods. These methods set the active key to examine for the next query method. All query methods should have a key setter called directly before it in the query chain.

While both methods are extremely similiar, for syntactic sugar `.where()` should be called before the first query method & `.and()` should be called before all following query methods.

Both functions take in a string that represents the object key to focus on for the next query. Optionally, if no value is passed to `.and()`, the focused key doesnt change.

###### Example

```js
const select = require('list-query');

const recentlyLoggedInAdmins = select('*')
  .from(users)

  // where "isAccountLocked" is false
  .where('isAccountLocked') // Active key set to "isAccountLocked"
  .is(false) // Active key (isAccountLocked) is false

  // lastLogin must be > 1600473600 & <= 1600473900
  .and('lastLogin') // Active key set to "lastLogin"
  .isGreaterThan(1600473600) // Active key (lastLogin) > 1600473600
  .and() // Since no argument past, active key does not change
  .isLessThanOrEqualTo(1600473900) // Active key (lastLogin) <= 1600473900
  .run();
```

### Query Methods

- `.is(val)` - _Any_ - Compared Value must equal provided value
- `.isNot(val)` - _Any_ - Compared Value must NOT equal provided value
- `.startsWith(str)` - _String_ - Compared Value _(as string)_ must start with provided value
- `.endsWith(str)` - _String_ - Compared Value _(as string)_ must end with provided value
- `.isGreaterThan(n)` - _Number_ - Compared Value must be greater than provided value
- `.isLessThan(n)` - _Number_ - Compared Value must be less than provided value
- `.isGreaterThanOrEqualTo(n)` - _Number_ - Compared Value must be greater than or equal to provided value
- `.isLessThanOrEqualTo(n)` - _Number_ - Compared Value must be less than or equal to provided value
- `.contains(val)` - _Any_ - Compared Value _(must be an array)_ must contain provided value
- `.within(arr)` - _Array_ - Compared value must match a value in the provided array

### Limit

Optionally, you can limit the max number of query results with the `.limit()` method.

###### Example

```js
const select = require('list-query');

const locations = [
  { city: 'Dallas', state: 'Texas', zip: 75001 },
  { city: 'San Diego', state: 'California', zip: 22434 },
  { city: 'Seattle', state: 'Washington', zip: 98101 },
  { city: 'Houston', state: 'Texas', zip: 77001 },
];
const cities = select('city').from(locations).where('state').isNot('California').limit(2).run();

// Expected: ['Dallas', 'Seattle']
```

## Example Queries

```js
const select = require('list-query');

const users = [
  {
    id: 123,
    username: 'johnsmith11',
    firstName: 'John',
    lastName: 'Smith',
    age: 25,
    isAccountLocked: false,
    lastLogin: 1600473700,
    roleList: ['user', 'moderator', 'admin'],
  },
  {
    id: 456,
    username: 'foobarz',
    firstName: 'Jane',
    lastName: 'Doe',
    age: 24,
    isAccountLocked: false,
    lastLogin: 1600473700,
    roleList: ['user', 'moderator'],
  },
  {
    id: 903,
    username: 'joejoe',
    firstName: 'Joe',
    lastName: 'Bar',
    age: 25,
    isAccountLocked: false,
    lastLogin: 1600473900,
    roleList: ['user', 'moderator', 'admin'],
  },
  {
    id: 211,
    username: 'amanda92',
    firstName: 'Amanda',
    lastName: 'Baz',
    age: 24,
    isAccountLocked: true,
    lastLogin: 1600472500,
    roleList: ['user'],
  },
  {
    id: 115,
    username: 'billybills',
    firstName: 'Bill',
    lastName: 'Baz',
    age: 23,
    isAccountLocked: true,
    lastLogin: 1600473650,
    roleList: ['user', 'moderator', 'admin'],
  },
];

// Passing "*" into "select" will return entire object
const recentlyLoggedInAdmins = select('*')
  .from(users) // From the users array
  .where('isAccountLocked')
  .is(false)
  .and('roleList')
  .contains('admin')
  .and('lastLogin')
  .isGreaterThan(1600473600)
  .and()
  .isLessThanOrEqualTo(1600473900)
  .run();

// EXPECTED:
//
// [
//   {
//     id: 123,
//     firstName: 'John',
//     lastName: 'Smith',
//     age: 25,
//     isAccountLocked: false,
//     lastLogin: 1600473700,
//     roleList: [ 'user', 'moderator', 'admin' ]
//   },
//   {
//     id: 903,
//     firstName: 'Joe',
//     lastName: 'Bar',
//     age: 25,
//     isAccountLocked: false,
//     lastLogin: 1600473900,
//     roleList: [ 'user', 'moderator', 'admin' ]
//   }
// ]

// Passing an array of strings into "select" will return an object containing the specified keys
const lockedAccounts = select('username').from(users).where('isAccountLocked').is(true).run();

// EXPECTED:
//
// [ 'amanda92', 'billybills' ]

// Passing a single string into "select" will return only the specified key's value
const jNamesExcludingJohn = select(['firstName', 'lastName'])
  .from(users)
  .where('firstName')
  .startsWith('J')
  .and()
  .isNot('John')
  .run();

// EXPECTED:
//
// [
//   { firstName: 'Jane', lastName: 'Doe' },
//   { firstName: 'Joe', lastName: 'Bar' }
// ]
```
