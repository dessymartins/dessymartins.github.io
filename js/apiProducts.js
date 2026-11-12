// API Product List (api-products.html): fetches products from the free DummyJSON API,
// paginated on the server with ?limit=&skip= (the API returns the total count)
const API_URL = "https://dummyjson.com/products";
const API_PRODUCTS_PER_PAGE = 12;
const API_MAX_PRODUCTS = 100;

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
  const url = `${API_URL}?limit=${limit}&skip=${skip}&select=title,price,thumbnail,category,description`;

  container.innerHTML = `<p class="text-center text-muted py-5">Memuat produk...</p>`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      renderProductList("#api-product-list", data.products.map(toCardProduct), "col-sm-6 col-lg-3");
      renderApiPagination(page, Math.max(1, Math.ceil(Math.min(data.total, API_MAX_PRODUCTS) / API_PRODUCTS_PER_PAGE)));
    })
    .catch(() => {
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

initApiPagination();