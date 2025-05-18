

let userProfileData = null;

const avatarPreview = document.getElementById('profile-avatar-preview');
const avatarInput = document.getElementById('profile-avatar');
const avatarUploadBtn = document.getElementById('avatar-upload-btn');
const avatarRemoveBtn = document.getElementById('avatar-remove-btn');
const avatarWrapper = document.getElementById('avatar-item');

avatarUploadBtn.addEventListener('click', (e) => {
  e.preventDefault();

  avatarInput.click();
});

avatarWrapper.addEventListener('dragover', function(e) {
  e.preventDefault();
  e.stopPropagation();
  avatarWrapper.classList.add('dragover');
});
avatarWrapper.addEventListener('dragleave', function(e) {
  e.preventDefault();
  e.stopPropagation();
  avatarWrapper.classList.remove('dragover');
});
avatarWrapper.addEventListener('drop', function(e) {
  e.preventDefault();
  e.stopPropagation();
  avatarWrapper.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {

    const reader = new FileReader();
    reader.onload = function(ev) {
      avatarPreview.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    avatarInput.files = e.dataTransfer.files;

    const formData = new FormData();
    formData.append('action', 'uploadAvatar');
    formData.append('avatar', file);

    fetch('./api/profile_change.php', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user && data.user.url_avatar) {
          avatarPreview.src = '../' + data.user.url_avatar;
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      });
  }
});

const resetButton = document.getElementById('button-cancel-profile');
resetButton.addEventListener('click',() => {
  addNonActiveToButtons();
  fillProfileForm(userProfileData);
  clearInputErrorAll();
});



avatarRemoveBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();

  fetch('./api/profile_change.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ action: 'regenerateAvatar' }).toString()
  })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.user && data.user.url_avatar) {
        avatarPreview.src = '../' + data.user.url_avatar;
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        avatarPreview.src = './img/icon/avatar_dir_white.png';
      }
    });
});

avatarInput.addEventListener('change', function (e) {
  e.preventDefault();
  e.stopPropagation();

  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('action', 'uploadAvatar');
  formData.append('avatar', file);

  fetch('./api/profile_change.php', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.user && data.user.url_avatar) {
        avatarPreview.src = '../' + data.user.url_avatar;
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    });
});

const form = document.getElementById('profile-form');

const firstNameInput = form['first-name'];
const lastNameInput = form['last-name'];
const genderInput = form['gender'];
const birthdayInput = form['birthday'];
const passwordInput = form['password'];
const confirmPasswordInput = form['confirm-password'];

function fillProfileForm(data) {
  if (!data) return;
  firstNameInput.value = data.first_name || '';
  lastNameInput.value = data.last_name || '';
  genderInput.value = data.gender || 'selected';
  birthdayInput.value = data.birthday || '';
  passwordInput.value = '';
  confirmPasswordInput.value = '';

  if (data.url_avatar) {
    avatarPreview.src = '../' + data.url_avatar;
  } else {
    avatarPreview.src = './img/icon/avatar_dir_white.png';
  }
}

const saveBtn = document.getElementById('button-save-profile');
saveBtn.addEventListener('click', (event) => {
  event.preventDefault();
  let res = trySaveData(event);
  if (res) {
    addNonActiveToButtons();
  }
});

const inputsData = [
  firstNameInput,
  lastNameInput,
  genderInput,
  birthdayInput
];

const inputsPassword = [
  passwordInput,
  confirmPasswordInput
];


function isEmptyInputData() {
  for (const input of inputsData) {
    if (isEmpty(input)) {
      showInputError(input, 'Field cannot be empty.');
      return true;
    }
  }
  return false;
}


function isRequiredPassword() {
  if (!isEmpty(passwordInput) || !isEmpty(confirmPasswordInput)) 
    return true;
  return false;
}

function isEmptyInputPassword() {
  if (isRequiredPassword()) {
    if (isEmpty(passwordInput)) {
      showInputError(passwordInput, 'Field cannot be empty.');
      return true;
    } else if (isEmpty(confirmPasswordInput)) {
      showInputError(confirmPasswordInput, 'Field cannot be empty.');
      return true;
    }
    return false;
  }
}

