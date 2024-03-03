
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
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  const formattedDateTime = currentDate.toLocaleDateString('en-US', options);
  datetimeContainer.textContent = formattedDateTime;
}

// //fullscreen
// const fullscreenBtn = document.getElementById('fullscreenBtn');

// // Function to toggle fullscreen mode
// function toggleFullscreen() {
//   if (!document.fullscreenElement) {
//     document.documentElement.requestFullscreen();
//     // fullscreenBtn.textContent = 'Exit Fullscreen';
//     fullscreenBtn.querySelector('img').src = 'image/minimize.png';
//   } else {
//     if (document.exitFullscreen) {
//       document.exitFullscreen();
//       // fullscreenBtn.textContent = 'Fullscreen';
//       fullscreenBtn.querySelector('img').src = 'image/fullscreen.png';
//     }
//   }
// }

// // Event listener for the button click
// fullscreenBtn.addEventListener('click', toggleFullscreen);


const fullscreenImg = document.getElementById('fullscreenImg');

// Function to toggle fullscreen mode
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        fullscreenImg.src = 'image/minimize.png';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            fullscreenImg.src = 'image/fullscreen.png';
        }
    }
}

// Event listener for the image click
fullscreenImg.addEventListener('click', toggleFullscreen);



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
    // listItem.textContent = `Name: ${user.name}, Plate Number: ${user.plateNumber}`;
    listItem.textContent = `Plate Number: ${user.plateNumber}`;

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
//MODAL SA ACCEPTING RIDE
// Function to handle actions when a plate number is clicked
// function handlePlateNumberClick(bookingData, userName, bookingDocId) {
//   // Open the modal
//   openModal();

//   // Display data in the modal
//   const modalDataDiv = document.getElementById('modalData');

//   // Convert Firestore timestamp to JavaScript Date object
//   const timestamp = bookingData.dateTime;
//   const dateObject = timestamp.toDate();

//   // Format date and time
//   const formattedDateTime = dateObject.toLocaleString('en-US', {
//     weekday: 'long',
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//     hour: 'numeric',
//     minute: 'numeric',
//     second: 'numeric',
//     // timeZoneName: 'short'
//   });

//   modalDataDiv.innerHTML = `

//   <p id="pickupPoint">Pickup Point: ${bookingData.pickupPoint}</p>
//   <p id="dropOffPoint">Drop-off Point: ${bookingData.dropOffPoint}</p>
//   <p id="dateTime">Time Requested: ${formattedDateTime}</p>
//   <!-- Accept button -->
//   <button onclick="acceptRide('${bookingData.pickupPoint}', '${bookingData.dropOffPoint}', '${formattedDateTime}', '${userName}', '${bookingData.userContactNumber}', '${bookingDocId}')">Accept (fingerprint)</button>

//   <button id="scanButton">Scan</button>
//   <button id="closeButton" style="display:none;">Close Camera</button>
//   `;

//    // Add event listener to the scan button
//    const scanButton = document.getElementById('scanButton');
//    scanButton.addEventListener('click', () => {
//      // Access the user's camera
//      navigator.mediaDevices.getUserMedia({ video: true })
//        .then((stream) => {
//          // Display the video stream in a video element
//          const videoElement = document.createElement('video');
//          videoElement.srcObject = stream;
//          videoElement.autoplay = true;
//          videoElement.width = 170; // Set the width of the video element
//          videoElement.height = 132; // Set the height of the video element
//           // Apply CSS styles for absolute positioning to center the video element
//           videoElement.style.position = 'absolute';
//           videoElement.style.top = '0';
//           videoElement.style.left = '0';
//           // videoElement.style.transform = 'translate(-50%, -50%)';
//          modalDataDiv.appendChild(videoElement);
 
//          // Show the close button
//          const closeButton = document.getElementById('closeButton');
//          closeButton.style.display = 'inline';
         
//          // Hide the scan button
//          scanButton.style.display = 'none';
         
//          // Add event listener to the close button
//          closeButton.addEventListener('click', () => {
//            // Stop the video stream
//            videoElement.srcObject.getTracks().forEach(track => track.stop());
//            // Remove the video element
//            modalDataDiv.removeChild(videoElement);
//            // Hide the close button
//            closeButton.style.display = 'none';
//            // Show the scan button
//            scanButton.style.display = 'inline';
//          });
//        })
//        .catch((error) => {
//          console.error('Error accessing the camera:', error);
//        });
//    });

   
  
 
// }


function closeModal() {
  const modal = document.getElementById('modalContainer'); // Replace 'yourModalId' with the actual ID of your modal
  modal.style.display = 'none';
}

