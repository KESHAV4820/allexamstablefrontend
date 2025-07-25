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

import {fetchDistinctExamNamesV2, fetchExamFiltersV2} from './controller.js';
import {fetchRecordCount, fetchVenueStat, fetchSummaryTable} from './controller.js';
import { examApplicants } from './controller.js';
import {showLoading, hideLoading} from './loadingTimeAnimation.js';

// Function to populate dropdown with exam names
function populateExamDropdown(examNames){
  // To target dropdown-content within dropdown dropdown__1
  const dropdownContent = document.querySelector('.dropdown__1 .dropdown-content');
  
  if (!dropdownContent) {
    console.error('Could not find dropdown content container div');// either dropdown dropdown__1 is missing or dropdown-content is missing
    return;
  };
  
  if (!Array.isArray(examNames)) {
    console.error("received non-array data. This API endpoint has to return Array data only for further use: ", examNames, typeof(examNames));// BugexamNames is "undefined"
    return;
  };
  
  // to clear what ever existed before this point in time 
  
      dropdownContent.innerHTML = '';
  
    
    // Add new exam names
    examNames.forEach(examName => {
      const anchor = document.createElement('a');
      anchor.href = '#';
      anchor.setAttribute('value', examName);
      anchor.textContent = examName;
      dropdownContent.appendChild(anchor);
    });
  };
  
  //function ot create dropdown html structure
  function createDropdownHTML(filterKey, filterValues, dropdownIndex) {
    // console.log('filterKey: ',filterKey,'\n','filterValues: ', filterValues, '\n', 'dropdownIndex: ', dropdownIndex);//debugging log
    
    // Create the dropdown structure
    const dropdownDiv = document.createElement('div');
    dropdownDiv.className = `dropdown dropdown__${dropdownIndex}`;
    // dropdownDiv.setAttribute('component-tooltip', `Select any Examname`);
    dropdownDiv.setAttribute('data-filter-key', filterKey); // Set a data attribute for the filter key
    
    const selectedValue = document.createElement('span');
    selectedValue.className = 'selected-value';
    selectedValue.textContent = formatFilterKey(filterKey); // Displaying the filter key as the selected value. Let's see the output.
    selectedValue.setAttribute('data-default', formatFilterKey(filterKey)); // Set a data attribute for the default value
    selectedValue.setAttribute('data-value', ''); // Set a data attribute for the filter key value
    selectedValue.setAttribute('data-param', filterKey); // Set a data attribute for the filter key parameter
    
    const dropdownContent = document.createElement('div');
    dropdownContent.className = 'dropdown-content';

    
    // const dropdownButton = document.createElement('button');
    // dropdownButton.className = 'dropbtn';
    // dropdownButton.textContent = filterKey;
    
    filterValues.forEach(value => {
        const anchor = document.createElement('a');
        anchor.href = '#';
        anchor.setAttribute('value', value); 
        anchor.textContent = formatFilterValue(filterKey,value);
        dropdownContent.appendChild(anchor);
    });
    
    dropdownDiv.appendChild(selectedValue);
    dropdownDiv.appendChild(dropdownContent);
    
    return dropdownDiv;
};

// Function to use sensible names for filters during display
function formatFilterKey(key){
  const filterKeyMapping = {
    'CAT1': 'CATEGORY(CAT1)',
    'CAT2': 'EX-SERV.MAN(CAT2)',
    'CAT3': 'HND.CP QUOTA(CAT3)',
    'GENDER': 'GENDER',
    'DME_APP': 'Dt.Med.Ex APP',
    'DME_QLY': 'Dt.Med.Ex QLY',
    'PET_APP': 'Phy.Endu.Tst APP',
    'PET_QLY': 'Phy.Endu.Tst QLY',
    'RME_APP': 'Rev.Med.Ex APP',
    'RME_QLY': 'Rev.Med.Ex QLY',
    'SELECTED': 'SELECTED',
    'WITHHELD': 'WITHHELD',
    'ALLOC_CAT': 'ALLOC_CAT',
    'INTVW_APP': 'INTVW APP',
    'SKILL_APP': 'SKILL TEST APP',
    'SKILL_QLY': 'SKILL TEST QLY',
    'WRTN1_APP': 'TIER 1 APP',
    'WRTN1_QLY': 'TIER 1 QLY',
    'WRTN2_APP': 'TIER 2 APP',
    'WRTN2_QLY': 'TIER 2 QLY',
    'WRTN3_APP': 'TIER 3 APP',
    'WRTN3_QLY': 'TIER 3 QLY',
    'ALLOC_AREA': 'ALLOC_AREA',
    'ALLOC_POST': 'ALLOC_POST',
    'ALLOC_STAT': 'ALLOC_STAT',
  };
  return filterKeyMapping[key] || key; // Return the mapped value or the original key if not found
};

