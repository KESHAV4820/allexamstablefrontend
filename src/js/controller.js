'use strict';
// SuperNote: always push the code to git after pulling the code from repo. code for pulling the code is 👉 git pull origin mirrorverse . where mirror verse is the name of the branch. you need to tell this or it will throw warning/error message.
// const {populateTable, resetSummaryTable} = require('./populateSummaryTable');
import { populateTable,resetSummaryTable } from './populateSummaryTable.js';// newly added23/7/24
import {SUMMARYTABLE_API_URL,SUMMARYTABLE_API_LIMIT,SUMMARYTABLE_API_OFFSET,VENUESTATS_API_URL,VENUESTATS_API_LIMIT,VENUESTATS_API_OFFSET, FETCHRECORDCOUNT_API_URL, VIEWRECORDS_API_URL, VIEWRECORDS_API_LIMIT, VIEWRECORDS_API_OFFSET, DOWNLOADRECORDS_API_URL} from './config.js';



/* --------for collecting the outputs of all dropdown menu---------- */

const selectedValues = {};

const dropdownContainers = document.querySelectorAll('.dropdown-container .dropdown');

const examApplicants = {
  'AWO/TPO-2022': 549497,
  'CAPF-2016': 694227,
  'CAPF-2017': 729596,
  'CAPF-2018': 823730,
  'CAPF-2019': 673292,
  'CAPF-2020': 674366,
  'CAPF-2022': 727110,
  'CAPF-2023': 834466,  // No data provided
  'CGL-2016': 3803748,
  'CGL-2017': 2928826,
  'CGL-2018': 2597431,
  'CGL-2019': 2177843,
  'CGL-2020': 2209867,
  'CGL-2021': 1963324,
  'CGL-2022': 3355194,
  'CGL-2023': 2527369,// No data provided
  'CHSL-2017': 6111719,
  'CHSL-2018': 2968655,
  'CHSL-2019': 4168750,
  'CHSL-2020': 3898378,
  'CHSL-2021': 3669524,
  'CHSL-2022': 3197965,
  'CHSL-2023': 3217298,  // No data provided
  'CONSTABLE-2018': 5236810,
  'CONSTABLE-2021': 7174579,
  'CONSTABLE-2022': 5359277,
  'DPCST-2016': 195860,
  'DPCST-2020': 2896045,
  'DPCST-2023': 3243083,  // NoteNo data provided
  'DPDVR-2022': 194704,
  'HC(MIN)IN DP-2022': 2228593,
  'IMD-2017': 475093,
  'JE-2016': 622041,
  'JE-2017': 995350,
  'JE-2018': 813622,
  'JE-2019': 806078,
  'JE-2020': 667589,
  'JE-2022': 600775,
  'JE-2023': 593027,  // No data provided
  'JHT-2016': 25298,
  'JHT-2017': 29131,
  'JHT-2018': 49651,
  'JHT-2019': 89821,
  'JHT-2020': 13515,
  'JHT-2022': 9444,
  'JHT-2023': 8126, // No data provided
  'LDC-D-2017': 'N/A', // No data provided
  'LDC-D-2018': 958,
  'MTS-2016': 6975285,
  'MTS-2019': 3869446,
  'MTS-2020': 4534810,
  'MTS-2021': 3797357,
  'MTS-2022': 5521917,  // No data provided
  'MTS-2023': 2608167,  // No data provided
  'SA_IMD-2022': 241276,
  'STENO-2016': 457680,
  'STENO-2017': 541900,
  'STENO-2018': 438905,
  'STENO-2019': 513597,
  'STENO-2020': 512172,
  'STENO-2022': 498884,
  'STENO-2023': 508538,  // No data provided
  'STENO-D-2017': 435,
  'UDC-D-2017': 80
};// in absence of data in database, we decided to hardcode the number of applicants for each exam. So we are putting the data in the script. 

// This function is for the content loading Animation
function showLoading(element) {
  // First clear any existing loading animations
  hideLoading(element);
  
  // Create loading animation container
  const loadingContainer = document.createElement('div');
  loadingContainer.className = 'loading-container';
  loadingContainer.innerHTML = `
    <div class="sscicon-spinner">
      <img src="/img/ssc_logo_trans.png" alt="Loading" class="rotating-sscicon">
    </div>
    <div class="loading-text">Loading data...</div>
  `;
  
  // Store original position if not already relative
  if (getComputedStyle(element).position === 'static') {
    element.style.position = 'relative';
  }
  
  element.appendChild(loadingContainer);
}

