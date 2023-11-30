import {doc,getDocs, updateDoc,collection, query, where ,orderBy, limit, startAfter, endBefore, limitToLast, addDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { db } from "../credentials/firebaseModule.js";
//Elements
let ownerName = document.getElementById("ownerName");
let lotNumber = document.getElementById("lotNumber");
let blockNum = document.getElementById("blockNum");
let lotSize = document.getElementById("lotSize");
let propertyStatus = document.getElementById("propertyStatus");
let lastVisible; 
let firstVisible;
let currentPage = 1;
let popupownerName = document.getElementById("popupownerName");
let popuplotNum = document.getElementById("popuplotNum");
let popupblockNum = document.getElementById("popupblockNum");
let popuplotSize = document.getElementById("popuplotSize");
let popuppropertyStatus = document.getElementById("popuppropertyStatus");
const propertyTable = document.getElementById("table");
const propertyCollection = collection(db, "Property");
const memberRef = collection(db, "Members");
const insert = document.getElementById("insert");
const editB = document.getElementById("Edit");
const updateB = document.getElementById("updateB");
  const Property = collection(db, "Property");

  document.addEventListener('DOMContentLoaded', (event) => {
    createPaginationControls();
    fetchAndPopulateTable();
    names();
  });
  document.querySelectorAll('input[type="number"]').forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
      }
    });
  });
//==========================AddProperty============================================================
async function names(){
  const datalist = document.getElementById("names");
  getDocs(memberRef).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const memberName = doc.data().memberName;
      const option = document.createElement("option");
      option.value = memberName;
      datalist.appendChild(option);
    });
  });
  }
  async function queryName() {
    const q = query(memberRef, where("memberName", "==", ownerName.value));
    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        return docSnap.id; // Return the document ID
      } else {
        console.log("No such document with the provided name!");
        return null;
      }
    } catch (error) {
      console.error("Error getting document by name:", error);
      return null;
    }
  }
