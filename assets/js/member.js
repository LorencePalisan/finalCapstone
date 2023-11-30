import {doc,getDocs, setDoc,collection, query, where ,orderBy, limit, startAfter, endBefore, limitToLast, addDoc  } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { db } from "../credentials/firebaseModule.js";



//Elements
let memberName = document.getElementById("memberName");
let spouseName = document.getElementById("spouseName");
let occupation = document.getElementById("occupation");
let age = document.getElementById("age");
let birthday = document.getElementById("birthday");
let civilStatus = document.getElementById("civilStatus");
let citizenship = document.getElementById("citizenship");
let contactNum = document.getElementById("contactNum");
let memberCategory = document.getElementById("memberCategory");
let memberStatus = document.getElementById("memberStatus");
let gender = document.getElementById("gender");
let balance = document.getElementById("bal"); 
let lastVisible; 
let firstVisible;
let currentPage = 1;
let totalDocuments;
const enteredmemberName = memberName?.value;
const enteredspouseName = spouseName?.value;
const enteredoccupation = occupation?.value;
const enteredage = age?.value;
const enteredbirthday = birthday?.value;
const enteredcivilStatus = civilStatus?.value;
const enteredcitizenship = citizenship?.value;
const enteredcontactNum = contactNum?.value;
const enteredmemberCategory = memberCategory?.value;
const enteredmemberStatus = memberStatus?.value;
const enteredgender = gender?.value;
const enteredbalance = balance?.value; 
//Buttons
const addData = document.getElementById("addMember");
const update = document.getElementById("updateMember");
const clear = document.getElementById("clear");


document.addEventListener('DOMContentLoaded', (event) => {
  createPaginationControls();
  fetchAndPopulateTable();
});
document.querySelectorAll('input[type="number"]').forEach(function(input) {
  input.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
    }
  });
});