const inputs = [
  firstNameInput,
  lastNameInput,
  genderInput,
  birthdayInput,
  passwordInput,
  confirmPasswordInput
];


inputs.forEach((input) => {
  input.addEventListener("input", isCorrectValue);
  input.addEventListener("focus", isCorrectValue);
});

function clearInputErrorAll() {
  inputs.forEach((input) => {
    clearInputError(input);
  });
}


function  isFormChanged() {
  return !(
    firstNameInput.value === (userProfileData?.first_name || '') &&
    lastNameInput.value === (userProfileData?.last_name || '') &&
    genderInput.value === (userProfileData?.gender || 'selected') &&
    birthdayInput.value === (userProfileData?.birthday || '') &&
    passwordInput.value === '' &&
    confirmPasswordInput.value === ''
  );
}

function isCorrectValue() {
  const isUnchanged = !isFormChanged();
  if (isUnchanged) {
    addNonActiveToButtons();
  } else {
    removeNonActiveFromButtons();
  }
  
  clearInputErrorAll();

  let errorText;

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
  errorText = checkValidDate(birthdayInput.value);
  if (errorText) {
    showInputError(birthdayInput, errorText);
    return false;
  }
  
  if (isRequiredPassword()) {
    errorText = checkValidPassword(passwordInput.value);
    if (errorText) {
      showInputError(passwordInput, errorText);
      return false;
    }
    if (passwordInput.value !== confirmPasswordInput.value) {
      showInputError(confirmPasswordInput, 'Passwords do not match.');
      return false;
    }
  }

  return true;
}

function resetInputs() {
  fillProfileForm(userProfileData);
  clearInputErrorAll();
}

window.addEventListener('DOMContentLoaded', () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    console.log('User data loaded from localStorage:', user);
    if (user) {
      userProfileData = { ...user }; 
      resetInputs();
    }
  } catch (e) {
    console.error('Failed to load user data:', e);
  }

  
});

function trySaveData() {
  if (isEmptyInputData()) return;
  if (!isCorrectValue()) return;

  const data = {
    action: 'updateData',
    first_name: firstNameInput.value,
    last_name: lastNameInput.value,
    gender: genderInput.value,
    birthday: birthdayInput.value,
    password: passwordInput.value,
    password_repeat: confirmPasswordInput.value,
  };

  console.log('Data to save:', data);

  fetch('./api/profile_change.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(data).toString()
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      console.log('Save successful:', result);
      userProfileData = result.user;
      localStorage.setItem('user', JSON.stringify(result.user));
      console.log('User data:', result.user);
      return true;
    } else if (result.errors) {
      console.log('Save failed:', result.errors);
      Object.entries(result.errors).forEach(([field, message]) => {
        const input = form[field] || document.getElementById(field);
        if (input) showInputError(input, message);
      });
      return false;
    } else if (result.message) {
      console.log('Save message:', result.message);
      alert(result.message);
      return false;
    }
  })
  .catch(() => {
    console.log('Save failed. Please try again later.');
    alert('Save failed. Please try again later.');
    return false;
  });
}

function addNonActiveToButtons() {
  resetButton.classList.add('non-active');
  saveBtn.classList.add('non-active');
}

function removeNonActiveFromButtons() {
  resetButton.classList.remove('non-active');
  saveBtn.classList.remove('non-active');
}

window.addEventListener('beforeunload', function (e) {
  if (isFormChanged()) {
    e.preventDefault();
    e.returnValue = '';
    return '';
  }
});

document.addEventListener('click', function (e) {
  const target = e.target.closest('a');
  if (
    target &&
    target.href &&
    !target.href.endsWith('profile.php') &&
    isFormChanged()
  ) {
    e.preventDefault();
    if (confirm('You have unsaved changes. Are you sure you want to leave? All changes will be discarded.')) {
      window.onbeforeunload = null;
      window.location.href = target.href;
    }
  }
});