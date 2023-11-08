import {doc, getDoc,getDocs, setDoc,collection, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { db } from "../credentials/firebaseModule.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { auth } from "../credentials/firebaseModule.js";

import { accountSid, authToken, twilioPhoneNumber } from '../credentials/twilioCredentials.js';



displayCollection();
collectionMenu();


const viewColCancel = document.getElementById("viewColCancel");
const addB =  document.getElementById("addCollection");
const collectionAdd =  document.getElementById("add");
const cancelB =  document.getElementById("cancel");
const deleteButton = document.getElementById("moveBin");
const editB = document.getElementById("Edit");
const closeB = document.getElementById("close");
const updateB = document.getElementById("updateMember");
const sendBbb = document.getElementById("sendBB");
const sendB =  document.getElementById("send");


let totalFee = 0; 
let lotAmortVal; 
let inputFee;

// Get the memberID query parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
const memberID = urlParams.get("memberID");
const MemID = memberID;
//Elements
const statusButton = document.getElementById("statusButton");

function sendSMS() {
 
  const recipientPhoneNumber = document.getElementById('recipientNumber').value;
  const messageBody = document.getElementById('messageBody').value;
  const apiUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  try {
  
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: twilioPhoneNumber,
        To: recipientPhoneNumber,
        Body: messageBody,
      }),
    })
      .then(response => response.json())
      .then(data => console.log(data.sid))
      .catch(error => console.error(error));
    
    toggleButton();
  } catch (error) {
      console.error('An unexpected error occurred:', error);
      alert('An unexpected error occurred. Please check the console for details.');
  }
  
}

//================================================================================================================================



const docRef = doc(db, "Members", memberID);

try {
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    
    // Update your HTML elements with the data

    document.getElementById("id").value = data.enterID;
    document.getElementById("name").value = data.memberName;
    document.getElementById("category").value = data.memberCategory;
    document.getElementById("statusButton").textContent = data.memberStatus;
    document.getElementById("recipientNumber").value = '+63' + data.contactNum.substring(1);
    document.getElementById("balance").value = parseFloat(data.lotAmort).toFixed(2);

    lotAmortVal = parseFloat(data.lotAmort).toFixed(2);


   
  } else {
    console.log("No such document!");
  }
} catch (error) {
  console.error("Error getting document:", error);
}


const buttonText = statusButton.textContent.toLowerCase();

if (buttonText === "active") {
  statusButton.style.backgroundColor = "#03AC13";
} else {
  statusButton.style.backgroundColor = "#ff0000"; 
}

  const lotTable = document.getElementById("lotTable");
  const lotTableBody = lotTable.querySelector('tbody');

  // Clear existing rows in the table body
  while (lotTableBody.rows.length > 1) {
    lotTableBody.deleteRow(1);
  }

  // Query the "Property" collection to find documents that match the MemID field
  console.log("MemID to query:", MemID);
  const queryid = query(collection(db, "Property"), where("ownerID", "==", MemID));

  try {
    const querySnapshot = await getDocs(queryid);

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();

      // Create a new row for each document and populate the cells
      const newRow = lotTableBody.insertRow(-1);
      const blockCell = newRow.insertCell(0);
      const lotCell = newRow.insertCell(1);
      const lotSizeCell = newRow.insertCell(2);

      blockCell.textContent = data.lotNumber;
      lotCell.textContent = data.blockNum;
      lotSizeCell.textContent = data.lotSize;
    });

    if (querySnapshot.empty) {
      console.log("No documents found for MemID:", MemID);

      // Display a message in the first row if no data is found
      const noDataMessage = lotTableBody.insertRow(-1);
      const messageCell = noDataMessage.insertCell(0);
      messageCell.textContent = "No Property Yet";
      messageCell.colSpan = 3; // Span across all columns
    }
  } catch (error) {
    console.error("Error getting documents:", error);
  }




     


//==================member=======================================

//===============================================================================================================================================

// Move outside of collectionMenu

