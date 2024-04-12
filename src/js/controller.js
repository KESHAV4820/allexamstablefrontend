'use strict';


const selectedValues = [];
const dropdowns = document.querySelectorAll('.dropdown-content');
dropdowns.forEach((dropdown) => {
    console.log(`${dropdown.textContent}`);   
});//Code Testing
// const dropdowns1= document.querySelectorAll('.dropdown');
// dropdowns1.forEach(dropdown1=>console.log(`${dropdown1.textContent}`));//Code Testing

const okButton = document.querySelector('.btn__1');

// Function to handle the button click event
function handleButtonClick() {
    dropdowns.forEach(function(dropdown) {
      const selectedOption = dropdown.querySelector('a[href="#"]:checked');
      console.log(`Selected Option is ${selectedOption}`); // Code Testing
      
      if (selectedOption) {
        selectedValues.push(selectedOption.getAttribute('data-value'));
      }
      if(!selectedOption){console.log(`No option selected in ${dropdown.innerText}`);
      }
    });
    const queryString = selectedValues.join(', ');//code upgrade needed to use template of SQL based string that will be used in here to make a valied quary which will be sent to the postgres.
    console.log(`Query String: ${queryString}`);
  }
  
  // Attach click event listener to the OK button
  document.addEventListener('DOMContentLoaded', function() {
    okButton.addEventListener('click', handleButtonClick);
  });












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
      dropdown.querySelector('.dropdown-content').classList.remove('show');
    });
  });
});

  