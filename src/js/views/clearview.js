'use strict'

 //import { initializeDropdowns } from "../controller.js"; 



// const clearButton=document.querySelector('.btn__2');

// const container= document.querySelector('.container');
// function _clearContainer(){container.innerHTML='';};
// // _clear(){this._parentElement.innerHTML='';};inspiration code

// // Function to generate the HTML content
// function _generateHTMLContent() {
//     let  originalHtmlMarkup =
//     ``;
//     return originalHtmlMarkup;
//   }
  
//   // Add click event listener to the "Clear" button
//   clearButton.addEventListener('click', function(e) {    e.preventDefault();
//     location.reload();
//   });
  






/* Alternative Code Knowledge Gap
// Function to reset dropdown triggers to default state
function resetPage() {
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
    resetPage();
  });
  */
/*👀uncomment from here.
  // Select the Clear button
const clearButton = document.querySelector('.btn.btn__2');

// Add event listener to the Clear button
clearButton.addEventListener('click', function(e) {
  e.preventDefault();
    // Select the container div
  const container = document.querySelector('.container');

  // Remove all child elements from the container
  while (container.firstChild) {
    container.removeChild(container.firstChild);
    //console.log(`${container.firstChild}`);//Code Testing
    
  }

  // Re-add the main logo, header, and other initial content
  container.innerHTML = `
  <div class="mainlogo">
  <img src="src/img/ssc_logo_trans.png" alt="Logo" class="header__logo" />
</div>

<div class="header">
  <header>
    <h1 class="achronyme">
      R.A.D.H.E 
    </h1>
    <h3 class="fullform">
      Record & Analysis of Data for
    </h3>
    <h3 class="fullform">
      Historical Employment
    </h3>
  </header>
</div>

<div class="databaseoutputarea">
  <!-- <h1>DATABASE WILL RENDER THE DATA IN THIS SPACE</h1> -->
  <img src="src/img/testing.png" alt="Logo" class="header__logo" />
</div>

<div class="dropdown-container">
  <div class="dropdown  dropdown__1">
    <span class="selected_value">YEAR</span>
    <div class="dropdown-content">
      <a href="#">ALL YEAR</a>
      <a href="#">2023</a>
      <a href="#">2022</a>
      <a href="#">2021</a>
    </div>
  </div>

  <div class="dropdown  dropdown__2">
    <span class="selected_value">EXAMs</span>
    <div class="dropdown-content">
      <a href="#">ALL EXAMs</a>
      <a href="#">CGL2023</a>
      <a href="#">CGL2022</a>
      <a href="#">CGL2021</a>
      <a href="#">CGL2020</a>
    </div>
  </div>

  <div class="dropdown  dropdown__4">
    <span class="selected_value">CRITERIA</span>
    <div class="dropdown-content">
      <a href="#">OVERALL</a>
      <a href="#">TOTAL SELECTED</a>
      <a href="#">SELECTED MEDICAL</a>
      <a href="#">APPEARED MEDICAL</a>
      <a href="#">SELECTED DV</a>
      <a href="#">APPERED DV</a>
      <a href="#">SELECTED T3</a>
      <a href="#">APPEARED T3</a>
      <a href="#">SELECTED T2</a>
      <a href="#">APPEARED T2</a>
      <a href="#">SELECTED T1</a>
      <a href="#">APPEARED T1</a>
    </div>
  </div>

  <div class="dropdown dropdown__3">
    <span class="selected_value">CATAGORY</span>
    <div class="dropdown-content">
      <a href="#">GENERAL</a>
      <a href="#">0</a>
      <a href="#">1</a>
      <a href="#">2</a>
      <a href="#">3</a>
      <a href="#">4</a>
      <a href="#">5</a>
      <a href="#">6</a>
      <a href="#">7</a>
      <a href="#">8</a>
      <a href="#">9</a>
    </div>
  </div>
  <button class="btn btn__1">OK</button>
</div>
<button class="btn btn__2">CLEAR</button>
<button class="btn btn__3">PRINT</button>

<div class="stats">
  <h2>STATS:</h2>
</div>

<div class="summarytable">
  <table border="1">
    <!-- Table header row -->
    <tr>
        <th>EXAM NAME</th>
        <th>TOTAL</th>
        <th>0</th>
        <th>1</th>
        <th>2</th>
        <th>3</th>
        <th>4</th>
        <th>5</th>
        <th>6</th>
        <th>7</th>
        <th>8</th>
        <th>9</th>
    </tr>
    <!-- Table data rows -->
    <tr>
        <td>TOTAL CANDIDATE</td>
        <!-- <td>Data 1B</td>
        <td>Data 1C</td> -->
    </tr>
    <tr>
        <td>MALE CANDIDATE</td>
        <!-- <td>Data 2B</td>
        <td>Data 2C</td> -->
    </tr>
    <tr>
      <td>FEMALE CANDIDATE</td>
      <!-- <td>Data 2B</td>
      <td>Data 2C</td> -->
    </tr>
  </table>
</div>
  `;
  // reinitialize dropdown event Listeners after clearing the content
  initializeDropdowns();
});
*/




/*👀uncomment from here

const clearButton = document.querySelector('.btn__2'); // Assuming the clear button has class 'btn__1'

clearButton.addEventListener('click', () => {
  // Reset dropdown selections
  const dropdownContents = document.querySelectorAll('.dropdown-content');
  dropdownContents.forEach(content => {
    content.querySelector('a:first-child').click(); // Click the first option (usually "ALL") to reset
  });

  // Reset selected values array (if applicable)
  const selectedValues = []; // Assuming you have an array to store selections
  selectedValues.length = 0; // Clear the array

  // Reset "OK" button state (if applicable)
  const okButton = document.querySelector('.btn'); // Assuming the OK button has class 'btn'
  okButton.disabled = true; // Disable the OK button if applicable
});

*/

/*👀uncomment from here

const clearButton = document.querySelector('.btn__2'); // Assuming the clear button has class 'btn__2'

clearButton.addEventListener('click', () => {
  // Reset dropdown selections
  const selectedValues = document.querySelectorAll('.selected-value');

  selectedValues.forEach(span => {
    // Get the default text content from the span's dataset (if available)
    const defaultText = span.dataset.defaultValue || "ALL"; // Default to "ALL" if no dataset is set

    span.textContent = defaultText;
  });

  // Reset selected values array (if applicable)
  const selectedValuesArray = []; // Assuming you have an array to store selections
  selectedValuesArray.length = 0; // Clear the array

  // Reset "OK" button state (if applicable)
  const okButton = document.querySelector('.btn'); // Assuming the OK button has class 'btn'
  okButton.disabled = true; // Disable the OK button if applicable
});
*/
import { selectedValues } from "../controller.js";

const selectedValuesSpan = document.querySelectorAll('.selected-value');
const initialValues = [];

selectedValuesSpan.forEach(span => {
  initialValues.push(span.textContent);
});

const clearButton = document.querySelector('.btn__2');

clearButton.addEventListener('click', () => {
  
  const selectedValuesSpan = document.querySelectorAll('.selected-value');

  selectedValuesSpan.forEach((span, index) => {
    span.textContent = initialValues[index];
  });

  // Reset selected values array which is selectedValues array in controller.js
  selectedValues.length = 0; // Clearing the array

  // // Reset "OK" button state 
  // const okButton = document.querySelector('.btn__1');
  // okButton.disabled = true; // Disable the OK button if applicable
});
