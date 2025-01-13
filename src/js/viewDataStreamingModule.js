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
        this.allRecords = new Set();//[]; // Stores all unique fetched records
        this.processedIds = new Set(); // Add tracking for processed records
        this.newTab = null; // Reference to the new browser tab for the stream
        // this.recordBuffer = []; // Temporary buffer for records
        
        // Scroll behavior settings
        this.scrollThreshold = 200; // Pixels from the bottom to trigger loading

        this.isScrollLocked = false;
        this.scrollTimeout = null;
        // this.handleScroll = this.debounce(this.checkScrollPosition.bind(this), 150); // Debounced scroll handler
        this.handleScroll= this.handleScrollEvent.bind(this);
        this.cleanup = this.cleanup.bind(this); // Ensures proper cleanup of resources
        this.totalRecords = null;
        this.lastRecordCount = 0;// to track last record count to detect when no new records are to be added
        this.lastRenderedIndex = 0;// to track the lsat rendered record index
        this.pendingRecords = [];// this is buffer for records waiting to be rendered
        
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

        this.loadMoreRecords(); 
        // this.renderRecords();

        //first time initial load
        this.initialLoad();
    };

    async initialLoad(){
        if (!this.isLoading) {
            this.isLoading = true;
            await this.fetchBatch();
            this.isLoading = false;
        }
    };

