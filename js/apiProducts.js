// API Product List (api-products.html): fetches products from the free DummyJSON API,
// paginated on the server with ?limit=&skip= (the API returns the total count)
const API_URL = "https://dummyjson.com/products";
const API_SEARCH_URL="https://dummyjson.com/products/search"
const API_PRODUCTS_PER_PAGE = 12;
const API_MAX_PRODUCTS = 100;
let apiSearchKeyword = "";
let apiRequestId = 0;

// Maps a DummyJSON product into the shape renderProductCard() expects
function toCardProduct(item) {
  return {
    image: item.thumbnail,
    alt: item.title,
    category: item.category,
    categoryClass: "bg-primary",
    title: item.title,
    description: item.description,
    price: `$${item.price}`,
  };
}

// Shows at most 5 page numbers around the current page, so many pages don't flood the bar
function renderApiPagination(page, totalPages) {
  const pagination = document.querySelector("#api-pagination");
  if (!pagination) return;

  const pageItem = (label, targetPage, { disabled = false, active = false } = {}) => `
    <li class="page-item ${disabled ? "disabled" : ""} ${active ? "active" : ""}">
      <a class="page-link" href="#" data-page="${targetPage}">${label}</a>
    </li>`;

  const first = Math.max(1, Math.min(page - 2, totalPages - 4));
  const last = Math.min(totalPages, first + 4);

  let items = pageItem("Sebelumnya", page - 1, { disabled: page === 1 });
  for (let i = first; i <= last; i++) {
    items += pageItem(i, i, { active: i === page });
  }
  items += pageItem("Selanjutnya", page + 1, { disabled: page === totalPages });

  pagination.innerHTML = items;
}

function loadApiProducts(page) {
  const container = document.querySelector("#api-product-list");
  if (!container) return;

  // Only the first API_MAX_PRODUCTS are shown, so the last page asks for just the remainder
  const skip = (page - 1) * API_PRODUCTS_PER_PAGE;
  const limit = Math.min(API_PRODUCTS_PER_PAGE, API_MAX_PRODUCTS - skip);
  const params = new URLSearchParams({limit, skip, select: "title,price,thumbnail,category,description"});
  if (apiSearchKeyword) params.set("q", apiSearchKeyword);
  const url = `${apiSearchKeyword ? API_SEARCH_URL : API_URL}?${params}`;

  const request = ++apiRequestId;

  container.innerHTML = `<p class="text-center text-muted py-5">Memuat produk...</p>`;

  fetch(url)
    // .then((response) => response.json())
    .then((response) => {
      if (!response.ok) throw new Error("API request failed");
      return response.json();
    })
    .then((data) => {
      if (request !== apiRequestId) return;

      if (!data.products.length) {
        const empty = document.createElement("p");
        empty.className = "text-center text-muted py-5";
        empty.textContent = apiSearchKeyword ? `Product "${apiSearchKeyword}" tidak ditemukan.` : "Produk tidak ditemukan.";
        container.appendChild(empty);
        document.querySelector("#api-pagination").innerHTML = "";
        return;
      }


      renderProductList("#api-product-list", data.products.map(toCardProduct), "col-sm-6 col-lg-3");
      renderApiPagination(page, Math.max(1, Math.ceil(Math.min(data.total, API_MAX_PRODUCTS) / API_PRODUCTS_PER_PAGE)));
    })
    .catch(() => {
      if (requestId !== apiRequestId) return;
      container.innerHTML = `<p class="text-center text-danger py-5">Gagal memuat produk dari API.</p>`;
    });
}

function initApiPagination() {
  const pagination = document.querySelector("#api-pagination");
  if (!pagination) return;

  pagination.addEventListener("click", (event) => {
    const link = event.target.closest(".page-link");
    if (!link) return;
    event.preventDefault();
    if (link.parentElement.classList.contains("disabled")) return;

    loadApiProducts(Number(link.dataset.page));
    document.querySelector("#api-product-list").scrollIntoView({ behavior: "smooth" });
  });

  loadApiProducts(1);
}

//fungsi search form
function iniApiSearch() {
  const form = document.querySelector("#api-search-form");
  const input = document.querySelector("#api-search-input");
  if (!form || !input) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    apiSearchKeyword = input.value.trim();
    loadApiProducts(1);
  });

}

initApiPagination();
iniApiSearch();