'use strict';

/* --------for collecting the outputs of all dropdown menu---------- */
const selectedValues = []; // Array to store selected values
let allSelected = false; // Flag to track if all dropdowns have selections

const dropdownContainers = document.querySelectorAll('.dropdown-container .dropdown');

dropdownContainers.forEach(dropdown => {
  const span = dropdown.querySelector('.selected-value');
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








/************to implement the dropdown menu selected view************/
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
  