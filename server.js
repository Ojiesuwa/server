const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const {
  fetchCollection,
  getDocs,
  getDoc,
  removeCollection,
  newCollection,
  addDoc,
  updateDoc,
  removeDoc,
} = require("./db");
const { generateRandomID } = require("./random");
const { hostname } = require("os");

const app = express();
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/fileUploads");
  },
  filename: function (req, file, cb) {
    const newName = generateRandomID(20) + Date.now();
    cb(null, newName + "." + file.originalname.split(".")[1]);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.status(200).send({ connection: "true" });
});

app.get("/api/collections", async (req, res) => {
  try {
    let collections = await fetchCollection();
    res.status(200).send(collections);
  } catch (error) {
    res.status(500).send({ msg: error });
  }
});

app.get("/api/docId/:collection", async (req, res) => {
  try {
    console.log(req.params);
    let collection = req.params.collection;
    let docs = await getDocs(collection);
    docs = docs.map((doc) => doc.id);
    res.status(200).send(docs);
  } catch (error) {
    res.status(500).send({ msg: error });
  }
});

app.get("/api/fields/:collection/:docId", async (req, res) => {
  try {
    console.log(req.params);
    let { collection, docId } = req.params;
    let doc = await getDoc(collection, docId);
    delete doc.id;
    res.status(200).send(doc);
  } catch (error) {
    res.status(500).send({ msg: error });
  }
});

app.get("/upload/:image", async (req, res) => {
  try {
    const { image } = req.params;
    const imagePath = path.join(__dirname, "fileUploads", image);
    res.status(200).sendFile(imagePath);
  } catch (error) {
    app.status(500).send({ msg: error });
  }
});

app.post("/api/collection/:collection", async (req, res) => {
  try {
    console.log(req.params);
    let { collection } = req.params;
    newCollection(collection);
    let collections = await fetchCollection();
    collections.push(collection);
    res.status(200).send(collections);
  } catch (error) {
    res.status(500).send({ msg: error });
  }
});
app.post("/api/collection/:collection", async (req, res) => {
  try {
    console.log(req.params);
    let { collection } = req.params;
    newCollection(collection);
    let collections = await fetchCollection();
    collections.push(collection);
    res.status(200).send(collections);
  } catch (error) {
    res.status(500).send({ msg: error });
  }
});

app.post("/api/doc/:collection", async (req, res) => {
  try {
    console.log(req.params);
    let { collection } = req.params;
    let response = await addDoc(collection, req.body);
    let id = response.id;
    res.status(200).send({ id: id });
  } catch (error) {
    res.status(500).send({ msg: error });
  }
});

app.post("/upload/image", upload.single("image"), (req, res) => {
  try {
    const baseUrl = req.protocol + "://" + req.get("host");
    res.status(200).send({ url: baseUrl + "/upload/" + req.file.filename });
  } catch (error) {
    res.status(500).send({ msg: error });
  }
});

app.patch("/api/doc/:collection/:doc", async (req, res) => {
  try {
    console.log(req.params);
    let { collection, doc } = req.params;
    updateDoc(collection, doc, req.body);
    let collections = await fetchCollection();
    collections.push(collection);
    res.status(200).send(collections);
  } catch (error) {
    res.status(500).send({ msg: error });
  }
});

app.delete("/api/collection/:collection", async (req, res) => {
  try {
    console.log(req.params);
    let { collection } = req.params;
    removeCollection(collection);
    let collections = await fetchCollection();
    collections = collections.filter((col) => col !== collection);
    res.status(200).send(collections);
  } catch (error) {
    res.status(500).send({ msg: error });
  }
});

app.delete("/api/doc/:collection/:doc", async (req, res) => {
  try {
    console.log(req.params);
    let { collection, doc } = req.params;
    await removeDoc(collection, doc);
    let nDoc = await getDocs(collection);
    res.status(200).send(nDoc);
  } catch (error) {
    res.status(500).send({ msg: error });
  }
});

app.listen(3000, () => {
  console.log("running on port 3000");
});
