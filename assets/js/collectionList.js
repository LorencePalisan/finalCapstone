
import { doc, getDoc,getDocs, setDoc,collection,updateDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

import { db } from "../credentials/firebaseModule.js";


let memID = document.getElementById("memID");

const add = document.getElementById("add");
const cancel = document.getElementById("cancel");
const popupMenu = document.getElementById("popupMenu");
const viewColCancel = document.getElementById("viewColCancel");
// const deleteButton = document.getElementById("moveBin");

let totalFee = 0; 
let inputFee = 0;
let lotAmortVal;


   
   




// Function to show/hide the popup
function togglePopup() {
    var addCol = document.querySelector('#addCol');
    if (addCol.style.display === 'none' || addCol.style.display === '') {
        addCol.style.display = 'block';
    } else {
        addCol.style.display = 'none';
    }
    }
function closePopup() {
    var addCol = document.querySelector('#addCol');
    addCol.style.display = 'none';

    document.getElementById("tranNum").value = "";
    document.getElementById("memID").value = "";
    document.getElementById("memName").value = "";
    document.getElementById("tranDate").value = "";
    
    cancelCollcetion();
    }

  

//=======================================================================

function updateTotalFee() {
    const totalFeeCell = document.getElementById("totalFee");
    if (totalFeeCell) {
        totalFeeCell.textContent = `Total Fee: $${totalFee.toFixed(2)}`;
    }
}


async function updateLotAmort() {
   


    let parsedLotAmortVal = parseFloat(lotAmortVal);
    let parsedInputFee = parseFloat(inputFee);
     
  let subResult = parsedLotAmortVal  - parsedInputFee ;
    // Check if a document with the same enterID exists
    const docRef = doc(db, "Members", memID?.value);
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





//=================add Collection=========================================


async function addCollection() {

    let currentBal

    const docRef = doc(db, "Members", memID?.value);

    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            lotAmortVal = parseFloat(data.lotAmort).toFixed(2);
            currentBal = data.lotAmort;
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error getting document:", error);
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





//==================Cancel==========================================================
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

//===============================display member Name=============================================
memID.addEventListener("input", async () => {
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
//=================================display Collection List========================================================
// Function to fetch data from Firestore and populate the table
async function displayCollection() {
    
  
    // Clear existing rows in the table
    while (trans.rows.length > 1) {
        trans.deleteRow(1);
    }
  
    // Reference to the "Members" collection in Firestore
    const collectionRef = collection(db, "CollectionList");
  
    try {
      const querySnapshot = await getDocs(collectionRef);
  
      // Loop through the documents in the collection
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        const row = trans.insertRow(-1); // Add a new row to the table
  
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
        viewButton.addEventListener("click",  () => viewCollection(data));
        viewCell.appendChild(viewButton);

        

        return function() {
            moveDataToBin(data);           
          };


          
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }
  
  //===============================Search Bar======================================================

function filterTable() {
    const searchInput = document.getElementById("searchBar").value.trim().toLowerCase();
    const memberTable = document.getElementById("trans");
    const rows = memberTable.getElementsByTagName("tr");
  
    for (let i = 1; i < rows.length; i++) {
      const nameCell = rows[i].getElementsByTagName("td")[1];
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

  // Add an event listener to the search input field
  const searchInput = document.getElementById("searchBar");
  searchInput.addEventListener("input", filterTable);
  // Call the filterTable function when the page loads
  document.addEventListener("DOMContentLoaded", filterTable);

//================================View Collection==================================================================
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

        // Add a click event listener to the delete button
        // deleteButton.addEventListener("click", () => transferDataToRecyCollection(data));
    }else{
        addCol.style.display = 'none';
    }
}

//==================================tranfer RecyCOllection========================================


  


  


displayCollection();
collectionMenu();
cancel.addEventListener("click", closePopup);
popupMenu.addEventListener("click", togglePopup);
add.addEventListener("click", addCollection);
viewColCancel.addEventListener("click", () => {
    var addCol = document.querySelector('#viewCollection');
    addCol.style.display = 'none';
});

// deleteButton.addEventListener("click", () => {
//     var addCol = document.querySelector('#viewCollection');
//     addCol.style.display = 'none';
// });