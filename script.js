document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab_content");
  const productContainer = document.querySelector(".product_container");

  // fetch api data
  async function fetchData() {
    try {
      const res = await fetch(
        "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json"
      );
      const data = await res.json();
      return data.categories;
    } catch (error) {
      console.log(`Error while fetching data: ${error}`);
    }
  }

  // display products based on category
  function displayProducts(categoryName) {
    fetchData().then((categories) => {
      const selectedCategory = categories.find(
        (category) => category.category_name === categoryName
      );

      if (selectedCategory) {
        const products = selectedCategory.category_products;
        const productCards = products
          .map((product) => {
            const discountPercentage = Math.round(
              ((product.compare_at_price - product.price) /
                product.compare_at_price) *
                100
            );

            return `
                <div class="product_card">
                ${
                  product.badge_text
                    ? `<span class="product_badge_text">${product.badge_text}</span>`
                    : ""
                }
                <img class="product_image" src="${product.image}" alt="${
              product.title
            }" />
                <div class="product_header">
                  <p class="product_title">${product.title}</p>
                  <p class="product_vendor">${product.vendor}</p>
                </div>
                <div class="product_bottom">
                  <p class="product_price">Rs ${product.price}</p>
                  <p class="product_discount_price">Rs ${
                    product.compare_at_price
                  }</p>
                  <p class="product_discount">${discountPercentage}% Off</p>
                </div>
                <button>Add to Cart</button>
              </div>
                `;
          })
          .join("");
        productContainer.innerHTML = productCards;
      } else {
        productContainer.innerHTML = "<p>No products found.</p>";
      }
    });
  }
  // Initialize display products with Men on page load
  displayProducts("Men");

  //   tab switch logic
  tabs.forEach((tab) => {
    tab.addEventListener("click", function (event) {
      event.preventDefault();
      const selectedTab = event.target;
      const categoryName = selectedTab.textContent.trim();

      tabs.forEach((tab) => tab.removeAttribute("id"));
      selectedTab.setAttribute("id", "selected");

      displayProducts(categoryName);
    });
  });
});
