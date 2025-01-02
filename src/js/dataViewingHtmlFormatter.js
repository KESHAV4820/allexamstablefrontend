
/*forced stop original working code
function generateFormattedHTML(data) {
    const fields = ['EXAMNAME', 'REGID', 'ROLL', 'NAME', 'FATHERNAME', 'MOTHERNAME', 'DOB', 'GENDER', 'CAT1', 'CAT2', 'CAT3', 'WRTN1_APP', 'WRTN1_QLY', 'WRTN2_APP', 'WRTN2_QLY', 'WRTN3_APP', 'WRTN3_QLY', 'INTVW_APP', 'SKILL_APP', 'SKILL_QLY', 'PET_APP', 'PET_QLY', 'DME_APP', 'DME_QLY', 'RME_APP', 'RME_QLY', 'SELECTED', 'MARKS', 'ALLOC_POST', 'ALLOC_STAT', 'ALLOC_AREA', 'ALLOC_CAT', 'RANK', 'WITHHELD'];
  
    // console.log(data[0]);// Code Testing {EXAMNAME: 'AWO/TPO-2022', REGID: '40000295702', ROLL: '1402000028', NAME: 'SWEETY', FATHERNAME: 'MAHAVIR SINGH', …}
    
    console.log(data);// Code Testing
    
  
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
 */ 

/* newly added 2/1/24 forced stop
  function generateFormattedHTML(data) {
    const fields = ['EXAMNAME', 'REGID', 'ROLL', 'NAME', 'FATHERNAME', 'MOTHERNAME', 'DOB', 'GENDER', 'CAT1', 'CAT2', 'CAT3', 'WRTN1_APP', 'WRTN1_QLY', 'WRTN2_APP', 'WRTN2_QLY', 'WRTN3_APP', 'WRTN3_QLY', 'INTVW_APP', 'SKILL_APP', 'SKILL_QLY', 'PET_APP', 'PET_QLY', 'DME_APP', 'DME_QLY', 'RME_APP', 'RME_QLY', 'SELECTED', 'MARKS', 'ALLOC_POST', 'ALLOC_STAT', 'ALLOC_AREA', 'ALLOC_CAT', 'RANK', 'WITHHELD'];
  
    console.log('Data received in generateFormattedHTML:', data); // Code Testing
    
    if (!Array.isArray(data) || data.length === 0) {
        return '<div class="container"><h1>No records found</h1></div>';
    };

    try {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge" />
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
            </body>
            </html>
        `;
    } catch (error) {
        console.error('Error generating HTML:', error);
        return `
            <div class="container">
                <h1>Error displaying records</h1>
                <p>Error: ${error.message}</p>
            </div>
        `;
    };
};
*/
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