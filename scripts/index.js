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
        container.appendChild(clone);
    });

}

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
