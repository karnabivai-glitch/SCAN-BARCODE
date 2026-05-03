import { app, firebaseConfig } from "./firebase.js";

import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { getFirestore, collection, addDoc, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

// LOGIN STATE
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    loadItems();
  } else {
    document.getElementById("loginPage").style.display = "block";
    document.getElementById("dashboard").style.display = "none";
  }
});

// LOGIN
window.login = async () => {
  const email = email.value;
  const password = password.value;
  await signInWithEmailAndPassword(auth, email, password);
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
    }
  );
};

// SIMPAN ITEM
window.saveItem = async () => {
  const data = {
    barcode: barcode.value,
    nama: nama.value,
    qty: parseInt(qty.value),
    created: new Date()
  };

  await addDoc(collection(db, "items"), data);
  loadItems();
};

// LOAD DATA
async function loadItems() {
  const snapshot = await getDocs(collection(db, "items"));
  const list = document.getElementById("itemList");
  list.innerHTML = "";

  snapshot.forEach(doc => {
    const d = doc.data();
    const li = document.createElement("li");
    li.textContent = `${d.barcode} - ${d.nama} (${d.qty})`;
    list.appendChild(li);
  });
}