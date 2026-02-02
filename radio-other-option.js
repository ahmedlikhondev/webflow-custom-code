window.Webflow ||= [];
window.Webflow.push(function () {

  const otherRadio = document.getElementById('other-radio2');
  const otherInput = document.getElementById('other-radio-input');

  if (!otherRadio || !otherInput) return;

  // Initial state
  otherInput.style.display = 'none';
  otherInput.required = false;

  // Listen to radio group change
  document.addEventListener('change', function (e) {

    // If "Other" radio is selected
    if (otherRadio.checked) {
      otherInput.style.display = 'block';
      otherInput.required = true;
      otherInput.focus();
    } else {
      otherInput.style.display = 'none';
      otherInput.required = false;
      otherInput.value = '';
    }

  });

});
