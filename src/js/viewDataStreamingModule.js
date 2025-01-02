import { VIEWRECORDSBYSTREAMING_API_URL, VIEWRECORDSBYSTREAMING_BATCHSIZE } from "./config.js";
import { generateFormattedHTML } from "./dataViewingHtmlFormatter.js";

// viewDataStreamingModule.js

// Constants
const RECORD_FIELDS = [
    // Fields defining the structure of a record
    'EXAMNAME', 'REGID', 'ROLL', 'NAME', 'FATHERNAME', 'MOTHERNAME', 
    'DOB', 'GENDER', 'CAT1', 'CAT2', 'CAT3', 
    'WRTN1_APP', 'WRTN1_QLY', 'WRTN2_APP', 'WRTN2_QLY', 
    'WRTN3_APP', 'WRTN3_QLY', 'INTVW_APP', 'SKILL_APP', 
    'SKILL_QLY', 'PET_APP', 'PET_QLY', 'DME_APP', 'DME_QLY', 
    'RME_APP', 'RME_QLY', 'SELECTED', 'MARKS', 'ALLOC_POST', 
    'ALLOC_STAT', 'ALLOC_AREA', 'ALLOC_CAT', 'RANK', 'WITHHELD'
];

// Class to manage streaming records from a server
class StreamingRecordsManager {
    constructor(filterParams, fields = RECORD_FIELDS) {
        // Configuration of API URL and default fields for the records
        this.apiUrl =VIEWRECORDSBYSTREAMING_API_URL;
        this.filterParams = filterParams;
        this.fields = fields;
        
        // Initial state variables
        this.isLoading = false; // Tracks if records are being fetched
        this.hasMore = true; // Indicates if there are more records to load
        this.currentOffset = 0; // Tracks the offset for fetching records
        this.batchSize = VIEWRECORDSBYSTREAMING_BATCHSIZE;//50; // Number of records to fetch per batch
        this.abortController = null; // Controller to cancel ongoing requests
        this.allRecords = []; // Stores all fetched records
        this.newTab = null; // Reference to the new browser tab for the stream
        this.recordBuffer = []; // Temporary buffer for records
        
        // Scroll behavior settings
        this.scrollThreshold = 200; // Pixels from the bottom to trigger loading
        this.handleScroll = this.debounce(this.checkScrollPosition.bind(this), 150); // Debounced scroll handler
        this.cleanup = this.cleanup.bind(this); // Ensures proper cleanup of resources
        this.totalRecords = null;
        this.recordsReceived = 0;
        
        this.init(); // Initialize the streaming process
    }

