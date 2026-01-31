window.Webflow ||= [];
window.Webflow.push(function () {

  const steps = document.querySelectorAll(".form-step-v2");
  const nextBtn = document.querySelector(".next-btn-v2");
  const prevBtn = document.querySelector(".prev-btn-v2");
  const submitBtn = document.querySelector(".submit-button-v2");

  if (!steps.length) return;

  let currentStep = 0;

  if (submitBtn) submitBtn.style.display = "none";

  // =========================
  // SHOW STEP
  // =========================
  function showStep(index) {
    steps.forEach(step => step.classList.remove("active"));
    steps[index].classList.add("active");

    if (prevBtn) prevBtn.style.display = index === 0 ? "none" : "inline-block";
    if (nextBtn) nextBtn.style.display = index === steps.length - 1 ? "none" : "inline-block";
    if (submitBtn) submitBtn.style.display = index === steps.length - 1 ? "inline-block" : "none";
  }

  // =========================
  // VALIDATE STEP
  // =========================
  function validateCurrentStep() {
    const step = steps[currentStep];

    const fields = step.querySelectorAll(
      "input:not([type='radio']):not([type='checkbox']), select, textarea"
    );
    for (let field of fields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }

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

    const visibleCheckboxes = Array.from(
      step.querySelectorAll("input[type='checkbox']")
    ).filter(cb => cb.offsetParent !== null);

    if (visibleCheckboxes.length > 0) {
      if (!visibleCheckboxes.some(cb => cb.checked)) {
        alert("Please select at least one option");
        visibleCheckboxes[0].focus();
        return false;
      }
    }

    return true;
  }

  // =========================
  // SYNC CHECKBOXES
  // =========================
  function syncCheckboxValues(form) {
    if (!form) return;
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
      const hidden = form.querySelector(`input[type="hidden"][name="${cb.name}"]`);
      if (hidden) hidden.value = cb.checked ? "true" : "false";
    });
  }

  // =========================
  // BUTTON EVENTS
  // =========================
  if (nextBtn) {
    nextBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (!validateCurrentStep()) return;
      syncCheckboxValues(this.closest("form"));

      if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
        scrollToTop();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
        scrollToTop();
      }
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", function () {
      syncCheckboxValues(this.closest("form"));
    });
  }

  // =========================
  // SCROLL TO TOP
  // =========================
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // =========================
  // INIT
  // =========================
  showStep(currentStep);

});
