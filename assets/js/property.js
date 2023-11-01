
import {getDocs, updateDoc, collection, addDoc, doc, getDoc} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { db } from "../credentials/firebaseModule.js";


//Elements

let ownerID = document.getElementById("ownerID");
let ownerName = document.getElementById("ownerName");
let lotNumber = document.getElementById("lotNumber");
let blockNum = document.getElementById("blockNum");
let lotSize = document.getElementById("lotSize");
let propertyStatus = document.getElementById("propertyStatus");

let popupownerID = document.getElementById("popupownerID");
let popupownerName = document.getElementById("popupownerName");
let popuplotNum = document.getElementById("popuplotNum");
let popupblockNum = document.getElementById("popupblockNum");
let popuplotSize = document.getElementById("popuplotSize");
let popuppropertyStatus = document.getElementById("popuppropertyStatus");

const insert = document.getElementById("insert");
const editB = document.getElementById("Edit");
const updateB = document.getElementById("updateB");


  const Property = collection(db, "Property");
  
  const membersList = collection(db, "Members");
  const membersQuerySnapshot = await getDocs(membersList);
  const propertyQuerySnapshot = await getDocs(Property);
  const propertyList = collection(db, "Property");






  fetchAndPopulateTable();


  document.addEventListener("DOMContentLoaded", () => {
    insert.addEventListener("click", addProperty);
    editB.addEventListener("click", enableInputFields);
    updateB.addEventListener("click", updateProperty);
    fetchAndPopulateTable();
});

//==========================AddProperty============================================================

document.getElementById('ownerID').addEventListener("input", async function() {
  const owneridCheck = ownerID.value; // Use "this.value" to get the input value

  const memberDocRef = doc(db, "Members", owneridCheck);
  const memberDocSnapshot = await getDoc(memberDocRef);
  try {
    

    if (memberDocSnapshot.exists()) {
      const data = memberDocSnapshot.data();
      ownerName.value = data.memberName;
    } else {
      // Handle the case when the member doesn't exist
      ownerName.textContent = "Member not found";
    }
  } catch (error) {
    // Handle any errors that occurred during the database query
    console.error("Error fetching member data:", error);
  }
});



//=============================================================================================================================


// async function addProperty() {
//   const ownerIDVal = ownerID.value; // Get the value of ownerID input field

//   // Check if ownerID is empty or undefined
//   if (!ownerIDVal) {
//     alert("Owner ID is empty or undefined.");
//     return;
//   }

//   const lotNumberVal = lotNumber.value; // Get the value of lotNumber input field

//   // Check if lotNumber is empty or undefined
//   if (!lotNumberVal) {
//     alert("Lot number is empty or undefined.");
//     return;
//   }

//   try {

//     // Query to check if the owner ID exists in "Members" collection
   
//     const ownerExists = membersQuerySnapshot.docs.some((doc) => doc.id === ownerIDVal);
    
//     if (!ownerExists) {
//       alert("Owner ID not found in Members. Cannot add property.");
//       return;
//     }
        
//     const existingProperty = propertyQuerySnapshot.docs.find((doc) => doc.data().lotNumber === lotNumberVal);
    
//     if (existingProperty & propertyStatus?.value !== "Owned") {
//       alert("The lot number already exists, but property is not owned. You can add a property with this lot number.");
//       return;
//     }

//     // If both ownerID and lotNumber checks pass, proceed to add the property
//     const data = {
//       ownerID: ownerIDVal,
//       lotNumber: lotNumberVal,
//       ownerName: ownerName?.value,
//       blockNum: blockNum?.value,
//       lotSize: lotSize?.value,
//       propertyStatus: propertyStatus?.value,
//     };

//     try {
//       const docRef = await addDoc(Property, data); // This will generate a unique document ID
//       alert("Added Successfully");
//       fetchAndPopulateTable();
//     } catch (e) {
//       console.error("Error adding document: ", e);
//     }
//   } catch (error) {
//     console.error("Error checking owner ID in Members: ", error);
//   }
// }

