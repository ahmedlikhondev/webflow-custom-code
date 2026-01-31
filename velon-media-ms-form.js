window.Webflow ||= [];
window.Webflow.push(function () {

  // Small delay to ensure Webflow fully renders checkboxes
  setTimeout(() => {

    const steps = document.querySelectorAll(".form-step-v2");
    const nextBtn = document.querySelector(".next-btn-v2");
    const prevBtn = document.querySelector(".prev-btn-v2");
    const submitBtn = document.querySelector(".submit-button-v2");

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
        if (hidden) hidden.value = cb.checked ? "true" : "false";
      });
    }

    /* =========================
       VALIDATE CHECKBOXES (at least one across all groups)
    ========================= */
    function validateCheckboxStep(step) {
      const visibleCheckboxes = Array.from(
        step.querySelectorAll("input[type='checkbox']")
      ).filter(cb => cb.offsetParent !== null);

      if (visibleCheckboxes.length === 0) return true;

      // Group checkboxes by name
      const checkboxGroups = {};
      visibleCheckboxes.forEach(cb => {
        if (!checkboxGroups[cb.name]) checkboxGroups[cb.name] = [];
        checkboxGroups[cb.name].push(cb);
      });

      // Require at least one checked among all groups
      const anyChecked = Object.values(checkboxGroups).some(group =>
        group.some(cb => cb.checked)
      );

      if (!anyChecked) {
        alert("Please select at least one option");
        visibleCheckboxes[0].focus();
        return false;
      }

      return true;
    }

    /* =========================
       VALIDATE CURRENT STEP
    ========================= */
    function validateCurrentStep() {
      const step = steps[currentStep];

      // text, email, select, textarea
      const fields = step.querySelectorAll(
        "input:not([type='radio']):not([type='checkbox']), select, textarea"
      );

      for (let field of fields) {
        if (!field.checkValidity()) {
          field.reportValidity();
          return false;
        }
      }

      // radio groups
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

      // checkbox validation
      if (!validateCheckboxStep(step)) return false;

      return true;
    }

    /* =========================
       STEP-4 DISQUALIFICATION
    ========================= */
    const step4 = steps[3];
    const disqualifiedMsg = document.querySelector(".disqualified-msg");

    if (step4) {
      step4
        .querySelectorAll('input[type="radio"][name="monthly_investment"]')
        .forEach(radio => {
          radio.addEventListener("change", function () {
            isDisqualifiedStep4 = this.value === "800";
            if (disqualifiedMsg) {
              disqualifiedMsg.style.display = isDisqualifiedStep4 ? "block" : "none";
            }
          });
        });
    }

    /* =========================
       OTHER OPTION TOGGLE (checkbox + radio)
    ========================= */
    function setupOtherInputs() {
      // checkbox "Other"
      document.querySelectorAll(".checkbox-other").forEach(cb => {
        const wrapper = cb.closest(".other-wrapper");
        if (!wrapper) return;
        const input = wrapper.querySelector(".other-input");
        if (!input) return;

        input.style.display = cb.checked ? "block" : "none";
        input.required = cb.checked;

        cb.addEventListener("change", function () {
          if (this.checked) {
            input.style.display = "block";
            input.required = true;
            input.focus();
          } else {
            input.style.display = "none";
            input.required = false;
            input.value = "";
          }
        });
      });

      // radio "Other"
      document.querySelectorAll(".radio-other").forEach(rb => {
        const wrapper = rb.closest(".other-wrapper");
        if (!wrapper) return;
        const input = wrapper.querySelector(".other-input");
        if (!input) return;

        input.style.display = rb.checked ? "block" : "none";
        input.required = rb.checked;

        const radios = wrapper.querySelectorAll(`input[type="radio"][name="${rb.name}"]`);
        radios.forEach(radio => {
          radio.addEventListener("change", function () {
            if (rb.checked) {
              input.style.display = "block";
              input.required = true;
              input.focus();
            } else {
              input.style.display = "none";
              input.required = false;
              input.value = "";
            }
          });
        });
      });
    }

    setupOtherInputs();

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

  }, 100); // small delay for Webflow CDN
});

