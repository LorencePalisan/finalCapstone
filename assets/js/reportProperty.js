import { getDocs,collection } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

import { db } from "../credentials/firebaseModule.js";



const resetB = document.getElementById("reset");


//=====================================================================================================================================================
displayCollection();

async function displayCollection() {
    // Clear existing rows in the table
    const trans = document.getElementById("showTable");
    while (trans.rows.length > 1) {
      trans.deleteRow(1);
    }
  
    // Reference to the "CollectionList" collection in Firestore
    const collectionRef = collection(db, "Property");
  
    try {
      const querySnapshot = await getDocs(collectionRef);
  
      // Loop through the documents in the CollectionList collection
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        const row = trans.insertRow(-1); // Add a new row to the table
  
        // Populate the row with the desired fields
        const ownerCell = row.insertCell(0);
        ownerCell.textContent = data.ownerID;
  
        const memberNameCell = row.insertCell(1);
        memberNameCell.textContent = data.ownerName;
  
        const lotnumber = row.insertCell(2);
        lotnumber.textContent = data.lotNumber;
  
        const blocCell = row.insertCell(3);
        blocCell.textContent = data.blockNum;
  
        const sizeCell = row.insertCell(4);
        sizeCell.textContent = data.lotSize;
  
        const statusCell = row.insertCell(5);
        statusCell.textContent = data.propertyStatus;

  
    
      
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }


  //===========================================================================================================

  function filterTable() {

   

    const searchInput = document.getElementById("selecBlock").value.trim().toLowerCase();
    const memberTable = document.getElementById("showTable");
    const rows = memberTable.getElementsByTagName("tr");
  
    for (let i = 1; i < rows.length; i++) {
      const nameCell = rows[i].getElementsByTagName("td")[3];
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
 



  
  function filterTableStatus() {

   

    const statusInput = document.getElementById("selectStatus").value.trim().toLowerCase();
    const memberTable = document.getElementById("showTable");
    const rows = memberTable.getElementsByTagName("tr");
  
    for (let i = 1; i < rows.length; i++) {
      const nameCell = rows[i].getElementsByTagName("td")[5];
      if (nameCell) {
        const name = nameCell.textContent.toLowerCase();
        if (name.includes(statusInput)) {
          rows[i].style.display = ""; 
        } else {
          rows[i].style.display = "none";
        }
      }
    }
  }



  // Function to convert a 2D array to a CSV string
  function convertToCSV(arr) {
    return arr.map(row => row.join(',')).join('\n');
}

// Function to download a CSV file with user-selected file name
function downloadCSV(data, filename) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', filename);

    // Trigger a click event to open the browser's save dialog
    a.click();
    window.URL.revokeObjectURL(url);
}

document.getElementById('generateReport').addEventListener('click', function () {
  const table = document.getElementById('showTable');
  const data = [];
  
  // Extract table headers (th elements)
  const headerRow = table.getElementsByTagName('tr')[0];
  const headers = Array.from(headerRow.getElementsByTagName('th')).map(th => th.textContent.trim());
  data.push(headers);

  // Extract table data based on current display (filtered by month and year)
  const rows = table.getElementsByTagName('tr');
  for (let i = 1; i < rows.length; i++) {
      if (rows[i].style.display !== 'none') {
          const row = [];
          const cells = rows[i].getElementsByTagName('td');
          for (let j = 0; j < cells.length; j++) {
              row.push(cells[j].textContent.trim());
          }
          data.push(row);
      }
  }

  // Prompt the user for a file name
  const fileName = prompt('Enter a file name (with .csv extension):');
  if (fileName) {
      downloadCSV(convertToCSV(data), fileName);
  }
});





  // Add an event listener to the search input field
  const statusInput = document.getElementById("selectStatus");
  statusInput.addEventListener("change", filterTableStatus);

  const searchInput = document.getElementById("selecBlock");
  searchInput.addEventListener("change", filterTable);

  resetB.addEventListener("click", displayCollection);

  document.addEventListener("DOMContentLoaded", filterTable);
  document.addEventListener("DOMContentLoaded", filterTableStatus);