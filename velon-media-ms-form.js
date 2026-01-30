<script>
document.addEventListener("DOMContentLoaded", function () {

  const steps = document.querySelectorAll(".form-step-v2");
  const nextBtn = document.querySelector(".next-btn-v2");
  const prevBtn = document.querySelector(".prev-btn-v2");
  const submitBtn = document.querySelector(".submit-button-v2");

  let currentStep = 0;
  let isDisqualifiedStep4 = false;

  if (submitBtn) submitBtn.style.display = "none";

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

  const step4 = steps[3];
  const radiosStep4 = step4.querySelectorAll(
    'input[type="radio"][name="monthly_investment"]'
  );

  radiosStep4.forEach(radio => {
    radio.addEventListener("change", function () {
      if (this.value === "800") {
        isDisqualifiedStep4 = true;
        disqualifiedMsg.style.display = "block";
      } else {
        isDisqualifiedStep4 = false;
        disqualifiedMsg.style.display = "none";
      }
    });
  });

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
    }
  });

  prevBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  });

  showStep(currentStep);
});
</script>

<script>
document.addEventListener("DOMContentLoaded", function () {

  const nextBtn = document.querySelector(".next-btn-v2");
  const prevBtn = document.querySelector(".prev-btn-v2");

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // change to "auto" if you want instant jump
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      setTimeout(scrollToTop, 50);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      setTimeout(scrollToTop, 50);
    });
  }

});
</script>
