'use strict';
// SuperNote: always push the code to git after pulling the code from repo. code for pulling the code is 👉 git pull origin mirrorverse . where mirror verse is the name of the branch. you need to tell this or it will throw warning/error message.
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
  'CAPF-2023': 'N/A',  // No data provided
  'CGL-2016': 3803748,
  'CGL-2017': 2928826,
  'CGL-2018': 2597431,
  'CGL-2019': 2177843,
  'CGL-2020': 2209867,
  'CGL-2021': 1963324,
  'CGL-2022': 3355194,
  'CGL-2023': 'N/A',  // No data provided
  'CHSL-2017': 6111719,
  'CHSL-2018': 2968655,
  'CHSL-2019': 4168750,
  'CHSL-2020': 3898378,
  'CHSL-2021': 3669524,
  'CHSL-2022': 3197965,
  'CHSL-2023': 'N/A',  // No data provided
  'CONSTABLE-2018': 5236810,
  'CONSTABLE-2021': 7174579,
  'CONSTABLE-2022': 5359277,
  'DPCST-2016': 195860,
  'DPCST-2020': 2896045,
  'DPCST-2023': 'N/A',  // No data provided
  'DPDVR-2022': 194704,
  'HC(MIN)IN DP-2022': 2228593,
  'IMD-2017': 475093,
  'JE-2016': 622041,
  'JE-2017': 995350,
  'JE-2018': 813622,
  'JE-2019': 806078,
  'JE-2020': 667589,
  'JE-2022': 600775,
  'JE-2023': 'N/A',  // No data provided
  'JHT-2016': 25298,
  'JHT-2017': 29131,
  'JHT-2018': 49651,
  'JHT-2019': 89821,
  'JHT-2020': 13515,
  'JHT-2022': 9444,
  'JHT-2023': 'N/A',  // No data provided
  'LDC-D-2017': 'N/A',  // No data provided
  'LDC-D-2018': 958,
  'MTS-2016': 6975285,
  'MTS-2019': 3869446,
  'MTS-2020': 4534810,
  'MTS-2021': 3797357,
  'MTS-2022': 'N/A',  // No data provided
  'MTS-2023': 'N/A',  // No data provided
  'SA_IMD-2022': 241276,
  'STENO-2016': 457680,
  'STENO-2017': 541900,
  'STENO-2018': 438905,
  'STENO-2019': 513597,
  'STENO-2020': 512172,
  'STENO-2022': 498884,
  'STENO-2023': 'N/A',  // No data provided
  'STENO-D-2017': 435,
  'UDC-D-2017': 80
};// in absence of data in database, we decided to hardcode the number of applicants for each exam. So we are putting the data in the script. 

const parameterMap = {
  '1': 'EXAMNAME',
  '2': 'CAT1',
  '3': 'SELECTED',
  '4': 'ALLOC_CAT',
  '5': 'GENDER',
  '6': 'CAT2',
  '7': 'CAT3',
};

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
      <p class="state-per-lakh">Per Lakh: <span>${data.perLakh.toFixed(5)}</span></p>
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
    `;
    examCentersDiv.appendChild(zoneItem);
  }
};


// Function to reset exam centers and show placeholder image
function resetExamCenters() {
  const examCentersDiv = document.querySelector('.examcenters');
  examCentersDiv.innerHTML = '<img src="/img/testing.png" alt="Logo" class="header__logo" />';
}


dropdownContainers.forEach(dropdown => {
  const span = dropdown.querySelector('.selected-value');
  const content = dropdown.querySelector('.dropdown-content');

  content.addEventListener('click', (event) => {
    event.preventDefault();

    const clickedValue = event.target.getAttribute('value');
    span.textContent = event.target.textContent;

    const dropdownIndex = dropdown.classList[1].split('__')[1];
    const parameterName = parameterMap[dropdownIndex];

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

okButton.addEventListener('click', () => {

  const lockedSelectedValues = JSON.stringify(selectedValues, null, 2);
  console.log('Selected Values:', lockedSelectedValues);//VIECode Testing
});// VIESuper to check inputs comming from frontend. 

// Initialize default values for spans
dropdownContainers.forEach(dropdown => {
  const span = dropdown.querySelector('.selected-value');
  span.setAttribute('data-default', span.textContent);
});





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
};

// New async function to fetch venue statistics
async function fetchVenueStat(parameterObjData) {
  try {
    const response = await fetch('http://127.0.0.1:3000/api/v1/venuerecords?limit=1170000&offset=0', {
    // const response = await fetch('http://127.0.0.1:3000/api/v1/venuerecords?limit=300000&offset=0', {// Note this code is in my laptop workstation. the limit has been kept low becouse my system can't handle higher limits>11,70,000

    // const response = await fetch('http://127.0.0.1:3000/api/v1/venuerecords?limit=60000000&offset=0', {//Note this code has been used in HP workstation.
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

// to call fetchRecordCount() function every time i press OK button. Actually to set the value in the "<span></span>" element. 
okButton.addEventListener('click', async (e) => {
  e.preventDefault();
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
  }

  const applicantCount = examApplicants[parameterSendingToApi.EXAMNAME] || 0;
  document.getElementById('noOfApplicant').textContent = applicantCount;

  
  // Fetching and update exam center stats
  await fetchVenueStat(parameterSendingToApi);
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
});
// to initialize the span with value 0 every time page loads. looks neat. 
document.getElementById('recordsOfData').textContent = '0';
// Calling resetExamCenters on page load to show the placeholder image initially
document.addEventListener('DOMContentLoaded',()=>{resetExamCenters();});


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
      <title>Exam Records</title>
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
      </div>
    </body>
    </html>
  `;
}; 


