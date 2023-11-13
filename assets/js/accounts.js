import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { doc, setDoc, getDoc,collection,getDocs } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

import { db, auth } from "../credentials/firebaseModule.js";




const submit = document.getElementById("submit");

let emailInput = document.getElementById("email");
let userType = document.getElementById("userType");
let memberID = document.getElementById("memberID");
let memberName = document.getElementById("memberName");
let contactNum = document.getElementById("contactNum");
let passwordInput = document.getElementById("password");
let confirmPasswordInput = document.getElementById("Cpassword");

var heading = document.getElementById("myHeading");


fetchAndPopulateTable();


// Create user account
async function createAccount() {

let email = emailInput?.value;
let password = passwordInput?.value;
let confirmPassword = confirmPasswordInput?.value;

  if (password !== confirmPassword) {
    console.error("Passwords do not match");
    return;
  }

  if (!memberID?.value) {
    alert("Member ID is empty or undefined.");
    return;
  }
    // Check if a document with the same enterID exists
    const docRef = doc(db, "Members", memberID?.value);
    const docSnap = await getDoc(docRef);
  
    if (!docSnap.exists()) {
      // Handle duplicate enterID
      alert("This member ID does not existed in members list.");
      return;
    }
  
    const userDocRef = doc(db, "Accounts",memberID?.value);
    const accSnap = await getDoc(userDocRef);
    if (accSnap.exists()) {
      // Handle duplicate enterID
      alert("This member ID is already used.");
      return;
    }
    const data = {
      email: email,
      userType: userType?.value,
      memberID: memberID?.value,
      memberName: memberName?.value,
      contactNum: contactNum?.value,
    }
    try{
      await setDoc(userDocRef, data);
      console.log("Data added.");
    }catch(error){
      console.error("Error adding data:", error);
    }
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      alert("Account has been created.");
 
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error creating user: ", errorMessage);
    });
    clear();
}























memberID.addEventListener("input", async function () {
  const memberIDValue = memberID?.value;

  if (memberIDValue) { // Check if memberIDValue is not empty or undefined
    const docRef = doc(db, "Members", memberIDValue);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      document.getElementById("memberName").value = data.memberName;
      document.getElementById("contactNum").value = data.contactNum;
    } else {
      // Handle the case when the document does not exist
    }
  } else {
    // Handle the case when memberIDValue is empty or undefined
  }
});
//===================================================================================
function clear(){
 email .value = "";
 userType .value = "";
 memberID .value = "";
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
    const nameCell = rows[i].getElementsByTagName("td")[3]; // Get the second cell (name cell)
    if (nameCell) {
      const name = nameCell.textContent.toLowerCase();
      if (name.includes(searchInput)) {
        rows[i].style.display = ""; // Show the row if it matches the search
      } else {
        rows[i].style.display = "none"; // Hide the row if it doesn't match the search
      }
    }
  }
}

// Add an event listener to the search input field
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", filterTable);

// Call the filterTable function when the page loads
document.addEventListener("DOMContentLoaded", filterTable);


//===================================================================================

// Function to fetch data from Firestore and populate the table
async function fetchAndPopulateTable() {
  const accountTable = document.getElementById("accountsTable");

  // Clear existing rows in the table
  while (accountTable.rows.length > 1) {
    accountTable.deleteRow(1);
  }

  // Reference to the "Members" collection in Firestore
  const accountCollection = collection(db, "Accounts");

  try {
    const querySnapshot = await getDocs(accountCollection);

    // Loop through the documents in the collection
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const row = accountTable.insertRow(-1); // Add a new row to the table

      // Populate the row with member information
      const idCell = row.insertCell(0);
      idCell.textContent = data.memberID;

      const typeCell = row.insertCell(1);
      typeCell.textContent = data.userType;

      const emailCell = row.insertCell(2);
      emailCell.textContent = data.email;

      const nameCell = row.insertCell(3);
      nameCell.textContent = data.memberName;

      const contact  = row.insertCell(4);
      contact.textContent = data.contactNum;

      // const viewCell = row.insertCell(5);
      // const viewButton = document.createElement("button");
      // viewButton.textContent = "Reset Password";
      // viewButton.addEventListener("click", () => {
      //   toggleUpdate();
      // });
      // viewCell.appendChild(viewButton);  
    });
  } catch (error) {
    console.error("Error fetching data: ", error);
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