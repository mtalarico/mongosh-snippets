# describe-indexes

Describe the index definitions of a collection.

```js
// on test database
> indexes(db.test);
[
    'db.getSiblingDB("test").getCollection("test").createIndex({"b":1},{"name":"b_1"})',
    'db.getSiblingDB("test").getCollection("test").createIndex({"c":"hashed"},{"name":"c_hashed"})',
    'db.getSiblingDB("test").getCollection("test").createIndex({"d":1},{"name":"d_1","expireAfterSeconds":600})',
    'db.getSiblingDB("test").getCollection("test").createIndex({"c":"hashed","a":1},{"name":"test"})',
    'db.getSiblingDB("test").getCollection("test").createIndex({"l":1},{"name":"l_1","partialFilterExpression":{"x":1},"expireAfterSeconds":600})',
    'db.getSiblingDB("test").getCollection("test").createIndex({"hl":1},{"name":"test2","partialFilterExpression":{"x":1},"expireAfterSeconds":600})',
    'db.getSiblingDB("test").getCollection("test").createIndex({"hl":-1},{"name":"test2rev","partialFilterExpression":{"x":1},"expireAfterSeconds":600})'
]

// on test database
> indexes(db.coll, {bulk: true})
[
  'db.getSiblingDB("test").runCommand({createIndexes: "test", indexes: [{"key":{"b":1},"name":"b_1"},{"key":{"c":"hashed"},"name":"c_hashed"},{"key":{"d":1},"name":"d_1","expireAfterSeconds":600},{"key":{"c":"hashed","a":1},"name":"test"},{"key":{"l":1},"name":"l_1","partialFilterExpression":{"x":1},"expireAfterSeconds":600},{"key":{"hl":1},"name":"test2","partialFilterExpression":{"x":1},"expireAfterSeconds":600},{"key":{"hl":-1},"name":"test2rev","partialFilterExpression":{"x":1},"expireAfterSeconds":600}]})'
]
```
