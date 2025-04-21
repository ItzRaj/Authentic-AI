// Show home page
function showHomePage() {
  document.getElementById('homePage').style.display = 'block';
  document.getElementById('detectionContent').style.display = 'none';
  
  // Hide all detection pages
  document.getElementById('imageDetection').style.display = 'none';
  document.getElementById('videoDetection').style.display = 'none';
  document.getElementById('audioDetection').style.display = 'none';
  document.getElementById('textDetection').style.display = 'none';
}

// Show specific detection page
function showDetectionPage(type) {
  document.getElementById('homePage').style.display = 'none';
  document.getElementById('detectionContent').style.display = 'block';
  
  // Hide all detection pages first
  document.getElementById('imageDetection').style.display = 'none';
  document.getElementById('videoDetection').style.display = 'none';
  document.getElementById('audioDetection').style.display = 'none';
  document.getElementById('textDetection').style.display = 'none';
  
  // Show the selected detection page
  document.getElementById(type + 'Detection').style.display = 'block';
  
  // Hide all result containers
  document.getElementById('imageResult').style.display = 'none';
  document.getElementById('videoResult').style.display = 'none';
  document.getElementById('audioResult').style.display = 'none';
  document.getElementById('textResult').style.display = 'none';
  
  // Scroll to top
  window.scrollTo(0, 0);
}

// API endpoint - adjust this to match your deployment
const API_BASE_URL = 'http://localhost:5000';

// Function to show loading state
function showLoading(type) {
  // Create or update loading element
  let loadingElement = document.getElementById(`${type}Loading`);
  if (!loadingElement) {
    loadingElement = document.createElement('div');
    loadingElement.id = `${type}Loading`;
    loadingElement.className = 'loading-indicator';
    loadingElement.innerHTML = '<div class="spinner"></div><p>Analyzing content...</p>';
    document.getElementById(type + 'Result').parentNode.insertBefore(loadingElement, document.getElementById(type + 'Result'));
  } else {
    loadingElement.style.display = 'block';
  }
}

// Function to hide loading state
function hideLoading(type) {
  const loadingElement = document.getElementById(`${type}Loading`);
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }
}

// Update result display based on API response
function updateResultDisplay(type, result) {
  const resultElement = document.getElementById(type + 'Result');
  const confidenceElement = document.getElementById(type + 'Confidence');
  const confidenceLevelElement = resultElement.querySelector('.confidence-level');
  
  // Update confidence score
  const confidenceScore = result.confidence_score || result.confidence || 0;
  confidenceElement.textContent = `${Math.round(confidenceScore * 100)}%`;
  
  // Update confidence bar
  confidenceLevelElement.style.width = `${Math.round(confidenceScore * 100)}%`;
  
  // Update analysis text
  const analysisElement = resultElement.querySelector('p:last-child');
  analysisElement.textContent = result.analysis || result.details || 'Analysis complete.';
  
  // Check if the content is marked as fake (could be true/false or a confidence score)
  const isFake = result.is_fake === true || confidenceScore > 0.5;
  
  // Adjust colors based on result
  if (isFake) {
    confidenceLevelElement.style.backgroundColor = 'var(--danger)';
    resultElement.classList.add('result-fake');
    resultElement.classList.remove('result-real');
    resultElement.querySelector('.result-icon').textContent = '⚠️';
    resultElement.querySelector('.result-icon').className = 'result-icon fake-icon';
    resultElement.querySelector('.result-title span:last-child').textContent = 'Likely AI-Generated or Manipulated';
  } else {
    confidenceLevelElement.style.backgroundColor = 'var(--success)';
    resultElement.classList.add('result-real');
    resultElement.classList.remove('result-fake');
    resultElement.querySelector('.result-icon').textContent = '✓';
    resultElement.querySelector('.result-icon').className = 'result-icon real-icon';
    resultElement.querySelector('.result-title span:last-child').textContent = 'Likely Authentic';
  }
  
  // Show result
  resultElement.style.display = 'block';
  
  // Scroll to result
  resultElement.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
}

