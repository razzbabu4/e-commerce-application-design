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

    if (exists) {
        showToast("Already in cart!", "warning");
    } else {
        cart.push(product);
        saveCart();
        showToast("Added to cart successfully", "success");
    }
}

const removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    showToast("Removed from cart", "error");
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
      <button class="text-red-500 text-sm cursor-pointer">✕</button>
    `;

        div.querySelector("button")
            .addEventListener("click", () => removeFromCart(item.id));

        cartItemsContainer.appendChild(div);
    });

    calculateTotal();
}

//  Open Cart Sidebar
document.getElementById("openCartBtn")?.addEventListener("click", () => {
    renderCartSummary();
    cartSidebar?.showModal();
    const toastPosition = document.querySelectorAll(".toast");

    const toastContainer = document.getElementById("toastContainer");

    if (cartSidebar?.open) {
        toastContainer.classList.remove("right-5");
        toastContainer.classList.add("left-5");
    } else {
        toastContainer.classList.remove("left-5");
        toastContainer.classList.add("right-5");
    }
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

// Custom Toast Function
const showToast = (message, type = "success") => {

    const container = document.getElementById("toastContainer");

    let bgColor = "bg-green-500 shadow-green-100";
    let iconColor = "fill-green-600";

    if (type === "error") {
        bgColor = "bg-red-500 shadow-red-100";
        iconColor = "fill-red-600";
    }

    if (type === "warning") {
        bgColor = "bg-yellow-500 shadow-yellow-100";
        iconColor = "fill-yellow-600";
    }

    const toast = document.createElement("div");

    toast.innerHTML = `
      <div class="${bgColor} text-white font-semibold tracking-wide flex items-center w-full min-w-xs max-w-lg p-4 rounded-md shadow-md"
           role="alert">
  
        <div class="shrink-0 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg"
               class="w-5 h-5 fill-white inline"
               viewBox="0 0 512 512">
            <ellipse cx="256" cy="256" fill="#fff" rx="256" ry="255.832" />
            <path class="${iconColor}"
              d="m235.472 392.08-121.04-94.296 34.416-44.168
                 74.328 57.904 122.672-177.016
                 46.032 31.888z" />
          </svg>
        </div>
  
        <span class="text-[15px] mr-3 flex-1">${message}</span>
  
        <svg xmlns="http://www.w3.org/2000/svg"
             class="w-3 cursor-pointer shrink-0 fill-white ml-auto closeToast"
             viewBox="0 0 320.591 320.591">
          <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"/>
          <path d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"/>
        </svg>
      </div>
    `;

    container.appendChild(toast);

    // Close Button
    toast.querySelector(".closeToast")
        .addEventListener("click", () => toast.remove());

    // Auto Remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
};


document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    setActiveNav();
    if (container) {
        getAllProducts();
    };
    updateCartCount();
});
