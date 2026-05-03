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

// LOGIN (GLOBAL FIX)
window.login = async () => {
  const emailInput = document.getElementById("email").value;
  const passwordInput = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, emailInput, passwordInput);
  } catch (err) {
    alert(err.message);
  }
};

// LOGOUT
window.logout = async () => {
  await signOut(auth);
};

// STATE LOGIN
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

// SCAN
window.startScan = function () {
  const html5QrCode = new Html5Qrcode("preview");

  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    (decodedText) => {
      document.getElementById("barcode").value = decodedText;
      html5QrCode.stop();
    }
  );
};

// SIMPAN
window.saveItem = async () => {
  const barcode = document.getElementById("barcode").value;
  const nama = document.getElementById("nama").value;
  const qty = parseInt(document.getElementById("qty").value);

  if (!barcode || !nama || !qty) {
    alert("Lengkapi data!");
    return;
  }

  await addDoc(collection(db, "items"), {
    barcode,
    nama,
    qty,
    created: new Date()
  });

  loadItems();
};

// LOAD DATA
async function loadItems() {
  const list = document.getElementById("itemList");

  if (!list) return;

  list.innerHTML = "";

  const snapshot = await getDocs(collection(db, "items"));

  snapshot.forEach(doc => {
    const d = doc.data();
    const li = document.createElement("li");
    li.textContent = `${d.barcode} - ${d.nama} (${d.qty})`;
    list.appendChild(li);
  });
}