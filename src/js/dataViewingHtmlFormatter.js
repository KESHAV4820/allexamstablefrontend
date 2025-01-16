// ================================================================================
// TO DRESS THE DATA COMMING FROM API OR BACKEND FOR VIEWING
// ================================================================================
function generateFormattedHTML(data) {
  const fields = ['EXAMNAME', 'REGID', 'ROLL', 'NAME', 'FATHERNAME', 'MOTHERNAME', 'DOB', 'GENDER', 'CAT1', 'CAT2', 'CAT3', 'WRTN1_APP', 'WRTN1_QLY', 'WRTN2_APP', 'WRTN2_QLY', 'WRTN3_APP', 'WRTN3_QLY', 'INTVW_APP', 'SKILL_APP', 'SKILL_QLY', 'PET_APP', 'PET_QLY', 'DME_APP', 'DME_QLY', 'RME_APP', 'RME_QLY', 'SELECTED', 'MARKS', 'ALLOC_POST', 'ALLOC_STAT', 'ALLOC_AREA', 'ALLOC_CAT', 'RANK', 'WITHHELD'];

  console.log('Data received in generateFormattedHTML:', data);//Code Testing
  
  if (!Array.isArray(data) || data.length === 0) {
      return '<div class="records-wrapper"><h1>No records found</h1></div>';
  };

  try {
      return `
              <div class="records-wrapper">
                  <h1>${data[0]?.EXAMNAME} Exam Records</h1>
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
      `;
  } catch (error) {
      console.error('Error generating HTML:', error);
      return `
          <div class="records-wrapper">
              <h1>Error displaying records</h1>
              <p>Error: ${error.message}</p>
          </div>
      `;
  };
};

export { generateFormattedHTML };