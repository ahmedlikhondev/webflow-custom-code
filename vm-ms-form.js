window.Webflow ||= [];
window.Webflow.push(function () {

  const steps = document.querySelectorAll(".form-step");
  const nextBtn = document.querySelector(".next-btn");
  const prevBtn = document.querySelector(".prev-btn");
  const submitBtn = document.querySelector(".submit-button");

  if (!steps.length || !nextBtn || !prevBtn) return;

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
    if (!form) return;

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

    /* ---- Text / Select / Textarea ---- */
    const fields = step.querySelectorAll(
      "input:not([type='radio']):not([type='checkbox']), select, textarea"
    );

    for (const field of fields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }

    /* ---- Radio Groups ---- */
    const radioGroups = {};
    step.querySelectorAll("input[type='radio']").forEach(radio => {
      if (!radioGroups[radio.name]) radioGroups[radio.name] = [];
      radioGroups[radio.name].push(radio);
    });

    for (const name in radioGroups) {
      const group = radioGroups[name];
      const required = group.some(r => r.required);
      const checked = group.some(r => r.checked);

      if (required && !checked) {
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

    if (visibleCheckboxes.length) {
      const oneChecked = visibleCheckboxes.some(cb => cb.checked);
      if (!oneChecked) {
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
        const disqualified = this.value === "800";
        isDisqualifiedStep4 = disqualified;

        if (disqualifiedMsg) {
          disqualifiedMsg.style.display = disqualified ? "block" : "none";
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  showStep(currentStep);
});