    // Sets up the basic HTML for the streaming tab
    setupInitialHTML() {
        const css = `
            body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 20px; 
                background-color: #f4f4f4;
            }
            #loading { 
                text-align: center; 
                padding: 20px; 
                position: sticky;
                bottom: 0;
                background: rgba(255, 255, 255, 0.9);
            }
            .error { 
                color: red; 
                text-align: center; 
                padding: 20px; 
            }
            #records-count { 
                position: fixed; 
                top: 10px; 
                right: 10px; 
                background: #333; 
                color: white; 
                padding: 5px 10px; 
                border-radius: 5px;
                z-index: 1000;
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
            .records-wrapper {
                margin-bottom: 20px;
            }
            h2 {
                color: #333;
                text-align: center;
                margin: 20px 0;
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
                position: sticky;
                top: 0;
                z-index: 10;
            }
            tr:nth-child(even) {
                background-color: #f9f9f9;
            }
            tr:hover {
                background-color: #f5f5f5;
            }
        `;

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Streaming Records</title>
                <style>${css}</style>
            </head>
            <body>
                <div id="records-count">Records: 0</div>
                <div class="container"></div>
                <div id="loading">Starting stream...</div>
            </body>
            </html>
        `;

        this.newTab.document.write(html);
        this.newTab.document.close();
    };

    // Initialization logic, opens a new tab and sets up event listeners
    init() {
        this.newTab = window.open('', '_blank'); // Opens a new blank tab
        this.setupInitialHTML(); // Sets up the initial HTML structure in the tab
        this.newTab.addEventListener('scroll', this.handleScroll); // Adds a scroll event listener
        window.addEventListener('unload', this.cleanup); // Ensures cleanup when the window is unloaded
        this.loadMoreRecords(); // Starts loading records immediately
    };

    // Checks the scroll position and loads more records if near the bottom
    checkScrollPosition() {
        if (!this.newTab || this.newTab.closed) return; // Ensures the tab is valid
        
        const scrollPosition = this.newTab.scrollY; // Current scroll position
        const windowHeight = this.newTab.innerHeight; // Height of the viewport
        const documentHeight = this.newTab.document.documentElement.scrollHeight; // Total document height
        
        // Loads more records if the user scrolls near the bottom
        if (documentHeight - (scrollPosition + windowHeight) < this.scrollThreshold) {
            this.loadMoreRecords();
        }
    }

    // Loads more records from the server in batches
    async loadMoreRecords() {
        if (this.isLoading || !this.hasMore) return; // Prevents redundant calls
        this.isLoading = true;

        try {
            if (this.abortController) {
                this.abortController.abort(); // Cancels any ongoing fetch
            }

            this.abortController = new AbortController(); // Creates a new abort controller
            
            // Makes a POST request to fetch records with the filter parameters
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Client-Id': crypto.randomUUID() // Generates a unique client ID
                },
                body: JSON.stringify({
                    filters: this.filterParams,
                    offset: this.currentOffset,
                    limit: this.batchSize
                }),
                signal: this.abortController.signal // Attaches the abort signal
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); // Handles errors

            // Get total records count from header if available
            if (this.totalRecords=== null) {
                const totalCount = response.headers.get('X-Total-Count');
                if (totalCount) {
                    this.totalRecords=parseInt(totalCount, 10);
                };
            };

            let recordCount = 0;
            const reader = response.body
                .pipeThrough(new TextDecoderStream()) // Decodes the response stream
                .getReader(); // Reads the decoded stream

            // Reads the streamed response and processes records
            while (true) {
                const { done, value } = await reader.read();
                if (done) break; // Stops when the stream ends
                
                const records = value.split('\n\n') // Splits response into events
                    .filter(event => event.startsWith('data: ')) // Filters valid events
                    .map(event => {
                        try {
                            return JSON.parse(event.replace('data: ', '')); // Parses JSON data
                        } catch (error) {
                            console.error('Parse error:', error); // Logs parse errors
                            return null;
                        }
                    })
                    .filter(Boolean); // Removes null values

                recordCount += records.length; // Updates the record count
                this.recordsReceived += records.length;
                this.allRecords.push(...records); // Adds new records to the main array
                this.renderRecords(true); // Renders the new records
            }

            //Update hasMore based on total records if available
            if (this.totalRecords !== null) {
                this.hasMore = this.recordsReceived < this.totalRecords;
            } else {
                //Fallback to batch size check
                this.hasMore = recordCount >= this.batchSize;
            }
            
            this.currentOffset += recordCount; // Updates the offset for the next batch

        } catch (error) {
            if (error.name === 'AbortError') return; // Ignores abort errors
            this.handleError(error); // Handles other errors
        } finally {
            this.isLoading = false; // Resets the loading state
            this.abortController = null; // Clears the abort controller
            this.updateLoadingState(); // Updates the loading UI
        }
    }

    // Renders records in the streaming tab
    renderRecords(append = false) {
        if (!this.newTab || this.newTab.closed) return;

        const container = this.newTab.document.querySelector('.container'); // Finds the container
        // const container = this.newTab.document.querySelector('.container');
        if (!container) return;

        console.log('Records to render:', this.allRecords);// Code Testing
        

        if (!append) {
            container.innerHTML = generateFormattedHTML(this.allRecords); // Replaces content
        } else {
            const tempContainer = this.newTab.document.createElement('div');
            const newRecords = this.allRecords.slice(-this.batchSize);
            tempContainer.innerHTML = generateFormattedHTML(newRecords);
            
            // Find the existing table or create a new one
            let existingTable = container.querySelector('table');
            if (!existingTable) {
                container.appendChild(tempContainer.firstElementChild);
            } else {
                // Append only the new rows to the existing table
                const newRows = tempContainer.querySelectorAll('tbody tr');
                const tbody = existingTable.querySelector('tbody');
                newRows.forEach(row => tbody.appendChild(row));
            }
        };

        this.updateLoadingState(); // Updates the UI state
    }

    // Updates the loading indicator and record count
    updateLoadingState() {
        if (!this.newTab || this.newTab.closed) return;

        const loadingElement = this.newTab.document.getElementById('loading'); // Finds the loading element
        if (loadingElement) {
            let message = this.isLoading ? 'Loading more records...' : '';
            if (!this.hasMore) {
                message = `All ${this.recordsReceived} records loaded`;
            } else if (!this.isLoading) {
                message = 'Scroll for more';
            }
            loadingElement.textContent = message;
        }

        const countElement = this.newTab.document.getElementById('records-count'); // Finds the record count element
        if (countElement) {
            const totalText = this.totalRecords ? `/${this.totalRecords}`:'';
            countElement.textContent = `Records: ${this.recordsReceived} ${totalText}`; // Updates the record count
        }
    };

    // Handles errors during streaming
    handleError(error) {
        if (!this.newTab || this.newTab.closed) return;
        console.error('Streaming error:', error); // Logs the error
        this.newTab.document.body.innerHTML = `
            <div class="error">
                <h3>Error streaming records</h3>
                <p>${error.message}</p>
                <button onclick="window.location.reload()">Retry</button> <!-- Retry button -->
            </div>
        `;
    };

    // Debounces a function to limit how often it runs
    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout); // Clears any existing timeout
            timeout = setTimeout(() => func.apply(this, args), wait); // Sets a new timeout
        };
    };

    // Cleans up resources and closes the streaming tab
    cleanup() {
        if (this.abortController) {
            this.abortController.abort(); // Cancels any ongoing requests
        }

        if (this.newTab && !this.newTab.closed) {
            this.newTab.removeEventListener('scroll', this.handleScroll); // Removes the scroll listener
            this.newTab.close(); // Closes the tab
        }

        window.removeEventListener('unload', this.cleanup); // Removes the unload listener
    };
}

// Exported function to create a new streaming view instance
export function createStreamingView(filterParams) {
    return new StreamingRecordsManager(filterParams, RECORD_FIELDS);
}
