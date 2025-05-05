function isValidDate(date) {
  let isValid = false;

  do {
    let patternDate = /^\d{4}-\d{2}-\d{2}$/;
    if (!patternDate.test(date)) {
      errorText.textContent = "Incorrect date format. Please use YYYY-MM-DD.";
      break;
    }

    let [year, month, day] = date.split("-").map(Number);
    let currentYear = new Date().getFullYear();

    if (year < currentYear - 80 || year > currentYear - 16) {
      errorText.textContent = `Year must be between ${currentYear - 80} and ${currentYear - 16}.`;
      break;
    }

    if (month < 1 || month > 12) {
      errorText.textContent = "Month must be between 01 and 12.";
      break;
    }

    let daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) {
      errorText.textContent = `Day must be between 01 and ${daysInMonth} for the selected month.`;
      break;
    }

    isValid = true;
  } while (0);

  return isValid;
}
  
function isValidName(name, error = errorText) {
  let isValid = false;
  const patternName = /^[A-Z]([a-z`']{1,17})?[a-z](-\b[A-Z]([a-z`']{0,17})?[a-z])?$/;


  if (!patternName.test(name)) {
    if (/@(.)*(\.com)/.test(name)) {
      error.textContent = "Enter name, not email.";

    } else if (/(\b[`']\B|\B[`']\b)/.test(name)) {
      error.textContent = "Apostrophe is allowed only in the middle of name.";
      
    } else if (/\s/.test(name)) 
      error.textContent = "Spaces are not allowed in the name.";

    else if (/\b[A-Za-z]{20,}/.test(name)) 
      error.textContent = "The part of name cannot be longer than 20 characters.";

    else if (/\b[a-z]/.test(name)) 
      error.textContent =  "Each part of the name must start with an uppercase letter.";

    else if (/[^A-Za-z-]/.test(name)) 
      error.textContent =  "Only letters and a hyphen as a separator are allowed.";

    else if (/[A-Z](.)*[A-Z]/.test(name)) 
      error.textContent =  "Only the first letter of each part should be uppercase.";

    else if ((name.match(/-/g) || []).length > 1) 
      errorTexDt.textContent = "The name can have a maximum of two parts.";

    else if (/\b[A-Z](-|$)/.test(name)) 
      error.textContent =  "Each name part must contain at least two letters.";

    else if (/^-|-$|[a-z]-[A-Z]/.test(name)) 
      error.textContent =  "The hyphen can only be used between two name parts.";

    else  
      error.textContent =  "Uncorrect name format.";
  
  } else 
    isValid = true;

  return isValid;
}

function isValidEmail(email, isStudent, error = errorText) {
  let isValid = true;

  do {

    if (isStudent) {
      const studentPattern = /^([a-z`']+)\.([a-z`']+)\.([a-z`']{1,4})\.(\d{4})@lpnu\.ua$/i;
      match = email.match(studentPattern);
      if (match) break
    } else {
      const teacherPattern = /^[a-z0-9-.]+@lpnu\.ua$/i;
      match = email.match(teacherPattern);
      if (match) break
    }
    
    isValid = false;
 
    const lpnuDomain = /@lpnu\.ua$/;
    const match = email.match(lpnuDomain);
    if (!match) {
      error.textContent = "Email must end with @lpnu.ua.";
      break;
    } 
    
    const localPart = email.split('@')[0];

    if (/[A-Z]/.test(localPart)) {
      error.textContent = "Only lowercase letters are allowed before @lpnu.ua.";
      break;
    }
  
    if (isStudent) {
      const year = parseInt(match[4], 10);
      let currentYear = new Date().getFullYear();
      if (year < currentYear - 80 || year > currentYear - 16) {
        error.textContent = `Year in email must be between ${currentYear - 80} and ${currentYear - 16}.`;
        break;
      }

      if (!/^[a-z0-9.\-]+$/i.test(localPart)) {
        error.textContent = "Only a-z, 0-9 and dot are allowed before @lpnu.ua.";
        break;
      }

      if (!match) {
        error.textContent = "Student email must be in the format name.surname.speciality(short form).year@lpnu.ua";
        break;
      }
    } else {
      
      if (!/^[a-z0-9.\-`']+$/i.test(localPart)) {
        error.textContent = "Only a-z, 0-9, dot and hyphen are allowed before @lpnu.ua.";
        break;
      }
    }
  } while (false);

  return isValid;
}