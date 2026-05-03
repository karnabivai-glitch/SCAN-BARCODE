import { app } from "./firebase.js";

import { 
  getAuth, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

// HANDLE LOGIN STATE
onAuthStateChanged(auth, (user) => {
  const loginPage = document.getElementById("loginPage");
  const dashboard = document.getElementById("dashboard");

  if (!loginPage || !dashboard) return;

  if (user) {
    loginPage.style.display = "none";
    dashboard.style.display = "block";
    loadItems();
  } else {
    loginPage.style.display = "block";
    dashboard.style.display = "none";
  }
});

// LOGIN
window.login = async () => {
  const emailInput = document.getElementById("email").value;
  const passwordInput = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, emailInput, passwordInput);
  } catch (err) {
    alert(err.message);
    console.error(err);
  }
};

// LOGOUT
window.logout = async () => {
  await signOut(auth);
};

// SCAN BARCODE
window.startScan = function () {
  const html5QrCode = new Html5Qrcode("preview");

  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    (decodedText) => {
      document.getElementById("barcode").value = decodedText;
      html5QrCode.stop();
    },
    (error) => {
      // ignore scan error
    }
  );
};

// SIMPAN ITEM
window.saveItem = async () => {
  const barcode = document.getElementById("barcode").value;
  const nama = document.getElementById("nama").value;
  const qty = parseInt(document.getElementById("qty").value);

  if (!barcode || !nama || !qty) {
    alert("Lengkapi data!");
    return;
  }

  try {
    await addDoc(collection(db, "items"), {
      barcode,
      nama,
      qty,
      created: new Date()
    });

    document.getElementById("barcode").value = "";
    document.getElementById("nama").value = "";
    document.getElementById("qty").value = "";

    loadItems();
  } catch (err) {
    console.error(err);
    alert("Gagal simpan data");
  }
};

// LOAD DATA (FIX ERROR NULL)
async function loadItems() {
  const list = document.getElementById("itemList");

  if (!list) {
    console.error("Element itemList tidak ditemukan");
    return;
  }

  list.innerHTML = "";

  const snapshot = await getDocs(collection(db, "items"));

  snapshot.forEach(doc => {
    const d = doc.data();

    const li = document.createElement("li");
    li.textContent = `${d.barcode} - ${d.nama} (${d.qty})`;

    list.appendChild(li);
  });
}