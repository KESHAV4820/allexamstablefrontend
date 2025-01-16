import { populateExamDropdown } from "./examDropDownupdate.js";

export function showConfirmationModal(message, onConfirm) {
    const confirmationModal =document.querySelector('.database-update-confirmation');
    //  document.getElementById('confirmationModal');
    const confirmButton = document.getElementById('confirmDBUpdate'); // More generic name
    const cancelButton = document.getElementById('cancelDBUpdate'); // More generic name
    const messageElement = confirmationModal.querySelector('.dbupdate-confirmation-message');

    if (!confirmationModal || !confirmButton || !cancelButton || !messageElement) {
        console.error("Confirmation elements not found in the DOM.");
        return; // Important: Exit if elements are not found
    }

    confirmationModal.style.display = 'block';
    messageElement.textContent = message || "Are you sure?"; // Default message

    const handleConfirm = () => {
        confirmationModal.style.display = 'none';
        confirmButton.removeEventListener('click', handleConfirm);
        cancelButton.removeEventListener('click', handleCancel);
        if (typeof onConfirm === 'function') { // Check if onConfirm is a function
            onConfirm(); // Call the provided callback
        };
    };

    const handleCancel = () => {
        confirmationModal.style.display = 'none';
        confirmButton.removeEventListener('click', handleConfirm);
        cancelButton.removeEventListener('click', handleCancel);
    };

    confirmButton.addEventListener('click', handleConfirm);
    cancelButton.addEventListener('click', handleCancel);
}

// Function to create the modal HTML if it doesn't exist
export function createConfirmationModal() {
    if (document.querySelector('.database-update-confirmation')) return; // Prevent creating twice

    const dbUpdateConfirmationModelHTML = `
        <div id="confirmationModal" class="database-update-confirmation">
        <div class="dbupdate-confrimation-content">
            <p class="dbupdate-confirmation-message">This button should be used only after database updation to get the new exam records or redacted exam name list after removal of some records. Press this button only in these conditions. Do you want to proceed?</p>
            <div class="confrimation-inner-buttons">
              <button id="confirmDBUpdate">UPDATE</button>
              <button id="cancelDBUpdate">CANCEL</button>
            </div>
        </div>
    </div> 
    `;
    document.body.insertAdjacentHTML('beforeend', dbUpdateConfirmationModelHTML);
}