window.Webflow ||= [];
window.Webflow.push(function () {
  
  /* =========================
   OTHER OPTION TOGGLE
========================= */
function setupOtherInputs() {
  // CHECKBOX "Other"
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

  // RADIO "Other"
  document.querySelectorAll(".radio-other").forEach(rb => {
    const wrapper = rb.closest(".other-wrapper");
    if (!wrapper) return;
    const input = wrapper.querySelector(".other-input");
    if (!input) return;

    // initialize visibility
    input.style.display = rb.checked ? "block" : "none";
    input.required = rb.checked;

    // on change of any radio in the same group
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

// initialize on DOM ready
setupOtherInputs();