//========================add Member==============================================
async function addMember() {
  const membersRef = collection(db, "Members");
    
    if (!enteredmemberName || !enteredspouseName  || !enteredoccupation||
        !enteredage       || !enteredbirthday   || !enteredcivilStatus || !enteredcitizenship
        || !enteredcontactNum || !enteredmemberCategory || !enteredmemberStatus || !enteredgender 
        || !enteredbalance) {
      alert("Please fill all the information.");
      return;
    }
const queryRef = query(membersRef, where("memberName", "==", memberName?.value));
const querySnapshot = await getDocs(queryRef);
if (!querySnapshot.empty) {
  alert("This member name already exists");
  return;
}
  const data = {
    memberName: enteredmemberName,
    spouseName: enteredspouseName,
    occupation: enteredoccupation,
    age: enteredage,
    birthday: enteredbirthday,
    civilStatus: enteredcivilStatus,
    citizenship: enteredcitizenship,
    contactNum: enteredcontactNum,
    memberCategory: enteredmemberCategory,
    memberStatus: enteredmemberStatus,
    gender: enteredgender,
    lotAmort: enteredbalance
  };
  const updateConfirmed = confirm("Please check again before adding this member's information.");
  if (updateConfirmed) {
  try {
    const docRef = await addDoc(collection(db, "Members"), data);
    console.log("Document written with ID: ", docRef.id);
    alert("Added Successfully");
      fetchAndPopulateTable();
      clearFields();
  } catch (e) {
    alert("Data not Added");
    console.error("Error adding document: ", e);
  } 
  } else {
    alert("Canceled by the user.");
  }
}
//====================================upadte Member===================================================
//=========================clear==============================================================
function clearFields() {
  memberName.value = "";
  spouseName.value = "";
  occupation.value = "";
  age.value = "";
  birthday.value = "";
  civilStatus.value = "";
  citizenship.value = "";
  contactNum.value = "";
  memberCategory.value = "";
  memberStatus.value = "";
  gender.value = "";
  balance.value = "";
}
//======================Table=================================================
async function fetchAndPopulateTable(next = true) {
  firstVisible = null;
  lastVisible = null;
  let categSelect = document.getElementById("categ")?.value; 
  let statSelect = document.getElementById("stat")?.value; 
  const memberTable = document.getElementById("memberTable");
  const membersCollection = collection(db, "Members");
  const pageSize = 10;
  const totalDocumentsQuery = query(membersCollection);
  const totalDocumentsSnapshot = await getDocs(totalDocumentsQuery);
  const totalDocuments = totalDocumentsSnapshot.size;
  while (memberTable.rows.length > 1) {
    memberTable.deleteRow(1);
  }
let maxPages = Math.ceil(totalDocuments / pageSize);
let queryMem;
if (next && lastVisible && currentPage < maxPages) {
  queryMem = query(membersCollection, orderBy("memberName"), startAfter(lastVisible), limit(pageSize));
  currentPage++;
} else if (!next && firstVisible && currentPage > 1) {
  queryMem = query(membersCollection, orderBy("memberName"), endBefore(firstVisible), limitToLast(pageSize));
  currentPage--;
} else {
  queryMem = query(membersCollection, orderBy("memberName"), limit(pageSize));
  currentPage = 1;
}
  try {
    const querySnapshot = await getDocs(queryMem);
    const documentSnapshots = querySnapshot.docs;
    firstVisible = documentSnapshots[0];
    lastVisible = documentSnapshots[documentSnapshots.length - 1];
    documentSnapshots.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const row = memberTable.insertRow(-1);
      if ((categSelect === "All" || categSelect === data.memberCategory) && statSelect === data.memberStatus) {
        const nameCell = row.insertCell(0);
        nameCell.textContent = data.memberName;
        const categoryCell = row.insertCell(1);
        categoryCell.textContent = data.memberCategory;
        const statusCell = row.insertCell(2);
        statusCell.textContent = data.memberStatus;
        const viewCell = row.insertCell(3);
        const viewButton = document.createElement("button");
        viewButton.textContent = "View Profile";
        viewButton.addEventListener("click", () => {
          const memberName = data.memberName;
          openProfileTab(memberName);
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
function filterTable() {
  const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();
  const memberTable = document.getElementById("memberTable");
  const rows = memberTable.getElementsByTagName("tr");
  for (let i = 1; i < rows.length; i++) {
    const nameCell = rows[i].getElementsByTagName("td")[0];
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
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", filterTable);
document.addEventListener("DOMContentLoaded", filterTable);
//=============================open profile=============================
function openProfileTab(memberName) {
  const url = `profile.html?memberName=${encodeURIComponent(memberName)}`;
  window.open(url, '_blank');
}
//==================================popup========================================
document.getElementById('categ').addEventListener('change', function() {
  fetchAndPopulateTable();
});
document.getElementById('stat').addEventListener('change', function() {
  fetchAndPopulateTable();
});
document.getElementById('Gen').addEventListener('click', function() {
  window.open('memberRenterReport.html');
});
addData.addEventListener("click", addMember);
clear.addEventListener("click", clearFields);
document.addEventListener('DOMContentLoaded', () => {
  const menuItems = document.querySelectorAll('.menu-item');
  function hideAllIframeWrappers() {
      document.querySelectorAll('.iframe-wrapper').forEach(wrapper => {
          wrapper.style.display = 'none';
          wrapper.style.zIndex = '-1';
      });
  }
  function showIframe(wrapperId) {
      hideAllIframeWrappers();
      const iframeWrapper = document.getElementById(wrapperId);
      if (iframeWrapper) {
          iframeWrapper.style.display = 'block';
          iframeWrapper.style.zIndex = '1000';
      }
  }
  menuItems.forEach(item => {
      item.addEventListener('click', () => {
          const iframeId = 'iframeWrapper_' + item.id;
          showIframe(iframeId);
      });
  });
  const memberDetailsMenuItem = document.getElementById('member');
  memberDetailsMenuItem.addEventListener('click', () => {
      hideAllIframeWrappers();
      showIframe('iframeWrapper_memberdetails');
  });
  const collectionListItem = document.getElementById('collectionList');
  collectionListItem.addEventListener('click', () => {
      hideAllIframeWrappers();
      showIframe('iframeWrapper_collectionlist');
  });
  showIframe('iframeWrapper_memberdetails');
});