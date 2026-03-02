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
        trendingContainer.appendChild(clone);
    });

}

const container = document.getElementById("ourProductContainer");
const cardTemplate = document.getElementById("allProductCard");

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

        container.appendChild(clone);
    });

}
// 🔥 Get Single Product for Modal
const modal = document.getElementById("productModal");
const modalContent = document.getElementById("modalContent");

const showProductModal = async (id) => {

    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    const product = await res.json();

    modalContent.innerHTML = `
      <div class="lg:flex gap-6">
        <img src="${product.image}" class="w-60 object-contain mx-auto"/>
        
        <div>
          <h2 class="text-2xl font-bold mb-2">${product.title}</h2>
          <p class="text-gray-500 mb-3">${product.description}</p>
          <p class="text-xl font-bold text-blue-600 mb-2">$${product.price}</p>
          <span class="badge badge-outline">${product.category}</span>
        </div>
      </div>
    `;

    modal.showModal();
};


// 🔥 Category Filter
document.querySelectorAll('input[name="category"]').forEach(btn => {
    btn.addEventListener("change", (e) => {

        // 🔥 Remove active class from all
        document.querySelectorAll('input[name="category"]').forEach(b => {
            b.classList.remove("btn-primary");
        });

        // 🔥 Add active class to selected
        e.target.classList.add("btn-primary");

        const selectedCategory = e.target.value;
        getAllProducts(selectedCategory);
    });
});

// set active
const setActiveNav = () => {
    const current = window.location.pathname.split("/").pop();
    const links = document.querySelectorAll(".nav-link");

    links.forEach(link => {
        if (link.getAttribute("href") === current) {
            link.classList.add("text-blue-600", "font-bold");
        }
    });
};


document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    setActiveNav();
    if (container) {
        getAllProducts();
    }
});