//=============================================================================================================================
async function addProperty() {
  let lotNumberVal = lotNumber.value;
  let blockNumVal = blockNum?.value;
  let lotSizeVal = lotSize?.value;
  let propertyStatusVal = propertyStatus?.value;
  let Name = ownerName?.value;
  const lotNumberQuery = query(Property, where('lotNumber', '==', lotNumberVal));
  const existingLotNumberSnapshot = await getDocs(lotNumberQuery);
if (!existingLotNumberSnapshot.empty) {
  alert("Lot number already exists. Please choose a different lot number.");
  return;
}
if(!lotNumberVal || !blockNumVal || !lotSizeVal || !propertyStatusVal){
  alert("Please fill all the information needed.");
  return
}
  if (!Name) {
    let data = {
      ownerName: " ",
      lotNumber: lotNumberVal,
      blockNum: blockNumVal,
      lotSize: lotSizeVal,
      propertyStatus: propertyStatusVal,
    };
    try {
      if(propertyStatusVal != "Vacant"){
        alert("The property should be Vacant");
        return
      }
      const docRef = await addDoc(Property, data);
      alert("Property added successfully.");
      fetchAndPopulateTable();
    } catch (e) {
      alert.error("Error adding property: ", e);
    }
  } else {
    const ownerIdRef = await queryName();
    if (!ownerIdRef) {
      console.log("Owner ID not found. Cannot add property.");
      return;
    }
    console.log(ownerIdRef);
    try {
      const data = {
        ownerRef: ownerIdRef,
        lotNumber: lotNumberVal,
        ownerName: Name,
        blockNum: blockNumVal,
        lotSize: lotSizeVal,
        propertyStatus: propertyStatusVal,
      };
      try {
        const docRef = await addDoc(Property, data); 
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
  const lotNum = popuplotNum?.value;
  const owner = popupownerName?.value;
  const stat = popuppropertyStatus?.value;
  const propertyCollection = collection(db, "Property");
  const querySnapshot = await getDocs(query(propertyCollection, where('lotNumber', '==', lotNum)));
  if (owner && stat === "Vacant") {
    alert('Cannot set property as Vacant if there is an owner');
    return;
  }
  try {
    if (querySnapshot.empty) {
      throw new Error('No document found with the provided lot number');
    }
    const docRef = querySnapshot.docs[0].ref;
    const data = {
      ownerName: popupownerName?.value,
      lotNumber: popuplotNum?.value,
      blockNum: popupblockNum?.value,
      lotSize: popuplotSize?.value,
      propertyStatus: popuppropertyStatus?.value
    };
    await updateDoc(docRef, data);
    togglePopup();
    fetchAndPopulateTable();
    alert('Updated successfully');
  } catch (error) {
    console.error('Error updating document:', error.message);
    alert('Error updating document: ' + error.message);
  }
}
//==========================Table============================================================
document.getElementById('sad').addEventListener('change', function() {
  fetchAndPopulateTable();
});
async function fetchAndPopulateTable(next = true) {
  firstVisible = null;
  lastVisible = null;
  let block = document.getElementById("sad")?.value; 
  const pageSize = 20;
  const totalDocumentsQuery = query(propertyCollection);
  const totalDocumentsSnapshot = await getDocs(totalDocumentsQuery);
  const totalDocuments = totalDocumentsSnapshot.size;
  while (propertyTable.rows.length > 1) {
    propertyTable.deleteRow(1);
  }
let maxPages = Math.ceil(totalDocuments / pageSize);
let queryMem;
if (next && lastVisible && currentPage < maxPages) {
  queryMem = query(propertyCollection, orderBy("blockNum"), startAfter(lastVisible), limit(pageSize));
  currentPage++;
} else if (!next && firstVisible && currentPage > 1) {
  queryMem = query(propertyCollection, orderBy("blockNum"), endBefore(firstVisible), limitToLast(pageSize));
  currentPage--;
} else {
  queryMem = query(propertyCollection, orderBy("blockNum"), limit(pageSize));
  currentPage = 1;
}
  try {
    const querySnapshot = await getDocs(queryMem);
    const documentSnapshots = querySnapshot.docs;
    firstVisible = documentSnapshots[0];
    lastVisible = documentSnapshots[documentSnapshots.length - 1];
    documentSnapshots.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const row = propertyTable.insertRow(-1);
      const num = 1;
      if( block == data.blockNum){
        const nameCell = row.insertCell(0);
        nameCell.textContent = data.ownerName;
        const categoryCell = row.insertCell(1);
        categoryCell.textContent = data.lotNumber;
        const blockCell = row.insertCell(2);
        blockCell.textContent = data.blockNum;
        const sizeCell = row.insertCell(3);
        sizeCell.textContent = data.lotSize;
        const statusCell = row.insertCell(4);
        statusCell.textContent = data.propertyStatus;
        const viewCell = row.insertCell(5);
        const viewButton = document.createElement("button");
        viewButton.textContent = "View Property";
        viewButton.addEventListener("click", () => {
          fillPopupWithData(data);
        });
        viewCell.appendChild(viewButton);
      }
    });
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
  updatePageDisplay(currentPage, maxPages);
}
function updatePageDisplay(currentPage, maxPages) {
  const pageInfo = document.getElementById('pageInfo');
  if (!pageInfo) {
    console.error('Page information element not found!');
    return;
  }
  pageInfo.textContent = `Page ${currentPage} / ${maxPages}`;
}
function createPaginationControls() {
  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.onclick = () => fetchAndPopulateTable(true);
  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous";
  prevButton.onclick = () => fetchAndPopulateTable(false);
  const controlsContainer = document.getElementById('paginationControls');
  controlsContainer.appendChild(prevButton);
  controlsContainer.appendChild(nextButton);
  const pageInfo = document.createElement('div');
  pageInfo.id = 'pageInfo';
  pageInfo.textContent = 'Page 1 / 1';
  controlsContainer.appendChild(pageInfo);
}
//===================================Search Bar==============================================
document.getElementById('find').addEventListener('click',queryPropertyByLotNumber );
async function queryPropertyByLotNumber() {
  let lotnam = document.getElementById('searchInput')?.value;
  const propertyCollection = collection(db, "Property");
  const querySnapshot = await getDocs(query(propertyCollection, where('lotNumber', '==', lotnam)));
  if (querySnapshot.empty) {
    alert('No matching Lot Number found');
    return;
  }
  const data = querySnapshot.docs[0].data();
  findPopup(data);
}
//====================================popup==================================================
function findPopup(data) {
  document.getElementById("popupownerName").value = data.ownerName;
  document.getElementById("popuplotNum").value = data.lotNumber;
  document.getElementById("popupblockNum").value = data.blockNum;
  document.getElementById("popuplotSize").value = data.lotSize;
  document.getElementById("popuppropertyStatus").value = data.propertyStatus;
  togglePopup();
}
function fillPopupWithData(data) {
  document.getElementById("popupownerName").value = data.ownerName;
  document.getElementById("popuplotNum").value = data.lotNumber;
  document.getElementById("popupblockNum").value = data.blockNum;
  document.getElementById("popuplotSize").value = data.lotSize;
  document.getElementById("popuppropertyStatus").value = data.propertyStatus;
  togglePopup();
}
//===========================================================================
function enableInputFields() {
  var editableFields = document.querySelectorAll('#popupownerName, #popuppropertyStatus');
  for (var i = 0; i < editableFields.length; i++) {
    editableFields[i].removeAttribute('disabled');
  }
  var updateButton = document.querySelector('#updateB');
  updateButton.style.display = 'block';
}
function disableInputFields() {
  var inputFields = document.querySelectorAll('.popup input, .popup select');
  for (var i = 0; i < inputFields.length; i++) {
    inputFields[i].setAttribute('disabled', 'disabled');
  }
  var saveButton = document.querySelector('.save-btn');
  saveButton.style.display = 'none';
}
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
document.getElementById('addProp').addEventListener('click', () => {
  toggleaddProp();
});
document.getElementById('clB').addEventListener('click', () => {
  toggleaddProp();
});
function toggleaddProp() {
  var popup = document.querySelector('.form-container');
  if (popup.style.display === 'none' || popup.style.display === '') {
    popup.style.display = 'flex';
    
  } else {
    popup.style.display = 'none';
    document.getElementById('addProp').textContent = "Add Property";
  }
}