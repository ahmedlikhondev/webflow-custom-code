document.addEventListener("DOMContentLoaded", function () {

  const steps = document.querySelectorAll(".form-step-v2");
  const nextBtn = document.querySelector(".next-btn-v2");
  const prevBtn = document.querySelector(".prev-btn-v2");
  const submitBtn = document.querySelector(".submit-button-v2");
  const disqualifiedMsg = document.querySelector(".disqualified-msg");

  let currentStep = 0;
  let isDisqualifiedStep4 = false;

  if (submitBtn) submitBtn.style.display = "none";

  function showStep(index) {
    steps.forEach(step => step.classList.remove("active"));
    steps[index].classList.add("active");

    if (prevBtn)
      prevBtn.style.display = index === 0 ? "none" : "inline-block";

    if (index === steps.length - 1) {
      if (nextBtn) nextBtn.style.display = "none";
      if (submitBtn) submitBtn.style.display = "inline-block";
    } else {
      if (nextBtn) nextBtn.style.display = "inline-block";
      if (submitBtn) submitBtn.style.display = "none";
    }
  }

  function validateCurrentStep() {
    const step = steps[currentStep];
    if (!step) return false;

    const fields = step.querySelectorAll(
      "input:not([type='radio']):not([type='checkbox']), select, textarea"
    );

    for (let field of fields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }
    return true;
  }

  const step4 = steps[3];
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

  if (nextBtn) {
    nextBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (!validateCurrentStep()) return;

      if (currentStep === 3 && isDisqualifiedStep4) {
        window.location.href =
          "https://velonmedia-js-form.webflow.io/disqualified";
        return;
      }

      if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  if (steps.length) showStep(currentStep);
});
