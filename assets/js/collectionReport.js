import { getDocs,collection } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

import { db } from "../credentials/firebaseModule.js";


addCategoryHeaders();
getCategoryNames();
displayCollection();

// Get references to the select elements
const selectMonth = document.getElementById("Select");
const selectYear = document.getElementById("selectYear");
const resetB = document.getElementById("reset");


// Add an event listener to the month select element
selectMonth.addEventListener("change", function () {
  const selectedMonth = selectMonth.value;
  console.log("Selected Month: " + selectedMonth);
});

// Add an event listener to the year select element
selectYear.addEventListener("change", function () {
  const selectedYear = selectYear.value;
  console.log("Selected Year: " + selectedYear);
});

//========================================================================================================================
function populateYearOptions() {
    const selectYear = document.getElementById("selectYear");
    const currentYear = new Date().getFullYear();
    const yearsToDisplay = 10; // Number of previous and future years to display

    for (let i = -yearsToDisplay; i <= yearsToDisplay; i++) {
        const year = currentYear + i;
        const option = document.createElement("option");
        option.value = year;
        option.text = year;
        selectYear.appendChild(option);
    }
}

    // Call the function to populate year options
    populateYearOptions();


//========================================================================================================================    

    function resetTable() {
        // Get a reference to the table element by its ID
        const table = document.getElementById("showTable");
      
        // Check if the table exists
        if (table) {
          // Remove all rows except the header (first row)
          const rowCount = table.rows.length;
          for (let i = rowCount - 1; i > 0; i--) {
            table.deleteRow(i);
          }
        } else {
          console.log("Table not found.");
        }
      }

//========================================================================================================================
      
      async function displayCollection() {
        // Clear existing rows in the table
        const trans = document.getElementById("showTable");
        while (trans.rows.length > 1) {
          trans.deleteRow(1);
        }
      
        // Reference to the "CollectionList" collection in Firestore
        const collectionRef = collection(db, "CollectionList");
      
        try {
          const querySnapshot = await getDocs(collectionRef);
      
          // Get the categories from CollectionCategory for checking later
          const categoryNames = await getCategoryNames();
      
          // Get the first row of the table (header row)
          const headerRow = document.getElementById("showTable").rows[0];
      
          // Loop through the documents in the CollectionList collection
          querySnapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            const row = trans.insertRow(-1); // Add a new row to the table
      
            // Populate the row with the desired fields
            const transactionNumCell = row.insertCell(0);
            transactionNumCell.textContent = data.TransactionNum;
      
            const memberNameCell = row.insertCell(1);
            memberNameCell.textContent = data.Member;
      
            const memberIDCell = row.insertCell(2);
            memberIDCell.textContent = data.MemberID;
      
            const collectorCell = row.insertCell(3);
            collectorCell.textContent = data.Collector;
      
            const dateCell = row.insertCell(4);
            dateCell.textContent = data.Date;
      
            const totalFeeCell = row.insertCell(5);
            totalFeeCell.textContent = data.TotalFee;

            const balLotAmort = row.insertCell(6);
            balLotAmort.textContent = data.lotAmortBal;
      
            // Add "Yes" or "No" cells based on category presence
            categoryNames.forEach((categoryName, index) => {
              const categoryCell = row.insertCell(7 + index);
              categoryCell.textContent = data.Categories && data.Categories.some(category => category.collectionName === categoryName) ? "Paid" : "Unpaid";
            });
          });
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      }
    async function addCategoryHeaders() {
        // Reference to the "CollectionCategory" collection in Firestore
        const categoryRef = collection(db, "CollectionCategory");
      
        try {
          const querySnapshot = await getDocs(categoryRef);
      
          // Get the first row of the table (header row)
          const headerRow = document.getElementById("showTable").rows[0];
      
          // Loop through the documents in the "CollectionCategory" collection
          querySnapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            // Create a new <th> element for each "collectionName"
            const th = document.createElement("th");
            th.textContent = data.collectionName;
            headerRow.appendChild(th);
          });
        } catch (error) {
          console.error("Error fetching category data: ", error);
        }
      }
      
      // Function to get the category names from CollectionCategory
      async function getCategoryNames() {
        const categoryRef = collection(db, "CollectionCategory");
        const categoryNames = [];
      
        try {
          const querySnapshot = await getDocs(categoryRef);
      
          querySnapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            categoryNames.push(data.collectionName);
          });
        } catch (error) {
          console.error("Error fetching category data: ", error);
        }
      
        return categoryNames;
      }
  //=====================================================================================================================================


// Function to filter the table based on the selected year
function filterTableYear() {
    const selectedYear = document.getElementById("selectYear").value;
    const memberTable = document.getElementById("showTable");
    const rows = memberTable.getElementsByTagName("tr");
  
    for (let i = 1; i < rows.length; i++) {
      const dateCell = rows[i].getElementsByTagName("td")[4]; // Get the cell with the date (modify the index if needed)
      if (dateCell) {
        const date = dateCell.textContent.trim(); // Get the date value
        if (selectedYear === "All" || date.includes(selectedYear)) {
          rows[i].style.display = ""; // Show the row if it matches the selected year or "All"
        } else {
          rows[i].style.display = "none"; // Hide the row if it doesn't match the selected year
        }
      }
    }
  }
  
  // Add an event listener to the select element
  selectYear.addEventListener("change", filterTableYear);
  
  // Call the filterTableYear function when the page loads with "All" selected
  document.addEventListener("DOMContentLoaded", () => {
    // Set "All" as the default value
    selectYear.value = "All";
    filterTableYear();
  });

//======================================================================================================================================

  function filterTableMonth() {
    const selectedMonth = document.getElementById("Select").value;
    const memberTable = document.getElementById("showTable");
    const rows = memberTable.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const dateCell = rows[i].getElementsByTagName("td")[4]; // Get the cell with the date (modify the index if needed)
        if (dateCell) {
            const date = dateCell.textContent.trim(); // Get the date value
            const dateParts = date.split("-"); // Split the date by hyphens
            if (dateParts.length === 3 && dateParts[1] === selectedMonth) {
                rows[i].style.display = ""; // Show the row if it matches the selected month
            } else {
                rows[i].style.display = "none"; // Hide the row if it doesn't match the selected month
            }
        }
    }
}

//======================================================================================================================================

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




// Function to filter the table based on the search input
function filterTable() {
  const searchInput = document.getElementById("searchName").value.trim().toLowerCase();
  const memberTable = document.getElementById("showTable");
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
const searchInput = document.getElementById("searchName");
searchInput.addEventListener("input", filterTable);
// Call the filterTable function when the page loads
document.addEventListener("DOMContentLoaded", filterTable);











selectMonth.addEventListener("change", filterTableMonth);

// Call the filterTableMonth function when the page loads with "Select Month" selected
document.addEventListener("DOMContentLoaded", () => {
    // Set "Select Month" as the default value
    selectMonth.value = "";
    filterTableMonth();
});

resetB.addEventListener("click", function() {
  displayCollection();
  selectMonth.selectedIndex = 0; 
  selectYear.selectedIndex = 0; 
});