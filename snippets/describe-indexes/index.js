(() => {
  globalThis.indexes = function (coll, options = {}) {
    if (typeof coll.getIndexes !== "function") {
      throw new IndexDefError(`please provide a collection handle`);
    }

    let indexes = coll.getIndexes();
    let dbName = db.getName();
    let collName = coll.getName();

    if (options.bulk == true) {
      return getBulkDefsForColl(dbName, collName, indexes);
    } else {
      return getIndividualDefsForColl(dbName, collName, indexes);
    }
  };

  class IndexDefError extends Error {
    constructor(message) {
      super(message);
      this.name = "IndexDefError";
    }
  }

  function getBulkDefsForColl(dbName, collName, indexes) {
    let cleaned = indexes.filter((index) => index.name != "_id_");
    cleaned.forEach((index) => {
      delete index.v;
      delete index.ns;
      return index;
    });
    return [
      `db.getSiblingDB("${dbName}").runCommand({createIndexes: "${collName}", indexes: ${EJSON.stringify(
        cleaned
      )}})`,
    ];
  }

  function getIndividualDefsForColl(dbName, collName, indexes) {
    let cmds = [];
    indexes.forEach((index) => {
      if (index.name == "_id_") {
        return;
      }
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