function updateTotalFee(totalFee) {
  const totalFeeCell = document.getElementById("totalFee");
  if (totalFeeCell) {
    totalFeeCell.textContent = `Total Fee: $${totalFee.toFixed(2)}`;
  }
}

async function collectionMenu() {
  // Clear existing rows in the table, but keep the first row (header)
  while (addColTable.rows.length > 1) {
    addColTable.deleteRow(1);
  }

  // Reference to the "Members" collection in Firestore
  const membersCollection = collection(db, "CollectionCategory");

  try {
    const querySnapshot = await getDocs(membersCollection);

    // Loop through the documents in the collection
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      if (data.Status === "Active") {
        const row = addColTable.insertRow(-1); // Add a new row to the table

        // Create and populate table cells for each data field
        const checkboxCell = row.insertCell(0);
        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkboxCell.appendChild(checkBox); // Append checkbox to the cell

        const idCell = row.insertCell(1);
        idCell.textContent = data.CollectionID;

        const nameCell = row.insertCell(2);
        nameCell.textContent = data.collectionName;

        const feeCell = row.insertCell(3);

        let feeValue = parseFloat(data.Fee);
        if (isNaN(feeValue)) {
          feeValue = 0; // Set default value for calculation
        }

        // Check if CollectionID is "001"
        if (data.CollectionID === "001") {
          inputFee = document.createElement("input");
          inputFee.type = "text";
          inputFee.placeholder = "Enter fee";

          let timeout;

          inputFee.addEventListener("input", (event) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              const newFee = parseFloat(event.target.value);
              feeValue = isNaN(newFee) ? 0 : newFee;
              feeCell.textContent = isNaN(newFee) ? "" : newFee.toFixed(2);

              // Assign the value to inputFee
              inputFee = event.target.value;
              
              let parsedLotAmortVal = parseFloat(lotAmortVal);
              let parsedInputFee = parseFloat(inputFee);

              // Use parsedLotAmortVal and parsedInputFee as needed in your code
            }, 2000); // Adjust the delay as needed
          });

          feeCell.appendChild(inputFee);
        } else {
          feeCell.textContent = feeValue.toFixed(2);
        }

        checkBox.addEventListener("change", () => {
          if (checkBox.checked) {
            totalFee += feeValue;
          } else {
            totalFee -= feeValue;
          }
          updateTotalFee(totalFee);
        });
      }
    });

    const totalFeeRow = document.createElement("tr");
    const totalFeeCell = document.createElement("td");
    totalFeeCell.textContent = `Total Fee: $${totalFee.toFixed(2)}`;
    totalFeeCell.colSpan = 4;
    totalFeeCell.id = "totalFee";
    totalFeeRow.appendChild(totalFeeCell);
    addColTable.appendChild(totalFeeRow);
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}


//===============================================================================================================================================




//===============================================================================================================================================

function togglePopup() {
  var addCol = document.querySelector('#addCol');
  if (addCol.style.display === 'none' || addCol.style.display === '') {
      addCol.style.display = 'flex';
  } else {
      addCol.style.display = 'none';
      document.getElementById("tranNum").value = "";
      document.getElementById("memID").value = "";
      document.getElementById("memName").value = "";
      document.getElementById("tranDate").value = "";
    collectionMenu();
    cancelCollcetion();
  }
  }
