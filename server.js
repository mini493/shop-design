const multer = require('multer');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000; // 수정된 포인트
const ADMIN_PASSWORD = 'wlals159632';

const uploadDir = path.join(__dirname, 'uploads');
const dataPath = path.join(__dirname, 'products.json');
const publicDir = path.join(__dirname, 'public');

// uploads 폴더 없으면 생성
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// products.json 없으면 초기화
if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, '[]', 'utf8');

// 멀티 이미지 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, 'product-' + Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// 정적 파일 설정
app.use(express.static(publicDir));
app.use('/uploads', express.static(uploadDir));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 데이터 불러오기/저장 함수
function loadProducts() {
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}
function saveProducts(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

// ✅ 상품 등록 API
app.post('/upload-product', upload.array('productImages', 5), (req, res) => {
  const { productName, productPrice, productDesc, productCategory, adminPassword } = req.body;

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(403).json({ message: '관리자 번호가 올바르지 않습니다.' });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: '이미지를 1장 이상 업로드해주세요.' });
  }

  const imagePaths = req.files.map(file => '/uploads/' + file.filename);

  const newProduct = {
    id: Date.now(),
    name: productName,
    price: parseInt(productPrice, 10),
    desc: productDesc,
    category: productCategory,
    images: imagePaths
  };

  try {
    const currentData = loadProducts();
    currentData.push(newProduct);
    saveProducts(currentData);
    console.log('✅ 상품 등록:', newProduct);
    res.json({ message: '상품 등록 완료!' });
  } catch (err) {
    console.error('상품 등록 실패:', err);
    res.status(500).json({ message: '상품 등록 실패' });
  }
});

// ✅ 상품 목록 API
app.get('/api/products', (req, res) => {
  try {
    res.json(loadProducts());
  } catch (err) {
    res.status(500).json({ message: '불러오기 실패' });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
