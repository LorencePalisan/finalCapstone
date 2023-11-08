import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { doc, getDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { db, auth } from "../credentials/firebaseModule.js";

displayCollection();

const viewColCancel = document.getElementById("viewColCancel");
const cancelB = document.getElementById("cancel");
const eventB = document.getElementById("eventB");
const logoutB = document.getElementById("logout");
const statusButton = document.getElementById("statusButton");

// Get the memberID query parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
const memberID = urlParams.get("memID");

// Add the onAuthStateChanged event listener
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // User is not authenticated, redirect to the login page
    redirectToLogin();
  }
  // If the user is authenticated, you can add any necessary logic here.
  // You may want to fetch and display user-specific data, etc.
});

// Define a logout function
const logout = async () => {
  const url = "http://127.0.0.1:5500/index.html";
  await signOut(auth);
  window.location.href = url;
};

// Define a redirectToLogin function
function redirectToLogin() {
  const url = "http://127.0.0.1:5500/index.html";
  signOut(auth); // Sign out the user
  window.location.href = url;
}





//==================member=======================================

   

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
    document.getElementById("lotAmort").value = data.lotAmort;
   
  } else {
    console.log("No such document!");
  }
} catch (error) {
  console.error("Error getting document:", error);
}


//==================property=======================================

const lotTable = document.getElementById("lotTable");
const lotTableBody = lotTable.querySelector('tbody');

// Clear existing rows in the table body
while (lotTableBody.rows.length > 1) {
  lotTableBody.deleteRow(1);
}

// Query the "Property" collection to find documents that match the MemID field
console.log("MemID to query:", memberID);
const queryid = query(collection(db, "Property"), where("ownerID", "==", memberID));

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
    console.log("No documents found for memberID:", memberID);

    // Display a message in the first row if no data is found
    const noDataMessage = lotTableBody.insertRow(-1);
    const messageCell = noDataMessage.insertCell(0);
    messageCell.textContent = "No Property Yet";
    messageCell.colSpan = 3; // Span across all columns
  }
} catch (error) {
  console.error("Error getting documents:", error);
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
      if (data.MemberID === memberID) {
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



//===============================================================================================================================================

viewColCancel.addEventListener("click", () => {
  var addCol = document.querySelector('#viewCollection');
  addCol.style.display = 'none';
});


logoutB.addEventListener("click", logout);

eventB.addEventListener("click", () => {
  
    const pagePath = "memberCalendar.html";
    window.open(pagePath, '_blank');
});