function hideLoading(element) {
  const existingLoader = element.querySelector('.loading-container');
  if (existingLoader) {
    existingLoader.remove();
  }
}

const parameterMap = {
  '1': 'EXAMNAME',
  '2': 'CAT1',
  '3': 'SELECTED',//WRTN1_APP, WRTN1_QLY, WRTN2_APP, WRTN2_QLY, WRTN3_APP, WRTN3_QLY,INTVW_APP,SKILL_APP,SKILL_QLY, PET_APP, PET_QLY, DME_APP, DME_QLY, RME_APP, RME_QLY
  '4': 'ALLOC_CAT',
  '5': 'GENDER',
  '6': 'CAT2',
  '7': 'CAT3',
};// Note The parameters mentioned here have the same name as the names of the column in the database.Super but the order of their appearance is according to the order of the dropdown buttons in the frontend section. 

// This is a function that will be used by the program to create template and enter the city names and their student counts.
function updateExamCenters(cityStats) {
  const examCentersDiv = document.querySelector('.examcenters');
  
  // Clearing the existing content. So nothing from previous use stay here.  
  examCentersDiv.innerHTML = '';

  //when there is no cities to display, show the placeholder image
  if (Object.keys(cityStats).length === 0) {
    resetExamCenters();
    return;
  }

  // to create and appand city names and their counts
  for (const [city, data] of Object.entries(cityStats)) {
    const cityItem = document.createElement('div');
    cityItem.className = 'city-item';// basically it means <div class="city-item"></div>
    cityItem.innerHTML = `
      <h3 class="city-name">${city}</h3>
      <p class="city-count">Candidates Count: <span>${data.count ?? 0}</span></p>
      <p class="city-percentage">% of Seats: <span>${(data.percentageSeat ?? 0).toFixed(5)}</span>%</p>
      <p class="city-per-lakh">Per Lakh: <span>${(data.perLakh ?? 0).toFixed(5)}</span></p>
      <p class="percent-against-appeared">% against Appeared Candidate: <span>${data.percentageToPlace !== null ? data.percentageToPlace.toFixed(3):'percentagenotmapped'}</span>%</p>
    `;
    examCentersDiv.appendChild(cityItem);
  };
};
function updateStateExamCenters(state_Stats) {
  const examCentersDiv = document.querySelector('.examcenters');// this will remain the same for state or zone as it's the <div> where our city-item div or state-item div or zone-item div is present.

  //when there is no state to display, show the placeholder image
  if (Object.keys(state_Stats).length === 0) {
    //resetExamCenters(); since this code is already there for centers, we don't need it for states.
    return;
  }

  // to create and appand city names and their counts
  for (const [stateName, data] of Object.entries(state_Stats)) {
    const stateItem = document.createElement('div');
    stateItem.className = 'state-item';// basically it means <div class="state-item"></div>
    stateItem.innerHTML = `
      <h3 class="state-name">${stateName}</h3>
      <p class="state-count">Candidates Count: <span>${data.count}</span></p>
      <p class="state-percentage">% of Seats: <span>${data.percentageSeat.toFixed(5)}</span>%</p>
      <p class="state-per-lakh">Per Lakh: <span>${data.perLakh !== null ? data.perLakh.toFixed(5):'citycodenotmapped'}</span></p>
      <p class="percent-against-appeared">% against Appeared Candidate: <span>${data.percentageToPlace !== null ? data.percentageToPlace.toFixed(3):'percentagenotmapped'}</span>%</p>

    `;
    examCentersDiv.appendChild(stateItem);
  }
};