// Function to formate filter values for display
function formatFilterValue(key, value){
  
  if (value === null) {
    return 'NULL'; // Display 'NULL' for null values
  };

  if (value === 'Y') {
    return 'YES'; // Display 'YES' for 'Y'
  };

  if (key === 'CAT1' || key === 'ALLOC_CAT') {
    const categoryMapping = {
      '0': 'EWS (0)',
      '1': 'SC (1)',
      '2': 'ST (2)',
      '4': 'OBC in DELHI(4)',
      '6': 'OBC (6)',
      '9': 'UR (9)',
    };
    return categoryMapping[value] || value; // Return the mapped value or the original value if not found
  };

  if (key === 'CAT2' || key === 'ALLOC_CAT') {
    const exServiceMapping = {
      '3': 'ESM (3)',
      };
    return exServiceMapping[value] || value; // Return the mapped value or the original value if not found
  };

  if (key === 'CAT3' || key === 'ALLOC_CAT') {
    const handicapMapping = {
      '4': 'OH',
      '5': 'HH',
      '7': 'VH',
      '8': 'PWD',
      }
    return handicapMapping[value] || value; // Return the mapped value or the original value if not found
  };

  if (key === 'GENDER') {
    const genderMapping = {
      'M': 'MALE',
      'F': 'FEMALE',
      'T': 'TRANS',
    };
    return genderMapping[value] || value; // Return the mapped value or the original value if
  };

};

// Function to create and add OK button at the very end of the dropdown div
function createOkButton(){
    const okButton = document.createElement('button');
    okButton.className = 'btn btn__1';
    okButton.setAttribute('component-tooltip', 'click to get records based on above selected filters');
    okButton.textContent = 'OK';
    return okButton;
};

// Global object to store selected values
const selectedValues = {};
//Function to add event listender to each dynamic dropdown
function attachDropdownEventListeners(dropdown){
  const span = dropdown.querySelector('.selected-value');
  const content = dropdown.querySelector('.dropdown-content');
  // Removing any event listener that existed before so that there is no duplication of event listeners
  content.removeEventListener('click', handleDropdownClick);
  // now adding the event listener to the dropdown content
  content.addEventListener('click', handleDropdownClick);

  console.log('Attached Event listener to :',span);//debugging log  
};

//Event handler for dropdown click
function handleDropdownClick(event) {
  event.preventDefault();
  if (event.target.tagName === 'A') {
    const clickedValue = event.target.getAttribute('value');
    const dropdown = event.target.closest('.dropdown');
    const span = dropdown.querySelector('.selected-value');
    const parameterName = span.getAttribute('data-param'); // Get the parameter name from the span's data attribute

    // Update the selected value display
    span.textContent = event.target.textContent;
    span.setAttribute('data-value', clickedValue); // Update the data-value attribute with the clicked value
    
    // Storing the selected value 
    selectedValues[parameterName] = clickedValue;

    console.log(`Selected value for ${parameterName}: ${clickedValue}`);//debugging log
    console.log('All selected values:', selectedValues);//debugging log
    
    updateOKButtonState();
    attachDropdownEventListeners(dropdown); // Re-attach event listeners to the dropdown
  };
};
// Function to update the state of the OK button state
function updateOKButtonState() {
  const okButton = document.querySelector('.btn__1');
  if (okButton) {
    const hasSelections = Object.keys(selectedValues).length > 0;
    okButton.disabled = !hasSelections; // Enable OK button only if there are selections
  }
};
// Function to get selected values for API call
function getSelectedValuesForAPI() {
  const apiParams = {};
  Object.entries(selectedValues).forEach(([key, value]) => { apiParams[key] = value; });
  console.log('in getSelectedValuesForAPI in examdropdownupdate module apiParams: ',apiParams);//debugging log
  
  return apiParams;
};


// function to clear dynamic dropdown and OK Button at the start of refresh
function clearDynamicContent(){
  const dropdownContainer = document.querySelector('.dropdown-container');
  const examDropdown = dropdownContainer.querySelector('.dropdown__1');

  // Removing all the children except exam dropdown
  const childrenToRemove = [];
  for (let child of dropdownContainer.children){
    if (child !== examDropdown) {
      childrenToRemove.push(child);
    }
  };
  childrenToRemove.forEach(child => child.remove());// removing all the children except exam dropdown by deleting all items from this array

  // Clearing the selected values object
  Object.keys(selectedValues).forEach(key =>{
    if (key !== 'EXAMNAME') delete selectedValues[key]; 
  });

  updateOKButtonState(); // Update the OK button state after clearing dynamic content
};

