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