//===============================================================================================================================================
  function cancelCollcetion() {
    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });

    // Set totalFee to 0
    totalFee = 0;
    
    // Update the "Total Fee" row
    updateTotalFee();
}
//===============================================================================================================================================
memID.addEventListener("click", async () => {
  document.getElementById("memID").value = MemID;
  // Check if memID is empty or undefined
  if (!memID.value) {
      console.error("memID is empty or undefined.");
      return;
  }

  // Check if a document with the same memID exists
  const docRef = doc(db, "Members", memID.value);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
      const memberData = docSnap.data();
      document.getElementById("memName").value = memberData.memberName;
  }
});
//===============================================================================================================================================
async function addCollection() {

  const buttonText = statusButton.textContent.toLowerCase();
  let currentBal = lotAmortVal;
  if (buttonText != "active") {
    alert("The member is currently INACTIVE");
    return
  }
  
  const checkedRows = Array.from(document.querySelectorAll('#colCat table input[type="checkbox"]:checked'));
  const dataToAdd = {
      TransactionNum: document.getElementById('tranNum').value, 
      Date: document.getElementById('tranDate').value, 
      Collector: document.getElementById('collName').value, 
      Member: document.getElementById('memName').value, 
      MemberID: document.getElementById('memID').value, 
      TotalFee: totalFee,
      lotAmortBal: currentBal,
      Categories: []
  };

  if (checkedRows.length === 0) {
      alert("Select at least 1 collection.");
  } else {
      // Insert data based on checked rows
      checkedRows.forEach((row) => {
          if (row.parentElement.tagName === 'TD') {
              // Exclude the header row
              const cells = row.parentElement.parentElement.cells; // Get the cells from the parent row
              const idCell = cells[1].textContent;
              const nameCell = cells[2].textContent;
              const feeCell = parseFloat(cells[3].textContent);
              dataToAdd.Categories.push({ collectionID: idCell, collectionName: nameCell, collectionFee: feeCell }); // Use the correct field names
          }
      });

      try {
          const transactionRef = doc(db, "CollectionList", dataToAdd.TransactionNum); // Use dataToAdd.TransactionNum
          const snapshot = await getDoc(transactionRef);

          if (snapshot.exists()) {
              alert("Transaction number already exists. Please enter a different number.");
              document.getElementById('tranNum').focus(); // Corrected how to set focus
          } else {
              await setDoc(transactionRef, dataToAdd);
              updateLotAmort();
              alert("Data added successfully");
              
          }
      } catch (error) {
          alert("Error adding data: " + error);
      }
  }
  
}
//===============================================================================================================================================

async function displayCollection() {
  // Clear existing rows in the table
  while (bleta.rows.length > 1) {
    bleta.deleteRow(1);
  }

  // Reference to the "Members" collection in Firestore
  const collectionRef = collection(db, "CollectionList");

  try {
    const querySnapshot = await getDocs(collectionRef);

    // Loop through the documents in the collection
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      
      // Check if the "MemberID" matches the desired value
      if (data.MemberID === MemID) {
        const row = bleta.insertRow(-1); // Add a new row to the table

        // Populate the row with member information
        const transactionID = row.insertCell(0);
        transactionID.textContent = data.TransactionNum;

        const memberName = row.insertCell(1);
        memberName.textContent = data.Member;

        const date = row.insertCell(2);
        date.textContent = data.Date;

        const amount = row.insertCell(3);
        amount.textContent = data.TotalFee;

        const viewCell = row.insertCell(4);
        const viewButton = document.createElement("button");
        viewButton.textContent = "View";
        viewButton.addEventListener("click", () => viewCollection(data));
        viewCell.appendChild(viewButton);

      }
    });
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}

//===============================================================================================================================================
// Function to display the selected data in "viewCollection" HTML

function viewCollection(data) {
  const addCol = document.querySelector('#viewCollection');
  if (addCol.style.display === 'none' || addCol.style.display === '') {
    addCol.style.display = 'block';

    // Populate the HTML elements with data
    document.getElementById('cdTransactionNumber').value = data.TransactionNum;
    document.getElementById('cdMemberID').value = data.MemberID;
    document.getElementById('cdMemberName').value = data.Member;
    document.getElementById('cdCollectorName').value = data.Collector;
    document.getElementById('cdTranDate').value = data.Date;
    document.getElementById('bal').value = data.lotAmortBal;
    // Clear the table
    const table = document.getElementById('cdTable');
    while (table.rows.length > 1) {
      table.deleteRow(1);
    }

    // Populate the table with collection data
    data.Categories.forEach((category) => {
      const row = table.insertRow(-1);
      const collectionIDCell = row.insertCell(0);
      const collectionNameCell = row.insertCell(1);
      const feeCell = row.insertCell(2);

      collectionIDCell.textContent = category.collectionID;
      collectionNameCell.textContent = category.collectionName;
      feeCell.textContent = category.collectionFee;
    });

    // Add a new row at the very end of the table with the value of data.TotalFee
    const newRow = table.insertRow(-1);
    const totalFeeCell = newRow.insertCell(0);
    totalFeeCell.colSpan = 3; // Span the cell across all columns
    totalFeeCell.textContent = `Total Fee: ${data.TotalFee}`;






  } else {
    addCol.style.display = 'none';
  }
}



