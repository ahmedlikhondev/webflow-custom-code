window.Webflow ||= [];
window.Webflow.push(function () {

  const steps = document.querySelectorAll(".form-step");
  const nextBtn = document.querySelector(".next-btn");
  const prevBtn = document.querySelector(".prev-btn");
  const submitBtn = document.querySelector(".submit-button");

  let currentStep = 0;
  let isDisqualifiedStep4 = false;

  if (submitBtn) submitBtn.style.display = "none";

  /* =========================
     SHOW STEP
  ========================= */
  function showStep(index) {
    steps.forEach(step => step.classList.remove("active"));
    steps[index].classList.add("active");

    prevBtn.style.display = index === 0 ? "none" : "inline-block";

    if (index === steps.length - 1) {
      nextBtn.style.display = "none";
      if (submitBtn) submitBtn.style.display = "inline-block";
    } else {
      nextBtn.style.display = "inline-block";
      if (submitBtn) submitBtn.style.display = "none";
    }
  }

  /* =========================
     SYNC CHECKBOX TRUE / FALSE
  ========================= */
  function syncCheckboxValues(form) {
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
      const hidden = form.querySelector(
        `input[type="hidden"][name="${cb.name}"]`
      );
      if (hidden) {
        hidden.value = cb.checked ? "true" : "false";
      }
    });
  }

  /* =========================
     VALIDATE CURRENT STEP
  ========================= */
  function validateCurrentStep() {
    const step = steps[currentStep];

    /* ---- Text, email, select, textarea ---- */
    const fields = step.querySelectorAll(
      "input:not([type='radio']):not([type='checkbox']), select, textarea"
    );

    for (let field of fields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }

    /* ---- Radio groups ---- */
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

    /* ---- Checkboxes (different names, at least one required) ---- */
    const visibleCheckboxes = Array.from(
      step.querySelectorAll("input[type='checkbox']")
    ).filter(cb => cb.offsetParent !== null);

    if (visibleCheckboxes.length > 0) {
      const atLeastOneChecked = visibleCheckboxes.some(cb => cb.checked);
      if (!atLeastOneChecked) {
        alert("Please select at least one option");
        visibleCheckboxes[0].focus();
        return false;
      }
    }

    return true;
  }

  /* =========================
     STEP-4 DISQUALIFICATION
  ========================= */
  const step4 = steps[3];
  const disqualifiedMsg = document.querySelector(".disqualified-msg");

  if (step4) {
    const radiosStep4 = step4.querySelectorAll(
      'input[type="radio"][name="monthly_investment"]'
    );

    radiosStep4.forEach(radio => {
      radio.addEventListener("change", function () {
        if (this.value === "800") {
          isDisqualifiedStep4 = true;
          if (disqualifiedMsg) disqualifiedMsg.style.display = "block";
        } else {
          isDisqualifiedStep4 = false;
          if (disqualifiedMsg) disqualifiedMsg.style.display = "none";
        }
      });
    });
  }

  /* =========================
     NEXT BUTTON
  ========================= */
  nextBtn.addEventListener("click", function (e) {
    e.preventDefault();

    if (!validateCurrentStep()) return;

    syncCheckboxValues(this.closest("form"));

    /* ---- Step-4 disqualified redirect ---- */
    if (currentStep === 3 && isDisqualifiedStep4) {
      window.location.href = "https://velonmedia.com/disqualified";
      return;
    }

    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);
      scrollToTop();
    }
  });

  /* =========================
     PREVIOUS BUTTON
  ========================= */
  prevBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
      scrollToTop();
    }
  });

  /* =========================
     SUBMIT BUTTON
  ========================= */
  if (submitBtn) {
    submitBtn.addEventListener("click", function () {
      syncCheckboxValues(this.closest("form"));
    });
  }

  /* =========================
     SCROLL TO TOP
  ========================= */
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  showStep(currentStep);
});

