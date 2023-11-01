(() => {
  globalThis.indexes = function (coll, options = {}) {
    if (typeof coll.getIndexes !== "function") {
      throw new IndexDefError(`please provide a collection handle`);
    }

    let rawIndexes = coll.getIndexes();
    let indexes = rawIndexes.filter((index) => index.name != "_id_");
    let dbName = db.getName();
    let collName = coll.getName();

    if (options.bulk == true) {
      return makeBulkDefsForColl(dbName, collName, indexes);
    } else {
      return makeIndividualDefsForColl(dbName, collName, indexes);
    }
  };

  class IndexDefError extends Error {
    constructor(message) {
      super(message);
      this.name = "IndexDefError";
    }
  }

  function makeBulkDefsForColl(dbName, collName, indexes) {
    indexes.forEach((index) => {
      delete index.v;
      delete index.ns;
      return index;
    });
    return [
      `db.getSiblingDB("${dbName}").runCommand({createIndexes: "${collName}", indexes: ${EJSON.stringify(
        indexes
      )}})`,
    ];
  }

  function makeIndividualDefsForColl(dbName, collName, indexes) {
    let cmds = [];
    indexes.forEach((index) => {
      let cmd = `db.getSiblingDB("${dbName}").getCollection("${collName}").createIndex(${EJSON.stringify(
        index.key
      )}`;
      let options = { ...index };
      delete options.v;
      delete options.key;
      delete options.ns;
      cmd = cmd + "," + EJSON.stringify(options) + ")";
      cmds.push(cmd);
    });
    return cmds;
  }
})();
