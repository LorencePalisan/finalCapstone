
import { doc, getDoc,getDocs, setDoc,collection,deleteDoc,addDoc} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

import { db } from "../credentials/firebaseModule.js";

let CollectionID = document.getElementById("CollectionID");
let collectionName = document.getElementById("collectionName");
let Description = document.getElementById("Description");
let Fee = document.getElementById("Fee");
let Status = document.getElementById("Status");

let popCollectionID = document.getElementById("popCollectionID");
let popcollectionName = document.getElementById("popcollectionName");
let popDescription = document.getElementById("popDescription");
let popFee = document.getElementById("popFee");
let popStatus = document.getElementById("popStatus");


const addB = document.getElementById("add");
const closeB = document.getElementById("close");
const remove = document.getElementById("remove");

const memberTable = document.getElementById("bleta");
//=======================add===========================================

async function addMember() {
    const enteredColID = CollectionID?.value;
    
    // Check if enterID is empty or undefined
    if (!enteredColID) {
      console.error("enterID is empty or undefined.");
      return;
    }
  
    // Check if a document with the same enterID exists
    const docRef = doc(db, "CollectionCategory", enteredColID);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      // Handle duplicate enterID
      alert("This ID already existed");
      return;
    }
  
    const data = {
        CollectionID: CollectionID?.value,
        collectionName: collectionName?.value,
        Description: Description?.value,
        Fee: Fee?.value,
        Status: Status?.value
    };
  
    try {
      await setDoc(docRef, data);
      alert("Added Successfully");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    fetchAndPopulateTable();
  }
//==============================================Table======================
// Function to fetch data from Firestore and populate the table
async function fetchAndPopulateTable() {
    
  
    // Clear existing rows in the table
    while (memberTable.rows.length > 1) {
      memberTable.deleteRow(1);
    }
  
    // Reference to the "Members" collection in Firestore
    const membersCollection = collection(db, "CollectionCategory");
  
    try {
      const querySnapshot = await getDocs(membersCollection);
  
      // Loop through the documents in the collection
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        const row = memberTable.insertRow(-1); // Add a new row to the table
  
        // Populate the row with member information
        const idCell = row.insertCell(0);
        idCell.textContent = data.CollectionID;
  
        const nameCell = row.insertCell(1);
        nameCell.textContent = data.collectionName;
  
        const feeCell = row.insertCell(2);
        feeCell.textContent = data.Fee;

        const statusCell = row.insertCell(3);
        statusCell.textContent = data.Status;
  
        const viewCell = row.insertCell(4);
        const viewButton = document.createElement("button");
        viewButton.textContent = "View";
        viewButton.addEventListener("click", () => fillPopupWithData(data));
        
        viewCell.appendChild(viewButton);
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }
  
  // Call the fetchAndPopulateTable function when the page loads
  fetchAndPopulateTable();

  //===================popup=================================
  function fillPopupWithData(data) {
    document.getElementById("popCollectionID").value = data.CollectionID;
    document.getElementById("popcollectionName").value = data.collectionName;
    document.getElementById("popDescription").value = data.Description;
    document.getElementById("popFee").value = data.Fee;
    document.getElementById("popStatus").value = data.Status;
    
    // Show the popup
    togglePopup();
  }

// Function to show/hide the popup
function togglePopup() {
    var popup = document.querySelector('.popup');
    if (popup.style.display === 'none' || popup.style.display === '') {
        popup.style.display = 'block';
    } else {
        popup.style.display = 'none';
    }
    }

    // Function to hide the popup when clicking the close button
    function closePopup() {
    var popup = document.querySelector('.popup');
    popup.style.display = 'none';
    }

    // Attach an event listener to the close button
    var closeButton = document.querySelector('.close-btn');
    closeButton.addEventListener('click', closePopup);

  //================ remove collection======================

  async function RemoveData() {
    const docRef = collection(db, "RecyCategory"); // Reference to the collection
    
    const data = {
      collectionName: popcollectionName?.value,
      Description: popDescription?.value,
      Fee: popFee?.value,
      Status: popStatus?.value,
    };
  
    try {
      // Use addDoc to automatically generate an ID
      const newDocRef = await addDoc(docRef, data);
      console.log("Added Successfully with ID: ", newDocRef.id);
  
      const deleteID = document.getElementById("popCollectionID").value;
      
      try {
        await deleteDoc(doc(db, "CollectionCategory", deleteID));
        alert("Data deleted successfully");
        fetchAndPopulateTable();
      } catch (e) {
        console.error("Error deleting document: ", e);
      }
    } catch (e) {
      console.error("Error adding document: ", e);
      // Handle error here
    }
    closePopup();
  }
  



  addB.addEventListener("click", addMember);
  closeB.addEventListener("click", closePopup);
  remove.addEventListener("click", RemoveData);