'use strict';

/* --------for collecting the outputs of all dropdown menu---------- */
export const selectedValues = []; // Array to store selected values
let allSelected = false; // Flag to track wether all dropdowns have selections

const dropdownContainers = document.querySelectorAll('.dropdown-container .dropdown');
//Code Testing console.log(`${Array.from(dropdownContainers)}`);


dropdownContainers.forEach(dropdown => {
  const span = dropdown.querySelector('.selected-value');
  console.log(`${span}`);
  
  const content = dropdown.querySelector('.dropdown-content');

  content.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default link behavior

    const clickedValue = event.target.textContent;
    span.textContent = clickedValue;

    // Update selectedValues array
    const dropdownIndex = dropdown.classList[1].split('__')[1];
    selectedValues[dropdownIndex - 1] = clickedValue;

    // Check if all dropdowns have selections
    allSelected = selectedValues.every(value => value !== undefined);
    updateOKButtonState();
  });
});

const okButton = document.querySelector('.btn__1');

function updateOKButtonState() {
  okButton.disabled = !allSelected;
}

updateOKButtonState(); // Initial button state based on existing selections

okButton.addEventListener('click', () => {
  console.log('Selected Values:', selectedValues.join(', '));
});



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












/*------------attempting database connection */

const pgpromise = require('pg-promise')({ /* Initialization options */ });

const connectionString = 'postgres://your_username:your_password@your_host:your_port/your_database'; // Replace with your connection details

const downloadData = async () => {
  // Get user selections (replace with your logic)
  const filter = document.getElementById('filter').value;

  let query = 'SELECT * FROM student_finance';
  if (filter !== 'all') {
    query += ' WHERE status = $1';
  }

  try {
    const db = pgpromise(connectionString);
    const data = await db.any(query, (filter !== 'all') ? ['passed'] : []);

    // Convert data to CSV format (replace with your preferred format)
    let csvContent = 'Aadharcard,Roll_number,Pan_card,Student_Name\n';
    data.forEach(row => {
      csvContent += `${row.Aadharcard},${row.Roll_number},${row.Pan_card},${row.Student_Name}\n`;
    });

    // Create a downloadable blob (binary large object)
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    // Simulate a click on a downloadable link
    const link = document.createElement('a');
    link.href = url;
    link.download = 'student_data.csv';
    link.click();

    // Cleanup the temporary URL
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading data:', error);
    // Handle errors gracefully (e.g., display an error message to the user)
  }
};



  