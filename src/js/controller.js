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



/*----------for printview-------------- */

import printJS from "print-js";

const printButton = document.querySelector('.btn__3');

/*
printButton.addEventListener('click', (e) => {
  // Get the content of the .databaseoutputarea div
  e.preventDefault();
  const databaseOutputArea = document.querySelector('.databaseoutputarea').innerHTML;
  const printWindow = window.open('', '', 'height=800,width=1200');// Creating new window object. Knowledge Gap need to work on the first two parameters. Resolved: now i know every thing about all the three parameters of window.open().🐱‍🏍
  // Write the HTML content to the new window
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Output</title>
        <style>
          <!--Add any necessary styles for the print view -->
        </style>
      </head>
      <body>
        ${databaseOutputArea}
      </body>
    </html>
  `);
  printWindow.document.close();// After printing the content of the print windows, you have to explicitly close the print window using close() method.
  printWindow.print();

  printWindow.close();
});
*/


const databaseOutputArea = document.getElementById('databaseoutputarea');

  printButton.addEventListener('click', () => {
    printJS({
      printable: databaseOutputArea, // Specify the element to print
      type: 'html', // Print as HTML (other options include 'pdf', 'image', 'json')
      style: '@media print { /* Add custom print styles here */ }' // Optional custom print styles
    });
  });












/**********to implement the dropdown menu selected view************/
/* Usless Coding 
export async function initializeDropdowns(){
  // Get all dropdowns
const dropdownSelect = document.querySelectorAll('.dropdown');

//Iterate over each dropdown
dropdownSelect.forEach(dropdown => {
  // Get the dropdown trigger and options
  const trigger = dropdown.querySelector('span');
  const options = dropdown.querySelectorAll('.dropdown-content a');

  // Check if trigger exists
  if (trigger) {
    // Add click event listener to the dropdown trigger
    trigger.addEventListener('click', function() {
      // Toggle dropdown content visibility when the trigger is clicked
      dropdown.querySelector('.dropdown-content').classList.toggle('show');
    });
  }

  // Add click event listener to each option
  options.forEach(option => {
    option.addEventListener('click', function() {
      // Get the text content of the selected option
      const selectedOption = option.textContent;

      // Update the text content of the dropdown trigger with the selected option
      if (trigger) {
        trigger.textContent = selectedOption;
      }

      // Hide dropdown content after an option is clicked
      dropdown.querySelector('.dropdown-content')?.classList.remove('show');
    });
  });
});
};
//Call the initializeDropDowns function initially
initializeDropdowns();
*/
  