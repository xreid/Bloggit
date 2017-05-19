function checkInput() {
  var username = document.getElementById('username').value.trim();
  var password = document.getElementById('password').value.trim();
  var captcha = document.getElementById('captcha').value.trim();
  if (!username) {
    alert('Enter username');
    return false;
  }
  if (!password) {
    alert('Enter password');
    return false;
  }
  if (!captcha || captcha.length != 4) {
    alert('Invalid captcha');
    return false;
  }
  return true;
}
