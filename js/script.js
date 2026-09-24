// Theme Toggle (apply saved theme immediately, before header even loads, to avoid a flash)
if (localStorage.getItem("theme") === "gelap") {
  document.body.classList.add("gelap");
}

// Theme button lives inside the header partial, so wire it up after the header loads
function initTheme() {
  const toggleButton = document.querySelector("#theme-toggle");
  if (!toggleButton) return;

  toggleButton.innerHTML = document.body.classList.contains("gelap") ? "Light" : "Dark";

  toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("gelap");
    const isGelap = document.body.classList.contains("gelap");

    toggleButton.innerHTML = isGelap ? "Light" : "Dark";
    localStorage.setItem("theme", isGelap ? "gelap" : "terang");
  });
}


// Cart Logic (runs after header is loaded, since #card-count lives there).
// Uses event delegation on document so it also works for .btn-beli buttons
// rendered dynamically (e.g. product cards) after this runs.
function initCart() {
  const cartCount = document.querySelector("#card-count");
  if (!cartCount) return;

  let jumlahCart = Number(localStorage.getItem("jumlahCart")) || 0;
  cartCount.innerHTML = jumlahCart;

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".btn-beli")) return;
    jumlahCart++;
    cartCount.innerHTML = jumlahCart;
    localStorage.setItem("jumlahCart", jumlahCart);
  });
}

function initHeader() {
  initTheme();
  initCart();
}

// Catalog Filter
function initCatalogFilter() {
  const semuaCheckbox = document.querySelector("#catSemua");
  const applyButton = document.querySelector("#btnTerapkanFilter");
  if (!semuaCheckbox || !applyButton) return;


  const categoryCheckboxes = document.querySelectorAll(".cat-filter:not(#catSemua)");

  semuaCheckbox.addEventListener("change", () => {
    if (semuaCheckbox.checked) {
      categoryCheckboxes.forEach((checkbox) => (checkbox.checked = false) );
    }
  });

    categoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const anyChecked = Array.from(categoryCheckboxes).some((c) => c.checked);
      semuaCheckbox.checked = !anyChecked;
    });
  });

  applyButton.addEventListener("click", () => {
    const selectedCategories = Array.from(categoryCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    const filteredProducts = selectedCategories.length
      ? products.filter((product) => selectedCategories.includes(product.category))
      : products;

    renderProductList("#catalog-product-list", filteredProducts, "col-md-6 col-xl-4", { linkToDetail: true });
  });

}

// Load Header & Footer Partials
function loadPartial(selector, url, callback) {
  const target = document.querySelector(selector);
  if (!target) return;

  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      target.innerHTML = html;
      if (callback) callback();
    });
}

loadPartial("#navbar", "header.html", initHeader);
loadPartial("#footer", "footer.html");

// Render Product Cards (component-based, from js/products.js + js/productCard.js)
renderProductList("#home-product-list", products, "col-sm-6 col-lg-3");
renderProductList("#catalog-product-list", products, "col-md-6 col-xl-4", { linkToDetail: true });
initCatalogFilter();