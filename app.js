


// Initialize Firebase with your configuration
const firebaseConfig = {
  //kylevincentmanuel@gmail.com
  // apiKey: "AIzaSyDDvAh_6tTStzjm6KhNNYhGV_IqeuRhE0I",
  // authDomain: "toooda-eab14.firebaseapp.com",
  // projectId: "toooda-eab14",
  // storageBucket: "toooda-eab14.appspot.com",
  // messagingSenderId: "518146176082",
  // appId: "1:518146176082:web:226ef0b25bc08dc28b5b8b"

  //sa kaijuuuuu10@gmail.com
  // apiKey: "AIzaSyAsg1oW1wpZXUcZo0UcFZ57qYWBAJHfasY",
  // authDomain: "todahero-4e7c0.firebaseapp.com",
  // projectId: "todahero-4e7c0",
  // storageBucket: "todahero-4e7c0.appspot.com",
  // messagingSenderId: "617421997910",
  // appId: "1:617421997910:web:aca4e6fc791b36393d38f7",
  // measurementId: "G-B2P699P8YS"

  apiKey: "AIzaSyDjBboCs4iqBnogiInGpHcVvCEDBGokiLU",
  authDomain: "thero-28f02.firebaseapp.com",
  projectId: "thero-28f02",
  storageBucket: "thero-28f02.appspot.com",
  messagingSenderId: "394557839181",
  appId: "1:394557839181:web:53a1bf1d15264d3ab74904",
  measurementId: "G-MB5NB4LDS3"
};

firebase.initializeApp(firebaseConfig);

// Get references to Firestore collections
const todaCollection = firebase.firestore().collection("Toda"); // Original collection for all users
const activeUsersCollection = firebase.firestore().collection("ActiveUsers"); // New collection for active users

// Array to store registered users
const registeredUsers = [];

// Function to update date and time dynamically
function updateDateTime() {
  const datetimeContainer = document.getElementById('datetimeContainer');
  const currentDate = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
  const formattedDateTime = currentDate.toLocaleDateString('en-US', options);
  datetimeContainer.textContent = formattedDateTime;
}

function registerUser() {
  const nameInput = document.getElementById('name');
  const plateNumberInput = document.getElementById('plateNumber');

  const name = nameInput.value;
  const plateNumber = plateNumberInput.value;

  // Display user data on the screen
  const userDataDiv = document.getElementById('userData');
  userDataDiv.innerHTML = `Name: ${name}<br>Plate Number: ${plateNumber}`;

  // Save user data to the "Toda" collection in Firestore
  saveUserDataToFirestore(name, plateNumber);

  // Save user data to the "ActiveUsers" collection in Firestore
  saveActiveUserDataToFirestore(name, plateNumber);

  // Clear the text below the registration form
  userDataDiv.innerHTML = '';

  // Add user to the array and update the UI
  registeredUsers.push({ name, plateNumber });
  updateUI();

  // Reset input fields
  nameInput.value = '';
  plateNumberInput.value = '';

  // Close the registration form modal
  closeRegistrationForm();
}

function saveUserDataToFirestore(name, plateNumber) {
  // Get the current date and time
  const currentDate = new Date();

  // Add a new document with a generated ID to the "Toda" collection
  todaCollection.add({
    name: name,
    plateNumber: plateNumber,
    registrationDateTime: currentDate
  })
  .then((docRef) => {
    console.log("Document written with ID in Toda collection: ", docRef.id);
  })
  .catch((error) => {
    console.error("Error adding document to Toda collection: ", error);
  });
}

function saveActiveUserDataToFirestore(name, plateNumber) {
  // Get the current date and time
  const currentDate = new Date();

  // Add a new document with a generated ID to the "ActiveUsers" collection
  activeUsersCollection.add({
    name: name,
    plateNumber: plateNumber,
    registrationDateTime: currentDate
  })
  .then((docRef) => {
    console.log("Document written with ID in ActiveUsers collection: ", docRef.id);
  })
  .catch((error) => {
    console.error("Error adding document to ActiveUsers collection: ", error);
  });
}

