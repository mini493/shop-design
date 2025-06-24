let allProducts = [];

window.onload = () => {
  fetch('/api/products')
    .then(res => res.json())
    .then(data => {
      allProducts = data;
      renderProducts(allProducts);
    })
    .catch(err => {
      alert('상품 불러오기 실패: ' + err.message);
    });
};

function renderProducts(list) {
  const productListEl = document.getElementById('productList');
  productListEl.innerHTML = '';

  if (list.length === 0) {
    productListEl.innerHTML = '<p style="text-align:center;">상품이 없습니다.</p>';
    return;
  }

  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₩${p.price.toLocaleString()}</p>
      <p>${p.category}</p>
      <p>${p.desc}</p>
      <button onclick="editProduct(${p.id})">수정</button>
      <button onclick="deleteProduct(${p.id})">삭제</button>
    `;
    productListEl.appendChild(card);
  });
}

function deleteProduct(id) {
  if (!confirm('정말 삭제하시겠습니까?')) return;

  fetch('/api/products/' + id, { method: 'DELETE' })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      location.reload();
    })
    .catch(err => alert('삭제 실패: ' + err.message));
}

function editProduct(id) {
  const p = allProducts.find(p => p.id === id);
  if (!p) return alert('상품 정보 없음');

  const name = prompt('새 이름 입력:', p.name);
  const price = prompt('새 가격 입력:', p.price);
  const desc = prompt('새 설명 입력:', p.desc);
  const category = prompt('새 카테고리 입력:', p.category);

  fetch('/api/products/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price, desc, category })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      location.reload();
    })
    .catch(err => alert('수정 실패: ' + err.message));
}