//new, below
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
  <p class="ride-detail"> Ride Details: </p>
    <p id="pickupPoint">Pickup Point: ${bookingData.pickupPoint}</p>
    <p id="dropOffPoint">Drop-off Point: ${bookingData.dropOffPoint}</p>
    <p id="dateTime">Time Requested: ${formattedDateTime}</p>
     <p id="userName">User: ${userName}</p> <!-- Display user's name --> 
 <p id="userContactNumber">Contact Number: ${bookingData.userContactNumber}</p> 
 
    <!-- Accept button -->
    <button id="scanButton">Scan</button>
    <button id="closeButton" style="display:none;">Close Camera</button>
  `;


  // <button onclick="acceptRide('${bookingData.pickupPoint}', '${bookingData.dropOffPoint}', '${formattedDateTime}', '${userName}', '${bookingData.userContactNumber}', '${bookingDocId}')">Accept (fingerprint)</button>
  
// Add event listener to the scan button
const scanButton = document.getElementById('scanButton');
scanButton.addEventListener('click', () => {
  // Access the user's camera
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      // Display the video stream in a video element
      const videoElement = document.createElement('video');
      videoElement.srcObject = stream;
      videoElement.autoplay = true;
      videoElement.width = 190; // Set the width of the video element
      videoElement.height = 145; // Set the height of the video element
      // Apply CSS styles for absolute positioning to center the video element
      videoElement.style.position = 'absolute';
      videoElement.style.top = '-160px';
      videoElement.style.left = '-330px';
      videoElement.style.border = '2px solid black';
videoElement.style.margin = '10px';



      modalDataDiv.appendChild(videoElement);

      // Show the close button
      const closeButton = document.getElementById('closeButton');
      closeButton.style.display = 'inline';
      
      // Hide the scan button
      scanButton.style.display = 'none';
      
      // Add event listener to the close button
      closeButton.addEventListener('click', () => {
        // Stop the video stream
        videoElement.srcObject.getTracks().forEach(track => track.stop());
        // Remove the video element
        modalDataDiv.removeChild(videoElement);
        // Hide the close button
        closeButton.style.display = 'none';
        // Show the scan button
        scanButton.style.display = 'inline';
      });

      // Wait for the video to load metadata so we can get its dimensions
      videoElement.addEventListener('loadedmetadata', () => {
        // Create canvas after video dimensions are available
        const canvasElement = document.createElement('canvas');
        
        const canvasContext = canvasElement.getContext('2d');
        
        
        // Set the size of the canvas to match the video stream
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;

        // Function to continuously scan for QR codes
        const scanForQRCode = () => {
          canvasContext.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
          const imageData = canvasContext.getImageData(0, 0, canvasElement.width, canvasElement.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code) {
            // QR code detected, do something with the result
            // console.log('QR Code detected:', code.data);
            // Stop scanning for QR codes
            videoElement.srcObject.getTracks().forEach(track => track.stop());
            // Remove the video element
            modalDataDiv.removeChild(videoElement);
            // Hide the close button
            closeButton.style.display = 'none';
            // Show the scan button
            scanButton.style.display = 'inline';
            // Perform actions with the QR code data
            // For example, you can extract information from the QR code and use it in your application
            handleQRCodeData(code.data); // Pass the QR code data to a function to handle it
               // Log the value of bookingDocId when scan button is clicked
              //  console.log('Fasirst user ID:', firstUser.id);
          } else {
            // No QR code detected, continue scanning
            requestAnimationFrame(scanForQRCode);
          }
        };

        // Start scanning for QR codes
        scanForQRCode();
      });
    })
    .catch((error) => {
      console.error('Error accessing the camera:', error);
    });
       // Log the value of bookingDocId when scan button is clicked
    console.log('Booking Document ID:', bookingDocId);
    console.log('First user ID:', firstUser.id);
});



//checking the data type
function handleQRCodeData(qrCodeData) {
  // Implement your logic to handle the QR code data here
  // For example, you can parse the data and perform specific actions based on its content
  console.log('Handling QR code data:', qrCodeData);




  if (typeof qrCodeData === 'string') {
    try {
      qrCodeData = JSON.parse(qrCodeData);
    } catch (error) {
      console.error('Error parsing QR code data:', error);
      return;
    }
  }

  if (!firstUser) {
    console.error('First user data not available');
    return; // Exit early if first user data is not available
  }

  // Extract name and plateNumber fields from qrCodeData
  const qrCodeName = qrCodeData.name;
  const qrCodePlateNumber = qrCodeData.plateNumber;

  // Extract name and plateNumber fields from firstUser data
  const userName = firstUser.data().name;
  const userPlateNumber = firstUser.data().plateNumber;

  // Compare the name and plateNumber fields
  if (qrCodeName === userName && qrCodePlateNumber === userPlateNumber) {
    console.log('Good');
    


//eto naman ililipta sa ibang collection after madelete
    // Ask for confirmation before deleting
//     const isConfirmed = confirm("Are you sure you want to delete this booking?");
//     if (isConfirmed) {
//       // Get a reference to the booking document
//       const bookingDocRef = firebase.firestore().collection("BookNow").doc(bookingDocId);

//       // Retrieve all the data from the booking document
//       bookingDocRef.get()
//         .then((docSnapshot) => {
//           if (docSnapshot.exists) {
//             // Save the data into the acceptedRequest collection
//             const acceptedRequestRef = firebase.firestore().collection("acceptedRequest").doc(bookingDocId);
//             return acceptedRequestRef.set(docSnapshot.data()); // Save all the data
//           } else {
//             console.error("Booking document does not exist.");
//             throw new Error("Booking document does not exist.");
//           }
//         })
//         .then(() => {
//           console.log("Booking data saved in acceptedRequest collection.");
          
//           // Delete the booking document from the BookNow collection
//           return bookingDocRef.delete();
//         })
//         .then(() => {
//           console.log("Booking document successfully deleted.");


          

//           const activeUsersCollection = firebase.firestore().collection("ActiveUsers");

//           // Retrieve data from ActiveUsers collection
//           return activeUsersCollection.doc(firstUser.id).get();
//         })
//         .then((docSnapshot) => {
//           if (docSnapshot.exists) {
//             // Save the data into the acceptedRequest collection
//             const acceptedRequestRef = firebase.firestore().collection("acceptedRequest").doc(firstUser.id);
//             return acceptedRequestRef.set(docSnapshot.data()); // Save all the data
//           } else {
//             console.error("User document does not exist.");
//             throw new Error("User document does not exist.");
//           }
//         })
//         .then(() => {
//           console.log("User data saved in acceptedRequest collection.");
  
//           // Delete the user document from the ActiveUsers collection
//           return activeUsersCollection.doc(firstUser.id).delete();
//         })
//         .then(() => {
//           console.log("User document successfully deleted from ActiveUsers collection.");
        


//         })




        
//         .catch((error) => {
//           console.error("Error:", error);
//         });
//     } else {
//       console.log("Deletion cancelled by user.");
//     }

//   } else {
//     console.log('Bad');
//   }
// }



// const isConfirmed = confirm("Are you sure you want to delete this booking?");
// if (isConfirmed) {
//   // Get references to booking document and first user document
//   const bookingDocRef = firebase.firestore().collection("BookNow").doc(bookingDocId);
//   const firstUserDocRef = firebase.firestore().collection("ActiveUsers").doc(firstUser.id);
//   const acceptedRequestRef = firebase.firestore().collection("acceptedRequest").doc(bookingDocId);

//   // Retrieve data from both documents simultaneously
//   Promise.all([bookingDocRef.get(), firstUserDocRef.get()])
//     .then((snapshots) => {
//       const bookingDocSnapshot = snapshots[0];
//       const firstUserDocSnapshot = snapshots[1];

//       if (bookingDocSnapshot.exists && firstUserDocSnapshot.exists) {
//         // Save the data of the first user into the acceptedRequest collection
//         return acceptedRequestRef.set({
//           ...bookingDocSnapshot.data(),
//           userData: firstUserDocSnapshot.data()
//         });
//       } else {
//         console.error("Booking document or user document does not exist.");
//         throw new Error("Booking document or user document does not exist.");
//       }
//     })
//     .then(() => {
//       console.log("User data moved to acceptedRequest collection.");

//       // Delete the booking document and the user document
//       return Promise.all([bookingDocRef.delete(), firstUserDocRef.delete()]);
//     })
//     .then(() => {
//       console.log("Booking document and user document successfully deleted.");
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// } else {
//   console.log("Deletion cancelled by user.");
// }

//woking below
// const isConfirmed = confirm("Are you sure you want to delete this booking?");
// if (isConfirmed) {
//   const bookingDocRef = firebase.firestore().collection("BookNow").doc(bookingDocId);
//   const firstUserDocRef = firebase.firestore().collection("ActiveUsers").doc(firstUser.id);
//   const acceptedRequestRef = firebase.firestore().collection("acceptedRequest").doc(bookingDocId);

//   Promise.all([bookingDocRef.get(), firstUserDocRef.get()])
//     .then((snapshots) => {
//       const bookingDocSnapshot = snapshots[0];
//       const firstUserDocSnapshot = snapshots[1];

//       console.log("Booking Data:", bookingData);
// console.log("User Data:", userData);

//       if (bookingDocSnapshot.exists && firstUserDocSnapshot.exists) {
//         const bookingData = bookingDocSnapshot.data();
//         const userData = firstUserDocSnapshot.data();
//         const combinedData = {
//           driverName: String(userData.userName),
//           driverPlateNumber: String(bookingData.plateNumber),
//           dropOffPoint: String(bookingData.dropOffPoint),
//           pickupPoint: String(bookingData.pickupPoint),
//           requestBy: String(bookingData.userName),
//           requestByContactNumber: String(bookingData.userContactNumber),
//           successful: String(bookingData.successful),
//           // timeAccepted: String(bookingData.timeAccepted),
//           // timeRequested: String(bookingData.dateTime)
//         };

//         return acceptedRequestRef.set(combinedData);
//       } else {
//         console.error("Booking document or user document does not exist.");
//         throw new Error("Booking document or user document does not exist.");
//       }
//     })
//     .then(() => {
//       console.log("User data moved to acceptedRequest collection.");
//       return Promise.all([bookingDocRef.delete(), firstUserDocRef.delete()]);
//     })
//     .then(() => {
//       console.log("Booking document and user document successfully deleted.");
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// } else {
//   console.log("Deletion cancelled by user.");
// }




// } else {
//        console.log('Bad');
//      }
//    }





const isConfirmed = confirm("Are you sure you want to delete this booking?");
if (isConfirmed) {
  closeModal();
  const bookingDocRef = firebase.firestore().collection("BookNow").doc(bookingDocId);
  const firstUserDocRef = firebase.firestore().collection("ActiveUsers").doc(firstUser.id);
  const acceptedRequestRef = firebase.firestore().collection("acceptedRequest").doc(bookingDocId);

  Promise.all([bookingDocRef.get(), firstUserDocRef.get()])
    .then((snapshots) => {
      const bookingDocSnapshot = snapshots[0];
      const firstUserDocSnapshot = snapshots[1];

      if (bookingDocSnapshot.exists && firstUserDocSnapshot.exists) {
        const bookingData = bookingDocSnapshot.data();
        const userData = firstUserDocSnapshot.data();

        // Log the booking data and user data here
        console.log("Booking Data:", bookingData);
        console.log("User Data:", userData);


// Convert Firestore timestamp to JavaScript Date object
const timestamp = bookingData.dateTime.toDate();

// Format the date
const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: true
};

const formattedDate = new Intl.DateTimeFormat('en-US', options).format(timestamp);

 // Get server's timestamp when the data is written
 const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();


        const combinedData = {
          driverName: String(userData.name),
          driverPlateNumber: String(userData.plateNumber),
          dropOffPoint: String(bookingData.dropOffPoint),
          pickupPoint: String(bookingData.pickupPoint),
          requestBy: String(bookingData.userName),
          requestByContactNumber: String(bookingData.userContactNumber),
          // successful: String(bookingData.successful),
          // timeAccepted: String(bookingData.timeAccepted),
          // timeRequested: String(bookingData.dateTime)
          timeRequested: formattedDate,
          //paganahin mo muna yung accepted date para gumana yung sa app
          timeAccepted: serverTimestamp // Save the server's timestamp
        };

        return acceptedRequestRef.set(combinedData);
      } else {
        console.error("Booking document or user document does not exist.");
        throw new Error("Booking document or user document does not exist.");
      }
    })
    .then(() => {
      console.log("User data moved to acceptedRequest collection.");
      return Promise.all([bookingDocRef.delete(), firstUserDocRef.delete()]);
    })
    .then(() => {
      console.log("Booking document and user document successfully deleted.");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
} else {
  console.log("Deletion cancelled by user.");
}

} else {
       console.log('Bad');

            // Get the modal
            const modal = document.getElementById("kioskmyModal");

            // When the bad condition happens, display the modal
            console.log('Bad');
            modal.style.display = "block";

            // When the user clicks on <span> (x), close the modal
            const span = document.getElementsByClassName("kioskclose")[0];
            span.onclick = function() {
              modal.style.display = "none";
            }


     }
   }



  



  // Fetch data from ActiveUsers collection when modal opens
  const activeUsersCollection = firebase.firestore().collection("ActiveUsers");

// Query ActiveUsers collection sorted by registration time (assuming you have a field named "registrationTime")
activeUsersCollection.orderBy("registrationDateTime").limit(1).get()
  .then((querySnapshot) => {
    // Check if there are any documents returned
    if (!querySnapshot.empty) {
      // Get the first document
      firstUser = querySnapshot.docs[0];
      const name = firstUser.data().name;
      const plateNumber = firstUser.data().plateNumber;
      // Format registrationDateTime
      const registrationDateTime = firstUser.data().registrationDateTime.toDate();
      const formattedDateTime = registrationDateTime.toLocaleString('en-US', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        timeZoneName: 'short',
      });
      // Log the data of the first user
      // console.log("First userasda:",  firstUser.id, ", registrationDateTime", formattedDateTime,", name:", name, ", plateNumber:", plateNumber, );
     
      // console.log("First userasda:",  firstUser.id); //log the id of firest user
    } else {
      console.log("No users found");
    }
  })
  .catch((error) => {
    console.error("Error fetching first user:", error);
  });

  
}



{/* <p id="userName">User: ${userName}</p> <!-- Display user's name --> */}
{/* <p id="userContactNumber">Contact Number: ${bookingData.userContactNumber}</p> */}


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

//working ala lang ringtone
// function listenForBookNowRealTimeUpdates() {
//   bookNowCollection
//     .orderBy("dateTime", "asc") // Assuming "dateTime" is the field to sort by
//     .onSnapshot((querySnapshot) => {
//       // Clear existing list
//       const notificationList = document.getElementById('notificationList');
//       notificationList.innerHTML = '';

//       let isFirstItem = true; // Flag to track if it's the first item

//       // Iterate through the documents in the "BookNow" collection
//       querySnapshot.forEach((doc, index) => {
//         const bookingData = doc.data();
        
//         // Extract user's name from booking data
//         const userName = bookingData.userName;

//         // Create a list item for each plate number
//         const listItem = document.createElement('div');
//         listItem.textContent = 'You have a ride request!';
//         listItem.classList.add('clickable-item');

//         // Add a click event only to the first item
//         if (isFirstItem) {
//           listItem.addEventListener('click', () => {
//             handlePlateNumberClick(bookingData, userName, doc.id); //docid
//           });
//           isFirstItem = false; // Reset flag after attaching click event
//         }

//         // Append the list item to the notification list
//         notificationList.appendChild(listItem);
//       });
//             // Add a class to the notification list container to enable scrolling
//             notificationList.classList.add('scrollable-list-container-notif');
//     });
// }



//may ringtone na
function listenForBookNowRealTimeUpdates() {
  // Path to your ringtone file
  const ringtone = new Audio('image/notif.mp3');

  let lastVisible = null; // Keep track of the last document

  bookNowCollection
    .orderBy("dateTime", "asc")
    .onSnapshot((querySnapshot) => {
      // Assuming you want to play the sound for new documents
      if (!lastVisible || querySnapshot.docs.some(doc => doc.id === lastVisible.id)) {
        // Play ringtone for new updates
        ringtone.play().catch(error => console.error("Audio play failed:", error));
      }

      // Clear existing list
      const notificationList = document.getElementById('notificationList');
      notificationList.innerHTML = '';

      let isFirstItem = true;

      querySnapshot.forEach((doc) => {
        // Logic to handle each document
        const bookingData = doc.data();
        const userName = bookingData.userName;
        const listItem = document.createElement('div');
        listItem.textContent = 'You have a ride request!';
        listItem.classList.add('clickable-item');

        if (isFirstItem) {
          listItem.addEventListener('click', () => {
            handlePlateNumberClick(bookingData, userName, doc.id);
          });
          isFirstItem = false;
        }

        notificationList.appendChild(listItem);
      });

      // Keep track of the last document if needed
      if (querySnapshot.docs.length > 0) {
        lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      }

      notificationList.classList.add('scrollable-list-container-notif');
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
      historyItem.textContent = `Ride completed!`;

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
    <p class="ride-detail"> Ride Details: </p>
    <p>Driver Name: ${driverName}</p>
    <p>Driver Plate Number: ${driverPlateNumber}</p>
    <p>Pickup Point: ${pickupPoint}</p>
    <p>Drop-off Point: ${dropOffPoint}</p>
   
    
    <p>Ride Ended: ${formattedRideEnded}</p>
    
    <!-- Add more details here as needed -->
  `;

  //<p>Contact Number: ${requestByContactNumber}</p>
  //<p>Time Accepted: ${formattedTimeAccepted}</p>
  //<p>Time Requested: ${formattedTimeRequested}</p>
  // <p>Requested By: ${requestBy}</p>
  // Display the modal
  openModal();
}