async function addProperty() {
  const ownerIDVal = ownerID.value; // Get the value of ownerID input field
  const lotNumberVal = lotNumber.value; // Get the value of lotNumber input field
  const blockNumVal = blockNum?.value;
  const lotSizeVal = lotSize?.value;
  const propertyStatusVal = propertyStatus?.value;

  if (!ownerIDVal) {
    // If ownerIDVal is empty or undefined, add the property without owner information
    const data = {
      lotNumber: lotNumberVal,
      blockNum: blockNumVal,
      lotSize: lotSizeVal,
      propertyStatus: propertyStatusVal,
    };

    try {

      if(propertyStatusVal.value !== "Owned" ||propertyStatusVal.value !== "Rented"){
        alert("The property should be Vacant");
        return
      }


      const docRef = await addDoc(Property, data); // This will generate a unique document ID
      alert("Property added successfully.");
      fetchAndPopulateTable();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  } else {
    // If ownerIDVal is provided, check for owner existence and existing property
    try {
      // Query to check if the owner ID exists in "Members" collection
      const ownerExists = membersQuerySnapshot.docs.some((doc) => doc.id === ownerIDVal);

      if (!ownerExists) {
        alert("Owner ID not found in Members. Cannot add property.");
        return;
      }

      const existingProperty = propertyQuerySnapshot.docs.find((doc) => doc.data().lotNumber === lotNumberVal);

      if (existingProperty && propertyStatusVal !== "Owned") {
        alert("The lot number already exists, but the property is not owned. You can add a property with this lot number.");
        return;
      }

      // If both ownerID and lotNumber checks pass, proceed to add the property with owner information
      const data = {
        ownerID: ownerIDVal,
        lotNumber: lotNumberVal,
        ownerName: ownerName?.value,
        blockNum: blockNumVal,
        lotSize: lotSizeVal,
        propertyStatus: propertyStatusVal,
      };

      try {
        const docRef = await addDoc(Property, data); // This will generate a unique document ID
        alert("Property added successfully.");
        fetchAndPopulateTable();
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    } catch (error) {
      console.error("Error checking owner ID in Members: ", error);
    }
  }
}



//==========================Update============================================================


async function updateProperty() {
  const enteredLotNum = popuplotNum.value;
  const enteredOwnerID = popupownerID.value;

  // Check if enteredLotNum is empty or undefined
  if (!enteredLotNum) {
    console.error("Lot number is empty or undefined.");
    return;
  }

 

  // Reference to the "Property" collection in Firestore
  

  // Reference to the "Members" collection in Firestore
 

  try {
    if (popupownerID?.value == "") {
      console.log("Update without owner");
    } else {
      const membersQuerySnapshot = await getDocs(membersList);
      const ownerExists = membersQuerySnapshot.docs.some((doc) => doc.id === enteredOwnerID);
  
      if (ownerExists) {
        console.log("Owner exists");
        // Proceed with the property update with an owner.
      } else {
        alert("Owner ID not found in Members. Cannot update property.");
        return;
      }
    }
  
  
  } catch (error) {
    console.error("An error occurred: ", error);
  }

    // Query to get the document reference for the property to update
    const querySnapshot = await getDocs(propertyList);
    let docRefToUpdate = null;

    querySnapshot.forEach((doc) => {
      if (doc.data().lotNumber === enteredLotNum) {
        docRefToUpdate = doc.ref;
      }
    });

    if (!docRefToUpdate) {
      alert("The lot number you entered does not exist.");
      return;
    }

    const propertyStatusSelect = document.getElementById("popuppropertyStatus"); 
    const propertyStatus = propertyStatusSelect.value;

    
    if ((propertyStatus === "Owned" || propertyStatus === "Rented") && !enteredOwnerID) {
      alert("Owner ID must have a value to set property status to 'Owned' or 'Rented'.");
      return;
    }

    const data = {
      ownerID: popupownerID?.value,
      lotNumber: popuplotNum?.value,
      ownerName:popupownerName?.value,
      blockNum: popupblockNum?.value,
      lotSize: popuplotSize?.value,
      propertyStatus: popuppropertyStatus?.value
    };

    try {
      await updateDoc(docRefToUpdate, data);
      alert("Updated Successfully");
      fetchAndPopulateTable();
      disableInputFields();
      closePopup();
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  } 


 

//==========================Table============================================================

document.addEventListener("DOMContentLoaded", () => {
  fetchAndPopulateTable();
});

// Function to fetch data from Firestore and populate the table
async function fetchAndPopulateTable() {
  const memberTable = document.getElementById("table");

  // Clear existing rows in the table
  while (memberTable.rows.length > 1) {
    memberTable.deleteRow(1);
  }

  // Reference to the "Property" collection in Firestore
 

  try {
    const querySnapshot = await getDocs(propertyList);

    // Loop through the documents in the collection and populate the table
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const row = memberTable.insertRow(-1); // Add a new row to the table

      // Populate the row with property information
      const ownerID = row.insertCell(0);
      ownerID.textContent = data.ownerID;

      const ownerName = row.insertCell(1);
      ownerName.textContent = data.ownerName;

      const lotNumber = row.insertCell(2);
      lotNumber.textContent = data.lotNumber;

      const blockNum = row.insertCell(3);
      blockNum.textContent = data.blockNum;

      const lotSize = row.insertCell(4);
      lotSize.textContent = data.lotSize;

      const status = row.insertCell(5);
      status.textContent = data.propertyStatus;

      const viewCell = row.insertCell(6);
      const viewButton = document.createElement("button");
      viewButton.textContent = "View";
      viewButton.addEventListener("click", () => fillPopupWithData(data));
      viewCell.appendChild(viewButton);
    });
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}



//===================================Search Bar==============================================

// Function to filter the table based on the search input
function filterTable() {
  const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();
  const memberTable = document.getElementById("table");
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


//====================================popup==================================================

function fillPopupWithData(data) {
  document.getElementById("popupownerID").value = data.ownerID;
  document.getElementById("popupownerName").value = data.ownerName;
  document.getElementById("popuplotNum").value = data.lotNumber;
  document.getElementById("popupblockNum").value = data.blockNum;
  document.getElementById("popuplotSize").value = data.lotSize;
  document.getElementById("popuppropertyStatus").value = data.propertyStatus;
  
  // Show the popup
  togglePopup();
}

//===========================================================================

function enableInputFields() {
  var inputFields = document.querySelectorAll('.popup input, .popup select');
  for (var i = 0; i < inputFields.length; i++) {
    inputFields[i].removeAttribute('disabled');
  }
  var saveButton = document.querySelector('.save-btn');
  if (saveButton.style.display === 'none' || saveButton.style.display === '') {
    saveButton.style.display = 'block';
  } else { 
    saveButton.style.display = 'none';
  }

}
function disableInputFields() {
  var inputFields = document.querySelectorAll('.popup input, .popup select');
  for (var i = 0; i < inputFields.length; i++) {
    inputFields[i].setAttribute('disabled', 'disabled');
  }
  var saveButton = document.querySelector('.save-btn');
  saveButton.style.display = 'none';
}





// Add event listeners for buttons
insert.addEventListener("click", addProperty);
editB.addEventListener("click", enableInputFields);
updateB.addEventListener("click", updateProperty);


function closePopup() {
  var popup = document.querySelector('.popup');
  popup.style.display = 'none';
  disableInputFields();
}


var closeButton = document.querySelector('.close-btn');
closeButton.addEventListener('click', closePopup);
