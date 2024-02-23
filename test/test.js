// Initialize Firebase
const firebaseConfig = {
   
  apiKey: "AIzaSyDjBboCs4iqBnogiInGpHcVvCEDBGokiLU",
  authDomain: "thero-28f02.firebaseapp.com",
  projectId: "thero-28f02",
  storageBucket: "thero-28f02.appspot.com",
  messagingSenderId: "394557839181",
  appId: "1:394557839181:web:53a1bf1d15264d3ab74904",
  measurementId: "G-MB5NB4LDS3"
  };
  firebase.initializeApp(firebaseConfig);
  
  const loginForm = document.getElementById('loginForm');
  const loginModal = document.getElementById('loginModal');
  const closeModal = document.getElementById('closeModal');
  const overlay = document.querySelector('.overlay');
  const landingPage = document.querySelector('.landing-page');
  const logoutBtn = document.getElementById('logoutBtn');
  const passwordField = document.getElementById('password');
  const showPasswordBtn = document.getElementById('showPassword');
  
  // Function to open the modal
  function openModal() {
    loginModal.style.display = 'block';
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Disable scrolling on the body
  }
  
  // Function to close the modal
  function closeModalFunc() {
    loginModal.style.display = 'none';
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto'; // Enable scrolling on the body
  }
  
  // Event listener to open the modal when the page loads
  window.addEventListener('load', openModal);
  
  // Event listener to close the modal when the close button is clicked
  closeModal.addEventListener('click', closeModalFunc);
  
  // Toggle function for showing/hiding the password
  function togglePassword() {
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      showPasswordBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
      passwordField.type = 'password';
      showPasswordBtn.innerHTML = '<i class="fas fa-eye"></i>';
    }
  }
  
  // Event listener for the show/hide password button
  showPasswordBtn.addEventListener('click', togglePassword);
  
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm['email'].value;
    const password = loginForm['password'].value;
  
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        alert('Login successful!');
        console.log('User logged in:', user);
        // Redirect to landing page and show logout button
        landingPage.style.display = 'block';
        logoutBtn.style.display = 'block';
        closeModalFunc(); // Close the modal
        loginForm.reset(); // Clear input fields
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
        console.error('Login error:', errorMessage);
      });
  });
  
  // Logout function
  function logout() {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      alert('Logout successful!');
      landingPage.style.display = 'none'; // Hide the landing page
      openModal(); // Open the login modal again
    }).catch((error) => {
      // An error happened.
      console.error('Logout error:', error);
    });
  }
  
  // Event listener for the logout button
  logoutBtn.addEventListener('click', logout);
  