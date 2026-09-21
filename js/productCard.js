// Product card component: turns a product object into card markup.
function renderProductCard(product, { linkToDetail = false } = {}) {
  const image = `<img src="${product.image}" class="card-img-top" alt="${product.alt}">`;
  const title = `<h5 class="card-title">${product.title}</h5>`;

  const imageMarkup = linkToDetail
    ? `<a href="detail.html" class="text-decoration-none text-dark">${image}</a>`
    : image;
  const titleMarkup = linkToDetail
    ? `<a href="detail.html" class="text-decoration-none text-dark">${title}</a>`
    : title;

  return `
    <div class="card product-card h-100 border-0 shadow-sm">
      ${imageMarkup}
      <div class="card-body d-flex flex-column">
        <span class="badge ${product.categoryClass} align-self-start mb-2">${product.category}</span>
        ${titleMarkup}
        <p class="card-text text-muted small flex-grow-1">${product.description}</p>
        <div class="d-flex justify-content-between align-items-center mt-2">
          <span class="fw-bold text-primary">${product.price}</span>
          <button class="btn btn-sm btn-primary btn-beli">
            <i class="bi bi-cart-plus"></i> Beli
          </button>
        </div>
      </div>
    </div>
  `;
}

// Renders a list of products into a container, wrapping each card in a grid column.
function renderProductList(containerSelector, productList, columnClass, options) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.innerHTML = productList
    .map((product) => `<div class="${columnClass}">${renderProductCard(product, options)}</div>`)
    .join("");
}