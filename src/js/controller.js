'use strict';

/* --------for collecting the outputs of all dropdown menu---------- */
/*
export const selectedValues = {
  EXAMNAME: "",
  CAT1: "",
  SELECTED: "",
  GENDER: "",
  CAT2: "",
  CAT3: ""
};

const dropdownContainers = document.querySelectorAll('.dropdown-container .dropdown');

const parameterMap = {
  '1': 'EXAMNAME',
  '2': 'CAT1',
  '3': 'SELECTED',
  '4': 'GENDER',
  '5': 'CAT2',
  '6': 'CAT3'
};

dropdownContainers.forEach(dropdown => {
  const span = dropdown.querySelector('.selected-value');
  const content = dropdown.querySelector('.dropdown-content');

  content.addEventListener('click', (event) => {
    event.preventDefault();

    const clickedValue = event.target.getAttribute('value') || "";
    span.textContent = event.target.textContent;

    const dropdownIndex = dropdown.classList[1].split('__')[1];
    const parameterName = parameterMap[dropdownIndex];
    selectedValues[parameterName] = clickedValue;

    updateOKButtonState();
  });
});

const okButton = document.querySelector('.btn__1');

function updateOKButtonState() {
  okButton.disabled = Object.values(selectedValues).every(value => value === "");
}

updateOKButtonState();

okButton.addEventListener('click', () => {
  const outputValues = {...selectedValues}; // Create a shallow copy
  const lockedSelectedValues = JSON.stringify(outputValues, null, 2);
  console.log('Selected Values:', lockedSelectedValues);
});

// Clear button functionality
const clearButton = document.querySelector('.btn__2');
clearButton.addEventListener('click', () => {
  dropdownContainers.forEach(dropdown => {
    const span = dropdown.querySelector('.selected-value');
    span.textContent = span.getAttribute('data-default') || span.textContent;
  });
  
  Object.keys(selectedValues).forEach(key => selectedValues[key] = "");
  updateOKButtonState();
});

// Initialize default values for spans
dropdownContainers.forEach(dropdown => {
  const span = dropdown.querySelector('.selected-value');
  span.setAttribute('data-default', span.textContent);
});
*/

'use strict';

const selectedValues = {
  EXAMNAME: "",
  CAT1: "",
  SELECTED: "",
  GENDER: "",
  CAT2: "",
  CAT3: ""
};

const dropdownContainers = document.querySelectorAll('.dropdown-container .dropdown');

const parameterMap = {
  '1': 'EXAMNAME',
  '2': 'CAT1',
  '3': 'SELECTED',
  '4': 'GENDER',
  '5': 'CAT2',
  '6': 'CAT3'
};

dropdownContainers.forEach(dropdown => {
  const span = dropdown.querySelector('.selected-value');
  const content = dropdown.querySelector('.dropdown-content');

  content.addEventListener('click', (event) => {
    event.preventDefault();

    const clickedValue = event.target.getAttribute('value') || "";
    span.textContent = event.target.textContent;

    const dropdownIndex = dropdown.classList[1].split('__')[1];
    const parameterName = parameterMap[dropdownIndex];
    selectedValues[parameterName] = clickedValue;

    updateOKButtonState();
  });
});

const okButton = document.querySelector('.btn__1');

function updateOKButtonState() {
  okButton.disabled = Object.values(selectedValues).every(value => value === "");
}

updateOKButtonState();

okButton.addEventListener('click', () => {
  const outputValues = {
    EXAMNAME: selectedValues.EXAMNAME,
    CAT1: selectedValues.CAT1,
    SELECTED: selectedValues.SELECTED,
    GENDER: selectedValues.GENDER,
    CAT2: selectedValues.CAT2,
    CAT3: selectedValues.CAT3
  };
  const lockedSelectedValues = JSON.stringify(outputValues, null, 2);
  console.log('Selected Values:', lockedSelectedValues);
});

// Clear button functionality
const clearButton = document.querySelector('.btn__2');
clearButton.addEventListener('click', () => {
  dropdownContainers.forEach(dropdown => {
    const span = dropdown.querySelector('.selected-value');
    span.textContent = span.getAttribute('data-default') || span.textContent;
  });
  
  Object.keys(selectedValues).forEach(key => selectedValues[key] = "");
  updateOKButtonState();
});

// Initialize default values for spans
dropdownContainers.forEach(dropdown => {
  const span = dropdown.querySelector('.selected-value');
  span.setAttribute('data-default', span.textContent);
});

export { selectedValues };
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


  