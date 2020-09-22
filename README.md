# SQL Array

Lightweight, dependency free module for SQL Like querying on arrays of object.

## Usage

```js
const select = require("sqlarray");

const users = [
  {
    id: 123,
    username: "johnsmith11",
    firstName: "John",
    lastName: "Smith",
    age: 25,
    isAccountLocked: false,
    lastLogin: 1600473700,
    roleList: ["user", "moderator", "admin"],
  },
  {
    id: 456,
    username: "foobarz",
    firstName: "Jane",
    lastName: "Doe",
    age: 24,
    isAccountLocked: false,
    lastLogin: 1600473700,
    roleList: ["user", "moderator"],
  },
  {
    id: 903,
    username: "joejoe",
    firstName: "Joe",
    lastName: "Bar",
    age: 25,
    isAccountLocked: false,
    lastLogin: 1600473900,
    roleList: ["user", "moderator", "admin"],
  },
  {
    id: 211,
    username: "amanda92",
    firstName: "Amanda",
    lastName: "Baz",
    age: 24,
    isAccountLocked: true,
    lastLogin: 1600472500,
    roleList: ["user"],
  },
  {
    id: 115,
    username: "billybills",
    firstName: "Bill",
    lastName: "Baz",
    age: 23,
    isAccountLocked: true,
    lastLogin: 1600473650,
    roleList: ["user", "moderator", "admin"],
  },
];

// Passing "*" into "select" will return entire object
const recentlyLoggedInAdmins = select("*")
  .from(users) // From the users array
  .where("isAccountLocked")
  .is(false)
  .and("roleList")
  .contains("admin")
  .and("lastLogin")
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
const lockedAccounts = select("username")
    .from(users)
    .where("isAccountLocked")
    .is(true)
    .run();

// EXPECTED:
//
// [ 'amanda92', 'billybills' ]

// Passing a single string into "select" will return only the specified key's value
const jNamesExcludingJohn = select(["firstName", "lastName"])
  .from(users)
  .where("firstName")
  .startsWith("J")
  .and()
  .isNot("John")
  .run();

// EXPECTED:
//
// [
//   { firstName: 'Jane', lastName: 'Doe' },
//   { firstName: 'Joe', lastName: 'Bar' }
// ]
```
