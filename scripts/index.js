document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
});

const loadProducts = async () => {
    const url = "https://fakestoreapi.com/products";
    const loader = document.getElementById("loader");
    try {
        loader?.classList.remove("hidden");
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
