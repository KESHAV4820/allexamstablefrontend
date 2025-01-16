// Function to populate dropdown with exam names
function populateExamDropdown(examNames) {
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
    
    // to clear what ever existed before this point in time.
    dropdownContent.innerHTML = '';
    
    
    // const updatedExamNameReceived = [...examNames];// Usless Codingcode upgrade
    
    // Creating and appending anchor elements for each exam
    [...examNames].forEach(examName => {
      const anchor = document.createElement('a');
      anchor.href = '#';
      anchor.setAttribute('value', examName);
      anchor.textContent = examName;
      dropdownContent.appendChild(anchor);
    });
  }

  export {populateExamDropdown};