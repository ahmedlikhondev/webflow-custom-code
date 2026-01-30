// Ensure Webflow has fully loaded
window.Webflow ||= [];
window.Webflow.push(function () {

  // --- Element references ---
  const steps = document.querySelectorAll(".form-step-v2");
  const nextBtn = document.querySelector(".next-btn-v2");
  const prevBtn = document.querySelector(".prev-btn-v2");
  const submitBtn = document.querySelector(".submit-button-v2");

  if (!steps.length || !nextBtn || !prevBtn || !submitBtn) return;

  let currentStep = 0;

  // Initially hide submit button
  submitBtn.style.display = "none";

  // --- Show specific step ---
  function showStep(index) {
    steps.forEach(step => step.classList.remove("active"));
    steps[index].classList.add("active");

    prevBtn.style.display = index === 0 ? "none" : "inline-block";

    if (index === steps.length - 1) {
      nextBtn.style.display = "none";
      submitBtn.style.display = "inline-block";
    } else {
      nextBtn.style.display = "inline-block";
      submitBtn.style.display = "none";
    }

    scrollToTop();
  }

  // --- Scroll to top smoothly ---
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // --- Validate current step ---
  function validateCurrentStep() {
    const step = steps[currentStep];

    // Validate input, select, textarea (excluding radio/checkbox)
    const fields = step.querySelectorAll(
      "input:not([type='radio']):not([type='checkbox']), select, textarea"
    );
    for (let field of fields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }

    // Validate radio groups
    const radioGroups = {};
    step.querySelectorAll("input[type='radio']").forEach(radio => {
      if (!radioGroups[radio.name]) radioGroups[radio.name] = [];
      radioGroups[radio.name].push(radio);
    });

    for (let name in radioGroups) {
      const group = radioGroups[name];
      const isRequired = group.some(r => r.required);
      const isChecked = group.some(r => r.checked);

      if (isRequired && !isChecked) {
        group[0].setCustomValidity("Please select one option");
        group[0].reportValidity();
        group[0].setCustomValidity("");
        return false;
      }
    }

    // Validate checkbox groups
    const checkboxGroups = {};
    step.querySelectorAll("input[type='checkbox']").forEach(cb => {
      if (!checkboxGroups[cb.name]) checkboxGroups[cb.name] = [];
      checkboxGroups[cb.name].push(cb);
    });

    for (let groupName in checkboxGroups) {
      const group = checkboxGroups[groupName];
      const isVisible = group[0].offsetParent !== null;
      if (!isVisible) continue;

      const checked = group.some(cb => cb.checked);
      if (!checked) {
        alert("Select at least one option");
        group[0].focus();
        return false;
      }
    }

    return true;
  }

  // --- Next button click ---
  nextBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);
    }
  });

  // --- Previous button click ---
  prevBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  });

  // --- Initialize first step ---
  showStep(currentStep);
});
