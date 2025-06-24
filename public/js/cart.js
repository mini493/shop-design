const cartItemsEl = document.getElementById("cartItems");
const totalPriceEl = document.getElementById("totalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    cartItemsEl.innerHTML = "<p>장바구니가 비어있습니다.</p>";
    totalPriceEl.textContent = "₩0";
    checkoutBtn.disabled = true;
    return;
  }

  checkoutBtn.disabled = false;

  cart.forEach((item, index) => {
    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.innerHTML = `
      <img src="${item.img}" alt="${item.name}" />
      <div class="item-info">
        <h3>${item.name}</h3>
        <p>₩${item.price.toLocaleString()}</p>
        <input type="number" min="1" value="${item.quantity}" class="quantity-input" data-index="${index}" />
        <button class="remove-btn" data-index="${index}">삭제</button>
      </div>
    `;
    cartItemsEl.appendChild(itemEl);
  });

  updateTotalPrice();

  // 수량 변경 이벤트
  document.querySelectorAll(".quantity-input").forEach(input => {
    input.addEventListener("change", e => {
      const idx = e.target.dataset.index;
      let val = parseInt(e.target.value);
      if (isNaN(val) || val < 1) val = 1;
      cart[idx].quantity = val;
      saveCart();
      updateTotalPrice();
    });
  });

  // 삭제 버튼 이벤트
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const idx = e.target.dataset.index;
      cart.splice(idx, 1);
      saveCart();
      renderCart();
    });
  });
}

function updateTotalPrice() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalPriceEl.textContent = `₩${total.toLocaleString()}`;
}

checkoutBtn.addEventListener("click", () => {
  alert("주문이 완료되었습니다! 감사합니다.");
  cart = [];
  saveCart();
  renderCart();
});

renderCart();