// Call the function to start listening for real-time updates in "history" for rides that ended today only
listenForTodayHistoryRealTimeUpdates();



//qr code

const video = document.getElementById('video');
let stream = null;

document.getElementById('startBtn').addEventListener('click', startCamera);
document.getElementById('stopBtn').addEventListener('click', stopCamera);
document.getElementById('qrFileInput').addEventListener('change', loadQRFile);

// Existing event listeners are assumed to be present in script.js

document.getElementById('doneBtn').addEventListener('click', removeFile);


function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(str => {
            stream = str;
            video.srcObject = stream;
            video.play();
            document.getElementById('startBtn').style.display = 'none';
            document.getElementById('stopBtn').style.display = 'inline-block';
            document.getElementById('qrFileInput').value = '';
        
            
            scanQRCode();
        })
        .catch(err => console.error('getUserMedia error:', err));
}

function stopCamera() {
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
        document.getElementById('startBtn').style.display = 'inline-block';
        document.getElementById('stopBtn').style.display = 'none';
    
    }
}
//gumagana to sa baba
// function scanQRCode() {
//     const canvas = document.createElement('canvas');
//     const context = canvas.getContext('2d');
//     context.canvas.getContext('2d', { willReadFrequently: true });

//     video.addEventListener('loadedmetadata', function() {
//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;

