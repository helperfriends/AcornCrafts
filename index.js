const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const port = 9000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/submit", (req, res) => {
  try {
    const data = req.body;
    fs.appendFileSync("data.txt", JSON.stringify(data) + "\n");
    console.log("Data saved successfully.");
    res.sendFile(path.join(__dirname, "confirmation.html"));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving data.");
  }
});

app.get("/logs", (req, res) => {
  try {
    const data = fs.readFileSync("data.txt", "utf-8");
    console.log("Data retrieved successfully.");
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error reading data.");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
