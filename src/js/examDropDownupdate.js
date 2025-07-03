// // Function to populate dropdown with exam names
// function populateExamDropdown(examNames) {
//     // To target dropdown-content within dropdown dropdown__1
//     const dropdownContent = document.querySelector('.dropdown__1 .dropdown-content');
    
//     if (!dropdownContent) {
//       console.error('Could not find dropdown content container div');// either dropdown dropdown__1 is missing or dropdown-content is missing
//       return;
//     };

//     if (!Array.isArray(examNames)) {
//         console.error("received non-array data. This API endpoint has to return Array data only for further use: ", examNames, typeof(examNames));// BugexamNames is "undefined"
//         return;
//     };
    
//     // // to clear what ever existed before this point in time.
//     // dropdownContent.innerHTML = '';
    
    
    

//     const existingExamNames = Array.from(dropdownContent.querySelectorAll('a')).map(a => a.textContent);
//     const newExamNames = examNames.filter(name => !existingExamNames.includes(name));

//     newExamNames.forEach(examName => {
//         const anchor = document.createElement('a');
//         anchor.href = '#';
//         anchor.setAttribute('value', examName);
//         anchor.textContent = examName;
//         dropdownContent.appendChild(anchor);
//     });

//     localStorage.setItem('examNames', JSON.stringify(examNames));

//   }

import {fetchDistinctExamNames, fetchExamFilters} from './controller.js';

// Function to populate dropdown with exam names
function populateExamDropdown(examNames){};

//function ot create dropdown html structure
function createDropdownHTML() {};

// Function to use sensible names for filters during display
function formatFilterKey(){};

// Function to formate filter values for display
function formatFilterValue(){};

// Function to create and add OK button at the very end of the dropdown div
function createOkButton(){};

// function to clear dynamic dropdown and OK Button at the start of refresh
function clearDynamicContent(){};

// function to populate dynamic dropdown based on selected exam
async function populateDynamicDropdown(examName){};

// Function to initialize the div on the page
async function initializePage(){};

// Function to handle exam selection
function handleExamSelection() {};

// Initializing every thing🔗🚨🔗🔗 when the page loads
document.addEventListener('DOMContentLoaded', async () => {
  initializePage();
  handleExamSelection();
});


  export {populateExamDropdown, populateDynamicDropdown, initializePage};