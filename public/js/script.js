const productListEl = document.getElementById("productList");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");

const modal = document.getElementById("productModal");
const modalCloseBtn = document.getElementById("modalClose");
const modalImg = document.getElementById("modalImg");
const modalName = document.getElementById("modalName");
const modalPrice = document.getElementById("modalPrice");
const modalDesc = document.getElementById("modalDesc");
const addCartBtn = document.getElementById("addCartBtn");

let allProducts = [];
let filteredProducts = [];
let currentIndex = 0;
const itemsPerLoad = 4;

// 장바구니에 추가
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${product.name} 상품이 장바구니에 담겼습니다!`);
}

// 상품 렌더링
function renderProducts(reset = false) {
  if (reset) {
    productListEl.innerHTML = "";
    currentIndex = 0;
  }

  const end = Math.min(currentIndex + itemsPerLoad, filteredProducts.length);
  for (let i = currentIndex; i < end; i++) {
    const p = filteredProducts[i];

    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>₩${p.price.toLocaleString()}</p>
      <button>장바구니 담기</button>
    `;

    // 장바구니 버튼 이벤트
    card.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(p);
    });

    // 카드 클릭 시 모달 열기
    card.addEventListener("click", () => openModal(p));

    productListEl.appendChild(card);
  }

  currentIndex = end;
}

// 모달 열기
function openModal(product) {
  modalImg.src = product.img;
  modalImg.alt = product.name;
  modalName.textContent = product.name;
  modalPrice.textContent = `₩${product.price.toLocaleString()}`;
  modalDesc.textContent = product.desc;
  addCartBtn.onclick = () => addToCart(product);
  modal.classList.remove("hidden");
}

// 모달 닫기 이벤트
modalCloseBtn.onclick = () => modal.classList.add("hidden");
modal.onclick = (e) => {
  if (e.target === modal) modal.classList.add("hidden");
};

// 필터/검색/정렬 적용
function applyFilters() {
  const search = searchInput?.value.trim().toLowerCase() || "";
  const category = categoryFilter?.value || "all";
  const sort = sortSelect?.value || "";

  filteredProducts = allProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search);
    const matchCategory = category === "all" || p.category === category;
    return matchSearch && matchCategory;
  });

  if (sort === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sort === "name-asc") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "name-desc") {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
  }

  renderProducts(true);
}

// 무한 스크롤 이벤트
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    renderProducts();
  }
});

// 서버에서 상품 데이터 fetch 후 초기 렌더링
fetch('/api/products')
  .then(res => res.json())
  .then(data => {
    allProducts = data;
    applyFilters();
  });

// 필터링 UI 이벤트 등록
if (searchInput) searchInput.addEventListener("input", applyFilters);
if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);
if (sortSelect) sortSelect.addEventListener("change", applyFilters);
