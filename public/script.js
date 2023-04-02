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
    fetch('/save', {
      method: 'POST',
      body: JSON.stringify({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log('Location saved successfully.');
      })
      .catch(error => {
        console.error('Error saving location:', error);
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
    fetch('/save', {
      method: 'POST',
      body: JSON.stringify({
        ip: data.ip
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log('IP address saved successfully.');
      })
      .catch(error => {
        console.error('Error saving IP address:', error);
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