function updateZoneCenters(zoneStats) {
  const examCentersDiv = document.querySelector('.examcenters');// this will remain the same for state or zone as it's the <div> where our city-item div or state-item div or zone-item div is present.

  //when there is no state to display, show the placeholder image
  if (Object.keys(zoneStats).length === 0) {
    //resetExamCenters(); since this code is already there for centers, we don't need it for states.
    return;
  }

  // to create and appand city names and their counts
  for (const [zoneName, data] of Object.entries(zoneStats)) {
    const zoneItem = document.createElement('div');
    zoneItem.className = 'zone-item';// basically it means <div class="state-item"></div>
    zoneItem.innerHTML = `
      <h3 class="state-name">${zoneName}</h3>
      <p class="state-count">Candidates Count: <span>${data.count}</span></p>
      <p class="state-percentage">% of Seats: <span>${data.percentageSeat.toFixed(5)}</span>%</p>
      <p class="state-per-lakh">Per Lakh: <span>${data.perLakh.toFixed(5)}</span></p>
      <p class="percent-against-appeared">% against Appeared Candidate: <span>${data.percentageToPlace !== null ? data.percentageToPlace.toFixed(3):'percentagenotmapped'}</span>%</p>
    `;
    examCentersDiv.appendChild(zoneItem);
  }
};


// Function to reset exam centers and show placeholder image
function resetExamCenters() {
  const examCentersDiv = document.querySelector('.examcenters');
  examCentersDiv.innerHTML = '<img src="/img/biglogossc.png" alt="Logo" class="header__logo" />';
}

// to select the names of the dropdown value in the dropdown menu and also rest it. 
dropdownContainers.forEach(dropdown => {
  const span = dropdown.querySelector('.selected-value');
  const content = dropdown.querySelector('.dropdown-content');

  content.addEventListener('click', (event) => {
    event.preventDefault();

    const clickedValue = event.target.getAttribute('value');
    span.textContent = event.target.textContent;

    const dropdownIndex = dropdown.classList[1].split('__')[1];
    const parameterName = parameterMap[dropdownIndex];

    selectedValues[parameterName] = clickedValue;//SuperNote:VIE becouse of the absance of this code, the download button was getting no access to parameters that will help it fetch the data from database which it will download in the next stage.Backend was correct. it was a frontend problem

    span.setAttribute('data-value', clickedValue);
    span.setAttribute('data-param', parameterName);

    updateOKButtonState();
  });
});

const okButton = document.querySelector('.btn__1');

function updateOKButtonState() {
  const filledDropdowns = Array.from(dropdownContainers).filter(dropdown => 
    dropdown.querySelector('.selected-value').getAttribute('data-value') !== null
  );
  okButton.disabled = filledDropdowns.length === 0;
}

updateOKButtonState();

//Event listeners on OK button.
okButton.addEventListener('click', (e) => {
    e.preventDefault();
  const lockedSelectedValues = JSON.stringify(selectedValues, null, 2);
  console.log('Selected Values:', lockedSelectedValues);//VIECode Testing
});// VIESuper to check inputs comming from frontend. 

// Initialize default values for spans
dropdownContainers.forEach(dropdown => {
  const span = dropdown.querySelector('.selected-value');
  span.setAttribute('data-default', span.textContent);
});

