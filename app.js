import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDpcYIgpUhU2kKnZiHCc1fVJmVjDx_VzXo",
  authDomain: "scan-barcode-7bb05.firebaseapp.com",
  projectId: "scan-barcode-7bb05",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// LOGIN
window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login berhasil");
    loadData();
  } catch (err) {
    alert(err.message);
  }
};

// SIMPAN DATA
window.saveData = async function () {
  const input = document.getElementById("dataInput").value;

  await addDoc(collection(db, "data"), {
    text: input,
    created: new Date()
  });

  loadData();
};

// LOAD DATA
async function loadData() {
  const querySnapshot = await getDocs(collection(db, "data"));
  const list = document.getElementById("dataList");
  list.innerHTML = "";

  querySnapshot.forEach(doc => {
    const li = document.createElement("li");
    li.textContent = doc.data().text;
    list.appendChild(li);
  });
}