//===============================================================================================================================================

viewColCancel.addEventListener("click", () => {
  var addCol = document.querySelector('#viewCollection');
  addCol.style.display = 'none';
});



function poppop() {
  var pop = document.querySelector('#popup');
  if (pop.style.display === 'none' || pop.style.display === '') {
    pop.style.display = 'grid';
  } else {
    pop.style.display = 'none';
  }
  } 

//===============================================================================================================================================
// Common function to update HTML elements
async function updateHTMLElements() {
const docRefe = doc(db, "Members", memberID);

try {
  const docSnap = await getDoc(docRefe);

  if (docSnap.exists()) {
    const data = docSnap.data();
    

    document.getElementById('enterID').value = data.enterID;
    document.getElementById('memberName').value = data.memberName;
    document.getElementById('spouseName').value = data.spouseName;
    document.getElementById('occupation').value = data.occupation;
    document.getElementById('PlaceOfBirth').value = data.PlaceOfBirth;
    document.getElementById('age').value = data.age;
    document.getElementById('birthday').value = data.birthday;
    document.getElementById('civilStatus').value = data.civilStatus;
    document.getElementById('citizenship').value = data.citizenship;
    document.getElementById('contactNum').value = data.contactNum;
    document.getElementById('sourceOfIncome').value = data.sourceOfIncome;
    document.getElementById('memberCategory').value = data.memberCategory;
    document.getElementById('memberStatus').value = data.memberStatus;
    document.getElementById('gender').value = data.gender;
   
  } else {
    console.log("No such document!");
  }
} catch (error) {
  console.log(error);
}

}


async function updateMember() {
  const enteredID = enterID?.value;

  // Check if enterID is empty or undefined
  if (!enteredID) {
    console.error("enterID is empty or undefined.");
    return;
  }

  // Check if a document with the same enterID exists
  const docRef = doc(db, "Members", enteredID);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    console.error("enterID not found. This ID does not exist in the database.");
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
    gender: gender?.value
  };

  try {
    await updateDoc(docRef, data); // Use updateDoc to update the existing document
    alert("Updated Successfully");
    location.reload();

  } catch (e) {
    console.error("Error updating document: ", e);
  }
}
//===============================================================================================================================================




function toggleButton() {
  var button = document.getElementById("smsForm");
  


  button.style.display = (button.style.display === "block") ? "none" : "block";
}


//===============================================================================================================================================

async function updateLotAmort() {
  let parsedLotAmortVal = parseFloat(lotAmortVal);
  let parsedInputFee = parseFloat(inputFee);
   
let subResult = parsedLotAmortVal  - parsedInputFee ;
  // Check if a document with the same enterID exists
  const docRef = doc(db, "Members", MemID);
  const docSnap = await getDoc(docRef);


  const data = {
    lotAmort:subResult
  };

  try {
    await updateDoc(docRef, data);
    console.log(subResult);
    location.reload();

  } catch (e) {
    console.error("Error updating document: ", e);
  }
}




collectionAdd.addEventListener("click", addCollection);
addB.addEventListener("click", togglePopup);
cancelB.addEventListener("click", togglePopup);
closeB.addEventListener("click", poppop);
updateB.addEventListener("click", updateMember);
sendBbb.addEventListener("click", toggleButton);
sendB.addEventListener("click", sendSMS);
editB.addEventListener("click", () => {
  updateHTMLElements();
  poppop();
});