/*    async fetchBatch(){
        try {
            if (this.abortController) {
                this.abortController.abort();
            }
            this.abortController = new AbortController();
    
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
            };
    
            let newRecordsCount = 0;
            const initialSize = this.allRecords.size;
            
            const reader = response.body
                .pipeThrough(new TextDecoderStream())
                .getReader();
    
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
    
                const records = value.split('\n\n')
                    .filter(event => event.startsWith('data: '))
                    .map(event => {
                        try {
                            return JSON.parse(event.replace('data: ', ''));
                        } catch (error) {
                            console.error('Parse error:', error);
                            return null;
                        }
                    })
                    .filter(Boolean);
    
                records.forEach(record => {
                    const recordId = this.getRecordId(record);
                    if (!this.processedIds.has(recordId)) {
                        this.processedIds.add(recordId);
                        this.allRecords.add(record);
                        newRecordsCount++;
                    }
                });
    
                if (newRecordsCount > 0) {
                    this.renderRecords(true);
                }
            }
    
            const recordsAdded = this.allRecords.size - initialSize;
            if (recordsAdded === 0 || (this.totalRecords !== null && this.allRecords.size >= this.totalRecords)) {
                this.hasMore = false;
                const loadingElement = this.newTab.document.getElementById('loading');
                if (loadingElement) {
                    loadingElement.textContent = `All ${this.allRecords.size} records loaded`;
                }
            } else {
                this.currentOffset = this.allRecords.size;
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                return;
            };
            this.handleError(error);
        }finally{
            this.updateLoadingState();
        }
    };
*/
    async fetchBatch() {
        try {
            if (this.abortController) {
                this.abortController.abort();
            }
            this.abortController = new AbortController();

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

            const reader = response.body
                .pipeThrough(new TextDecoderStream())
                .getReader();

            let recordsInBatch = 0;
            let batchComplete = false;

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

    // Checks the scroll position and loads more records if near the bottom
/*    checkScrollPosition() {
        if (!this.newTab || this.newTab.closed) return; // Ensures the tab is valid
        
        const scrollPosition = this.newTab.scrollY; // Current scroll position
        const windowHeight = this.newTab.innerHeight; // Height of the viewport
        const documentHeight = this.newTab.document.documentElement.scrollHeight; // Total document height
        
        // Loads more records if the user scrolls near the bottom
        if (documentHeight - (scrollPosition + windowHeight) < this.scrollThreshold && !this.isLoading && this.hasMore) {
            this.loadMoreRecords();
        }
    };
*/
    // handleScrollEvent - New method to replace the old checkScrollPosition
    handleScrollEvent() {
        if (this.isScrollLocked || this.isLoading || !this.hasMore || !this.newTab || this.newTab.closed) {
            return;
        }

        const scrollPosition = this.newTab.scrollY;
        const windowHeight = this.newTab.innerHeight;
        const documentHeight = this.newTab.document.documentElement.scrollHeight;
        
        if (documentHeight - (scrollPosition + windowHeight) < this.scrollThreshold) {
            this.lockScroll();
            this.loadMoreRecords();
        }
    };
    // New method to lock scroll
    lockScroll() {
        this.isScrollLocked = true;
        const container = this.newTab.document.querySelector('.container');
        if (container) {
            // Shift the scroll position up by threshold + 100px buffer
            this.newTab.scrollTo({
                top: this.newTab.scrollY - (this.scrollThreshold + 450),
                behavior: 'smooth'
            });
        }
    };
    // New method to unlock scroll
    unlockScroll() {
        this.isScrollLocked = false;
    };


    //Simple record ID generator using REGID and ROLL
    getRecordId(record) {
        return `${record.REGID}|${record.ROLL}`;
    };

    // Loads more records from the server in batches
/*    async loadMoreRecords() {
        if (this.isLoading || !this.hasMore) return; // Prevents redundant calls
        this.isLoading = true;

        try {
            if (this.abortController) {
                this.abortController.abort(); // Cancels any ongoing fetch
            };

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
                    console.log(`Total records to fetch: ${this.totalRecords}`);
                };
            };

            let newRecordsCount = 0;
            const initialSize = this.allRecords.size;

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

                // Add new records to Set to prevent duplicates
                let newRecordsCount = 0;
                records.forEach(record => {
                    const recordId = this.getRecordId(record);
                    if (!this.processedIds.has(recordId)) {
                        this.processedIds.add(recordId);
                        this.allRecords.add(record);
                        newRecordsCount++;
                    };
                });
                // Only render if we have new records
                    if (newRecordsCount > 0) {
                        this.renderRecords(true);
                    };

                };
                
                // check if we received any new records
                const recordsAdded =this.allRecords.size - initialSize;
                console.log(`Current records count: ${this.allRecords.size} out of ${this.totalRecords}`);//Code Testing
            //stop any further request, if we didn't get any new records or total record amount is done
            if (recordsAdded === 0 || (this.totalRecords !== null && this.allRecords.size >= this.totalRecords)) {
                this.hasMore = false;

                // not calling cleanup(), just aborting the SSE request system and UI update
                if ( this.abortController) {
                    this.abortController.abort();
                };

                //Update the loading message to indicate completion
                // if (this.newTab && !this.newTab.closed) {
                    const loadingElement = this.newTab.document.getElementById('loading');
                    if (loadingElement) {
                        loadingElement.textContent = `All ${this.allRecords.size} records loaded`;
                    }
                // };


            }else{
                this.currentOffset = this.allRecords.size;
            }
        }catch (error) {
                if (error.name === 'AbortError') return;
                this.handleError(error);
            }finally{
                this.isLoading = false;
                this.abortController = null;
                this.updateLoadingState();
            };

        };
*/
    // Modified loadMoreRecords method
    async loadMoreRecords() {
        if (this.isLoading || !this.hasMore) return;
        this.isLoading = true;
        
        try {
            await this.fetchBatch();
        } finally {
            this.isLoading = false;
            this.updateLoadingState();
            
            // Unlock scroll after a short delay to prevent immediate retriggering
            setTimeout(() => {
                this.unlockScroll();
            }, 250);
        }
    };

    recordExists(newRecord){
        //checking if record already exists based on unique identifier (e.g., REGID or ROLL or combination of two)
        // return Array.from(this.allRecords).some(existingRecord => existingRecord.REGID === newRecord.REGID && existingRecord.ROLL === newRecord.ROLL);//forced stop
        return this.processedIds.has(this.getRecordId(newRecord));// newly added
    };
    // Renders records in the streaming tab
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
