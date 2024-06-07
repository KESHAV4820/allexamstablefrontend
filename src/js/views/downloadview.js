'use strict';

const downloadview = document.querySelector('.btn__3');

function downloadData() {
  fetch('/download') //Note:Replace with your actual API endpoint
    .then(response => response.json())
    .then(data => {
      console.log("Download triggered successfully:", data);})
    .catch(error => {
      console.error("Error triggering download:", error);
    });
}

downloadview.addEventListener('click', (e) => {
  // Get the content of the .databaseoutputarea div
  e.preventDefault();
  downloadData();
});