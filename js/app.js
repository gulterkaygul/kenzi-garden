// Firebase Yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyAaxzHiu1Ya-Wcni1RT7Rso4phrJ-ppeoE",
  authDomain: "kenzi-garden.firebaseapp.com",
  projectId: "kenzi-garden",
  storageBucket: "kenzi-garden.firebasestorage.app",
  messagingSenderId: "537211811884",
  appId: "1:537211811884:web:477222a1e7de3167367989",
  measurementId: "G-QPGDBD1EJ6"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const WHATSAPP_NUMBER = "905338400301"; // Telefon numaranız

let cart = [];

// Veritabanından Ürünleri Çek
db.collection("products").onSnapshot((snapshot) => {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '';
  if(snapshot.empty) {
    grid.innerHTML = '<p class="text-center col-span-full text-gray-500">Henüz mağazada ürün bulunmuyor.</p>';
    return;
  }
  snapshot.forEach((doc) => {
    const item = doc.data();
    grid.innerHTML += `
      <div class="bg-white rounded-2xl overflow-hidden product-card flex flex-col justify-between">
        <div>
          <img src="${item.image || 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=500'}" class="w-full h-64 object-cover" alt="${item.name}">
          <div class="p-5">
            <span class="text-xs text-[#2D4A3E] font-semibold tracking-wider uppercase">${item.category || 'Genel'}</span>
            <h3 class="font-bold text-lg text-[#4A3525] mt-1 mb-2">${item.name}</h3>
            <p class="text-stone-500 text-xs mb-4">${item.desc || ''}</p>
          </div>
        </div>
        <div class="p-5 pt-0 flex justify-between items-center border-t border-stone-50">
          <span class="font-bold text-xl text-[#4A3525]">${item.price} TL</span>
          <button onclick="addToCart('${item.name}', ${item.price})" class="bg-[#2D4A3E] text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-custom">
            + Sepete Ekle
          </button>
        </div>
      </div>
    `;
  });
});

function addToCart(name, price) {
  cart.push({ name, price });
  updateCartUI();
}

function updateCartUI() {
  document.getElementById('cart-count').innerText = cart.length;
  const container = document.getElementById('cart-items');
  let total = 0;
  
  if(cart.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center">Sepetiniz henüz boş.</p>';
  } else {
    container.innerHTML = '';
    cart.forEach((item, index) => {
      total += item.price;
      container.innerHTML += `
        <div class="flex justify-between items-center border-b pb-2">
          <div>
            <p class="font-bold text-sm">${item.name}</p>
            <p class="text-xs text-gray-500">${item.price} TL</p>
          </div>
          <button onclick="removeFromCart(${index})" class="text-red-500 text-xs"><i class="fas fa-trash"></i> Sil</button>
        </div>
      `;
    });
  }
  document.getElementById('cart-total').innerText = `${total} TL`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function toggleCart() {
  document.getElementById('cart-modal').classList.toggle('hidden');
}

function sendWhatsAppOrder() {
  const name = document.getElementById('cust-name').value;
  const address = document.getElementById('cust-address').value;

  if (cart.length === 0) { alert('Sepetiniz boş!'); return; }
  if (!name || !address) { alert('Lütfen adınızı ve adresinizi doldurun.'); return; }

  let message = `🌿 *KENZI GARDEN SİPARİŞİ*\n\n`;
  message += `*Müşteri:* ${name}\n`;
  message += `*Adres:* ${address}\n\n`;
  message += `*Sipariş Edilen Ürünler:*\n`;

  let total = 0;
  cart.forEach(item => {
    message += `- ${item.name} (${item.price} TL)\n`;
    total += item.price;
  });

  message += `\n*Toplam Tutar:* ${total} TL`;

  const encodedMessage = encodeURIComponent(message);
  window.location.href = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;
}