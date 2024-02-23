const fs = require("fs");
const fsP = require("fs").promises;
const path = require("path");
const { generateRandomID } = require("./random");
const { json } = require("stream/consumers");
const { error } = require("console");

const readFileAsJson = function (collectionName) {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(
        "collections/" + collectionName + ".json",
        "utf-8",
        async (err, data) => {
          if (err) throw err;
          var dbData = await JSON.parse(data || "[]");
          resolve(dbData);
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};
const writeFileAsString = function (collectionName, data) {
  const filePath = path.join(__dirname, "collections/");
  fs.writeFile("collections/" + collectionName + ".json", data, (err) => {
    if (err) throw err;
    console.log("sss");
    return { msg: "Collection Created" };
  });
};
const newCollection = function (collectionName) {
  const filePath = path.join(__dirname, "collections/");
  fs.writeFile(filePath + collectionName + ".json", "", (err) => {
    if (err) throw err;
    console.log("sss");
    return { msg: "Collection Created" };
  });
};
const removeCollection = function (collectionName) {
  const filePath = path.join(__dirname, "collections/");

  console.log(filePath);
  fs.unlink(filePath + collectionName + ".json", (err) => {
    if (err) throw err;
    console.log("sss");
    return { msg: "Deleted File" };
  });
};
const fetchCollection = async function () {
  try {
    var files = await fsP.readdir("./collections");
    files = files.map((file) => {
      return file.split(".")[0];
    });
    console.log(files);
    return files;
  } catch (error) {
    throw new Error(error);
  }
};
const addDoc = function (collectionName, data) {
  return new Promise(async (resolve, reject) => {
    const docId = generateRandomID();
    data.id = docId;

    var dbData = await readFileAsJson(collectionName);
    dbData.push(data);

    let dbRawData = JSON.stringify(dbData, null, 2);
    writeFileAsString(collectionName, dbRawData);
    resolve(data);
  });
};
const updateDoc = function (collectionName, id, update) {
  return new Promise(async (resolve, reject) => {
    var dbData = await readFileAsJson(collectionName);
    dbData = dbData.map((data) => {
      if (data.id == id) {
        const newData = {
          ...data,
          ...update,
        };
        return newData;
      }
      return data;
    });

    let dbRawData = JSON.stringify(dbData);
    writeFileAsString(collectionName, dbRawData);
    resolve(dbData);
  });
};
const removeDoc = function (collectionName, id) {
  return new Promise(async (resolve, reject) => {
    try {
      var dbData = await readFileAsJson(collectionName);
      var previouslength = dbData.length;

      dbData = dbData.filter((data) => {
        if (data.id !== id) return data;
      });

      if (dbData.length < previouslength) {
        resolve(dbData);
        writeFileAsString(collectionName, JSON.stringify(dbData));
      }

      throw new Error("ID Not Found");
    } catch (err) {
      reject(err);
    }
  });
};
const getDoc = function (collectionName, id) {
  return new Promise(async (resolve, reject) => {
    try {
      var dbData = await readFileAsJson(collectionName);

      const doc = dbData.find((data) => data.id === id);

      if (doc) {
        resolve(doc);
      }
      throw new Error("ID Not Found");
    } catch (err) {
      reject(err);
    }
  });
};
const getDocs = function (collectionName) {
  return new Promise(async (resolve, reject) => {
    try {
      var dbData = await readFileAsJson(collectionName);
      resolve(dbData);
    } catch (err) {
      reject(err);
    }
  });
};
const queryDocs = function (collectionName, queryObject) {
  return new Promise(async (resolve, reject) => {
    const { field, condition, value } = queryObject;
    try {
      var dbData = await readFileAsJson(collectionName);
      var queryResult = [];
      for (const data of dbData) {
        if (condition === "=") {
          if (data[field] === value) {
            queryResult.push(data);
          }
        } else if (condition === "<") {
          if (data[field] < value) {
            queryResult.push(data);
          }
        } else if (condition === "<=") {
          if (data[field] <= value) {
            queryResult.push(data);
          }
        } else if (condition === ">") {
          if (data[field] > value) {
            queryResult.push(data);
          }
        } else if (condition === ">=") {
          if (data[field] >= value) {
            queryResult.push(data);
          }
        } else if (condition === "!=") {
          if (data[field] !== value) {
            queryResult.push(data);
          }
        }
      }
      resolve(queryResult);
    } catch (err) {
      reject(err);
    }
  });
};
module.exports = {
  newCollection,
  removeCollection,
  addDoc,
  removeDoc,
  getDoc,
  getDocs,
  updateDoc,
  queryDocs,
  fetchCollection,
  readFileAsJson,
  writeFileAsString,
};