const viewButton = document.querySelector('.btn__4');
//here we are calling the api endpoint in viewRecords function
async function viewRecords(parameterObjData){
try {//beyond limit=35000, even HPZ2 started failing. heap out of memory thing.
    const response = await fetch('http://127.0.0.1:3000/api/v1/records?limit=35000&offset=0',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parameterObjData),
    });
    const data = await response.json();
    
    const newTab = window.open('', '_blank');
    newTab.document.write(generateFormattedHTML(data));
    newTab.document.close();
  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Failed to fetch data. Please try again.');
  }
};
//here eventlisteners are being pasted upon the ViewButton.
viewButton.addEventListener('click', async () => {
  const parameterSendingToApi = {...selectedValues};
  await viewRecords(parameterSendingToApi);
});


/* 
let limit=100;

function generateFormattedHTML(data) {
  const fields = ['EXAMNAME', 'REGID', 'ROLL', 'NAME', 'FATHERNAME', 'MOTHERNAME', 'DOB', 'GENDER', 'CAT1', 'CAT2', 'CAT3', 'WRTN1_APP', 'WRTN1_QLY', 'WRTN2_APP', 'WRTN2_QLY', 'WRTN3_APP', 'WRTN3_QLY', 'INTVW_APP', 'SKILL_APP', 'SKILL_QLY', 'PET_APP', 'PET_QLY', 'DME_APP', 'DME_QLY', 'RME_APP', 'RME_QLY', 'SELECTED', 'MARKS', 'ALLOC_POST', 'ALLOC_STAT', 'ALLOC_AREA', 'ALLOC_CAT', 'RANK', 'WITHHELD'];

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
      <title>Exam Records</title>
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
        <h1>All Exams Table Records:</h1>
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
async function viewRecords(parameterObjData, currentOffset){
try {
    const response = await fetch(`http://127.0.0.1:3000/api/v1/records?limit=100&offset=${currentOffset}`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parameterObjData),
    });
    const data = await response.json();
    
    const newTab = window.open('', '_blank');
    newTab.document.write(generateFormattedHTML(data));
    newTab.document.close();
  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Failed to fetch data. Please try again.');
  }
};
viewButton.addEventListener('click', async () => {
  const parameterSendingToApi = {...selectedValues};
  const newOffSet = limit+100;
  await viewRecords(parameterSendingToApi,newOffSet);
});
*/

//------To Add Download functionality. 😨Complicated thing. 

const downloadButton = document.querySelector('.btn__3');

async function downloadRecords(parameterObjData) {
  try {
    const response = await fetch('http://127.0.0.1:3000/api/v1/downloadrecords', {
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
    let filename = 'data.zip'; // Default filename
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
};//newly added

downloadButton.addEventListener('click', async () => {
  const parameterSendingToApi = {...selectedValues};
  await downloadRecords(parameterSendingToApi);
});

/* Bug Found legacy code 
const downloadButton = document.querySelector('.btn__3');

async function triggerDownload(parameterObjData) {
  try {
    const response = await fetch('http://127.0.0.1:3000/api/v1/downloadrecords', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parameterObjData),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    // Check if the download was successful
    const result = await response.json();
    if (result.success) {
      alert('Download successful. Check your D drive for the data.zip file.');
    } else {
      throw new Error('Download failed on the server side');
    }
  } catch (error) {
    console.error('Error:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', await error.response.text());
    }
    alert('Failed to initiate download. Please try again.');
  }
}

downloadButton.addEventListener('click', async () => {
  const parameterSendingToApi = {...selectedValues};
  await triggerDownload(parameterSendingToApi);
});
*/

export { selectedValues };