'use strict';


// this function is meant to poplate the table based on the choice :- numbers or percentage

async function populateTable(stats, displayType = 'numbers') {
  // console.log(stats,displayType);//Code Testing
  
    const mapping = [
      { row: "CANDIDATES", data: displayType === 'numbers' ? stats.candidates : stats.candidates_per },
      { row: "MALES", data: displayType === 'numbers' ? stats.male : stats.male_per },
      { row: "FEMALES", data: displayType === 'numbers' ? stats.female : stats.female_per },
      { row: "ESM", data: displayType === 'numbers' ? stats.esm_candidates : stats.esm_candidates_per },
      { row: "ESM MALES", data: displayType === 'numbers' ? stats.esm_male : stats.esm_male_per },
      { row: "ESM FEMALES", data: displayType === 'numbers' ? stats.esm_female : stats.esm_female_per },
      { row: "OH", data: displayType === 'numbers' ? stats.oh_candidates : stats.oh_candidates_per },
      { row: "OH MALES", data: displayType === 'numbers' ? stats.oh_male : stats.oh_male_per },
      { row: "OH FEMALES", data: displayType === 'numbers' ? stats.oh_female : stats.oh_female_per },
      { row: "HH", data: displayType === 'numbers' ? stats.hh_candidates : stats.hh_candidates_per },
      { row: "HH MALES", data: displayType === 'numbers' ? stats.hh_male : stats.hh_male_per },
      { row: "HH FEMALES", data: displayType === 'numbers' ? stats.hh_female : stats.hh_female_per },
      { row: "VH", data: displayType === 'numbers' ? stats.vh_candidates : stats.vh_candidates_per },
      { row: "VH MALES", data: displayType === 'numbers' ? stats.vh_male : stats.vh_male_per },
      { row: "VH FEMALES", data: displayType === 'numbers' ? stats.vh_female : stats.vh_female_per },
      { row: "PWD", data: displayType === 'numbers' ? stats.pwd_candidates : stats.pwd_candidates_per },
      { row: "PWD MALES", data: displayType === 'numbers' ? stats.pwd_male : stats.pwd_male_per },
      { row: "PWD FEMALES", data: displayType === 'numbers' ? stats.pwd_female : stats.pwd_female_per },
    ];
  
    const categories = ["total", "gen", "sc", "st", "obc", "ews"];
  
    // Create the table HTML
    let tableHTML = `
      <table border="1">
        <tr>
          <th>${stats.examname?stats.examname:`EXAM NAME:`}</th>
          <th>TOTAL</th>
          <th>GEN</th>
          <th>SC</th>
          <th>ST</th>
          <th>OBC</th>
          <th>EWS</th>
        </tr>
    `;
  
    mapping.forEach(item => {
      tableHTML += '<tr>';
      tableHTML += `<td>${item.row}</td>`;
      categories.forEach(category => {
        // const value = item.data[category] || '';
        // const formattedValue = displayType === 'percentage' ? `${value.toFixed(4)}%` : value;
        // tableHTML += `<td>${formattedValue}</td>`;
        const value = item.data[category];
      let formattedValue;
      if (typeof value === 'number') {
        formattedValue = displayType === 'percentage' ? `${value.toFixed(4)}%` : value.toString();
      } else if (value === undefined || value === null) {
        formattedValue = '-';
      } else {
        formattedValue = value.toString();
      }
      tableHTML += `<td>${formattedValue}</td>`;
      });
      tableHTML += '</tr>';
    });
  
    tableHTML += '</table>';
  
    // Insert the table into the div
    const summaryTableDiv = document.querySelector('div.summarytable');
    if (summaryTableDiv) {
      summaryTableDiv.innerHTML = tableHTML;
    } else {
      console.error('Div with class "summarytable" not found');
    }
  }

//Reseting the summary table
function resetSummaryTable() {
    const summaryTableDiv = document.querySelector('div.summarytable');
    if (summaryTableDiv) {
      summaryTableDiv.innerHTML = '<p>No data available</p>';
    }
}; 
export {populateTable, resetSummaryTable};
