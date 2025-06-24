// public/upload.js
document.getElementById("productForm").addEventListener("submit", (e) => {
    e.preventDefault();
  
    const name = document.getElementById("name").value.trim();
    const price = parseInt(document.getElementById("price").value);
    const img = document.getElementById("img").value.trim();
    const category = document.getElementById("category").value;
    const desc = document.getElementById("desc").value.trim();
  
    const newProduct = {
      id: Date.now(),
      name,
      price,
      img,
      category,
      desc
    };
  
    const stored = JSON.parse(localStorage.getItem("userProducts") || "[]");
    stored.push(newProduct);
    localStorage.setItem("userProducts", JSON.stringify(stored));
  
    alert("상품이 등록되었습니다!");
    location.href = "index.html";
  });
  