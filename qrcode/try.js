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
//                     const licensePlate = parsedData.licensePlate;
//                     resultDiv.innerText = `Name: ${name}\nLicense Plate: ${licensePlate}`;
//                 }
//             }
//             requestAnimationFrame(scan);
//         };
//         scan();
//     });
// }

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
                        const licensePlate = parsedData.licensePlate;
                        resultDiv.innerText = `Name: ${name}\nLicense Plate: ${licensePlate}`;
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
                        const licensePlate = parsedData.licensePlate;
                        resultDiv.innerText = `Name: ${name}\nLicense Plate: ${licensePlate}`;
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