function removeFirstUser() {

  console.log("Before removal - registeredUsers:", registeredUsers);
  // Check if there are users in the list
  if (registeredUsers.length > 0) {
    // Remove the first user from the array
    const removedUser = registeredUsers.shift();

    // Update the UI to reflect the removal
    updateUI();

    // Save the removal date and time to the "Toda" collection
    saveRemovalDataToFirestore(removedUser);

    // Remove the corresponding document from the "ActiveUsers" collection
    removeUserFromActiveUsers(removedUser);

    // Optionally, you can perform additional actions with the removed user data
    // console.log(`Removed user: ${removedUser.name} - Removed plateNumber ${removedUser.plateNumber}`);



    // Return the removed user object
    return removedUser;


  } else {
    // Handle the case when there are no users to remove
    console.log("No users to remove");
    // console.log("After removal - registeredUsers:", registeredUsers);


       // Return null if no users are removed
    return null;
  }
}

function saveRemovalDataToFirestore(removedUser) {
  // Get the current date and time
  const currentDate = new Date();

  // Update the existing document in the "Toda" collection
  todaCollection.where("name", "==", removedUser.name)
    .where("plateNumber", "==", removedUser.plateNumber)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // Update the document with removal date and time
        return doc.ref.update({
          removalDateTime: currentDate
        })
        .then(() => {
          console.log("Removal data updated successfully in Toda collection");
        })
        .catch((error) => {
          console.error("Error updating removal data in Toda collection: ", error);
        });
      });
    })
    .catch((error) => {
      console.error("Error getting document from Toda collection: ", error);
    });
}

function removeUserFromActiveUsers(removedUser) {
  // Find and delete the corresponding document in the "ActiveUsers" collection
  activeUsersCollection.where("name", "==", removedUser.name)
    .where("plateNumber", "==", removedUser.plateNumber)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // Delete the document from the "ActiveUsers" collection
        doc.ref.delete()
          .then(() => {
            console.log("Document deleted from ActiveUsers collection");
          })
          .catch((error) => {
            console.error("Error deleting document from ActiveUsers collection: ", error);
          });
      });
    })
    .catch((error) => {
      console.error("Error getting document from ActiveUsers collection: ", error);
    });
}

function updateUI() {
  const userList = document.getElementById('userList');
  userList.innerHTML = ''; // Clear existing list

  // Populate the list with registered users
  registeredUsers.forEach(user => {
    const listItem = document.createElement('li');
    listItem.textContent = `Name: ${user.name}, Plate Number: ${user.plateNumber}`;
    userList.appendChild(listItem);
  });
}

function toggleFormVisibility() {
  const registrationModal = document.getElementById('registrationModal');
  registrationModal.style.display = (registrationModal.style.display === 'none' || registrationModal.style.display === '') ? 'block' : 'none';
}

function openRegistrationForm() {
  const registrationModal = document.getElementById('registrationModal');
  registrationModal.style.display = 'block';
}

function closeRegistrationForm() {
  const registrationModal = document.getElementById('registrationModal');
  registrationModal.style.display = 'none';
}


const bookNowCollection = firebase.firestore().collection("BookNow"); // New collection for booked users




