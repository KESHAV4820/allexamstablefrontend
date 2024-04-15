'use strict';





const printButton = document.querySelector('.btn__3');


printButton.addEventListener('click', (e) => {
  // Get the content of the .databaseoutputarea div
  e.preventDefault();
  const databaseOutputArea = document.querySelector('.databaseoutputarea').innerHTML;
  const printWindow = window.open('', '', 'height=800,width=1200');// Creating new window object. Knowledge Gap need to work on the first two parameters. Resolved: now i know every thing about all the three parameters of window.open().🐱‍🏍

  

  // Write the HTML content to the new window
    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Output</title>
        <style>
          /* Add any necessary styles for the print view */
        </style>
      </head>
      <body>
        ${databaseOutputArea}
      </body>
    </html>
  `);

  
  printWindow.document.close();// After printing the content of the print windows, you have to explicitly close the print window using close() method.
  printWindow.print();

  printWindow.close();
});