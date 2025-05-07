function showInputError(input, message) {
  const errorDiv = document.getElementById('error-' + input.id);
  input.classList.add('input-error');
  const textSpan = errorDiv.querySelector('.error-text-content');
  textSpan.textContent = message;
  errorDiv.style.display = 'block';
}

function clearInputError(input) {
  const errorDiv = document.getElementById('error-' + input.id);
  input.classList.remove('input-error');
  const textSpan = errorDiv.querySelector('.error-text-content');
  textSpan.textContent = '';
  errorDiv.style.display = 'none';
}

function isEmpty(input) {
  return input.value.trim() === "" || input.value === "selected";
}

function checkValidGroupName(name) {
  if (name === "") return null;

  const pattern = /^[А-ЯІЇЄҐ]{2}-[1-4][1-9]$/u;

  if (!pattern.test(name)) {
    if (!/^[А-ЯІЇЄҐ]{2}-\d{2}$/u.test(name)) {
      return "Group must start with two uppercase Ukrainian letters, then a dash and two digits.";
    }
    if (!/^[А-ЯІЇЄҐ]{2}-[1-4][1-9]$/u.test(name)) {
      const digits = name.slice(-2);
      if (!/[1-4]/.test(digits[0])) {
        return "The first digit after the dash must be from 1 to 4 (course number).";
      }
      if (!/[1-9]/.test(digits[1])) {
        return "The second digit after the dash must be from 1 to 9 (group number).";
      }
    }
    return "Incorrect group format. Example: АБ-11";
  }

  return null;
}

function checkValidPassword(password) {
  if (password === "") return null;

  const allowedPattern = /^[A-Za-z0-9_!]+$/;
  if (!allowedPattern.test(password)) {
    return "Password can contain only English letters, digits, _ and !";
  }

  if (password.length < 7) {
    return "Password must be at least 7 characters long.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one digit.";
  }

  return null;
}
function checkValidDate(date) {
  if (date === "") return null;

  let patternDate = /^\d{4}-\d{2}-\d{2}$/;
  if (!patternDate.test(date)) 
    return "Incorrect date format. Please use YYYY-MM-DD.";

  let [year, month, day] = date.split("-").map(Number);
  let currentYear = new Date().getFullYear();
  if (year < currentYear - 80 || year > currentYear - 16)
    return `Year must be between ${currentYear - 80} and ${currentYear - 16}.`;

  if (month < 1 || month > 12) 
    return "Month must be between 01 and 12.";
    
  let daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) 
    return `Day must be between 01 and ${daysInMonth} for the selected month.`;
     
  return null;
}
  
function checkValidName(name) {
  if (name === "") return null;

  const patternName = /^[A-Z]([a-z`']{1,17})?[a-z](-\b[A-Z]([a-z`']{0,17})?[a-z])?$/;

  if (!patternName.test(name)) {
    if (/@(.)*(\.com)/.test(name))
      return "Enter name, not email.";

    if (/(\b[`']\B|\B[`']\b)/.test(name)) 
      return "Apostrophe is allowed only in the middle of name.";
      
    if (/\s/.test(name)) 
      return "Spaces are not allowed in the name.";

    if (/\b[A-Za-z]{20,}/.test(name)) 
      return "The part of name cannot be longer than 20 characters.";

    if (/\b[a-z]/.test(name)) 
      return  "Each part of the name must start with an uppercase letter.";

    if (/[^A-Za-z-]/.test(name)) 
      return  "Only letters and a hyphen as a separator are allowed.";

    if (/[A-Z](.)*[A-Z]/.test(name)) 
      return  "Only the first letter of each part should be uppercase.";

    if ((name.match(/-/g) || []).length > 1) 
      return "The name can have a maximum of two parts.";

    if (/\b[A-Z](-|$)/.test(name)) 
      return  "Each name part must contain at least two letters.";

    if (/^-|-$|[a-z]-[A-Z]/.test(name)) 
      return  "The hyphen can only be used between two name parts.";

    return  "Uncorrect name format.";
  }

  return null;
}

function checkValidEmail(email, isStudent) {
  console.log("checkValidEmail")
  if (email === "") return null;
  console.log(email);
  console.log(isStudent);

  let match = null;
  let pattern;
  if (isStudent) {
    pattern = /^([a-z`']+)\.([a-z`']+)\.([a-z`']{1,4})\.(\d{4})@lpnu\.ua$/i;
    match = email.match(pattern);
    if (match) return null;
  } else {
    pattern = /^[a-z0-9-.]+@lpnu\.ua$/i;
    match = email.match(pattern);
    if (match) return null;
  }
    
  const lpnuDomain = /@lpnu\.ua$/;
  match = email.match(lpnuDomain);
  if (!match) 
    return "Email must end with @lpnu.ua.";

  const localPart = email.split('@')[0];
  if(localPart === "")
    return "The part before @lpnu.ua cannot be empty.";

  if (localPart.length > 20) 
    return "The part before @lpnu.ua must be less than 30 characters.";

  if (/[A-Z]/.test(localPart)) 
    return "Only lowercase letters are allowed before @lpnu.ua.";

  if (isStudent) {
    if (!/^[a-z0-9.\-]+$/i.test(localPart)) 
      return "Only a-z, 0-9 and dot are allowed before @lpnu.ua.";

    if (!email.match(pattern)) 
      return "Student email must be in the format name.surname.speciality(short form).year@lpnu.ua";

    const year = parseInt(match[4], 10);
    console.log(year);
    let currentYear = new Date().getFullYear();
    if (year < currentYear - 80 || year > currentYear - 16) 
      return `Year in email must be between ${currentYear - 80} and ${currentYear - 16}.`;

  } else {
    
    if (!/^[a-z0-9.\-`']+$/i.test(localPart)) 
      return "Only a-z, 0-9, dot and hyphen are allowed before @lpnu.ua.";
  }
}