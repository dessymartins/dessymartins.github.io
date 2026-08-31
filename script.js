const toggleButton =
  document.querySelector("#theme-toggle");
 
toggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    toggleButton.innerHTML = "☀️";
  } else {
    toggleButton.innerHTML = "🌙";
  }

});

// Cart functionality
const tombolBeli = document.querySelectorAll(".btn-beli");
const cartCount = document.querySelector("#cart-count");

let count = 0;

tombolBeli.forEach((button) => {
  button.addEventListener("click", () => {
    count++;
    cartCount.innerHTML = count;
  });
});



// Navbar Logic 
fetch("partials/header.html")
.then (response => response.text())
.then(data => {
  document.querySelector("#navbar").innerHTML = data;
});