//         const scan = () => {
//             if (video.readyState === video.HAVE_ENOUGH_DATA) {
//                 context.drawImage(video, 0, 0, canvas.width, canvas.height);
//                 const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
//                 const code = jsQR(imageData.data, imageData.width, imageData.height);
//                 if (code) {
//                     console.log('QR code detected:', code.data);
//                     // Extracting and displaying only name and license plate number
//                     const resultDiv = document.getElementById('result');
//                     const parsedData = JSON.parse(code.data);
//                     const name = parsedData.name;
//                     const plateNumber = parsedData.plateNumber;
//                     resultDiv.innerText = `Name: ${name}\nLicense Plate: ${plateNumber}`;
//                 }
//             }
//             requestAnimationFrame(scan);
//         };
//         scan();
//     });
// }
//gumagana to sa taas

//kamuka sa taas tong code na 'to
// function scanQRCode() {
//   const canvas = document.createElement('canvas');
//   const context = canvas.getContext('2d');

//   video.addEventListener('loadedmetadata', function() {
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;

//       const scan = () => {
//           if (video.readyState === video.HAVE_ENOUGH_DATA) {
//               context.drawImage(video, 0, 0, canvas.width, canvas.height);
//               const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
//               try {
//                   const code = jsQR(imageData.data, imageData.width, imageData.height);
//                   if (code) {
//                       console.log('QR code detected:', code.data);
//                       // Extracting and displaying only name and license plate number
//                       const resultDiv = document.getElementById('result');
//                       const parsedData = JSON.parse(code.data);
//                       const name = parsedData.name;
//                       const plateNumber = parsedData.plateNumber;
//                       resultDiv.innerText = `Name: ${name}\nPlate Number: ${plateNumber}`;
//                       checkDataInDriversCollection(name, plateNumber); //siningit ko lang ot ah ahahha
//                   }
//               } catch (error) {
//                   console.error('Error decoding QR code:', error);
//               }
//           }
//           requestAnimationFrame(scan);
//       };
//       scan();
//   });
// }
  //check


  //para di diretso nags-scan yung camera
  let scanningEnabled = true;

function scanQRCode() {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  video.addEventListener('loadedmetadata', function() {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const scan = () => {
          if (!scanningEnabled) return; // Check if scanning is enabled
          if (video.readyState === video.HAVE_ENOUGH_DATA) {
              context.drawImage(video, 0, 0, canvas.width, canvas.height);
              const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
              try {
                  const code = jsQR(imageData.data, imageData.width, imageData.height);
                  if (code) {
                      console.log('QR code detected:', code.data);
                      // Extracting and displaying only name and license plate number
                      const resultDiv = document.getElementById('result');
                      const parsedData = JSON.parse(code.data);
                      const name = parsedData.name;
                      const plateNumber = parsedData.plateNumber;
                      resultDiv.innerText = `Name: ${name}\nPlate Number: ${plateNumber}`;
                      checkDataInDriversCollection(name, plateNumber);
                      // Disable scanning for a short period
                      scanningEnabled = false;
                      setTimeout(() => {
                          scanningEnabled = true;
                      }, 2000); // 2 seconds delay before enabling scanning again
                  }
              } catch (error) {
                  console.error('Error decoding QR code:', error);
              }
          }
          requestAnimationFrame(scan);
      };
      scan();
  });
}