// Function to clear form
function clearForm(type) {
  switch(type) {
    case 'image': {
      // Clear file input
      const fileInput = document.getElementById('imageUpload');
      fileInput.value = '';
      
      // Clear URL input
      const urlInput = document.querySelector('#imageDetection input[type="text"]');
      urlInput.value = '';
      
      // Hide result
      document.getElementById('imageResult').style.display = 'none';
      
      // Remove selected file text if exists
      const selectedFileElement = document.querySelector('#imageDetection .selected-file');
      if (selectedFileElement) {
        selectedFileElement.remove();
      }
      break;
    }
    
    case 'video': {
      // Clear file input
      const fileInput = document.getElementById('videoUpload');
      fileInput.value = '';
      
      // Clear URL input
      const urlInput = document.querySelector('#videoDetection input[type="text"]');
      urlInput.value = '';
      
      // Hide result
      document.getElementById('videoResult').style.display = 'none';
      
      // Remove selected file text if exists
      const selectedFileElement = document.querySelector('#videoDetection .selected-file');
      if (selectedFileElement) {
        selectedFileElement.remove();
      }
      break;
    }
    
    case 'audio': {
      // Clear file input
      const fileInput = document.getElementById('audioUpload');
      fileInput.value = '';
      
      // Clear URL input
      const urlInput = document.querySelector('#audioDetection input[type="text"]');
      urlInput.value = '';
      
      // Hide result
      document.getElementById('audioResult').style.display = 'none';
      
      // Remove selected file text if exists
      const selectedFileElement = document.querySelector('#audioDetection .selected-file');
      if (selectedFileElement) {
        selectedFileElement.remove();
      }
      break;
    }
    
    case 'text': {
      // Clear textarea
      const textInput = document.querySelector('#textDetection textarea');
      textInput.value = '';
      
      // Clear file input
      const fileInput = document.querySelector('#textDetection input[type="file"]');
      fileInput.value = '';
      
      // Hide result
      document.getElementById('textResult').style.display = 'none';
      break;
    }
  }
  
  // Hide loading if visible
  hideLoading(type);
  
  // Scroll to top of form
  document.getElementById(type + 'Detection').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

// Real API calls to the backend
async function analyzeImage(file, url) {
  showLoading('image');
  
  try {
    const formData = new FormData();
    
    if (file) {
      formData.append('image', file);
      
      const response = await fetch(`${API_BASE_URL}/check_image`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      hideLoading('image');
      updateResultDisplay('image', result);
    } 
    else if (url) {
      const response = await fetch(`${API_BASE_URL}/check_image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      hideLoading('image');
      updateResultDisplay('image', result);
    }
  } catch (error) {
    console.error('Error analyzing image:', error);
    hideLoading('image');
    alert(`Error analyzing image: ${error.message}`);
  }
}

async function analyzeVideo(file, url) {
  showLoading('video');
  
  try {
    const formData = new FormData();
    
    if (file) {
      formData.append('video', file);
      
      const response = await fetch(`${API_BASE_URL}/check_video`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      hideLoading('video');
      updateResultDisplay('video', result);
    } 
    else if (url) {
      const response = await fetch(`${API_BASE_URL}/check_video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      hideLoading('video');
      updateResultDisplay('video', result);
    }
  } catch (error) {
    console.error('Error analyzing video:', error);
    hideLoading('video');
    alert(`Error analyzing video: ${error.message}`);
  }
}

async function analyzeAudio(file, url) {
  showLoading('audio');
  
  try {
    const formData = new FormData();
    
    if (file) {
      formData.append('audio', file);
      
      const response = await fetch(`${API_BASE_URL}/check_audio`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      hideLoading('audio');
      updateResultDisplay('audio', result);
    } 
    else if (url) {
      const response = await fetch(`${API_BASE_URL}/check_audio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      hideLoading('audio');
      updateResultDisplay('audio', result);
    }
  } catch (error) {
    console.error('Error analyzing audio:', error);
    hideLoading('audio');
    alert(`Error analyzing audio: ${error.message}`);
  }
}

async function analyzeText(text, file) {
  showLoading('text');
  
  try {
    if (text) {
      const response = await fetch(`${API_BASE_URL}/check_text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: text })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      hideLoading('text');
      updateResultDisplay('text', result);
    } 
    else if (file) {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_BASE_URL}/check_text_file`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      hideLoading('text');
      updateResultDisplay('text', result);
    }
  } catch (error) {
    console.error('Error analyzing text:', error);
    hideLoading('text');
    alert(`Error analyzing text: ${error.message}`);
  }
}

// Handle content analysis based on type
function analyzeContent(type) {
  switch(type) {
    case 'image': {
      const fileInput = document.getElementById('imageUpload');
      const urlInput = document.querySelector('#imageDetection input[type="text"]');
      const file = fileInput.files[0];
      const url = urlInput.value.trim();
      
      if (file || url) {
        analyzeImage(file, url);
      } else {
        alert('Please upload an image or provide a URL');
      }
      break;
    }
    
    case 'video': {
      const fileInput = document.getElementById('videoUpload');
      const urlInput = document.querySelector('#videoDetection input[type="text"]');
      const file = fileInput.files[0];
      const url = urlInput.value.trim();
      
      if (file || url) {
        analyzeVideo(file, url);
      } else {
        alert('Please upload a video or provide a URL');
      }
      break;
    }
    
    case 'audio': {
      const fileInput = document.getElementById('audioUpload');
      const urlInput = document.querySelector('#audioDetection input[type="text"]');
      const file = fileInput.files[0];
      const url = urlInput.value.trim();
      
      if (file || url) {
        analyzeAudio(file, url);
      } else {
        alert('Please upload an audio file or provide a URL');
      }
      break;
    }
    
    case 'text': {
      const textInput = document.querySelector('#textDetection textarea');
      const fileInput = document.querySelector('#textDetection input[type="file"]');
      const text = textInput.value.trim();
      const file = fileInput.files[0];
      
      if (text || file) {
        analyzeText(text, file);
      } else {
        alert('Please enter text or upload a text file');
      }
      break;
    }
  }
}

// Check if the API server is up
async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      console.log("API server is running");
      document.getElementById('apiStatus').style.display = 'none';
    } else {
      throw new Error("API server returned an error");
    }
  } catch (error) {
    console.error("API server is not running:", error);
    const apiStatusElement = document.getElementById('apiStatus');
    if (apiStatusElement) {
      apiStatusElement.style.display = 'block';
    } else {
      // Create an API status warning if it doesn't exist
      const warning = document.createElement('div');
      warning.id = 'apiStatus';
      warning.className = 'api-warning';
      document.querySelector('header').appendChild(warning);
    }
  }
}

// Initialize with home page
document.addEventListener('DOMContentLoaded', function() {
  showHomePage();
  
  // Check API health
  checkApiHealth();
  
  // Add drag and drop functionality for file uploads
  const uploadAreas = document.querySelectorAll('.upload-area');
  
  uploadAreas.forEach(area => {
    area.addEventListener('dragover', function(e) {
      e.preventDefault();
      this.classList.add('dragover');
    });
    
    area.addEventListener('dragleave', function() {
      this.classList.remove('dragover');
    });
    
    area.addEventListener('drop', function(e) {
      e.preventDefault();
      this.classList.remove('dragover');
      
      const fileInput = this.querySelector('input[type="file"]');
      if (e.dataTransfer.files.length > 0 && fileInput) {
        fileInput.files = e.dataTransfer.files;
        // Trigger change event
        const event = new Event('change');
        fileInput.dispatchEvent(event);
      }
    });
  });
  
  // Add event listeners for file uploads
  document.getElementById('imageUpload').addEventListener('change', function() {
    if (this.files.length > 0) {
      const fileNameElement = document.createElement('p');
      fileNameElement.className = 'selected-file';
      fileNameElement.textContent = `Selected: ${this.files[0].name}`;
      
      // Remove previous filename display if exists
      const previousNameElement = this.parentElement.querySelector('.selected-file');
      if (previousNameElement) {
        previousNameElement.remove();
      }
      
      this.parentElement.appendChild(fileNameElement);
    }
  });
  
  document.getElementById('videoUpload').addEventListener('change', function() {
    if (this.files.length > 0) {
      const fileNameElement = document.createElement('p');
      fileNameElement.className = 'selected-file';
      fileNameElement.textContent = `Selected: ${this.files[0].name}`;
      
      // Remove previous filename display if exists
      const previousNameElement = this.parentElement.querySelector('.selected-file');
      if (previousNameElement) {
        previousNameElement.remove();
      }
      
      this.parentElement.appendChild(fileNameElement);
    }
  });
  
  document.getElementById('audioUpload').addEventListener('change', function() {
    if (this.files.length > 0) {
      const fileNameElement = document.createElement('p');
      fileNameElement.className = 'selected-file';
      fileNameElement.textContent = `Selected: ${this.files[0].name}`;
      
      // Remove previous filename display if exists
      const previousNameElement = this.parentElement.querySelector('.selected-file');
      if (previousNameElement) {
        previousNameElement.remove();
      }
      
      this.parentElement.appendChild(fileNameElement);
    }
  });
});