//START
// Function to handle actions when a plate number is clicked
function handlePlateNumberClick(bookingData, userName, bookingDocId) {
  // Open the modal
  openModal();

  // Display data in the modal
  const modalDataDiv = document.getElementById('modalData');

  // Convert Firestore timestamp to JavaScript Date object
  const timestamp = bookingData.dateTime;
  const dateObject = timestamp.toDate();

  // Format date and time
  const formattedDateTime = dateObject.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    // timeZoneName: 'short'
  });

  modalDataDiv.innerHTML = `

  <p id="pickupPoint">Pickup Point: ${bookingData.pickupPoint}</p>
  <p id="dropOffPoint">Drop-off Point: ${bookingData.dropOffPoint}</p>
  <p id="dateTime">Time Requested: ${formattedDateTime}</p>
  <p id="userName">User: ${userName}</p> <!-- Display user's name -->
  <p id="userContactNumber">Contact Number: ${bookingData.userContactNumber}</p>
  <!-- Accept button -->
  <button onclick="acceptRide('${bookingData.pickupPoint}', '${bookingData.dropOffPoint}', '${formattedDateTime}', '${userName}', '${bookingData.userContactNumber}', '${bookingDocId}')">Accept (fingerprint)</button>
`;


 
}
///END     
      {/* <p>Pickup Point: ${bookingData.pickupPoint}</p>
      <p>Drop-off Point: ${bookingData.dropOffPoint}</p>
      <p>Time Requested: ${formattedDateTime}</p>
      <p>User: ${userName}</p> <!-- Display user's name -->
      <!-- Accept button -->
      <button onclick="acceptRide()">Accept</button>
      `; */}


  // Function to save accepted request time to Firestore
  function saveAcceptedRequestTimeToFirestore() {
    // Get the current date and time
    const currentDate = new Date();

    // Save the current date and time to the "acceptedRequest" collection
    firebase.firestore().collection("acceptedRequest").add({
      acceptedDateTime: currentDate
    })
    .then((docRef) => {
      console.log("Accepted request time saved to Firestore with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error saving accepted request time to Firestore: ", error);
    });
  }




  //para sa notification na mareremoved once maclicked yung "ok" sa modal
  function removeNotification() {
  // Get the notification list
  const notificationList = document.getElementById('notificationList');

  // Remove the first child (the clicked notification) from the list
  notificationList.removeChild(notificationList.firstChild);
}




//   // Function to accept a ride
  function acceptRide(pickupPoint, dropOffPoint, dateTime, userName, userContactNumber, bookingDocId) {
  // Display a confirmation prompt
  const isConfirmed = confirm("Do you want to accept this ride?\n Kunyare fingerprint cerification 'to...");

  // Check if the user confirmed
  if (isConfirmed) {

  // Remove the corresponding document from the "BookNow" collection
  removeBookingFromBookNowCollection(bookingDocId);
   

    // Log the data to the console
    console.log("Accepted Ride Data:");
    console.log("Pickup Point:", pickupPoint);
    console.log("Drop-off Point:", dropOffPoint);
    console.log("Date and Time:", dateTime);
    console.log("User Name:", userName);
    console.log("User Contact Number:", userContactNumber);

   
  

  
    


    // saveAcceptedRequestToFirestore({
    //   pickupPoint: pickupPoint,
    //   dropOffPoint: dropOffPoint,
    //   dateTime: dateTime,
    //   userName: userName,
    //   userContactNumber: userContactNumber,
      
    // });


      

        // // Save the time when the user clicked "OK" to the "acceptedRequest" collection
        // saveAcceptedRequestTimeToFirestore();

      //  // Call the function to remove the first user
      //  removeFirstUser();

        //  // Call the function to remove the first user and log the removed user's details
        //  const removedUser = removeFirstUser();
        //  if (removedUser) {
        //      console.log("User Removed from Queuing List:");
        //      console.log("Name:", removedUser.name);
        //      console.log("Plate Number:", removedUser.plateNumber);
        //  }
     

         // Call the function to remove the first user
    const removedUser = removeFirstUser();
    if (removedUser) {
      console.log("User Removed from Queuing List:");
      console.log("Name:", removedUser.name);
      console.log("Plate Number:", removedUser.plateNumber);

      // Call the function to save accepted request to Firestore
      saveAcceptedRequestToFirestore({
        pickupPoint: pickupPoint,
        dropOffPoint: dropOffPoint,
        dateTime: dateTime,
        userName: userName,
        userContactNumber: userContactNumber
      }, removedUser);

        

  }  
  

       // Close the modal
       closeModal();

         // Remove the clicked notification from the list
         removeNotification();

    // Close the modal
    // openConfirmationModal();
  } else {
    // The user chose not to accept the ride
    // Additional actions or handling can be added here
  }
}




// Function to remove the booking from the "BookNow" collection
function removeBookingFromBookNowCollection(bookingDocId) {
  // Get a reference to the "BookNow" collection and delete the document
  bookNowCollection.doc(bookingDocId).delete()
    .then(() => {
      console.log("Document deleted from BookNow collection");
    })
    .catch((error) => {
      console.error("Error deleting document from BookNow collection: ", error);
    });
}