function loadQRFile(event) {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function() {
          const img = new Image();
          img.onload = function() {
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.width = img.width;
              canvas.height = img.height;
              context.drawImage(img, 0, 0, img.width, img.height);
              try {
                  const imageData = context.getImageData(0, 0, img.width, img.height);
                  const code = jsQR(imageData.data, imageData.width, imageData.height);
                  if (code) {
                      console.log('QR code detected:', code.data);
                      // Extracting and displaying only name and license plate number
                      const parsedData = JSON.parse(code.data);
                      const name = parsedData.name;
                      const plateNumber = parsedData.plateNumber;
                      // Call a function to check if the data exists in the "Drivers" collection
                      checkDataInDriversCollection(name, plateNumber);
                  } else {
                      alert('No QR Code detected in the image.');
                  }
              } catch (error) {
                  console.error('Error processing QR code image:', error);
              }
          };
          img.onerror = function() {
              console.error('Error loading image:', img.src);
          };
          img.src = reader.result;
      };
      reader.readAsDataURL(file);
  }
}
//gumagana tong nasa babako
// function checkDataInDriversCollection(name, plateNumber) {
//   const driversCollection = firebase.firestore().collection("Drivers");
//   // Query the "Drivers" collection for documents with matching name and plateNumber
//   driversCollection.where("name", "==", name).where("plateNumber", "==", plateNumber)
//       .get()
//       .then((querySnapshot) => {
//           if (!querySnapshot.empty) {
//               // If documents exist, log "verified"
//               console.log("verified");

// // Extract the data from the first matching document
// const driverData = querySnapshot.docs[0].data();
// // Add the verified data to the queuing lists
// addToQueuingLists(driverData.name, driverData.plateNumber);

//           } else {
//               // If no matching documents found, log "not verified"
//               console.log("not verified");
//           }
//       })
//       .catch((error) => {
//           console.error("Error checking data in Drivers collection:", error);
//       });
// }


// function checkDataInDriversCollection(name, plateNumber) {
//   const driversCollection = firebase.firestore().collection("Drivers");
//   const activeUsersCollection = firebase.firestore().collection("ActiveUsers");

//   // Query the "Drivers" collection for documents with matching name and plateNumber
//   driversCollection.where("name", "==", name).where("plateNumber", "==", plateNumber)
//       .get()
//       .then((querySnapshot) => {
//           if (!querySnapshot.empty) {
//               // If documents exist, log "verified"
//               console.log("verified");

//               // Extract the data from the first matching document
//               const driverData = querySnapshot.docs[0].data();

//               // Save the driver's data to the ActiveUsers collection
//               activeUsersCollection.add({
//                 name: driverData.name,
//                 plateNumber: driverData.plateNumber,
//                 registrationDateTime: new Date() // You can set the registration date/time here
//               })
//               .then((docRef) => {
//                 console.log("Driver data saved to ActiveUsers collection with ID: ", docRef.id);
//               })
//               .catch((error) => {
//                 console.error("Error adding driver data to ActiveUsers collection: ", error);
//               });

//               // Add the verified data to the queuing lists
//               addToQueuingLists(driverData.name, driverData.plateNumber);

//           } else {
//               // If no matching documents found, log "not verified"
//               console.log("not verified");
//           }
//       })
//       .catch((error) => {
//           console.error("Error checking data in Drivers collection:", error);
//       });
// }
//gumagana tong sa taas ko
//goods na tong sa baba nakakascan na ng qr code

// function checkDataInDriversCollection(name, plateNumber) {
//   const driversCollection = firebase.firestore().collection("Drivers");
//   const activeUsersCollection = firebase.firestore().collection("ActiveUsers");

//   // Query the "Drivers" collection for documents with matching name and plateNumber
//   driversCollection.where("name", "==", name).where("plateNumber", "==", plateNumber)
//     .get()
//     .then((querySnapshot) => {
//       if (!querySnapshot.empty) {
//         // If documents exist, log "verified"
//         console.log("verified");

//         // Extract the data from the first matching document
//         const driverData = querySnapshot.docs[0].data();

//         // Check if the driver's data is already in the registeredUsers array
//         const isRegistered = registeredUsers.some(user => user.name === driverData.name && user.plateNumber === driverData.plateNumber);

//         if (!isRegistered) {
//           // Save the driver's data to the ActiveUsers collection
//           activeUsersCollection.add({
//             name: driverData.name,
//             plateNumber: driverData.plateNumber,
//             registrationDateTime: new Date() // You can set the registration date/time here
//           })
//           .then((docRef) => {
//             console.log("Driver data saved to ActiveUsers collection with ID: ", docRef.id);
//           })
//           .catch((error) => {
//             console.error("Error adding driver data to ActiveUsers collection: ", error);
//           });

//           // Add the verified data to the queuing lists
//           addToQueuingLists(driverData.name, driverData.plateNumber);
//         } else {
//           console.log("Driver is already registered.");
//         }
//       } else {
//         // If no matching documents found, log "not verified"
//         console.log("not verified");
//       }
//     })
//     .catch((error) => {
//       console.error("Error checking data in Drivers collection:", error);
//     });
// }

//working below

// function checkDataInDriversCollection(name, plateNumber) {
//   const driversCollection = firebase.firestore().collection("Drivers");
//   const activeUsersCollection = firebase.firestore().collection("ActiveUsers");

//   // Query the "Drivers" collection for documents with matching name and plateNumber
//   driversCollection.where("name", "==", name).where("plateNumber", "==", plateNumber)
//     .get()
//     .then((querySnapshot) => {
//       if (!querySnapshot.empty) {
//         // If documents exist, log "verified"
//         console.log("verified");

//         // Extract the data from the first matching document
//         const driverData = querySnapshot.docs[0].data();

//         // Check if the driver's data is already in the registeredUsers array
//         const isRegistered = registeredUsers.some(user => user.name === driverData.name && user.plateNumber === driverData.plateNumber);

//         if (!isRegistered) {
//           // Save the driver's data to the ActiveUsers collection
//           activeUsersCollection.add({
//             name: driverData.name,
//             plateNumber: driverData.plateNumber,
//             registrationDateTime: new Date() // You can set the registration date/time here
//           })
//           .then((docRef) => {
//             console.log("Driver data saved to ActiveUsers collection with ID: ", docRef.id);

//             // Stop the camera stream once the data is saved
//             stopCamera();
//           })
//           .catch((error) => {
//             console.error("Error adding driver data to ActiveUsers collection: ", error);
//           });

//           // Add the verified data to the queuing lists
//           addToQueuingLists(driverData.name, driverData.plateNumber);
//         } else {
//           console.log("Driver is already registered.");
//           stopCamera();
//             // Remove the data from the list
//             // removeFromQueuingLists(driverData.name, driverData.plateNumber);
//         }
//       } else {
//         // If no matching documents found, log "not verified"
//         console.log("not verified");
//       }
//     })
//     .catch((error) => {
//       console.error("Error checking data in Drivers collection:", error);
//     });
// }

//pag aalis yung driver habang naka queue
// function checkDataInDriversCollection(name, plateNumber) {
//   const driversCollection = firebase.firestore().collection("Drivers");
//   const activeUsersCollection = firebase.firestore().collection("ActiveUsers");

//   // Query the "Drivers" collection for documents with matching name and plateNumber
//   driversCollection.where("name", "==", name).where("plateNumber", "==", plateNumber)
//     .get()
//     .then((querySnapshot) => {
//       if (!querySnapshot.empty) {
//         // If documents exist, log "verified"
//         console.log("verified");

//         // Extract the data from the first matching document
//         const driverData = querySnapshot.docs[0].data();

