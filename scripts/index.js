// Global Cart System
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartCount = document.getElementById("cartCount");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartSidebar = document.getElementById("cartSidebar");

const updateCartCount = () => {
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

const saveCart = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCartSummary();
}

const addToCart = (product) => {
    const exists = cart.find(item => item.id === product.id);

    if (!exists) {
        cart.push(product);
        saveCart();
    }
}

const removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    saveCart();
}

const calculateTotal = () => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    if (cartTotalEl) {
        cartTotalEl.textContent = total.toFixed(2);
    }
}

const renderCartSummary = () => {

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML =
            `<p class="text-gray-500">Cart is empty</p>`;
        if (cartTotalEl) cartTotalEl.textContent = "0";
        return;
    }

    cart.forEach(item => {

        const div = document.createElement("div");
        div.className = "flex items-center gap-3 border p-2 rounded";

        div.innerHTML = `
      <img src="${item.image}" class="w-12 h-12 object-contain"/>
      <div class="flex-1">
        <p class="text-sm font-semibold line-clamp-1">${item.title}</p>
        <p class="text-blue-600 text-sm">$${item.price}</p>
      </div>
      <button class="text-red-500 text-sm">✕</button>
    `;

        div.querySelector("button")
            .addEventListener("click", () => removeFromCart(item.id));

        cartItemsContainer.appendChild(div);
    });

    calculateTotal();
}

//  OPEN CART SIDEBAR
document.getElementById("openCartBtn")?.addEventListener("click", () => {
    renderCartSummary();
    cartSidebar?.showModal();
});


// Get all Products
const container = document.getElementById("ourProductContainer");
const cardTemplate = document.getElementById("allProductCard");
// Get Single Product Details for Modal
const modal = document.getElementById("productModal");
const modalContent = document.getElementById("modalContent");

const loadProducts = async () => {
    const loader = document.getElementById("loader");

    const url = "https://fakestoreapi.com/products";
    try {
        loader?.classList.remove("hidden");
        // loading all data
        const response = await fetch(url);
        const result = await response.json();

        // Load top three product based on rating
        if (document.getElementById("productCard")) {
            topProducts(result);
        }
        // Show a loading spinner when data is fetching
        if (loader) {
            loader.style.display = "none";
        }
    } catch (error) {
        console.error(error.message);
    } finally {
        // after loading data spinner will be hidden
        loader?.classList.add("hidden");
    }
}

const topProducts = (products) => {
    // console.log(products);
    const trendingContainer = document.getElementById("trendingContainer");
    const trendingCardTemplate = document.getElementById("productCard");

    if (!trendingCardTemplate || !trendingContainer) {
        console.warn("Template or container not found!");
        return;
    }
    // Sort by rating descending and pick top 3
    const top = [...products].sort((a, b) => b.rating.rate - a.rating.rate).slice(0, 3);

    top.forEach(product => {
        const clone = trendingCardTemplate.content.cloneNode(true);
        clone.querySelector(".productImage").src = product.image;
        clone.querySelector(".productRating").textContent = product.rating.rate;
        clone.querySelector(".productRatingCount").textContent = `(${product.rating.count})`;
        clone.querySelector(".productImage").alt = product.category;
        clone.querySelector(".productCategory").textContent = product.category;
        clone.querySelector(".productTitle").textContent = product.title;
        clone.querySelector(".productPrice").textContent = "$" + product.price;
        clone.querySelector(".detailsBtn").addEventListener("click", () => {
            showProductModal(product.id);
        });
        clone.querySelector(".addCartBtn").addEventListener("click", () => {
            addToCart(product);
        });
        trendingContainer.appendChild(clone);
    });

}


const getAllProducts = async (category = "all") => {

    let url = "https://fakestoreapi.com/products";

    if (category !== "all") {
        url = `https://fakestoreapi.com/products/category/${category}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    if (!container || !cardTemplate) {
        console.error("Container or Template not found!");
        return;
    }

    container.innerHTML = "";

    data.forEach(product => {
        const clone = cardTemplate.content.cloneNode(true);
        clone.querySelector(".productImage").src = product.image;
        clone.querySelector(".productRating").textContent = product.rating.rate;
        clone.querySelector(".productRatingCount").textContent = `(${product.rating.count})`;
        clone.querySelector(".productImage").alt = product.category;
        clone.querySelector(".productCategory").textContent = product.category;
        clone.querySelector(".productTitle").textContent = product.title;
        clone.querySelector(".productPrice").textContent = "$" + product.price;

        clone.querySelector(".detailsBtn").addEventListener("click", () => {
            showProductModal(product?.id);
        });
        clone.querySelector(".addCartBtn").addEventListener("click", () => {
            addToCart(product);
        });

        container.appendChild(clone);
    });

}

const showProductModal = async (id) => {

    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    const product = await res.json();

    modalContent.innerHTML = `
    <div class="grid lg:grid-cols-2 gap-6">

      <div class="flex justify-center items-center">
        <img src="${product.image}" class="w-64 object-contain"/>
      </div>

      <div>
        <h2 class="text-2xl font-bold mb-3">
          ${product.title}
        </h2>

        <p class="text-gray-500 mb-4">
          ${product.description}
        </p>

        <div class="flex items-center gap-4 mb-3">
          <p class="text-xl font-bold text-blue-600">
            $${product.price}
          </p>

          <div class="flex items-center gap-1">
            <span class="text-yellow-500 text-lg"><i
                      class="fa-solid fa-star"
                    ></i></span>
            <span>${product.rating.rate}</span>
            <span class="text-gray-400 text-sm">
              (${product.rating.count} reviews)
            </span>
          </div>
        </div>

        <div class="flex gap-3 mt-5">
          <button class="btn btn-primary">
            Buy Now
          </button>

          <button id="addCartBtn" class="btn btn-outline btn-primary">
            Add to Cart
          </button>
        </div>
      </div>

    </div>
  `;

    // Add to cart event
    document.getElementById("addCartBtn")
        .addEventListener("click", () => {
            addToCart(product);
        });

    modal.showModal();
};


// Category Filter
document.querySelectorAll('input[name="category"]').forEach(btn => {
    btn.addEventListener("change", (e) => {

        // Remove active class from all
        document.querySelectorAll('input[name="category"]').forEach(b => {
            b.classList.remove("btn-primary");
        });

        // Add active class to selected
        e.target.classList.add("btn-primary");

        const selectedCategory = e.target.value;
        getAllProducts(selectedCategory);
    });
});

// set active
const setActiveNav = () => {
    const currentPath = window.location.pathname; // "/", "/products.html", "/products"
    const links = document.querySelectorAll(".nav-link");

    links.forEach(link => {
        const hrefPath = new URL(link.href).pathname;

        // consider home if path is "/" or contains "index.html"
        if (
            currentPath === hrefPath ||
            (currentPath === "/" && hrefPath.includes("index.html"))
        ) {
            link.classList.add("text-blue-600", "font-bold");
        } else {
            link.classList.remove("text-blue-600", "font-bold");
        }
    });
};


document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    setActiveNav();
    if (container) {
        getAllProducts();
    };
    updateCartCount();
});