function saveAcceptedRequestToFirestore(acceptedRideData, removedUserData) {
  // Get the current date and time
  const currentDate = new Date();

    // Format the current date and time for `timeAccepted`
    // const formattedCurrentDateTime = currentDate.toLocaleString('en-US', {
    //   weekday: 'long',
    //   year: 'numeric',
    //   month: 'long',
    //   day: 'numeric',
    //   hour: 'numeric',
    //   minute: 'numeric',
    //   second: 'numeric',
    //   // timeZoneName: 'short'
    // });

  // Log the acceptedRideData object for debugging
  console.log("Accepted Ride Data:", acceptedRideData);



  // Save the current date and time along with accepted ride data to the "acceptedRequest" collection
  firebase.firestore().collection("acceptedRequest").add({
    // timeAccepted: formattedCurrentDateTime,
    timeAccepted: firebase.firestore.Timestamp.fromDate(currentDate),
    pickupPoint: acceptedRideData.pickupPoint,
    dropOffPoint: acceptedRideData.dropOffPoint,
    timeRequested: acceptedRideData.dateTime,
    requestBy: acceptedRideData.userName,
    requestByContactNumber: acceptedRideData.userContactNumber,

    driverName: removedUserData.name,
    driverPlateNumber: removedUserData.plateNumber
   

   
    
  })
  .then((docRef) => {
    console.log("Accepted request and data saved to Firestore with ID: ", docRef.id);
  })
  .catch((error) => {
    console.error("Error saving accepted request and data to Firestore: ", error);
  });
}





// Function to open the modal
function openModal() {
  const modalContainer = document.getElementById('modalContainer');
  modalContainer.style.display = 'flex';
}

// Function to close the modal
function closeModal() {
  const modalContainer = document.getElementById('modalContainer');
  modalContainer.style.display = 'none';

  
  var modal = document.getElementById("registrationModal");
  modal.style.display = "none";

}

// Function to listen for real-time updates in the "BookNow" collection
// function listenForBookNowRealTimeUpdates() {
//   bookNowCollection
//     .orderBy("dateTime", "asc") // Assuming "dateTime" is the field to sort by
//     .onSnapshot((querySnapshot) => {
//       // Clear existing list
//       const notificationList = document.getElementById('notificationList');
//       notificationList.innerHTML = '';

//       // Iterate through the documents in the "BookNow" collection
//       querySnapshot.forEach((doc) => {
//         const bookingData = doc.data();
        
//         // Extract user's name from booking data
//         const userName = bookingData.userName;

//         // Create a clickable list item for each plate number
//         const listItem = document.createElement('div');
//         listItem.textContent = 'You have a ride request!';
//         listItem.classList.add('clickable-item');

//         // Add a click event to each list item
//         listItem.addEventListener('click', () => {
//           // Call the function to handle the click
//           handlePlateNumberClick(bookingData, userName, doc.id); //docid
//         });

//         // Append the list item to the notification list
//         notificationList.appendChild(listItem);
//       });
//     });
// }

function listenForBookNowRealTimeUpdates() {
  bookNowCollection
    .orderBy("dateTime", "asc") // Assuming "dateTime" is the field to sort by
    .onSnapshot((querySnapshot) => {
      // Clear existing list
      const notificationList = document.getElementById('notificationList');
      notificationList.innerHTML = '';

      let isFirstItem = true; // Flag to track if it's the first item

      // Iterate through the documents in the "BookNow" collection
      querySnapshot.forEach((doc, index) => {
        const bookingData = doc.data();
        
        // Extract user's name from booking data
        const userName = bookingData.userName;

        // Create a list item for each plate number
        const listItem = document.createElement('div');
        listItem.textContent = 'You have a ride request!';
        listItem.classList.add('clickable-item');

        // Add a click event only to the first item
        if (isFirstItem) {
          listItem.addEventListener('click', () => {
            handlePlateNumberClick(bookingData, userName, doc.id); //docid
          });
          isFirstItem = false; // Reset flag after attaching click event
        }

        // Append the list item to the notification list
        notificationList.appendChild(listItem);
      });
    });
}


