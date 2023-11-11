import { doc,getDocs,collection,deleteDoc, addDoc  } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

import { db } from "../credentials/firebaseModule.js";

const eventDB = collection(db, "EventDatabase");
const eventReq = collection(db, "EventRequest");

var button = document.getElementById('cal');

const eventsTable = document.getElementById("eventsTable");
displayEvent();



async function displayEvent() {
    // Clear existing rows in the table
    while (eventsTable.rows.length > 1) {
      eventsTable.deleteRow(1);
    }
  
    try {
      const querySnapshot = await getDocs(eventReq);
  
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        const row = eventsTable.insertRow(-1); // Add a new row to the table
  
        // Get the document ID
        const docId = docSnapshot.id;
  
        // Populate the row with event information
        const date = row.insertCell(0);
        date.textContent = data.fullDate;
  
        const facility = row.insertCell(1);
        facility.textContent = data.facility;
  
        const reservedBy = row.insertCell(2);
        reservedBy.textContent = data.reservedBy;
  
        const title = row.insertCell(3);
        title.textContent = data.title;
  
        const time = row.insertCell(4);
        time.textContent = data.time;
  
        const acceptCell = row.insertCell(5);
        const acceptButton = document.createElement("button");
        acceptButton.textContent = "Confirm";
        acceptButton.addEventListener("click", () => acceptEvent(data, docId));
        acceptCell.appendChild(acceptButton);
  
        const rejectCell = row.insertCell(6);
        const rejectButton = document.createElement("button");
        rejectButton.textContent = "Reject";
        rejectButton.addEventListener("click", () => confirmReject(data, docId));
        rejectCell.appendChild(rejectButton);
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }
  

  async function acceptEvent(data, docId) {
    try {
        // Add the event data to the Event Database
        await addDoc(eventDB, data);
        
        // Remove the accepted event from the Event Request collection
        await deleteDoc(doc(eventReq, docId));

        // Refresh the table to reflect the changes
        displayEvent();
    } catch (error) {
        console.error("Error accepting event: ", error);
    }
}


async function confirmReject(data, docId ) {
    const confirmation = confirm("Are you sure you want to reject this event?");
    if (confirmation) {
        console.log("Document ID to be deleted:", docId);
      try {
        // Delete the event document from the "EventRequest" collection in your Firestore database
        const eventRef = doc(eventReq, docId);
        await deleteDoc(eventRef);
  
        console.log("Event deleted");
        displayEvent();
        
      } catch (error) {
        console.error("Error deleting event: ", error);
      }
    }
  }
  

  

// Add a click event listener to the button
button.addEventListener('click', function() {
    window.open('Reservation.html', '_blank');
});