//         // Check if the driver's data is already in the registeredUsers array
//         const isRegistered = registeredUsers.some(user => user.name === driverData.name && user.plateNumber === driverData.plateNumber);

//         if (!isRegistered) {
//           // Save the driver's data to the ActiveUsers collection
//           activeUsersCollection.add({
//             name: driverData.name,
//             plateNumber: driverData.plateNumber,
//             registrationDateTime: new Date() // You can set the registration date/time here
//           })
//           .then((docRef) => {
//             console.log("Driver data saved to ActiveUsers collection with ID: ", docRef.id);

//             // Stop the camera stream once the data is saved
//             stopCamera();
//           })
//           .catch((error) => {
//             console.error("Error adding driver data to ActiveUsers collection: ", error);
//           });

//           // Add the verified data to the queuing lists
//           addToQueuingLists(driverData.name, driverData.plateNumber);
//         } else {
//           console.log("Driver is already registered.");
//           // Ask for confirmation before removing the data
//           const confirmed = window.confirm("Driver is already registered. Do you want to remove the entry from the queuing list?");
//           if (confirmed) {
//             // Remove the data directly from the ActiveUsers collection
//             stopCamera();
//             activeUsersCollection.where("name", "==", name).where("plateNumber", "==", plateNumber)
//               .get()
//               .then(querySnapshot => {
//                 querySnapshot.forEach(doc => {
//                   doc.ref.delete().then(() => {
//                     console.log("Data removed from ActiveUsers collection");
//                   }).catch(error => {
//                     console.error("Error removing data from ActiveUsers collection:", error);
//                   });
//                 });
//               })
//               .catch(error => {
//                 console.error("Error querying ActiveUsers collection:", error);
//               });
//             // stopCamera();
//           }
//           stopCamera();
//         }
//       } else {
//         // If no matching documents found, log "not verified"
//         console.log("not verified");
//         // stopCamera();
//       }
//     })
//     .catch((error) => {
//       console.error("Error checking data in Drivers collection:", error);
//     });
// }


//test, NAGFIFILTER TO NG SUCCESSFUL FIELD

// function checkDataInDriversCollection(name, plateNumber) {
//   const driversCollection = firebase.firestore().collection("Drivers");
//   const activeUsersCollection = firebase.firestore().collection("ActiveUsers");
//   const acceptedRequestCollection = firebase.firestore().collection("acceptedRequest");

//   // Query the "Drivers" collection for documents with matching name and plateNumber
//   driversCollection.where("name", "==", name).where("plateNumber", "==", plateNumber)
//     .get()
//     .then((querySnapshot) => {
//       if (!querySnapshot.empty) {
//         // If documents exist, log "verified"
//         console.log("verified");

//         // Extract the data from the first matching document
//         const driverData = querySnapshot.docs[0].data();

//         // Check if the driver's data is already in the registeredUsers array
//         const isRegistered = registeredUsers.some(user => user.name === driverData.name && user.plateNumber === driverData.plateNumber);

//         if (!isRegistered) {
//           // Save the driver's data to the ActiveUsers collection
//           activeUsersCollection.add({
//             name: driverData.name,
//             plateNumber: driverData.plateNumber,
//             registrationDateTime: new Date() // You can set the registration date/time here
//           })
//           .then((docRef) => {
//             console.log("Driver data saved to ActiveUsers collection with ID: ", docRef.id);

//             // Stop the camera stream once the data is saved
//             stopCamera();
//           })
//           .catch((error) => {
//             console.error("Error adding driver data to ActiveUsers collection: ", error);
//           });

//           // Add the verified data to the queuing lists
//           addToQueuingLists(driverData.name, driverData.plateNumber);
//         } else {
//           console.log("Driver is already registered.");
//           // Ask for confirmation before removing the data
//           const confirmed = window.confirm("Driver is already registered. Do you want to remove the entry from the queuing list?");
//           if (confirmed) {
//             // Remove the data directly from the ActiveUsers collection
//             stopCamera();
//             activeUsersCollection.where("name", "==", name).where("plateNumber", "==", plateNumber)
//               .get()
//               .then(querySnapshot => {
//                 querySnapshot.forEach(doc => {
//                   doc.ref.delete().then(() => {
//                     console.log("Data removed from ActiveUsers collection");
//                   }).catch(error => {
//                     console.error("Error removing data from ActiveUsers collection:", error);
//                   });
//                 });
//               })
//               .catch(error => {
//                 console.error("Error querying ActiveUsers collection:", error);
//               });
//             // stopCamera();
//           }
//           stopCamera();
//         }
//       } else {
//         // If no matching documents found, log "not verified"
//         console.log("not verified");
//         // stopCamera();
//       }
//     })
//     .catch((error) => {
//       console.error("Error checking data in Drivers collection:", error);
//     });

//   // Query the "acceptedRequest" collection for the number of documents based on driver's name
//   acceptedRequestCollection.where("driverName", "==", name)
//     .get()
//     .then((querySnapshot) => {
//       const numDocuments = querySnapshot.size;
//       console.log(`Number of documents in acceptedRequest collection for driver ${name}:`, numDocuments);
      
//       // Iterate through the documents and log the status of the "successful" field
//       querySnapshot.forEach(doc => {
//         const status = doc.data().successful;
//         console.log(`Status for document ${doc.id}: ${status}`);
//       });
//     })
//     .catch((error) => {
//       console.error("Error fetching documents from acceptedRequest collection:", error);
//     });
// }



// Display error message in modal
function displayError(errorMessage) {
  const modal = document.getElementById("errorModal");
  const message = document.getElementById("errorMessage");

  message.textContent = errorMessage;
  modal.style.display = "block";

  // Close the modal when the close button or anywhere outside the modal is clicked
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  const closeBtn = document.getElementsByClassName("errorclose")[0];
  closeBtn.onclick = function() {
    modal.style.display = "none";
  }
}