// function to populate dynamic dropdown based on selected exam
async function populateDynamicDropdown(examName){
  try {
    // Clear existing dynamic content
    clearDynamicContent();
    // Fetch exam filters for the selected exam
    const result = await fetchExamFiltersV2(examName);
    console.log('result= ',result);//debugging log
    
    if (!result.success) {
      console.error('Failed to fetch exam filters:', result.error);
      return;
    };

    const filters = result.data;
    console.log('filters received in populateDynamicDropdown function: ', filters);//debugging log
    const dropdownContainer = document.querySelector('.dropdown-container');

    // Creating a dropdown for each filter
    let dropdownIndex = 2; // Start from 2 since 1 is already used for exam dropdown

    Object.entries(filters).forEach(([filterKey, filterValues]) => {
      const dropdownElement = createDropdownHTML(filterKey, filterValues, dropdownIndex);
      dropdownContainer.appendChild(dropdownElement);
      //now attaching event listeners to the newly created dropdown
      attachDropdownEventListeners(dropdownElement); // Attach event listeners to the newly created dropdown
      dropdownIndex++;
    });

    // Create and append the OK button NOW. It's important to append it "NOW". 
    const okButton = createOkButton();
    dropdownContainer.appendChild(okButton);

    // Adding event listener to the OK button
    attachOKBUttonEventListener(okButton);

    console.log(`Created ${Object.keys(filters).length} dynamic dropdowns for exam: ${examName}`);//debugging log
    
  } catch (error) {
    console.error(`Error populating dynamic dropdown for exam "${examName}":`, error);
  }
};
// Function to attach event listener to the OK button
function attachOKBUttonEventListener(okButton) {
  okButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const apiParams = getSelectedValuesForAPI();
    console.log('inside examDropdownupdate module Parameters for API:', JSON.stringify(apiParams, null, 2));//debugging log
    
    // Make API call with selected values
    const examCentersDiv=document.querySelector('.examcenters');
    const summaryTable=document.querySelector('.summarytable');

showLoading(examCentersDiv);
showLoading(summaryTable);

  // const apiParams = {};
  // dropdownContainers.forEach(dropdown => {
  //   const span = dropdown.querySelector('.selected-value');
  //   const value = span.getAttribute('data-value');
  //   const param = span.getAttribute('data-param');
  //   if (value !== null && param !== null) {
  //     apiParams[param] = value;
  //   }
  // });
    // console.log('Selected Values:', JSON.stringify(apiParams, null, 2));//VIECode Testing
  const recordCount = await fetchRecordCount(apiParams);
  if (recordCount !== null) {
    document.getElementById('recordsOfData').textContent = recordCount;
  } else {
    console.error('fetch record count is not working. This error is comming from LOC 353 around in examDropDownupdate.js module');//Code Testing
  };

  const applicantCount = examApplicants[apiParams.EXAMNAME] || 0;
  document.getElementById('noOfApplicant').textContent = applicantCount;
  // console.log(apiParams);//Code Testing
  
  try {
    // Fetching and update exam center stats
    await fetchVenueStat(apiParams);
    //Fetching and updating the summary table in numbers by default
    await fetchSummaryTable(apiParams,'numbers'); 
  }catch (error) {
   console.error('Error fetching data: ', error) 
  }finally{
    hideLoading(examCentersDiv);
    hideLoading(summaryTable);
  }

  })
}

// Function to initialize the div on the page
async function initializePage(){
  try {
    // Fetch distinct exam names from the API and populate the exam dropdown
    const result = await fetchDistinctExamNamesV2();
    // console.log('inside initializePage() result= ',result);//debugging log
    console.log('examNames received in initializePage function inside result.data:  ', result.data);//debugging log

    if (result.success){
      const examNames = result.data;
      populateExamDropdown(examNames);
      console.log('Exam dropdown populated successfully');//debugging log
    } else {
      console.error('Failed to fetch distinct exam names:', result.error);
    };
  } catch (error) {
    console.error(`Error initializing page:`, error);
  }

};

// Function to handle exam selection
function handleExamSelection() {

  const examDropdown = document.querySelector('.dropdown__1');
  const dropdownContent = examDropdown.querySelector('.dropdown-content');
  const span = examDropdown.querySelector('.selected-value');

  // Seting initial attributes for the exam dropdown
  span.setAttribute('data-default', 'EXAMs');
  span.setAttribute('data-value', null); // Set a data attribute for the exam value
  span.setAttribute('data-param', 'EXAMNAME'); // Set a data attribute for

  // Attach Event listener to exam dropdown 
  attachDropdownEventListeners(examDropdown);

  dropdownContent.addEventListener('click', async (event) => {
    if (event.target.tagName === 'A') {
      event.preventDefault();
      const selectedExam = event.target.getAttribute('value');
      console.log(`in handleExamSelection() Selected exam: ${selectedExam}`);//debugging log

      // Update the selected value display
      const selectedValueSpan = examDropdown.querySelector('.selected-value');
      selectedValueSpan.textContent = selectedExam;
      selectedValueSpan.setAttribute('data-value', selectedExam); // Update the data-value attribute with the selected exam

      // Storing exam name in selectedValues object
      selectedValues.EXAMNAME = selectedExam;
      
      if (selectedExam !== null) {
        await populateDynamicDropdown(selectedExam);
        console.log(`Dynamic dropdown populated for exam: ${selectedExam}`);//debugging log
      } else {
        clearDynamicContent();
        // console.log(`Cleared dynamic dropdown `);//debugging log
            };
      };
  });
};

// Initializing every thing🔗🚨🔗🔗 when the page loads
document.addEventListener('DOMContentLoaded', async () => {
  initializePage();
  handleExamSelection();
});


  export {
    populateExamDropdown, 
    populateDynamicDropdown, 
    initializePage,
    getSelectedValuesForAPI,
    selectedValues,
    handleDropdownClick,
    attachDropdownEventListeners,
    updateOKButtonState
  };