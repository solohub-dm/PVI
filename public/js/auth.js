const getElement = document.querySelector.bind(document);

const form = getElement('#auth-form');

const firstNameInput = form['first-name'];
const lastNameInput = form['last-name'];
const genderInput = form['gender'];
const roleInput = form['role'];
const groupInput = form['group'];
const birthdayInput = form['birthday'];
const emailInput = form['email'];
const passwordInput = form['password'];
const confirmPasswordInput = form['confirm-password'];

const groupField = getElement("#form-item-group");
roleInput.addEventListener("change", function () {
  const selectedValue = roleInput.value;
  if (selectedValue === "Student") {
    groupField.style.display = "flex";
  } else {
    groupField.style.display = "none";
  }
});

const toggleAuthModeButtonReg = getElement('#toggle-auth-mode-reg');
const toggleAuthModeButtonSign = getElement('#toggle-auth-mode-sign');
const authSubmitButton = getElement('#auth-submit');
const panel = getElement('#wrapped-window-panel-login');

let isRegisterMode = false;
function toggleAuthMode() {
  isRegisterMode = !isRegisterMode;
  resetInputs();
  console.log("isRegisterMode: ", isRegisterMode);
  panel.classList.toggle('register-mode', isRegisterMode);
  panel.classList.toggle('signin-mode', !isRegisterMode);
}

toggleAuthModeButtonReg.addEventListener('click', toggleAuthMode);
toggleAuthModeButtonSign.addEventListener('click', toggleAuthMode);

authSubmitButton.addEventListener('click', tryAuth);
function tryAuth(event) {
  event.preventDefault();

  if (isRegisterMode) 
    tryRegister();
  else 
    tryLogin();
}

const inputLogin = [
  emailInput,
  passwordInput
];

const inputRegister = [
  firstNameInput,
  lastNameInput,
  genderInput,
  roleInput,
  birthdayInput,
  emailInput,
  passwordInput,
  confirmPasswordInput
];

function isEmptyInputLogin() {

  inputLogin.forEach((input) => {
    if (isEmpty(input)) {
      showInputError(input, 'Field cannot be empty.');
      return true;
    }
  });
  return false;
}

function clearInputErrorLogin() {
  inputLogin.forEach((input) => {
    clearInputError(input);
  });
}

function isEmptyInputRegister() {
  
  inputRegister.forEach((input) => {
    if (isEmpty(input)) {
      showInputError(input, 'Field cannot be empty.');
      return true;
    }
  });
  if (role === "Student" && isEmpty(groupInput)) {
    showInputError(groupInput, 'Field cannot be empty.');
    return true;
  }

  return false;
}

function clearInputErrorRegister() {
  inputRegister.forEach((input) => {
    clearInputError(input);
  });
  clearInputError(groupInput);
}


const inputCheck = [
  firstNameInput,
  lastNameInput,
  roleInput,
  groupInput,
  birthdayInput,
  emailInput,
  passwordInput
];

inputCheck.forEach((input) => {
  input.addEventListener("input", isCorrectValue);
  input.addEventListener("focus", isCorrectValue);
});

function isCorrectValue() {
  clearInputErrorLogin();
  if (isRegisterMode) {
    clearInputErrorRegister();
  }

  let errorText;
  if (isRegisterMode) {
    errorText = checkValidName(firstNameInput.value);
    if (errorText) {
      showInputError(firstNameInput, errorText);
      return false;
    }
    errorText = checkValidName(lastNameInput.value);
    if (errorText) {
      showInputError(lastNameInput, errorText);
      return false;
    }
    errorText = checkValidGroupName(groupInput.value);
    if (errorText) {
      showInputError(groupInput, errorText);
      return false;
    }
    errorText = checkValidDate(birthdayInput.value);
    if (errorText) {
      showInputError(birthdayInput, errorText);
      return false;
    }
  }

  errorText = checkValidEmail(emailInput.value, isRegisterMode && role.value === "student");
  console.log("errorText: ", errorText);
  if (errorText) {
    showInputError(emailInput, errorText);
    return false;
  }
  
  if (isRegisterMode) {
    errorText = checkValidPassword(passwordInput.value);
    if (errorText) {
      showInputError(passwordInput, errorText);
      return false;
    }
  }

  return true;
}

function resetInputs() {
  form.reset();
  clearInputErrorLogin();
  clearInputErrorRegister();
}

window.addEventListener('DOMContentLoaded', () => {
  resetInputs();
});


function tryRegister() {
  if (!isCorrectValue()) return;
  if (isEmptyInputRegister()) return;

  const data = {
    first_name: firstNameInput.value,
    last_name: lastNameInput.value,
    gender: genderInput.value,
    role: roleInput.value,
    birthday: birthdayInput.value,
    email: emailInput.value,
    password: passwordInput.value,
    password_repeat: confirmPasswordInput.value,
    group_name: groupInput.value
  };

  fetch('./api/register.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(data).toString()
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      console.log('Registration successful:', result);
      // localStorage.setItem('user', JSON.stringify(result.user));
      console.log('User data:', result.user);
      window.location.href = './index.php';
    } else if (result.errors) {
      console.log('Registration failed:', result.errors);
      Object.entries(result.errors).forEach(([field, message]) => {
        const input = form[field] || document.getElementById(field);
        if (input) showInputError(input, message);
      });
    } else if (result.message) {
      console.log('Registration message:', result.message);
      alert(result.message);
    }
  })
  .catch(() => {
    console.log('Registration failed. Please try again later.');
    alert('Registration failed. Please try again later.');
  });
  console.log('Registration data:', data);
}

function tryLogin() {
  if (!isCorrectValue()) return;
  if (isEmptyInputLogin()) return;

  const data = {
    email: emailInput.value,
    password: passwordInput.value
  };

  fetch('./api/login.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(data).toString()
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      // localStorage.setItem('user', JSON.stringify(result.user));
      window.location.href = './index.php';
    } else if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        const input = form[field] || document.getElementById(field);
        if (input) showInputError(input, message);
      });
    } else if (result.message) {
      alert(result.message);
    }
  })
  .catch(() => {
    alert('Login failed. Please try again later.');
  });
}

function fillTestRegisterData() {
  firstNameInput.value = "Test";
  lastNameInput.value = "User";
  genderInput.value = "Male";
  roleInput.value = "teacher";
  birthdayInput.value = "2003-05-06";
  emailInput.value = "test.user@lpnu.ua ";
  passwordInput.value = "Test123!";
  confirmPasswordInput.value = "Test123!";
  groupInput.value = "АБ-11";
  // Якщо поле групи приховане, показати його
  if (groupField) groupField.style.display = "none";
}

document.addEventListener('keydown', function (e) {
  if (e.key === '*') {
    fillTestRegisterData();
  }
});


