
// //modal

// // Get the modal
// var modal = document.getElementById("modal");

// // Get the button that opens the modal
// var btn = document.getElementById("openModalBtn");

// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// // When the user clicks the button, open the modal 
// btn.onclick = function() {
//   modal.style.display = "block";
// }

// // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//   modal.style.display = "none";
// }

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// }

  const firebaseConfig = {
    apiKey: "AIzaSyDjBboCs4iqBnogiInGpHcVvCEDBGokiLU",
    authDomain: "thero-28f02.firebaseapp.com",
    projectId: "thero-28f02",
    storageBucket: "thero-28f02.appspot.com",
    messagingSenderId: "394557839181",
    appId: "1:394557839181:web:53a1bf1d15264d3ab74904",
    measurementId: "G-MB5NB4LDS3"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Initialize Firestore
  const db = firebase.firestore();



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


  function scanQRCode() {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      video.addEventListener('loadedmetadata', function() {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const scan = () => {
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
                          resultDiv.innerText = `Name: ${name} \plateNumber: ${plateNumber}`;
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
                          const resultDiv = document.getElementById('result');
                          const parsedData = JSON.parse(code.data);
                          const name = parsedData.name;
                          const plateNumber = parsedData.plateNumber;
                          resultDiv.innerText = `Name: ${name} \plateNumber : ${plateNumber}`;
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

  function removeFile() {
      document.getElementById('qrFileInput').value = '';

      const resultDiv = document.getElementById('result');
      resultDiv.innerText = '';
  }



  // Function to fetch data from Firestore and update the display
  function fetchDataInAcceptedRequest(acceptedRequestId) {
    const displayElement = document.getElementById('displayData');

    db.collection("acceptedRequest") // Make sure the collection name matches your Firestore collection
      .doc(acceptedRequestId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          displayElement.innerHTML = `
            <p>Name: ${data.name}</p>
            <p>Plate Number: ${data.plateNumber}</p>
          `;
        } else {
          displayElement.innerHTML = "<p>No data found.</p>";
        }
      })
      .catch((error) => {
        console.error("Error getting document:", error);
        displayElement.innerHTML = "<p>Error fetching data.</p>";
      });
  }


  // Function to handle accepted requests
  function handleAcceptedRequest(acceptedRequestId) {
    // Call the function to fetch and display data
    fetchDataInAcceptedRequest(acceptedRequestId);
  }

  // Assuming you have a function to handle accepted requests elsewhere in your code
  // Make sure it calls handleAcceptedRequest with the accepted request ID
