









// // Initialize Firebase with your configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDDvAh_6tTStzjm6KhNNYhGV_IqeuRhE0I",
//   authDomain: "toooda-eab14.firebaseapp.com",
//   projectId: "toooda-eab14",
//   storageBucket: "toooda-eab14.appspot.com",
//   messagingSenderId: "518146176082",
//   appId: "1:518146176082:web:226ef0b25bc08dc28b5b8b"
// };

// firebase.initializeApp(firebaseConfig);

// // Get a reference to the Firestore database
// const db = firebase.firestore();

// // Array to store registered users
// const registeredUsers = [];

// // Function to update date and time dynamically
// function updateDateTime() {
//   const datetimeContainer = document.getElementById('datetimeContainer');
//   const currentDate = new Date();
//   const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
//   const formattedDateTime = currentDate.toLocaleDateString('en-US', options);
//   datetimeContainer.textContent = formattedDateTime;
// }

// function registerUser() {
//   const nameInput = document.getElementById('name');
//   const plateNumberInput = document.getElementById('plateNumber');

//   const name = nameInput.value;
//   const plateNumber = plateNumberInput.value;

//   // Display user data on the screen
//   const userDataDiv = document.getElementById('userData');
//   userDataDiv.innerHTML = `Name: ${name}<br>Plate Number: ${plateNumber}`;

//   // Save user data to the "Toda" collection in Firestore
//   saveUserDataToFirestore(name, plateNumber);

//   // Clear the text below the registration form
//   userDataDiv.innerHTML = '';

//   // Add user to the array and update the UI
//   registeredUsers.push({ name, plateNumber });
//   updateUI();

//   // Reset input fields
//   nameInput.value = '';
//   plateNumberInput.value = '';

//   // Close the registration form modal
//   closeRegistrationForm();
// }

// function saveUserDataToFirestore(name, plateNumber) {
//   // Get the current date and time
//   const currentDate = new Date();

//   // Add a new document with a generated ID to the "Toda" collection
//   db.collection("Toda").add({
//     name: name,
//     plateNumber: plateNumber,
//     registrationDateTime: currentDate
//   })
//   .then((docRef) => {
//     console.log("Document written with ID: ", docRef.id);
//   })
//   .catch((error) => {
//     console.error("Error adding document: ", error);
//   });
// }



// function removeFirstUser() {
//   // Check if there are users in the list
//   if (registeredUsers.length > 0) {
//     // Remove the first user from the array
//     const removedUser = registeredUsers.shift();

//     // Update the UI to reflect the removal
//     updateUI();

//     // Save the removal date and time to Firestore
//     saveRemovalDataToFirestore(removedUser);

//     // Optionally, you can perform additional actions with the removed user data
//     console.log(`Removed user: ${removedUser.name} - ${removedUser.plateNumber}`);
//   } else {
//     // Handle the case when there are no users to remove
//     console.log("No users to remove");
//   }
// }

// function saveRemovalDataToFirestore(removedUser) {
//   // Get the current date and time
//   const currentDate = new Date();

//   // Update the existing document in the "Toda" collection
//   db.collection("Toda").where("name", "==", removedUser.name)
//     .where("plateNumber", "==", removedUser.plateNumber)
//     .get()
//     .then((querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//         // Update the document with removal date and time
//         return doc.ref.update({
//           removalDateTime: currentDate
//         })
//         .then(() => {
//           console.log("Removal data updated successfully");
//         })
//         .catch((error) => {
//           console.error("Error updating removal data: ", error);
//         });
//       });
//     })
//     .catch((error) => {
//       console.error("Error getting document: ", error);
//     });
// }


// function updateUI() {
//   const userList = document.getElementById('userList');
//   userList.innerHTML = ''; // Clear existing list

//   // Populate the list with registered users
//   registeredUsers.forEach(user => {
//     const listItem = document.createElement('li');
//     listItem.textContent = `Name: ${user.name}, Plate Number: ${user.plateNumber}`;
//     userList.appendChild(listItem);
//   });
// }

// function toggleFormVisibility() {
//   const registrationModal = document.getElementById('registrationModal');
//   registrationModal.style.display = (registrationModal.style.display === 'none' || registrationModal.style.display === '') ? 'block' : 'none';
// }

// function openRegistrationForm() {
//   const registrationModal = document.getElementById('registrationModal');
//   registrationModal.style.display = 'block';
// }

// function closeRegistrationForm() {
//   const registrationModal = document.getElementById('registrationModal');
//   registrationModal.style.display = 'none';
// }

// // Update date and time initially
// updateDateTime();

// // Update date and time every second
// setInterval(updateDateTime, 1000);



// Initialize Firebase with your configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDvAh_6tTStzjm6KhNNYhGV_IqeuRhE0I",
  authDomain: "toooda-eab14.firebaseapp.com",
  projectId: "toooda-eab14",
  storageBucket: "toooda-eab14.appspot.com",
  messagingSenderId: "518146176082",
  appId: "1:518146176082:web:226ef0b25bc08dc28b5b8b"
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
    console.log(`Removed user: ${removedUser.name} - ${removedUser.plateNumber}`);
  } else {
    // Handle the case when there are no users to remove
    console.log("No users to remove");
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

// Update date and time initially
updateDateTime();

// Update date and time every second
setInterval(updateDateTime, 1000);

// Add a function to listen for real-time updates in the "ActiveUsers" collection
function listenForActiveUsersRealTimeUpdates() {
  activeUsersCollection.onSnapshot((querySnapshot) => {
    // Handle real-time updates for active users
    // You can update UI or perform other actions as needed
  });
}

// Call the function to start listening for real-time updates in "ActiveUsers"
listenForActiveUsersRealTimeUpdates();





