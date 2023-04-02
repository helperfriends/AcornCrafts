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
  const data = req.body;

  fs.appendFile("data.txt", JSON.stringify(data) + "\n", (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error saving data.");
    } else {
      console.log("Data saved successfully.");
      res.send("Data saved successfully.");
    }
  });
  
  // Save data to file
  fs.appendFile("data.txt", JSON.stringify(req.body), (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
  
  res.sendFile(path.join(__dirname, "confirmation.html"));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/logs", (req, res) => {
  fs.readFile("data.txt", "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading data.");
    } else {
      console.log("Data retrieved successfully.");
      res.send(data);
    }
  });
});
