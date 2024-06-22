'use strict';

/* --------for collecting the outputs of all dropdown menu---------- */
'use strict';

const selectedValues = {};

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

    const clickedValue = event.target.getAttribute('value');
    span.textContent = event.target.textContent;

    const dropdownIndex = dropdown.classList[1].split('__')[1];
    const parameterName = parameterMap[dropdownIndex];
    
    if (clickedValue !== null) {
      selectedValues[parameterName] = clickedValue;
    } else {
      delete selectedValues[parameterName];
    }

    updateOKButtonState();
  });
});

const okButton = document.querySelector('.btn__1');

function updateOKButtonState() {
  okButton.disabled = Object.keys(selectedValues).length === 0;
}

updateOKButtonState();

// okButton.addEventListener('click', () => {
//   const lockedSelectedValues = JSON.stringify(selectedValues, null, 2);
//   console.log('Selected Values:', lockedSelectedValues);
// });

// Clear button functionality
// const clearButton = document.querySelector('.btn__2');
// clearButton.addEventListener('click', () => {
//   dropdownContainers.forEach(dropdown => {
//     const span = dropdown.querySelector('.selected-value');
//     span.textContent = span.getAttribute('data-default') || span.textContent;
//   });
  
//   Object.keys(selectedValues).forEach(key => delete selectedValues[key]);
//   updateOKButtonState();
// });

// Initialize default values for spans
dropdownContainers.forEach(dropdown => {
  const span = dropdown.querySelector('.selected-value');
  span.setAttribute('data-default', span.textContent);
});

export { selectedValues };




//---- the function that will use the fetch function for API endpointVIE💀☠⚡----

async function fetchRecordCount(parameterObjData) {
  try {
    const response = await fetch('http://127.0.0.1:3000/api/v1/recordcount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parameterObjData),//💀Super i forgot to stringify the raw data input stream. Hence it was giving error. Don't do it agian.⚡
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// to call fetchRecordCount() function every time i press OK button. Actually to set the value in the "<span></span>" element. 
okButton.addEventListener('click', async (e) => {
  e.preventDefault();
  const parameterSendingToApi = {
    EXAMNAME: selectedValues.EXAMNAME,
    CAT1: selectedValues.CAT1,
    SELECTED: selectedValues.SELECTED,
    GENDER: selectedValues.GENDER,
    CAT2: selectedValues.CAT2,
    CAT3: selectedValues.CAT3
  };
  
  const recordCount = await fetchRecordCount(parameterSendingToApi);
  if (recordCount !== null) {
    document.getElementById('recordsOfData').textContent = recordCount;
  } else {
    console.error('fetch record count is not working. This error is comming from LOC 199 around');
  }
});

// similarly new CLEAR button functionaliyt
const clearButton = document.querySelector('.btn__2');
clearButton.addEventListener('click', (e) => {
  e.preventDefault();
  dropdownContainers.forEach(dropdown => {
    const span = dropdown.querySelector('.selected-value');
    span.textContent = span.getAttribute('data-default') || span.textContent;
  });
 
  Object.keys(selectedValues).forEach(key => selectedValues[key] = "");
  updateOKButtonState();
  
  // to Reset the record if count is found to be 0
  document.getElementById('recordsOfData').textContent = '0';
});

// to initialize the span with value 0 every time page loads. looks neat. 
document.getElementById('recordsOfData').textContent = '0';

