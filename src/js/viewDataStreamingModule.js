    // ================================================================================
    // IMPORTS AND CONSTANTS
    // ================================================================================

import { VIEWRECORDSBYSTREAMING_API_URL, VIEWRECORDSBYSTREAMING_BATCHSIZE } from "./config.js";
import { generateFormattedHTML } from "./dataViewingHtmlFormatter.js";
import { showLoading, hideLoading } from "./loadingTimeAnimation.js";

// Array of fields that exist in the data base as columns
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

    // ================================================================================
    // STREAMING RECORDS MANAGER CLASS
    // Main class that handles fetching, displaying, and managing streamed records
    // Uses Server-Sent Events (SSE) for real-time data streaming
    // ================================================================================
class StreamingRecordsManager {
    constructor(filterParams, fields = RECORD_FIELDS) {
        // API Configuration
        this.apiUrl = VIEWRECORDSBYSTREAMING_API_URL;
        this.filterParams = filterParams;
        this.fields = fields;
        
        // State Management
        this.isLoading = false;      // Prevents multiple simultaneous fetches
        this.hasMore = true;         // Indicates if more records are available
        this.currentOffset = 0;      // Tracks current position in record set
        this.batchSize = VIEWRECORDSBYSTREAMING_BATCHSIZE; // Records per fetch
        this.abortController = null; // Controls ongoing fetch requests
        
        // Data Storage
        this.allRecords = new Set();     // Stores unique records
        this.processedIds = new Set();    // Tracks processed record IDs
        this.totalRecords = null;         // Total available records
        this.lastRecordCount = 0;         // Previous record count
        this.lastRenderedIndex = 0;       // Last rendered record index
        this.pendingRecords = [];         // Buffer for unrendered records
        
        // UI Elements
        this.newTab = null;               // Reference to display window
        
        // Scroll Management
        this.scrollThreshold = 200;       // Distance from bottom to trigger load
        this.isScrollLocked = false;      // Prevents multiple scroll triggers
        this.scrollTimeout = null;        // Timer for scroll event handling
        this.handleScroll = this.handleScrollEvent.bind(this);
        
        // Cleanup
        this.cleanup = this.cleanup.bind(this);
        
        // Start the process
        this.init();
    }

    // ================================================================================
    // UI SETUP AND INITIALIZATION
    // ================================================================================
    
