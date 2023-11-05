
import {doc, getDoc,getDocs, setDoc,collection} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

import { db } from "../credentials/firebaseModule.js";
//Elements

let enterID = document.getElementById("enterID");
let memberName = document.getElementById("memberName");
let spouseName = document.getElementById("spouseName");
let occupation = document.getElementById("occupation");
let PlaceOfBirth = document.getElementById("PlaceOfBirth");
let age = document.getElementById("age");
let birthday = document.getElementById("birthday");
let civilStatus = document.getElementById("civilStatus");
let citizenship = document.getElementById("citizenship");
let contactNum = document.getElementById("contactNum");
let sourceOfIncome = document.getElementById("sourceOfIncome");
let memberCategory = document.getElementById("memberCategory");
let memberStatus = document.getElementById("memberStatus");
let gender = document.getElementById("gender");
let balance = document.getElementById("bal"); 


//Buttons

const addData = document.getElementById("addMember");
const update = document.getElementById("updateMember");
const clear = document.getElementById("clear");




//========================add Member==============================================

async function addMember() {
  const enteredID = enterID?.value;
  const enteredmemberName = memberName?.value;
  const enteredspouseName = spouseName?.value;
  const enteredoccupation = occupation?.value;
  const enteredPlaceOfBirth = PlaceOfBirth?.value;
  const enteredage = age?.value;
  const enteredbirthday = birthday?.value;
  const enteredcivilStatus = civilStatus?.value;
  const enteredcitizenship = citizenship?.value;
  const enteredcontactNum = contactNum?.value;
  const enteredsourceOfIncome = sourceOfIncome?.value;
  const enteredmemberCategory = memberCategory?.value;
  const enteredmemberStatus = memberStatus?.value;
  const enteredgender = gender?.value;
  const enteredbalance = balance?.value;

  // Check if enterID is empty or undefined
  if (!enteredID || !enteredmemberName || !enteredspouseName  || !enteredoccupation  || !enteredPlaceOfBirth ||
      !enteredage       || !enteredbirthday   || !enteredcivilStatus || !enteredcitizenship || !enteredcontactNum   || 
      !enteredsourceOfIncome || !enteredmemberCategory || !enteredmemberStatus || !enteredgender || !enteredbalance) {
    alert("Please fill all the information.");
    return;
  }

  // Check if a document with the same enterID exists
  const docRef = doc(db, "Members", enteredID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // Handle duplicate enterID
    alert("This ID already existed");
    return;
  }

  const data = {
    enterID: enteredID,
    memberName: memberName?.value,
    spouseName: spouseName?.value,
    occupation: occupation?.value,
    PlaceOfBirth: PlaceOfBirth?.value,
    age: age?.value,
    birthday: birthday?.value,
    civilStatus: civilStatus?.value,
    citizenship: citizenship?.value,
    contactNum: contactNum?.value,
    sourceOfIncome: sourceOfIncome?.value,
    memberCategory: memberCategory?.value,
    memberStatus: memberStatus?.value,
    gender: gender?.value,
    lotAmort: balance?.value
  };

  try {
    await setDoc(docRef, data);
    alert("Added Successfully");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  fetchAndPopulateTable();
  clearFields();
}
//====================================upadte Member===================================================


//=========================clear==============================================================
function clearFields() {
  enterID.value = "";
  memberName.value = "";
  spouseName.value = "";
  occupation.value = "";
  PlaceOfBirth.value = "";
  age.value = "";
  birthday.value = "";
  civilStatus.value = "";
  citizenship.value = "";
  contactNum.value = "";
  sourceOfIncome.value = "";
  memberCategory.value = "";
  memberStatus.value = "";
  gender.value = "";
  balance.value = "";
}

//======================Table=================================================

// Function to fetch data from Firestore and populate the table
async function fetchAndPopulateTable() {
  const memberTable = document.getElementById("memberTable");

  // Clear existing rows in the table
  while (memberTable.rows.length > 1) {
    memberTable.deleteRow(1);
  }

  // Reference to the "Members" collection in Firestore
  const membersCollection = collection(db, "Members");

  try {
    const querySnapshot = await getDocs(membersCollection);

    // Loop through the documents in the collection
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const row = memberTable.insertRow(-1); // Add a new row to the table

      // Populate the row with member information
      const idCell = row.insertCell(0);
      idCell.textContent = data.enterID;

      const nameCell = row.insertCell(1);
      nameCell.textContent = data.memberName;

      const statusCell = row.insertCell(2);
      statusCell.textContent = data.memberStatus;

      const viewCell = row.insertCell(3);
      const viewButton = document.createElement("button");
      viewButton.textContent = "View";
      viewButton.addEventListener("click", () => {
        const memberId = data.enterID; // Get the member ID
        openProfileTab(memberId);
      });
      viewCell.appendChild(viewButton);
    });
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}

// Call the fetchAndPopulateTable function when the page loads
fetchAndPopulateTable();


//===================================Search Bar==============================================

// Function to filter the table based on the search input
function filterTable() {
  const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();
  const memberTable = document.getElementById("memberTable");
  const rows = memberTable.getElementsByTagName("tr");

  for (let i = 1; i < rows.length; i++) {
    const nameCell = rows[i].getElementsByTagName("td")[1]; // Get the second cell (name cell)
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

//=============================open profile=============================

function openProfileTab(memberId) {
  // Create a URL with the memberId as a query parameter
  const url = `profile.html?memberID=${encodeURIComponent(memberId)}`;


  window.open(url, '_blank');
}

//==================================popup========================================




addData.addEventListener("click", addMember);
clear.addEventListener("click", clearFields);
// update.addEventListener("click", updateMember);