//--------------for adding Component-Tooltip----------------------
//function to be called to show the tip tip on mouse hover start. 
function showComponentToolTip(event) {
  console.log('Called: showComponentToolTip');//Code Testing
  const tooltip = event.target.getAttribute('component-tooltip');// here we copied the text that was put as tool tip for that component.
  console.log('Tooltip text:',tooltip);//Code Testing
   
  let tooltipElement = document.createElement('div');// creating the div element where we shall put the contents of tooltip variable from above.
  tooltipElement.className = 'component-tooltip';//we are basically saying <div class="tooltip"></div> in this code.😊 we will use this class name in CSS. 
  tooltipElement.textContent = tooltip;// copying the text into the <div></div> we created.
  //code upgrade👇🏼 document.body.appendChild(tooltipElement);//attaching our <div></div> item where the hower is commited.
  document.body.appendChild(tooltipElement);

  const positionalDimensionDataOfElement = event.target.getBoundingClientRect();
  //SuperNoteLearnByHeart: positionalDimensionDataOfElement now contains data & properties like left, top, right, bottom, width, and height of the target element.
  const tooltipDimensions= tooltipElement.getBoundingClientRect();

  tooltipElement.style.left = `${positionalDimensionDataOfElement.left + positionalDimensionDataOfElement.width/2 - tooltipDimensions.width/2}px`;
  tooltipElement.style.top = `${positionalDimensionDataOfElement.top - tooltipDimensions.height-10}px`;
  
  tooltipElement.offsetHeight;//to force a reflow
  tooltipElement.classList.add('visible');
  console.log('Tooltip element:', tooltipElement);//Code Testing
  console.log('Tooltip style:',tooltipElement.style.cssText);//Code Testing
  
  
};// newly added 19/08/2024
// function to hide the tooltip if the hover ends. 
function hideComponentToolTip() {
  console.log('hideComponentToolTip called');// Code Testing
  
  const tooltipElement = document.querySelector('.component-tooltip');
  if (tooltipElement) {
    tooltipElement.classList.remove('visible');
    setTimeout(() => tooltipElement.remove(),800);
  }
};// newly added 19/08/2024
/*
// here we are handling the part where the mouse pointer hover or leaves.
document.addEventListener('DOMContentLoaded', () => {console.log('DOMContentLoaded event has been fired up🔫');//Code Testing

  const componenttooltipElement = document.querySelectorAll('[component-tooltip]');
 console.log('Number of tooltip element found:', componenttooltipElement.length);//Code Testing
  
  componenttooltipElement.forEach(element => {
    element.addEventListener('mouseenter', showComponentToolTip);// becouse we don't have 'mousehover' event as such in JS . instead we use the event like when mouseenter and when mouseleave🧑🏼
    element.addEventListener('mouseleave', hideComponentToolTip);
  });
});// newly added 19/08/2024
*/



//---- the function that will use the fetch function for API endpointVIE💀☠⚡----

