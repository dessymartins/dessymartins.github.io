// Get Data Dari API
const API_URL = "https://dummyjson.com/products?limit=15&select=title,price,thumbnail,category,description";

// Menata Data Produk dari API
function toCardProduct(item) {
    return {
        image: item.thumbnail,
        alt: item.title,
        category: item.category,
        categoryClass: "bg-primary",
        title: item.title,
        description: item.description,
        price: '$ ${item.price} ',

    };
}

function loadApiProducts() {
    const container = document.querySelector("#api-product-list");
    if (!container) return;

    container.innerHTML = `<p class="text-center text-muted py-5">Memuat Produk ....</p>`;

    fetch(API_URL)
        .then((response) => response.json())
        .then((data) => {
            renderProductList("#api-product-list", data.products.map(toCardProduct), "col-sm-6 col-lg-3");
        })
        .catch(() => {
            container.innerHTML = `<p class="text-center text-danger py-5">Maaf Product Gagal Di Load</p>`;
        });
}

loadApiProducts();