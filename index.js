const {
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
} = require("./db");
const { generateRandomID } = require("./random");

// const func = (async function () {
//   const res = await addDoc("account", {
//     name: "JJ",
//     age: 30,
//     gender: "male",
//     hubby: ["football"],
//   });
//   console.log(res);
// })();

const func = (async function () {
  let data = await readFileAsJson("Product Details");
  data.forEach((element) => {
    element.id = generateRandomID();
  });

  writeFileAsString("Product Details", JSON.stringify(data));
})();

// console.log();