//di makakapag queue yung driver hangggat di pa succesful yung status niya :)
function checkDataInDriversCollection(name, plateNumber) {
  const driversCollection = firebase.firestore().collection("Drivers");
  const activeUsersCollection = firebase.firestore().collection("ActiveUsers");
  const acceptedRequestCollection = firebase.firestore().collection("acceptedRequest");

  // Query the "acceptedRequest" collection for documents based on driver's name
  acceptedRequestCollection.where("driverName", "==", name)
    .get()
    .then((querySnapshot) => {
      let allDocumentsSuccessful = true; // Variable to track if all documents have status true

      querySnapshot.forEach(doc => {
        const status = doc.data().successful;
        console.log(`Status for document ${doc.id}: ${status}`);
        if (status !== true) {
          allDocumentsSuccessful = false;
        }
      });

      // Proceed only if all documents have status true
      if (allDocumentsSuccessful) {
        // Query the "Drivers" collection for documents with matching name and plateNumber
        driversCollection.where("name", "==", name).where("plateNumber", "==", plateNumber)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              // If documents exist, log "verified"
              console.log("verified");

              // Extract the data from the first matching document
              const driverData = querySnapshot.docs[0].data();

              // Check if the driver's data is already in the registeredUsers array
              const isRegistered = registeredUsers.some(user => user.name === driverData.name && user.plateNumber === driverData.plateNumber);

              if (!isRegistered) {
                // Save the driver's data to the ActiveUsers collection
                activeUsersCollection.add({
                  name: driverData.name,
                  plateNumber: driverData.plateNumber,
                  registrationDateTime: new Date() // You can set the registration date/time here
                })
                .then((docRef) => {
                  console.log("Driver data saved to ActiveUsers collection with ID: ", docRef.id);

                  // Stop the camera stream once the data is saved
                  stopCamera();
                })
                .catch((error) => {
                  console.error("Error adding driver data to ActiveUsers collection: ", error);
                });

                // Add the verified data to the queuing lists
                addToQueuingLists(driverData.name, driverData.plateNumber);
              } else {
                console.log("Driver is already registered.");
                // Ask for confirmation before removing the data
                const confirmed = window.confirm("Driver is already registered. Do you want to remove the entry from the queuing list?");
                if (confirmed) {
                  // Remove the data directly from the ActiveUsers collection
                  stopCamera();
                  activeUsersCollection.where("name", "==", name).where("plateNumber", "==", plateNumber)
                    .get()
                    .then(querySnapshot => {
                      querySnapshot.forEach(doc => {
                        doc.ref.delete().then(() => {
                          console.log("Data removed from ActiveUsers collection");
                        }).catch(error => {
                          console.error("Error removing data from ActiveUsers collection:", error);
                        });
                      });
                    })
                    .catch(error => {
                      console.error("Error querying ActiveUsers collection:", error);
                    });
                  // stopCamera();
                }
                stopCamera();
              }
            } else {
              // If no matching documents found, log "not verified"
              console.log("not verified");
              // stopCamera();
            }
          })
          .catch((error) => {
            console.error("Error checking data in Drivers collection:", error);
          });
      } else {
        console.log("Cannot add to queuing list: Not all documents have status true.");
        // alert("Error: Ongoing ride");
        displayError("You can't queue until you finish your current trip");
      }
    })
    .catch((error) => {
      console.error("Error fetching documents from acceptedRequest collection:", error);
    });
}



//end


function addToQueuingLists(name, plateNumber) {
  // Add the verified data to the queuing lists
  const registeredUsersList = document.getElementById('userList');
  const listItem = document.createElement('li');
  listItem.textContent = `Name: ${name}, License Plate: ${plateNumber}`;
  registeredUsersList.appendChild(listItem);

  // You can also add the data to the registeredUsers array if needed
  registeredUsers.push({ name, plateNumber });
  // Update the UI to reflect the changes
  updateUI();
}


function removeFile() {
    document.getElementById('qrFileInput').value = '';

    const resultDiv = document.getElementById('result');
    resultDiv.innerText = '';
}



// Function to fetch and display data from the "Drivers" collection
function fetchAndDisplayDrivers() {
  const driversCollection = firebase.firestore().collection("Drivers");

  driversCollection.get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const driverData = doc.data();
        console.log("Driver:", driverData);
      });
    })
    .catch((error) => {
      console.error("Error fetching drivers:", error);
    });
}

// Call the function to fetch and display drivers when needed
fetchAndDisplayDrivers();





//reportmodal


// Get the modal
var modal = document.getElementById("reportmodal");