    // Sets up the initial HTML structure and styling in the new tab after view button is pressed
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
                <div class="container-viewtab">
                <div id="records-count">Records: 0</div>
                <div class="container"></div>
                <div id="loading">Starting stream...</div>
                </div>
            </body>
            </html>
        `;

        this.newTab.document.write(html);
        this.newTab.document.close();
    };
    async initialLoad(){
        if (!this.isLoading) {
            this.isLoading = true;
            await this.fetchBatch();
            this.isLoading = false;
        }
    };

    // Initialization logic, opens a new tab and sets up event listeners
    init() {
        // const containerViewTabDiv=document.querySelector('.container-viewtab');
        // showLoading(containerViewTabDiv);//Bug not working here
        try {
            this.newTab = window.open('', '_blank');
            this.setupInitialHTML();
            
            // Set up event listeners
            this.newTab.addEventListener('scroll', this.handleScroll);
            window.addEventListener('unload', this.cleanup);
            
            // Start loading data
            this.loadMoreRecords();
            this.initialLoad();

            // hideLoading(containerViewTabDiv);//Bugnot working here. 
        } catch (error) {
            console.error("Error while initializing the new ViewTab: ",error);
        };
    };

    // ================================================================================
    // SCROLL MANAGEMENT
    // Handles infinite scrolling functionality with anti-cascade protection
    // ================================================================================
    
    // Main scroll event handler - prevents cascade triggers
    handleScrollEvent() {
        // Skip if already loading or locked
        if (this.isScrollLocked || this.isLoading || !this.hasMore || !this.newTab || this.newTab.closed) {
            return;
        }

        // Check if we're near the bottom
        const scrollPosition = this.newTab.scrollY;
        const windowHeight = this.newTab.innerHeight;
        const documentHeight = this.newTab.document.documentElement.scrollHeight;
        
        if (documentHeight - (scrollPosition + windowHeight) < this.scrollThreshold) {
            this.lockScroll();           // Lock scroll to prevent cascade
            this.loadMoreRecords();      // Load more data
        }
    };
    // Prevents scroll triggers by locking and moving viewport
    lockScroll() {
        this.isScrollLocked = true;
        const container = this.newTab.document.querySelector('.container');
        if (container) {
            // Move viewport away from trigger zone
            this.newTab.scrollTo({
                top: this.newTab.scrollY - (this.scrollThreshold + 450),
                behavior: 'smooth'
            });
        }
    };
    // Re-enables scroll triggers
    unlockScroll() {
        this.isScrollLocked = false;
    };

    // ================================================================================
    // DATA FETCHING AND PROCESSING
    // Handles SSE data streaming and record management
    // ================================================================================
    //To Fetch a batch of record by SSE(Server Side Event) method
    async fetchBatch() {
        //to cancel any ongoing request before the current requests
        try {
            if (this.abortController) {
                this.abortController.abort();
            }
            this.abortController = new AbortController();
            
            //Making the fetch request
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Client-Id': crypto.randomUUID()
                },
                body: JSON.stringify({
                    filters: this.filterParams,
                    offset: this.currentOffset,
                    limit: this.batchSize
                }),
                signal: this.abortController.signal
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            if (this.totalRecords === null) {
                const totalCount = response.headers.get('X-Total-Count');
                if (totalCount) {
                    this.totalRecords = parseInt(totalCount, 10);
                }
            }
            //Process the SSE stream
            const reader = response.body
                .pipeThrough(new TextDecoderStream())
                .getReader();

            let recordsInBatch = 0;
            let batchComplete = false;
            // Process incoming SSE data
            while (!batchComplete) {
                const { done, value } = await reader.read();
                
                if (done) {
                    batchComplete = true;
                    break;
                }

                const records = value.split('\n\n')
                    .filter(event => event.startsWith('data: '))
                    .map(event => {
                        try {
                            return JSON.parse(event.replace('data: ', ''));
                        } catch (error) {
                            return null;
                        }
                    })
                    .filter(Boolean);

                for (const record of records) {
                    const recordId = this.getRecordId(record);
                    if (!this.processedIds.has(recordId)) {
                        this.processedIds.add(recordId);
                        this.allRecords.add(record);
                        recordsInBatch++;
                    }

                    if (recordsInBatch >= this.batchSize) {
                        batchComplete = true;
                        reader.cancel();
                        break;
                    }
                }

                if (recordsInBatch > 0) {
                    await this.renderRecords(true);
                }
            }

            //Update state based on results
            if (recordsInBatch === 0 || (this.totalRecords !== null && this.allRecords.size >= this.totalRecords)) {
                this.hasMore = false;
                const loadingElement = this.newTab.document.getElementById('loading');
                if (loadingElement) {
                    loadingElement.textContent = `All ${this.allRecords.size} records loaded`;
                }
            } else {
                this.currentOffset = this.allRecords.size;
            }

        } catch (error) {
            if (error.name === 'AbortError') return;
            this.handleError(error);
        } 
        // finally {
        //     this.isLoading = false;
        //     this.updateLoadingState();
        // }
    };// newly added    

    // this is the main method that fetches more data if needed
    async loadMoreRecords(){
        if (this.isLoading || !this.hasMore) {
            return;
        };
        this.isLoading = true;
        // this.fetchBatch().finally(() => {	
        //     this.isLoading = false;
        // 	});
        try {
            await this.fetchBatch();
        } finally {
            this.isLoading = false;
            this.updateLoadingState();
            
            // Unlock scroll after a short delay to prevent immediate retriggering
            setTimeout(() => {
                this.unlockScroll();
            }, 250);
        };
    };




    // ================================================================================
    // RECORD PROOFING AND DE-DUPLICATION
    // ================================================================================
    //Simple record ID generator using REGID and ROLL
    getRecordId(record) {
        return `${record.REGID}|${record.ROLL}`;
    };
    //To check if the records exists to avoid the duplicate
    recordExists(newRecord){
        //checking if record already exists based on unique identifier (e.g., REGID or ROLL or combination of two)
        // return Array.from(this.allRecords).some(existingRecord => existingRecord.REGID === newRecord.REGID && existingRecord.ROLL === newRecord.ROLL);//forced stop
        return this.processedIds.has(this.getRecordId(newRecord));// newly added
    };

    // ================================================================================
    // RECORD RENDERING AND UI UPDATES
    // Handles displaying records and updating UI state
    // ================================================================================
    
    // Renders records to UI
    renderRecords(append = false) {
        if (!this.newTab || this.newTab.closed) return;

        const container = this.newTab.document.querySelector('.container');
        if (!container) return;

        const recordsArray = Array.from(this.allRecords);

        if (!append) {
            container.innerHTML = generateFormattedHTML(recordsArray);
            this.lastRenderedIndex = recordsArray.length;
        } else {
            const newRecords = recordsArray.slice(this.lastRenderedIndex);

            if (newRecords.length === 0) return;

            const tempContainer = this.newTab.document.createElement('div');
            tempContainer.innerHTML = generateFormattedHTML(newRecords);
            
            let existingTable = container.querySelector('table');
            if (!existingTable) {
                container.appendChild(tempContainer.firstElementChild);
            } else {
                const tbody = existingTable.querySelector('tbody');
                const newRows = tempContainer.querySelectorAll('tbody tr');
                newRows.forEach(row => tbody.appendChild(row));
            };
            
            this.lastRenderedIndex = recordsArray.length;
        };

        // Update the records count
        const countElement = this.newTab.document.getElementById('records-count');
        if (countElement) {
            const totalText = this.totalRecords ? ` out of ${this.totalRecords}` : '';
            countElement.textContent = `Records: ${this.allRecords.size}${totalText}`;
        };  
    };

    // Updates the loading indicator and record count
    updateLoadingState() {
        if (!this.newTab || this.newTab.closed) return;

        const loadingElement = this.newTab.document.getElementById('loading'); // Finds the loading element
        if (loadingElement) {
            if (loadingElement) {
                if (this.isLoading) {
                    loadingElement.textContent='Loading more records...'
                } else if (!this.hasMore){
                    loadingElement.textContent = `All ${this.allRecords.size} records loaded`;
                } else{
                    loadingElement.textContent = 'Scroll for more';
                }
            }

            const countElement = this.newTab.document.getElementById('records-count');
            if (countElement) {
                const totalText = this.totalRecords ? `out of ${this.totalRecords}`:'';
                countElement.textContent = `Records: ${this.allRecords.size} ${totalText}`;
            };
        }
    };

    // ================================================================================
    // ERROR HANDLING AND CLEANUP
    // Manages error states and resource cleanup
    // ================================================================================
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
// ================================================================================
// EXPORTS
// ================================================================================
// Exported function to create a new streaming view instance
export function createStreamingView(filterParams) {
    return new StreamingRecordsManager(filterParams, RECORD_FIELDS);
}
