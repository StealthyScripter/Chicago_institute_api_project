var form = document.querySelector('.newsletter form');
form.addEventListener('submit', function(event) {
  event.preventDefault();
  var emailInput = document.querySelector('.newsletter input[type="text"]');
  var email = emailInput.value;
  if (!isValidEmail(email)) {
    alert('Please enter a valid email address');
    emailInput.focus();
    return;
  }
  form.submit();
});

function isValidEmail(email) {
  var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

function loadContent(page) {
    fetch(page + '.html')
      .then(response => response.text())
      .then(html => {
        document.getElementById('content-container').innerHTML = html;
      });
  }