// Get the button that opens the modal
var btn = document.getElementById("reportopenModalBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("reportclose")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


// Initialize Firestore
const db = firebase.firestore();




function formatDate(date) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
  const seconds = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight
  const formattedDate = `${day} ${month} ${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
  return formattedDate;
}







// // Function to open the report modal
// function openReportModal() {
//   const reportModal = document.getElementById("reportmodal");
//   reportModal.style.display = "block";
  
//   // Get the container for the list
//   const requestListContainer = document.getElementById("requestListContainer");

//   // Get the current date
//   const currentDate = new Date();

//   // Fetch data from the "acceptedRequest" collection
//   db.collection("acceptedRequest").get().then((querySnapshot) => {
//     requestListContainer.innerHTML = ""; // Clear previous content

//     querySnapshot.forEach((doc) => {
//       // Get data from each document
//       const data = doc.data();

//       // Check if timeAccepted is defined and is today's date
//       if (data.timeAccepted && isSameDay(data.timeAccepted.toDate(), currentDate)) {
//         // Create a paragraph element to display the document ID and timeAccepted timestamp
//         const p = document.createElement("p");
//         // p.textContent = `Request ID: ${doc.id}, Time Accepted: ${formatDate(data.timeAccepted.toDate())}`;
//         p.textContent = `Request ID: ${doc.id}`;
        
//         // Add click event listener to the paragraph element
//         p.addEventListener("click", () => {
//           openSecondModal();
//         });

//         // Append the paragraph element to the container
//         requestListContainer.appendChild(p);
//       }
//     });
//   }).catch((error) => {
//     console.log("Error getting documents: ", error);
//   });
// }


// // Function to open the second modal
// function openSecondModal() {
//   const secondModal = document.getElementById("secondModal");
//   secondModal.style.display = "block";

//   // Get the second modal's close button
//   const secondModalCloseBtn = document.querySelector(".second-modal-close");

//   // Close the second modal when the close button is clicked
//   secondModalCloseBtn.addEventListener("click", () => {
//     secondModal.style.display = "none";
//   });


// }



//wroking taas
// Function to open the report modal
// function openReportModal() {
//   const reportModal = document.getElementById("reportmodal");
//   reportModal.style.display = "block";
  
//   // Get the container for the list
//   const requestListContainer = document.getElementById("requestListContainer");

//   // Get the current date
//   const currentDate = new Date();

//   // Fetch data from the "acceptedRequest" collection
//   db.collection("acceptedRequest").get().then((querySnapshot) => {
//     requestListContainer.innerHTML = ""; // Clear previous content

//     querySnapshot.forEach((doc) => {
//       // Get data from each document
//       const data = doc.data();

//       // Check if timeAccepted is defined and is today's date
//       if (data.timeAccepted && isSameDay(data.timeAccepted.toDate(), currentDate)) {
//         // Create a paragraph element to display the document ID and timeAccepted timestamp
//         const p = document.createElement("p");
//         // p.textContent = `Request ID: ${doc.id}, Driver Name: ${data.driverName}`;
//         p.textContent = `Driver Name: ${data.driverName}`;

        
//         // Add click event listener to the paragraph element
//         p.addEventListener("click", () => {
//           openSecondModal(doc.id); // Pass the document ID to the function
//         });

//         // Append the paragraph element to the container
//         requestListContainer.appendChild(p);
//       }
//     });
//   }).catch((error) => {
//     console.log("Error getting documents: ", error);
//   });
// }

//may scrolllist lang
function openReportModal() {
  const reportModal = document.getElementById("reportmodal");
  reportModal.style.display = "block";
  
  // Get the container for the list
  const requestListContainer = document.getElementById("requestListContainer");

  // Get the current date
  const currentDate = new Date();

  // Fetch data from the "acceptedRequest" collection
  db.collection("acceptedRequest").get().then((querySnapshot) => {
    requestListContainer.innerHTML = ""; // Clear previous content

    querySnapshot.forEach((doc) => {
      // Get data from each document
      const data = doc.data();

      // Check if timeAccepted is defined and is today's date
      if (data.timeAccepted && isSameDay(data.timeAccepted.toDate(), currentDate)) {
        // Create a paragraph element to display the document ID and timeAccepted timestamp
        const p = document.createElement("p");
        // p.textContent = `Request ID: ${doc.id}, Driver Name: ${data.driverName}`;
        p.textContent = `Driver Name: ${data.driverName}`;

        
        // Add click event listener to the paragraph element
        p.addEventListener("click", () => {
          openSecondModal(doc.id); // Pass the document ID to the function
        });

        // Append the paragraph element to the container
        requestListContainer.appendChild(p);
      }
    });
    
    // After adding all items, apply scrollable style
    requestListContainer.style.overflowY = "auto";
    requestListContainer.style.maxHeight = "200px"; // Adjust the max height as needed
  }).catch((error) => {
    console.log("Error getting documents: ", error);
  });
}



// // Function to open the second modal with the ID
// function openSecondModal(id) {
//   const secondModal = document.getElementById("secondModal");
//   secondModal.style.display = "block";

//   // Display the ID in the second modal
//   const idElement = document.getElementById("secondModalId");
//   idElement.textContent = id;

//   // Get the second modal's close button
//   const secondModalCloseBtn = document.querySelector(".second-modal-close");

//   // Close the second modal when the close button is clicked
//   secondModalCloseBtn.addEventListener("click", () => {
//     secondModal.style.display = "none";
//   });
// }



// Function to open the second modal with the ID
// function openSecondModal(id) {
//   const secondModal = document.getElementById("secondModal");
//   const secondModalContent = document.getElementById("secondModalContent");
//   secondModal.style.display = "block";

//   // Fetch the data from Firestore based on the ID
//   db.collection("acceptedRequest").doc(id).get().then((doc) => {
//     if (doc.exists) {
//       const data = doc.data();
//       // Create HTML content to display the data
//       const htmlContent = `
//         <div class="reportdetails">
//         <h1 style="text-align:center">Details</h1>
         
//           <p>Driver Name: ${data.driverName}</p>
//           <p>Driver Plate Number: ${data.driverPlateNumber}</p>
//           <p>Drop-off Point: ${data.dropOffPoint}</p>
//           <p>Pickup Point: ${data.pickupPoint}</p>
//           <p>Request By: ${data.requestBy}</p>
//           <p>Successful: ${data.successful ? 'Yes' : 'No'}</p>
//           <p>Time Accepted: ${formatDate(data.timeAccepted.toDate())}</p>
//           <button id="reportButton">Report</button>
//       </div>
        
//       `;
//       // Set the HTML content in the second modal
//       // <p>Request ID: ${id}</p>
//       secondModalContent.innerHTML = htmlContent;
//     } else {
//       // Handle the case where the document does not exist
//       secondModalContent.innerHTML = "<p>No data found for this ID.</p>";
//     }
//   }).catch((error) => {
//     console.log("Error getting document:", error);
//     // Display an error message in the second modal if an error occurs
//     secondModalContent.innerHTML = "<p>Error retrieving data.</p>";
//   });

//   // Get the second modal's close button
//   const secondModalCloseBtn = document.querySelector(".second-modal-close");

//   // Close the second modal when the close button is clicked
//   secondModalCloseBtn.addEventListener("click", () => {
//     secondModal.style.display = "none";
//   });
// }


// Function to open the second modal with the ID
function openSecondModal(id) {
  const secondModal = document.getElementById("secondModal");
  const secondModalContent = document.getElementById("secondModalContent");
  secondModal.style.display = "block";

  // Fetch the data from Firestore based on the ID
  db.collection("acceptedRequest").doc(id).get().then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      // Create HTML content to display the data
      const htmlContent = `
        <div class="reportdetails">
          <h1 style="text-align:center; margin-top: -40px;">Details</h1>
          <p style="font-weight: bold;">Request By: ${data.requestBy}</p>

          <p>Driver Name: ${data.driverName}</p>
          <p>Driver Plate Number: ${data.driverPlateNumber}</p>
          <p>Drop-off Point: ${data.dropOffPoint}</p>
          <p>Pickup Point: ${data.pickupPoint}</p>
          <p>Successful: ${data.successful ? 'Yes' : 'No'}</p>
          <p>Time Accepted: ${formatDate(data.timeAccepted.toDate())}</p>
          <button id="reportButton">Report</button>
        </div>
      `;
      // Set the HTML content in the second modal
      secondModalContent.innerHTML = htmlContent;

      // Get the report button
      const reportButton = document.getElementById("reportButton");

      // Add event listener to report button
      reportButton.addEventListener("click", () => {
        // Open the report modal
        const reportModal = document.getElementById("reportModal");
        reportModal.style.display = "block";
      });

      // Get the close button inside the report modal
      const reportModalCloseBtn = document.querySelector(".report-modal-close");

      // Add event listener to close button
      reportModalCloseBtn.addEventListener("click", () => {
        // Close the report modal
        const reportModal = document.getElementById("reportModal");
        reportModal.style.display = "none";
      });
    } else {
      // Handle the case where the document does not exist
      secondModalContent.innerHTML = "<p>No data found for this ID.</p>";
    }
  }).catch((error) => {
    console.log("Error getting document:", error);
    // Display an error message in the second modal if an error occurs
    secondModalContent.innerHTML = "<p>Error retrieving data.</p>";
  });

  // Get the second modal's close button
  const secondModalCloseBtn = document.querySelector(".second-modal-close");

  // Close the second modal when the close button is clicked
  secondModalCloseBtn.addEventListener("click", () => {
    secondModal.style.display = "none";
  });
}





// Close the report modal when the close button is clicked
document.querySelector(".reportclose").addEventListener("click", closeReportModal);

// Close the report modal when clicking outside of it
window.addEventListener("click", (event) => {
  const reportModal = document.getElementById("reportmodal");
  if (event.target === reportModal) {
    reportModal.style.display = "none";
  }
});

// Open the report modal when the "Open Modal" button is clicked
document.getElementById("reportopenModalBtn").addEventListener("click", openReportModal);






// Function to check if two dates are the same day
function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Function to close the report modal
function closeReportModal() {
  const reportModal = document.getElementById("reportmodal");
  reportModal.style.display = "none";
}

// Close the report modal when the close button is clicked
document.querySelector(".reportclose").addEventListener("click", closeReportModal);

// Close the report modal when clicking outside of it
window.addEventListener("click", (event) => {
  const reportModal = document.getElementById("reportmodal");
  if (event.target === reportModal) {
    reportModal.style.display = "none";
  }
});

// Open the report modal when the "Open Modal" button is clicked
document.getElementById("reportopenModalBtn").addEventListener("click", openReportModal);



