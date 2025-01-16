
// This function is for the content loading Animation
function showLoading(element) {
    // First of all, i will clear any existing loading animations
    hideLoading(element);
    
    // then i am Creating loading animation container where the code for animated roundel will exist. And this will be pushed into other dives where animation has to be shown.
    const loadingContainer = document.createElement('div');
    loadingContainer.className = 'loading-container';
    loadingContainer.innerHTML = `
      <div Class="loading-wrapper">
          <div Class="ripple-background"></div>
            <div class="sscicon-spinner">
              <img src="/img/ssc_logo_trans.png" alt="Loading" class="rotating-sscicon">
            </div>
        <div class="loading-text">Loading. Please Wait.</div>
      </div>
    `;
    
    // Store original position if not already relative
    if (getComputedStyle(element).position === 'static') {
      element.style.position = 'relative';
    };
    
    element.appendChild(loadingContainer);
  
  
    //Loading Percentages: this isn't real percentage loader. It's simulated one. I will implement real one latter on.
    /*forced stop legacy code this is not to be used when implementing real percentage loader.
  
    const loadingText=loadingContainer.querySelector('.loading-text');
    let progress = 0;
    const updateProgress= () => {	
      progress = Math.min(progress + Math.floor(Math.random()*15), 100);
      loadingText.textContent = `Loading: ${progress}%`;
  
      if(progress<100){
        setTimeout(updateProgress, Math.floor(Math.floor(Math.random()*500))+200);
      };
        };
      updateProgress();
      */
  };
  
  function hideLoading(element) {
    const existingLoader = element.querySelector('.loading-container');
    if (existingLoader) {
      existingLoader.remove();
    }
  };
  export {showLoading, hideLoading};

  