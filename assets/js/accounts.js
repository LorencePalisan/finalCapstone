import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { doc, addDoc,getDocs, setDoc,collection, updateDoc, query, where, orderBy, limit, startAfter, endBefore, limitToLast, } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { db, auth } from "../credentials/firebaseModule.js";
const memberRef = collection(db, "Members");
const submit = document.getElementById("submit");
let emailInput = document.getElementById("email");
let userType = document.getElementById("userType");
let memberName = document.getElementById("memName");
let contactNum = document.getElementById("contactNum");
let passwordInput = document.getElementById("password");
let confirmPasswordInput = document.getElementById("Cpassword");
const bleta = document.getElementById("accountsTable");
let currentPage = 1; 
const pageSize = 20; 
let lastVisible = null; 
let firstVisible = null; 
var heading = document.getElementById("myHeading");
let user = document.getElementById("user");
document.addEventListener('DOMContentLoaded', (event) => {
  fetchAndPopulateTable();
  createPaginationControls();
  names();
});
user.addEventListener('change', (event) => {
  fetchAndPopulateTable();
});
async function names() {
  const datalist = document.getElementById("names");
  datalist.innerHTML = "";
  try {
    const querySnapshot = await getDocs(memberRef);
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Select a name";
    datalist.appendChild(defaultOption);
    querySnapshot.forEach((doc) => {
      const memberName = doc.data().memberName;
      const option = document.createElement("option");
      option.value = memberName;
      datalist.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching member names: ", error);
  }
}
document.querySelectorAll('input[type="number"]').forEach(function(input) {
  input.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
    }
  });
});
memberName.addEventListener("change", async function () {
  if (memberName.value) { 
    const queryRef = query(collection(db, "Members"), where("memberName", "==", memberName.value));
    try { 
      const querySnapshot = await getDocs(queryRef);
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        document.getElementById("contactNum").value = data.contactNum;
      } else {
        console.log("Member not found.");
      }
    } catch (error) {
      console.log("Error retrieving member information:", error);
    }
  } else {
    console.log("Member name is required.");
  }
});
async function createAccount() {
  const email = emailInput?.value;
  const password = passwordInput?.value;
  const confirmPassword = confirmPasswordInput?.value;
  if (password !== confirmPassword) {
    alert.error("Passwords do not match");
    return;
  }
  if (!memberName?.value || !emailInput.value || !userType.value || !contactNum.value || !passwordInput.value || !confirmPasswordInput.value) {
    alert("Fill all the empty fields.");
    return;
  }
  const queryRef = query(collection(db, "Members"), where("memberName", "==", memberName?.value));
  const querySnapshot = await getDocs(queryRef);
  const accRef = query(collection(db, "Accounts"), where("memberName", "==", memberName?.value));
  const accSanp = await getDocs(accRef);
  if (!accSanp.empty) {
    alert("This member already has and account.");
    return;
  }
  if (querySnapshot.empty) {
    alert("This member name does not exist in the members list.");
    return;
  }
  const userDocRef = doc(collection(db, "Accounts"));
  const userData = {
    email: email,
    userType: userType?.value,
    memberName: memberName?.value,
    contactNum: contactNum?.value,
  };
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await sendEmailVerification(user);
    await setDoc(userDocRef, userData);
    alert("Account has been created. Please check your email for verification.");
    fetchAndPopulateTable();
    clear();
  } catch (error) {
    console.error("Error creating account:", error);
    alert(error);
  }
}
//===================================================================================
function clear(){
 email .value = "";
 userType .value = "";
 memberName .value = "";
 contactNum .value = "";
 passwordInput .value = "";
 confirmPasswordInput .value = "";
}
//===================================================================================
function filterTable() {
  const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();
  const accountsTable = document.getElementById("accountsTable");
  const rows = accountsTable.getElementsByTagName("tr");
  for (let i = 1; i < rows.length; i++) {
    const nameCell = rows[i].getElementsByTagName("td")[2];
    if (nameCell) {
      const name = nameCell.textContent.toLowerCase();
      if (name.includes(searchInput)) {
        rows[i].style.display = "";
      } else {
        rows[i].style.display = "none";
      }
    }
  }
}
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", filterTable);
document.addEventListener("DOMContentLoaded", filterTable);
//===================================================================================
async function fetchAndPopulateTable(next = true) {
  const collectionRef = collection(db, "Accounts");
  let queryCol;
const totalDocumentsQuery = query(collectionRef);
const totalDocumentsSnapshot = await getDocs(totalDocumentsQuery);
const totalDocuments = totalDocumentsSnapshot.size;
let maxPages = Math.ceil(totalDocuments / pageSize);
if (next && lastVisible && currentPage < maxPages) {
  queryCol = query(collectionRef, orderBy("memberName", "asc"), startAfter(lastVisible), limit(pageSize));
  currentPage++;
} else if (!next && firstVisible && currentPage > 1) {
  queryCol = query(collectionRef, orderBy("memberName", "asc"), endBefore(firstVisible), limitToLast(pageSize));
  currentPage--;
} else {
  queryCol = query(collectionRef, orderBy("memberName", "asc"), limit(pageSize));
  currentPage = 1;
  firstVisible = null;
  lastVisible = null;
}
  while (bleta.rows.length > 1) {
    bleta.deleteRow(1);
  }
  try {
    const querySnapshot = await getDocs(queryCol);
    const documentSnapshots = querySnapshot.docs;
    if (documentSnapshots.length > 0) {
      firstVisible = documentSnapshots[0];
      lastVisible = documentSnapshots[documentSnapshots.length - 1];
    }
    documentSnapshots.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      if (data.userType === user.value) {
                const row = bleta.insertRow(-1);
                const transactionID = row.insertCell(0);
                transactionID.textContent = data.userType;
                const memberName = row.insertCell(1);
                memberName.textContent = data.email;
                const date = row.insertCell(2);
                date.textContent = data.memberName;
                const amount = row.insertCell(3);
                amount.textContent = data.contactNum;
                const resetCell = row.insertCell(4);
                const resetButton = document.createElement("button");
                resetButton.textContent = "Reset Password";
                resetButton.addEventListener("click", () => {
                requestPasswordReset(data.email);
                });
                resetCell.appendChild(resetButton);
              }
    });
    updatePageDisplay(currentPage, maxPages);
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}
function updatePageDisplay(currentPage, maxPages) {
  const pageInfo = document.getElementById('pageInfo');
  if (!pageInfo) {
    console.error('Page information element not found!');
    return;
  }
  pageInfo.textContent = `Page ${currentPage} / ${maxPages}`;
}
function createPaginationControls() {
  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.onclick = () => fetchAndPopulateTable(true);
  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous";
  let alreadyAutoClicked = false;
  prevButton.addEventListener('click', function handlePrevButtonClick() {
    fetchAndPopulateTable(false);
    if (!alreadyAutoClicked) {
      alreadyAutoClicked = true;
      prevButton.dispatchEvent(new MouseEvent('click'));
    }
  });
  const controlsContainer = document.getElementById('paginationControls');
  controlsContainer.appendChild(prevButton);
  controlsContainer.appendChild(nextButton);
  const pageInfo = document.createElement('div');
  pageInfo.id = 'pageInfo';
  pageInfo.textContent = 'Page 1 / 1';
  controlsContainer.appendChild(pageInfo);
}
async function requestPasswordReset(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    alert(`Password reset email sent to ${email}. Check your inbox for further instructions.`);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(`Error sending password reset email: ${errorMessage}`);
    console.error("Error sending password reset email:", errorCode, errorMessage);
  }
}
async function toggleUpdate() {
var formContainer = document.querySelector('.form-container');
        if (formContainer.style.display === 'none' || formContainer.style.display === '') {
            formContainer.style.display = 'flex';
        } else {
            formContainer.style.display = 'none';
            heading.textContent = "Create Account";
            clear();
        }
}
//===================================================================================
submit.addEventListener("click", createAccount);
