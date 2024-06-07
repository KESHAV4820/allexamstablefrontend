'use strict';

/* --------for collecting the outputs of all dropdown menu---------- */
export const selectedValues = []; // Array to store selected values
let allSelected = false; // Flag to track wether all dropdowns have selections

const dropdownContainers = document.querySelectorAll('.dropdown-container .dropdown');
//Code Testing console.log(`${Array.from(dropdownContainers)}`);


dropdownContainers.forEach(dropdown => {
  const span = dropdown.querySelector('.selected-value');
  console.log(`${span}`);
  
  const content = dropdown.querySelector('.dropdown-content');

  content.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default link behavior

    const clickedValue = event.target.textContent;
    span.textContent = clickedValue;

    // Update selectedValues array
    const dropdownIndex = dropdown.classList[1].split('__')[1];
    selectedValues[dropdownIndex - 1] = clickedValue;

    // Check if all dropdowns have selections
    allSelected = selectedValues.every(value => value !== undefined);
    updateOKButtonState();
  });
});

const okButton = document.querySelector('.btn__1');

function updateOKButtonState() {
  okButton.disabled = !allSelected;
}

updateOKButtonState(); // Initial button state based on existing selections

okButton.addEventListener('click', () => {
  console.log('Selected Values:', selectedValues.join(', '));
});



/*----------for downloadview-------------- */

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


  