// Call the function to start listening for real-time updates in "BookNow"
listenForBookNowRealTimeUpdates();





// Update date and time initially
updateDateTime();

// Update date and time every second
setInterval(updateDateTime, 1000);



// Function to listen for real-time updates in the "ActiveUsers" collection
function listenForActiveUsersRealTimeUpdates() {
  activeUsersCollection
    .orderBy("registrationDateTime", "asc")  // or "desc" for descending order
    .onSnapshot((querySnapshot) => {
      // Clear existing list
      const activeUsersList = document.getElementById('userList');
      activeUsersList.innerHTML = '';

       // Clear the registeredUsers array
       registeredUsers.length = 0;

      // Iterate through the documents in the "ActiveUsers" collection
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const name = userData.name;
        const plateNumber = userData.plateNumber;

        // Update the UI or perform other actions with the real-time data
        const listItem = document.createElement('li');
        listItem.textContent = `Name: ${name}, Plate Number: ${plateNumber}`;
        activeUsersList.appendChild(listItem);

         // Update the registeredUsers array
         registeredUsers.push({ name, plateNumber });
      });

        // Update the UI with the latest data
        updateUI();
    });
}

// Call the function to start listening for real-time updates in "ActiveUsers"
listenForActiveUsersRealTimeUpdates();


// Function to listen for real-time updates in the "history" collection for rides that ended today
function listenForTodayHistoryRealTimeUpdates() {
  const historyCollection = firebase.firestore().collection("history");
  
  // Get the start and end of today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfToday = new Date(today);
  endOfToday.setDate(endOfToday.getDate() + 1);

  // Query documents where rideEndedAt is within today's date range
  const query = historyCollection.where("rideEnded", ">=", today).where("rideEnded", "<", endOfToday)
  .orderBy("rideEnded", "desc");

  query.onSnapshot((querySnapshot) => {
    // Clear existing history list
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    // Iterate through the documents in the "history" collection for today
    querySnapshot.forEach((doc) => {
      // Get the ID and data of each document
      const historyId = doc.id;
      const historyData = doc.data();

      // Create a list item for each history item
      const historyItem = document.createElement('li');
      // historyItem.textContent = `History ID: ${historyId}`;
      historyItem.textContent = `History`;

      // Add a click event listener to each history item
      historyItem.addEventListener('click', () => {
        // Call a function to handle the click event and display the modal
        displayHistoryModal(historyData);
      });

      // Append the history item to the history list
      historyList.appendChild(historyItem);
    });
  });
}

// Function to display a modal with history details
function displayHistoryModal(historyData) {
  // Access all the relevant data from the history object
  const {
    driverName,
    driverPlateNumber,
    dropOffPoint,
    pickupPoint,
    requestBy,
    requestByContactNumber,
    rideEnded,
    timeAccepted,
    timeRequested
  } = historyData;

  // Format the timestamp fields for better readability
  const formattedRideEnded = rideEnded ? new Date(rideEnded.toDate()).toLocaleString() : '';
  const formattedTimeAccepted = timeAccepted ? new Date(timeAccepted.toDate()).toLocaleString() : '';
  const formattedTimeRequested = timeRequested ? timeRequested : '';

  // Update the content of the modal with the history details
  const modalDataDiv = document.getElementById('modalData');
  modalDataDiv.innerHTML = `
    <p> Ride Details: </p>
    <p>Driver Name: ${driverName}</p>
    <p>Driver Plate Number: ${driverPlateNumber}</p>
    <p>Pickup Point: ${pickupPoint}</p>
    <p>Drop-off Point: ${dropOffPoint}</p>
    <p>Requested By: ${requestBy}</p>
    
    <p>Ride Ended: ${formattedRideEnded}</p>
    
    <!-- Add more details here as needed -->
  `;

  //<p>Contact Number: ${requestByContactNumber}</p>
  //<p>Time Accepted: ${formattedTimeAccepted}</p>
  //<p>Time Requested: ${formattedTimeRequested}</p>
  // Display the modal
  openModal();
}

// Call the function to start listening for real-time updates in "history" for rides that ended today only
listenForTodayHistoryRealTimeUpdates();