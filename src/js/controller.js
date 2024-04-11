'use strict';


const selectedValues = [];
const dropdowns = document.querySelectorAll('.dropdown-content');
// Function to handle the button click event
function handleButtonClick() {
    dropdowns.forEach(function(dropdown) {
      const selectedOption = dropdown.querySelector('a[href="#"]:checked');
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
    const okButton = document.querySelector('.btn__1');
    okButton.addEventListener('click', handleButtonClick);
  });
  