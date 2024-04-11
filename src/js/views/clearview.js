'use strict'


// Function to reset dropdown triggers to default state
function resetDropdowns() {
    // Get all dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');
  
    // Iterate over each dropdown
    dropdowns.forEach(dropdown => {
      // Get the dropdown trigger
      const trigger = dropdown.querySelector('span');
  
      // Get the default name of the dropdown menu
      const defaultName = trigger.dataset.default;
  
      // Update the text content of the trigger with the default name
      trigger.textContent = defaultName;
    });
  }
  
  // Get all dropdowns
  const dropdowns = document.querySelectorAll('.dropdown');
  
  // Iterate over each dropdown
  dropdowns.forEach(dropdown => {
    // Get the dropdown trigger and options
    const trigger = dropdown.querySelector('span');
    const options = dropdown.querySelectorAll('.dropdown-content a');
  
    // Store the default name of the dropdown menu
    trigger.dataset.default = trigger.textContent;
  
    // Add click event listener to each option
    options.forEach(option => {
      option.addEventListener('click', function() {
        // Get the text content of the selected option
        const selectedOption = option.textContent;
        
        // Update the text content of the dropdown trigger with the selected option
        trigger.textContent = selectedOption;
      });
    });
  });
  
  // Get the "Clear" button
  const clearButton = document.querySelector('.btn__2');
  
  // Add click event listener to the "Clear" button
  clearButton.addEventListener('click', function() {
    // Reset dropdowns to default state
    resetDropdowns();
  });
  