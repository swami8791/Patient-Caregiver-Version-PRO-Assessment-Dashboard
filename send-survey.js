// Send Survey - Interactive Functions
(function() {
  'use strict';

  // State management
  let currentStep = 1;
  let selectedPatients = [];
  let selectedSurveyType = null;
  let scheduleType = 'now';
  let scheduleDate = null;
  let scheduleTime = null;

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
  });

  /**
   * Initialize the application
   */
  function initializeApp() {
    setupEventListeners();
    updateUI();

    // Pre-select some patients for demo
    const firstThreePatients = document.querySelectorAll('.patient-card');
    firstThreePatients.forEach((card, index) => {
      if (index < 3) {
        card.classList.add('selected');
        selectedPatients.push(card.dataset.patientId || `patient-${index + 1}`);
      }
    });
    updateSelectedCount();
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Search input
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.addEventListener('input', handleSearch);
    }

    // Filter chips
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
      chip.addEventListener('click', function() {
        filterChips.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
      });
    });

    // Schedule options
    const scheduleOptions = document.querySelectorAll('.schedule-option');
    scheduleOptions.forEach(option => {
      option.addEventListener('click', function() {
        scheduleOptions.forEach(o => o.classList.remove('selected'));
        this.classList.add('selected');
        scheduleType = this.dataset.type;

        // Show/hide datetime picker
        const datetimePicker = document.getElementById('datetimePicker');
        if (datetimePicker) {
          if (scheduleType === 'scheduled') {
            datetimePicker.classList.add('active');
          } else {
            datetimePicker.classList.remove('active');
          }
        }
      });
    });
  }

  /**
   * Toggle patient selection
   */
  window.togglePatient = function(card) {
    const patientId = card.dataset.patientId || card.querySelector('.patient-name').textContent;

    if (card.classList.contains('selected')) {
      card.classList.remove('selected');
      selectedPatients = selectedPatients.filter(id => id !== patientId);
    } else {
      card.classList.add('selected');
      selectedPatients.push(patientId);
    }

    updateSelectedCount();
  };

  /**
   * Select all patients
   */
  window.selectAllPatients = function() {
    const patientCards = document.querySelectorAll('.patient-card');
    selectedPatients = [];

    patientCards.forEach(card => {
      card.classList.add('selected');
      const patientId = card.dataset.patientId || card.querySelector('.patient-name').textContent;
      selectedPatients.push(patientId);
    });

    updateSelectedCount();
  };

  /**
   * Toggle survey type selection
   */
  window.toggleSurveyType = function(card) {
    const surveyCards = document.querySelectorAll('.survey-card');
    surveyCards.forEach(c => c.classList.remove('selected'));

    card.classList.add('selected');
    selectedSurveyType = card.dataset.surveyType;
  };

  /**
   * Update selected count display
   */
  function updateSelectedCount() {
    const countElement = document.getElementById('selectedCount');
    const bulkSelectText = document.querySelector('.bulk-select .text-muted');

    if (countElement) {
      countElement.textContent = `(${selectedPatients.length} selected)`;
    }

    if (bulkSelectText) {
      bulkSelectText.textContent = `${selectedPatients.length} patients selected`;
    }
  }

  /**
   * Handle search input
   */
  function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const patientCards = document.querySelectorAll('.patient-card');

    patientCards.forEach(card => {
      const patientName = card.querySelector('.patient-name').textContent.toLowerCase();
      const patientMeta = card.querySelector('.patient-meta').textContent.toLowerCase();

      if (patientName.includes(searchTerm) || patientMeta.includes(searchTerm)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  /**
   * Navigate to next step
   */
  window.nextStep = function() {
    // Validation
    if (currentStep === 1 && selectedPatients.length === 0) {
      alert('Please select at least one patient');
      return;
    }

    if (currentStep === 2 && !selectedSurveyType) {
      alert('Please select a survey type');
      return;
    }

    if (currentStep === 3 && scheduleType === 'scheduled') {
      const dateInput = document.getElementById('scheduleDate');
      const timeInput = document.getElementById('scheduleTime');

      if (dateInput && !dateInput.value) {
        alert('Please select a date');
        return;
      }

      if (timeInput && !timeInput.value) {
        alert('Please select a time');
        return;
      }

      scheduleDate = dateInput ? dateInput.value : null;
      scheduleTime = timeInput ? timeInput.value : null;
    }

    if (currentStep < 4) {
      currentStep++;
      updateStep();
      updateProgressBar();

      // Populate review screen
      if (currentStep === 4) {
        populateReview();
      }
    } else {
      // Send surveys
      sendSurveys();
    }
  };

  /**
   * Navigate to previous step
   */
  window.previousStep = function() {
    if (currentStep > 1) {
      currentStep--;
      updateStep();
      updateProgressBar();
    }
  };

  /**
   * Update current step display
   */
  function updateStep() {
    const steps = document.querySelectorAll('.step-screen');
    const progressSteps = document.querySelectorAll('.progress-step');

    steps.forEach((step, index) => {
      if (index + 1 === currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    progressSteps.forEach((step, index) => {
      if (index + 1 === currentStep) {
        step.classList.add('active');
        step.classList.remove('completed');
      } else if (index + 1 < currentStep) {
        step.classList.add('completed');
        step.classList.remove('active');
      } else {
        step.classList.remove('active', 'completed');
      }
    });

    updateUI();
  }

  /**
   * Update progress bar
   */
  function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const percentage = (currentStep / 4) * 100;

    if (progressBar) {
      progressBar.style.width = percentage + '%';
    }
  }

  /**
   * Update UI based on current step
   */
  function updateUI() {
    const bottomActions = document.getElementById('bottomActions');
    const backButton = bottomActions ? bottomActions.querySelector('.btn-secondary') : null;
    const continueButton = bottomActions ? bottomActions.querySelector('.btn-primary') : null;

    if (backButton) {
      backButton.style.display = currentStep === 1 ? 'none' : 'flex';
    }

    if (continueButton) {
      const buttonText = currentStep === 4 ? 'Send Surveys' : 'Continue';
      const countSpan = continueButton.querySelector('#selectedCount');

      continueButton.childNodes[0].textContent = buttonText + ' ';

      if (currentStep === 1) {
        if (countSpan) countSpan.style.display = 'inline';
      } else {
        if (countSpan) countSpan.style.display = 'none';
      }
    }
  }

  /**
   * Populate review screen
   */
  function populateReview() {
    // Update patients list
    const patientsValue = document.getElementById('reviewPatients');
    if (patientsValue) {
      patientsValue.textContent = `${selectedPatients.length} patient(s) selected`;
    }

    // Update survey type
    const surveyValue = document.getElementById('reviewSurvey');
    if (surveyValue && selectedSurveyType) {
      const surveyCard = document.querySelector(`[data-survey-type="${selectedSurveyType}"]`);
      if (surveyCard) {
        const surveyTitle = surveyCard.querySelector('.survey-card-title').textContent;
        surveyValue.textContent = surveyTitle;
      }
    }

    // Update schedule
    const scheduleValue = document.getElementById('reviewSchedule');
    if (scheduleValue) {
      if (scheduleType === 'now') {
        scheduleValue.textContent = 'Send immediately';
      } else {
        scheduleValue.textContent = `Scheduled for ${scheduleDate} at ${scheduleTime}`;
      }
    }
  }

  /**
   * Send surveys
   */
  function sendSurveys() {
    const loadingOverlay = document.getElementById('loadingOverlay');

    if (loadingOverlay) {
      loadingOverlay.classList.add('show');
    }

    // Simulate API call
    setTimeout(() => {
      if (loadingOverlay) {
        loadingOverlay.classList.remove('show');
      }

      showSuccessScreen();
    }, 2000);
  }

  /**
   * Show success screen
   */
  function showSuccessScreen() {
    // Hide all steps
    const steps = document.querySelectorAll('.step-screen');
    steps.forEach(step => step.classList.remove('active'));

    // Show success message
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.innerHTML = `
        <div class="success-screen">
          <div class="success-icon">✓</div>
          <h2 class="success-title">Surveys Sent!</h2>
          <p class="success-description">
            ${selectedPatients.length} survey${selectedPatients.length > 1 ? 's have' : ' has'} been sent successfully.
            Patients will receive notifications shortly.
          </p>
          <button class="btn btn-primary" onclick="window.location.reload()">
            Send More Surveys
          </button>
        </div>
      `;
    }

    // Hide bottom actions
    const bottomActions = document.getElementById('bottomActions');
    if (bottomActions) {
      bottomActions.style.display = 'none';
    }
  }

  /**
   * Save draft
   */
  window.saveDraft = function() {
    const draft = {
      step: currentStep,
      patients: selectedPatients,
      surveyType: selectedSurveyType,
      scheduleType: scheduleType,
      scheduleDate: scheduleDate,
      scheduleTime: scheduleTime
    };

    // Save to localStorage
    localStorage.setItem('surveyDraft', JSON.stringify(draft));

    alert('Draft saved successfully!');
  };

  /**
   * Cancel flow
   */
  window.cancelFlow = function() {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      window.history.back();
    }
  };

  /**
   * Edit review section
   */
  window.editReviewSection = function(stepNumber) {
    currentStep = stepNumber;
    updateStep();
    updateProgressBar();
  };

})();
