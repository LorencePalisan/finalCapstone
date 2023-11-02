import { signOut } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { doc, getDoc,getDocs,collection, query, where} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { db ,auth} from "../credentials/firebaseModule.js";
  

displayCollection();


const viewColCancel = document.getElementById("viewColCancel");
const cancelB =  document.getElementById("cancel");
const eventB =  document.getElementById("eventB");

const logoutB =  document.getElementById("logout");



// Get the memberID query parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
const memberID = urlParams.get("memID");
const MemID = memberID.value;
// const memberID = String(22);
// const MemID = String(22);

//Elements
const statusButton = document.getElementById("statusButton");


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
const queryid = query(collection(db, "Property"), where("ownerID", "==", memberID));

try {
  const querySnapshot = await getDocs(queryid);

  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();
    

    // Update your HTML elements with the data
    document.getElementById("block").value = data.blockNum;
    document.getElementById("lot").value = data.lotNumber;
    document.getElementById("lotSize").value = data.lotSize;
    
    
  } else {
    console.log("No documents found for MemID:", MemID);
    document.getElementById("block").value = "No Property Yet";
    document.getElementById("lot").value = "No Property Yet";
    document.getElementById("lotSize").value = "No Property Yet";
  }
} catch (error) {
  console.error("Error getting document:", error);
}


const buttonText = statusButton.textContent.toLowerCase();

if (buttonText === "active") {
    statusButton.style.backgroundColor = "#03AC13"; // Green background for "active"
} else {
    statusButton.style.backgroundColor = "#ff0000"; // Red background for "inactive"
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


const logout = async () => {
  const url = `http://127.0.0.1:5500/index.html`;
  await signOut(auth);
  window.location.href = url;
  window.location.replace(url);
}
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