async function fetchRecordCount(parameterObjData) {
  try {
    const response = await fetch(`${FETCHRECORDCOUNT_API_URL}`,
      {
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
};

// New async function to fetch venue statistics
async function fetchVenueStat(parameterObjData) {
  try {
    // const response = await fetch('http://127.0.0.1:3000/api/v1/venuerecords?limit=1170000&offset=0', {
      const response = await fetch(`${VENUESTATS_API_URL}?limit=${VENUESTATS_API_LIMIT}&offset=${VENUESTATS_API_OFFSET}`,{
    // const response = await fetch('http://127.0.0.1:3000/api/v1/venuerecords?limit=300000&offset=0', {// Note this code is in my laptop workstation. the limit has been kept low becouse my system can't handle higher limits>11,70,000
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parameterObjData),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    };

    const data = await response.json();
    if (data.records && data.records.city_stats) {
      updateExamCenters(data.records.city_stats);
      updateStateExamCenters(data.records.state_stats);
      updateZoneCenters(data.records.zone_stats);
    } else {
      console.error('Unexpected data structure:', data);
      resetExamCenters();
    }
  } catch (error) {
    console.error('Error fetching city stats:', error);
    resetExamCenters();
  }
}

// async funtion to fetch the data to populate summmaytable
let dataToBtn5, dataToBtn6;
async function fetchSummaryTable(parameterObjData,displayType = 'numbers') {
  try {
    // const response = await fetch('http://127.0.0.1:3000/api/v1/summarytablestats?limit=316000&offset=0',
    const response = await fetch(`${SUMMARYTABLE_API_URL}?limit=${SUMMARYTABLE_API_LIMIT}&offset=${SUMMARYTABLE_API_OFFSET}`,
      {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parameterObjData),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch the summarytablestats');
    }

    const data = await response.json();
    if (data.examname) {
      populateTable(data, displayType);
    } else {
      console.error('Unexpected data structure, 😨 ye kahaan se aaya bhai:', data);
      resetSummaryTable();
    };

    dataToBtn5=data;//newly added14/08/24
    dataToBtn6=data;//newly added14/08/24

  } catch (error) {
    console.error('Error while fetching😵summary table stats:', error);
    resetSummaryTable();
  }
};


// to call fetchRecordCount() function every time i press OK button. Actually to set the value in the "<span></span>" element. 
okButton.addEventListener('click', async (e) => {
  e.preventDefault();

const databaseOutput=document.querySelector('.databaseoutput');
const summaryTable=document.querySelector('.summarytable');

showLoading(databaseOutput);
showLoading(summaryTable);

  const parameterSendingToApi = {};
  dropdownContainers.forEach(dropdown => {
    const span = dropdown.querySelector('.selected-value');
    const value = span.getAttribute('data-value');
    const param = span.getAttribute('data-param');
    if (value !== null && param !== null) {
      parameterSendingToApi[param] = value;
    }
  });
    console.log('Selected Values:', JSON.stringify(parameterSendingToApi, null, 2));//VIECode Testing

  const recordCount = await fetchRecordCount(parameterSendingToApi);
  if (recordCount !== null) {
    document.getElementById('recordsOfData').textContent = recordCount;
  } else {
    console.error('fetch record count is not working. This error is comming from LOC 205 around');
  };

  const applicantCount = examApplicants[parameterSendingToApi.EXAMNAME] || 0;
  document.getElementById('noOfApplicant').textContent = applicantCount;
  console.log(parameterSendingToApi);//Code Testing
  
  try {
    // Fetching and update exam center stats
    await fetchVenueStat(parameterSendingToApi);
    //Fetching and updating the summary table in numbers by default
    await fetchSummaryTable(parameterSendingToApi,'numbers'); 
  }catch (error) {
   console.error('Error fetching data: ', error) 
  }finally{
    hideLoading(databaseOutput);
    hideLoading(summaryTable);
  }
});

// similarly CLEAR button functionaliyt
const clearButton = document.querySelector('.btn__2');

clearButton.addEventListener('click', (e) => {
  e.preventDefault();
  dropdownContainers.forEach(dropdown => {
    const span = dropdown.querySelector('.selected-value');
    span.textContent = span.getAttribute('data-default') || span.textContent;
    span.removeAttribute('data-value');
    span.removeAttribute('data-param');
  });
  
  updateOKButtonState();
  
  // to Reset the record if count is found to be 0
  document.getElementById('recordsOfData').textContent = '0';
  document.getElementById('noOfApplicant').textContent = '0';

  // reset exam centers and show placeholder image
  resetExamCenters();

  // to reset the summary table when clear button is clicked.
  resetSummaryTable();
});
// to initialize the span with value 0 every time page loads. looks neat. 
document.getElementById('recordsOfData').textContent = '0';
// Calling resetExamCenters on page load to show the placeholder image initially
document.addEventListener('DOMContentLoaded',()=>{resetExamCenters();});


document.querySelector('.btn__5').addEventListener('click', (e)=>{
  e.preventDefault();
  populateTable(dataToBtn5, 'numbers');//we aren't calling API in this code upgrade to bypass the Issue that we found👇🏼
});//Issue Found: what is being sent in parameterSendingToApi json formate. Becouse the browser is saying that there is somekind of problem with it. Hence, i think, we need to defined the header for CORS error resolution and body of the json formate to solve the issue of proper key:value pair, that is being sent after this button is clicked. So the same for .btn__6 as well. But first let's see what's going out there in  parameterSendingToApi at this point. Issue Resolved: since backend is sending number and percentage data on first fetch itself, why do any more fetch. hence is simply used the data that came with the first fetch in fetchSummaryTable() function. after fetching the data, it sends the to populateTable() in the frontend side only. So i directly use the data comming and populateTable() when .btn__5 or .btn__6 are pressed.😎 And the CORS has been addressed in the backend. the is no such problem in my code as such. ⚡

document.querySelector('.btn__6').addEventListener('click', (e) =>{ 
  // console.log(dataToBtn6);//Code Testing
  e.preventDefault();
  populateTable(dataToBtn6, 'percentage');
});

//----- To Add Data View functionality. 
// This function provides template to dress data comming from our API.

/*code in progress
const viewButton = document.querySelector('.btn__4');
let newTab=null;
function generateFormattedHTML(data, currentPage, totalPages) {
  const fields = ['EXAMNAME', 'REGID', 'ROLL', 'NAME', 'FATHERNAME', 'MOTHERNAME', 'DOB', 'GENDER', 'CAT1', 'CAT2', 'CAT3', 'WRTN1_APP', 'WRTN1_QLY', 'WRTN2_APP', 'WRTN2_QLY', 'WRTN3_APP', 'WRTN3_QLY', 'INTVW_APP', 'SKILL_APP', 'SKILL_QLY', 'PET_APP', 'PET_QLY', 'DME_APP', 'DME_QLY', 'RME_APP', 'RME_QLY', 'SELECTED', 'MARKS', 'ALLOC_POST', 'ALLOC_STAT', 'ALLOC_AREA', 'ALLOC_CAT', 'RANK', 'WITHHELD'];

  // to Check if data is coming or undfined or not an array
  if (!Array.isArray(data)) {
    return `
      <html>
        <body>
          <h1>Error: No data available</h1>
          <p>Please try again or contact support if the problem persists.</p>
        </body>
      </html>
    `;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Downloaded Exam Records</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 100%;
          margin: 0 auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          overflow-x: auto;
        }
        h1 {
          color: #333;
          text-align: center;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          padding: 8px;
          border: 1px solid #ddd;
          text-align: left;
          font-size: 14px;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        tr:hover {
          background-color: #f5f5f5;
        }
        .pagination {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        .pagination button {
          margin: 0 5px;
          padding: 5px 10px;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>All Exams Records:</h1>
        <table>
          <thead>
            <tr>
              ${fields.map(field => `<th>${field}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(record => `
              <tr>
                ${fields.map(field => `<td>${record[field] || ''}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="pagination">
          <button id="prevPage" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
          <span>Page ${currentPage} of ${totalPages}</span>
          <button id="nextPage" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
        </div>
      </div>
      <script>
        let currentPage = ${currentPage};
        let totalPages = ${totalPages};
        
        function changePage(newPage) {
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({ type: 'changePage', page: newPage }, '*');
          } else {
            // If in the same window, call viewRecords directly
            window.viewRecords(window.parameterSendingToApi, newPage);
          }
        }
        
        document.getElementById('prevPage').addEventListener('click', () => {
          if (currentPage > 1) {
            changePage(currentPage - 1);
          }
        });
        
        document.getElementById('nextPage').addEventListener('click', () => {
          if (currentPage < totalPages) {
            changePage(currentPage + 1);
          }
        });
      </script>
    </body>
    </html>
  `;
};

async function fetchRecords(parameterObjData, page = 1, limit = 100) {
  const offset = (page - 1) * limit;
  try {
    const response = await fetch(`http://127.0.0.1:3000/api/v1/records?limit=${limit}&offset=${offset}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parameterObjData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API Response:', result); // Log the entire response

    let data, totalRecords;

    if (Array.isArray(result)) {
      data = result;
      totalRecords = result.length;
    } else if (typeof result === 'object') {
      if (Array.isArray(result.data)) {
        data = result.data;
      } else if (Array.isArray(result.records)) {
        data = result.records;
      } else {
        throw new Error('No valid data array found in the response');
      }
      totalRecords = result.totalRecords || result.total || data.length;
    } else {
      throw new Error('Unexpected response format from server');
    }

    if (!data || data.length === 0) {
      throw new Error('No records found');
    }

    return { data, totalRecords };
  } catch (error) {
    console.error('Error in fetchRecords:', error);
    throw error;
  }
};

async function viewRecords(parameterObjData, page = 1) {
  try {
    const { data, totalRecords } = await fetchRecords(parameterObjData, page);
    const totalPages = Math.ceil(totalRecords / 100);
    
    const htmlContent = generateFormattedHTML(data, page, totalPages);
    
    if (newTab && !newTab.closed) {
      newTab.close();
    }
    
    newTab = window.open('', '_blank');
    
    if (!newTab) {
      console.warn('Unable to open a new tab. Displaying data in the current window.');
      document.body.innerHTML = htmlContent;
      const scriptContent = htmlContent.match(/<script>([\s\S]*)<\/script>/)[1];
      eval(scriptContent);
    } else {
      newTab.document.open();
      newTab.document.write(htmlContent);
      newTab.document.close();
    }

    // Set up message listener for pagination
    window.removeEventListener('message', handlePageChange);
    window.addEventListener('message', handlePageChange);

  } catch (error) {
    console.error('Error fetching or displaying data:', error);
    const errorMessage = `
      <h1>Error</h1>
      <p>${error.message}</p>
      <p>Please try again or contact support if the problem persists.</p>
    `;
    document.body.innerHTML = errorMessage;
  }
};
async function handlePageChange(event) {
  if (event.data && event.data.type === 'changePage') {
    await viewRecords(window.parameterSendingToApi, event.data.page);
  }
}

viewButton.addEventListener('click', async () => {
  const parameterSendingToApi = {...selectedValues};
  await viewRecords(window.parameterSendingToApi);
});
*/

//working code
function generateFormattedHTML(data) {
  const fields = ['EXAMNAME', 'REGID', 'ROLL', 'NAME', 'FATHERNAME', 'MOTHERNAME', 'DOB', 'GENDER', 'CAT1', 'CAT2', 'CAT3', 'WRTN1_APP', 'WRTN1_QLY', 'WRTN2_APP', 'WRTN2_QLY', 'WRTN3_APP', 'WRTN3_QLY', 'INTVW_APP', 'SKILL_APP', 'SKILL_QLY', 'PET_APP', 'PET_QLY', 'DME_APP', 'DME_QLY', 'RME_APP', 'RME_QLY', 'SELECTED', 'MARKS', 'ALLOC_POST', 'ALLOC_STAT', 'ALLOC_AREA', 'ALLOC_CAT', 'RANK', 'WITHHELD'];

  // console.log(data[0]);// Code Testing {EXAMNAME: 'AWO/TPO-2022', REGID: '40000295702', ROLL: '1402000028', NAME: 'SWEETY', FATHERNAME: 'MAHAVIR SINGH', …}

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <link
        href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,600,700"
        rel="stylesheet"
      />
      <title>SSC Exam Records</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 100%;
          margin: 0 auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          overflow-x: auto;
        }
        h1 {
          color: #333;
          text-align: center;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          padding: 8px;
          border: 1px solid #ddd;
          text-align: left;
          font-size: 14px;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        tr:hover {
          background-color: #f5f5f5;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${data[0].EXAMNAME} Exam Records:</h1>
        <table>
          <thead>
            <tr>
              ${fields.map(field => `<th>${field}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(record => `
              <tr>
                ${fields.map(field => `<td>${record[field] || ''}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </body>
    </html>
  `;
}; 


const viewButton = document.querySelector('.btn__4');
//here we are calling the api endpoint in viewRecords function
async function viewRecords(parameterObjData){
try {//beyond limit=35000, even HPZ2 started failing. heap out of memory thing.
    // const response = await fetch('http://127.0.0.1:3000/api/v1/records?limit=35000&offset=0',
      const response = await fetch(`${VIEWRECORDS_API_URL}?limit=${VIEWRECORDS_API_LIMIT}&offset=${VIEWRECORDS_API_OFFSET}`,
      {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parameterObjData),
    });
    const data = await response.json();
    
    const newTab = window.open('', '_blank');
    newTab.document.write(generateFormattedHTML(data));//Issue Found
    newTab.document.close();
  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Failed to fetch data. Please try again.');
  }
};
console.log(selectedValues);//Code Testing


//here eventlisteners are being pasted upon the ViewButton.
viewButton.addEventListener('click', async (e) => {
  e.preventDefault();
  const parameterSendingToApi = {...selectedValues};
  console.log(parameterSendingToApi, selectedValues);//Code Testing
  await viewRecords(parameterSendingToApi);
});



//------To Add Download functionality. 😨Complicated thing. 

const downloadButton = document.querySelector('.btn__3');
async function downloadRecords(parameterObjData) {
  console.log(parameterObjData);
  try {
    const response = await fetch(`${DOWNLOADRECORDS_API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parameterObjData),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'SSCEXAMRECORDS_downloaded_file.zip';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to download records. Please try again.');
  }
}
/*legacy code👇code upgrade👆
async function downloadRecords(parameterObjData) {
  console.log(parameterObjData);// Code Testing  
  try {
    // const response = await fetch('http://127.0.0.1:3000/api/v1/downloadrecords',
    const response = await fetch(`${DOWNLOADRECORDS_API_URL}`,
      {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parameterObjData),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    // Get the filename from the Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'SSCRADHE_downloaded_file.zip'; // changes this filename for production
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link and trigger the download
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to download records. Please try again.');
  }
};
*/
downloadButton.addEventListener('click', async (e) => {
  e.preventDefault();
  const parameterSendingToApi = {...selectedValues};
  console.log(selectedValues);//Code Testing
  console.log(parameterSendingToApi);//Code Testing
  
  await downloadRecords(parameterSendingToApi);
});


export { selectedValues };