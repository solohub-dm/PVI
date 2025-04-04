const tableBody = getElement("#table-body");
const headCbxItem = getElement("#checkbox-table-head");

const addTableText = getElement("#add_student");
const editTableText = getElement("#edit_student");

const windowShadowPanelConfirm = getElement("#wrapped-shadow-panel-confirm");
const cancelConfirmWindowButton = getElement("#button-cancel-confirm");
const confirmConfirmWindowButton = getElement("#button-confirm-confirm");
const textConfirmWindow = getElement("#text-confirm-window");
const closeWindowIconCnf = getElement("#icon-close-window-confirm");

const windowShadowPanelRedact = getElement("#wrapped-shadow-panel-redact");
const confirmTableText = getElement("#text-confirm");
const confirmTableButton = getElement("#button-confirm");
const cancelTableButton = getElement("#button-cancel");
const saveTableButton = getElement("#button-save");
const createTableButton = getElement("#button-create");
const closeWindowIconRdc = getElement("#icon-close-window-redact");

const windowShadowPanelInfo = getElement("#wrapped-shadow-panel-info");
const closeWindowIconInfo = getElement("#icon-close-window-info");
const group_name_span = getElement("#group-span");
const first_name_span = getElement("#first-name-span");
const last_name_span = getElement("#last-name-span");
const gender_span = getElement("#gender-span");
const birth_date_span = getElement("#birthday-date-span");

const deleteTableIcon = getElement("#icon-delete-table");
const addTableIcon = getElement("#icon-add-row");
const editTableIcon = getElement("#icon-edit-row");

const errorText = getElement("#error-text");
const form_input = getElement("#form-student");
const group_name_input = getElement("#select-group");
const first_name_input = getElement("#first-name");
const last_name_input = getElement("#last-name");
const gender_input = getElement("#select-gender");
const birth_date_input = getElement("#birthday-date");

const usernameText = getElement("#profile-username");
const avatarIcon = getElement("#icon-profile-avatar");

let isAddMode = false;
let isCnfMode = false;

const observer = new MutationObserver(() => {
  bodyCbxItems = document.querySelectorAll(".table-body-checkbox");
  const anyChecked = Array.from(bodyCbxItems).some(
    (checkbox) => checkbox.checked
  );
  headCbxItem.checked = anyChecked;
  if (!anyChecked) offDelete();
});
observer.observe(document.body, { childList: true, subtree: true });

let bodyCbxItems;

closeWindowIconInfo.addEventListener("click", closeInfo);
function closeInfo() {
  windowShadowPanelInfo.style.display = "none";
}
function openInfo(event) {
  if (window.innerWidth > 850) return;

  const clckElem = event.target;
  let td = clckElem.closest("td");
  if (!td) return;

  let colIndex = td.cellIndex;
  if (colIndex === 0 || colIndex === 6) return;

  const row = clckElem.closest("tr");
  const studentId = row.dataset.studentId;

  const studentIndex = students.findIndex((student) => student.id == studentId);
  const student = students[studentIndex];
  if (!student) return;

  group_name_span.textContent = student.group_name;
  first_name_span.textContent = student.full_name.split(" ")[0];
  last_name_span.textContent = student.full_name.split(" ")[1];
  gender_span.textContent = student.gender;
  birth_date_span.textContent = student.birth_date;

  windowShadowPanelInfo.style.display = "flex";
}

headCbxItem.addEventListener("change", headCbxChange);
function headCbxChange() {
  if (bodyCbxItems) {
    if (headCbxItem.checked) onDelete();
    else offDelete();

    bodyCbxItems.forEach((checkbox) => {
      if (checkbox.checked !== headCbxItem.checked) {
        checkbox.checked = headCbxItem.checked;
        lockOptions(checkbox);
      }
    });
  }
}

function bodyCbxChange(event) {
  const checkbox = event.target;
  lockOptions(checkbox);
  if (checkbox.checked) {
    headCbxItem.checked = true;
    onDelete();
  } else {
    const anyChecked = Array.from(bodyCbxItems).some(
      (checkbox) => checkbox.checked
    );
    headCbxItem.checked = anyChecked;
    if (!anyChecked) offDelete();
  }
}

function lockOptions(checkbox) {
  const row = checkbox.closest("tr");
  const cell = row.cells[6];
  const div = cell.firstElementChild;

  if (checkbox.checked) {
    div.querySelectorAll("*").forEach((child) => {
      child.style.pointerEvents = "auto";
    });
    div.style.opacity = 1;
    div.removeAttribute("title");
  } else {
    div.querySelectorAll("*").forEach((child) => {
      child.style.pointerEvents = "none";
    });
    div.style.opacity = 0.3;
    div.setAttribute(
      "title",
      "Options are not available.\nUnlock row to interact."
    );
  }
}

cancelConfirmWindowButton.addEventListener("click", closeConfirmWindow);
closeWindowIconCnf.addEventListener("click", closeConfirmWindow);

function closeConfirmWindow() {
  windowShadowPanelConfirm.style.display = "none";
}

function offDelete() {
  deleteTableIcon.style.opacity = 0.3;
  deleteTableIcon.style.pointerEvents = "none";
}

function onDelete() {
  deleteTableIcon.style.opacity = 1;
  deleteTableIcon.style.pointerEvents = "auto";
}

function openConfirmWindowOne(event) {
  const clckElem = event.target;
  event.stopPropagation();
  const row = clckElem.closest("tr");

  const name = row.cells[2].textContent;
  textConfirmWindow.textContent =
    "Are you sure to delete row with " + name + "`s data?";

  confirmConfirmWindowButton.onclick = () => deleteIconClick(row);

  windowShadowPanelConfirm.style.display = "block";
}

function deleteIconClick(row) {
  row.remove();

  let cbx = row.cells[0].firstElementChild;

  const studentId = row.dataset.studentId;
  const studentIndex = students.findIndex((student) => student.id == studentId);
  if (studentIndex !== -1) {
    students.splice(studentIndex, 1);
  }

  const anyChecked = Array.from(bodyCbxItems).some(
    (checkbox) => checkbox.checked
  );
  headCbxItem.checked = anyChecked;
  if (!anyChecked) offDelete();

  closeConfirmWindow();
}

deleteTableIcon.addEventListener("click", openConfirmWindowAll);
function openConfirmWindowAll() {
  windowShadowPanelConfirm.style.display = "block";
  textConfirmWindow.textContent =
    "Are you sure to delete all unlocked rows in the table?";
  confirmConfirmWindowButton.onclick = deleteUnlockRow;
}
function deleteUnlockRow() {
  if (headCbxItem.checked) {
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach((row) => {
      let cbx = row.cells[0].firstElementChild;
      if (cbx.checked) {
        row.remove();

        // const cbxIndex = bodyCbxItems.findIndex((checkbox) => checkbox == cbx);
        // if (cbxIndex !== -1) {
        //   bodyCbxItems.splice(cbxIndex, 1);
        // }

        const studentId = row.dataset.studentId;
        const studentIndex = students.findIndex(
          (student) => student.id == studentId
        );
        if (studentIndex !== -1) {
          students.splice(studentIndex, 1);
        }
      }
    });
    headCbxItem.checked = false;
  }
  closeConfirmWindow();
}

addTableIcon.addEventListener("click", () => openWindow(true));
closeWindowIconRdc.addEventListener("click", closeWindow);

function isFormEmpty() {
  return (
    group_name_input.value == "selected" &&
    first_name_input.value == "" &&
    last_name_input.value == "" &&
    gender_input.value == "selected" &&
    birth_date_input.value == ""
  );
}

function isFormChanged() {
  return !(
    group_name_input.value === student.group_name &&
    first_name_input.value === student.full_name.split(" ")[0] &&
    last_name_input.value === student.full_name.split(" ")[1] &&
    gender_input.value === student.gender &&
    birth_date_input.value === student.birth_date
  );
}

cancelTableButton.addEventListener("click", confirmAction);
function confirmAction() {
  let is;
  let ms;
  if (!isAddMode) {
    is = isFormChanged();
  } else {
    ms = isFormEmpty();
  }

  if ((isAddMode && !ms) || isCnfMode || is) {
    displayButtons();
    isCnfMode = !isCnfMode;
  } else {
    closeWindow();
  }
}

confirmTableButton.addEventListener("click", confirmedCancel);
function confirmedCancel() {
  closeWindow();
}

function displayButtons() {
  let displayDir = isCnfMode ? "block" : "none";
  let displayRev = isCnfMode ? "none" : "block";
  let hidden = isCnfMode ? 0 : 1;

  if (isAddMode) createTableButton.style.display = displayDir;
  else saveTableButton.style.display = displayDir;

  confirmTableButton.style.display = displayRev;
  confirmTableText.style.opacity = hidden;
  confirmTableText.style.cursor = isCnfMode ? "default" : "auto";
}

function openWindow(isOpenInAddMode) {
  isAddMode = isOpenInAddMode;
  if (isOpenInAddMode)
    birth_date_input.value = "2000-01-01";
  displayWindow(true);
}
function closeWindow() {
  displayWindow(false);
  isAddMode = false;
  confirmTableButton.style.display = "none";
  confirmTableText.style.opacity = 0;
  isCnfMode = false;
  form_input.reset();
}

function displayWindow(isDisplayed) {
  let display = isDisplayed ? "block" : "none";
  errorText.textContent = "";
  [
    group_name_input,
    first_name_input,
    last_name_input,
    gender_input,
    birth_date_input
  ].forEach((input) => {
    input.style.backgroundColor = "#ffffff";
  }) ;

  if (isAddMode) {
    addTableText.style.display = display;
    createTableButton.style.display = display;
  } else {
    editTableText.style.display = display;
    saveTableButton.style.display = display;
  }
  windowShadowPanelRedact.style.display = display;
}

first_name_input.addEventListener("input", checkCorrectValue);
last_name_input.addEventListener("input", checkCorrectValue);
birth_date_input.addEventListener("input", checkCorrectValue);
group_name_input.addEventListener("focus", checkCorrectValue);
gender_input.addEventListener("focus", checkCorrectValue);

function checkFormValid() {
  if (!checkCorrectValue() || !checkFormEmpty()) return false;
  return true;
}

function checkCorrectValue() {
  let isValid = false;
  let colorError = "#e77b7b";
 
  errorText.textContent = "";
  [
    group_name_input,
    first_name_input,
    last_name_input,
    gender_input,
    birth_date_input
  ].forEach((input) => {
    input.style.backgroundColor = "#ffffff";
  }) ;

  do {
    let firstName = first_name_input.value;
    if (firstName.trim() !== "" && !isValidName(firstName)) {
      first_name_input.style.backgroundColor = colorError;
      break;
    }

    let lastName = last_name_input.value;
    if (lastName.trim() !== "" && !isValidName(lastName)) {
      last_name_input.style.backgroundColor = colorError;
      break;
    }

    let date = birth_date_input.value;
    if (date.trim() !== "" && !isValidDate(date)) {
      birth_date_input.style.backgroundColor = colorError;
      break;
    }

    isValid = true;
  } while (0);

  return isValid;
}

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

function isValidName(name) {
  let isValid = false;
  const patternName = /^[A-Z]([a-z`']{1,17})?[a-z](-\b[A-Z]([a-z`']{0,17})?[a-z])?$/;


  if (!patternName.test(name)) {
    if (/@(.)*(\.com)/.test(name)) {
      errorText.textContent = "Enter name, not email.";

    } else if (/(\b[`']\B|\B[`']\b)/.test(name)) {
      errorText.textContent = "Apostrophe is allowed in the middle of name.";
    } else if (/\s/.test(name)) 
      errorText.textContent = "Spaces are not allowed in the name.";
    else if (/\b[A-Za-z]{20,}/.test(name)) 
      errorText.textContent = "The part of name cannot be longer than 20 characters.";

    else if (/\b[a-z]/.test(name)) 
      errorText.textContent =  "Each part of the name must start with an uppercase letter.";

    else if (/[^A-Za-z-]/.test(name)) 
      errorText.textContent =  "Only letters and a hyphen as a separator are allowed.";

    else if (/[A-Z][A-Z]/.test(name)) 
      errorText.textContent =  "Only the first letter of each part should be uppercase.";

    else if ((name.match(/-/g) || []).length > 1) 
      errorText.textContent = "The name can have a maximum of two parts.";

    else if (/\b[A-Z](-|$)/.test(name)) 
      errorText.textContent =  "Each name part must contain at least two letters.";

    else if (/^-|-$|[a-z]-[A-Z]/.test(name)) 
      errorText.textContent =  "The hyphen can only be used between two name parts.";

  
  } else 
    isValid = true;



  return isValid;
}

function checkFormEmpty() {
  let isValid = false;
  let colorError = "#e77b7b";

  do {
    if (group_name_input.value === "selected") {
      errorText.textContent = "Enter group name first."
      group_name_input.style.backgroundColor = colorError;
      break;
    } 

    if (first_name_input.value.trim() === "") {
      errorText.textContent = "Enter first name first."
      first_name_input.style.backgroundColor = colorError;
      break;
    }

    if (last_name_input.value.trim() === "") {
      errorText.textContent = "Enter last name first."
      last_name_input.style.backgroundColor = colorError;
      break;
    }

    if (gender_input.value === "selected") {
      errorText.textContent = "Enter group name first."
      gender_input.style.backgroundColor = colorError;
      break;
    } 

    if (birth_date_input.value === "") {
      errorText.textContent = "Enter date first."
      birth_date_input.style.backgroundColor = colorError;
      break;
    }
    
    isValid = true;
  } while (false);

  return isValid;
}

createTableButton.addEventListener("click", tryAddRow);
function tryAddRow() {
  if (checkFormValid()) {
    const new_student = new Student(
      group_name_input.value,
      first_name_input.value + " " + last_name_input.value,
      gender_input.value,
      birth_date_input.value,
      "disabled"
    );

    students.push(new_student);
    addRow(new_student);
    closeWindow();
  }
}

saveTableButton.addEventListener("click", saveForm);
function saveForm() {
  if (checkFormValid()) {
    student.group_name = group_name_input.value;
    student.full_name = first_name_input.value + " " + last_name_input.value;
    student.gender = gender_input.value;
    student.birth_date = birth_date_input.value;

    editRow(student);
    closeWindow();
    student = null;
  }
}

function createElem(tag) {
  return document.createElement(`${tag}`);
}
function addRow(new_student) {
  if (usernameText.textContent === new_student.full_name) {
    new_student.status = "active";
  }

  const new_row = createElem("tr");
  let container = createElem("div");
  let img_edit = createElem("img");
  let img_del = createElem("img");
  let img_stat = createElem("img");
  let checkbox = createElem("input");

  new_row.dataset.studentId = new_student.id;
  new_row.onclick = openInfo;

  checkbox.type = "checkbox";
  checkbox.checked = headCbxItem.checked;
  checkbox.className = "table-body-checkbox";
  checkbox.name = "lock";
  const cbxId = "checkbox-" + new_student.id;
  checkbox.id = cbxId;
  checkbox.onchange = bodyCbxChange;

  let label = createElem("label");
  label.className = "label-hidden";
  label.htmlFor = cbxId;
  label.textContent = "Lock / unlock row";
  

  // checkbox.addEventListener('change', bodyCbxChange);

  img_stat.className = "icon-status";
  img_stat.alt = "status";

  if (new_student.status == "active") img_stat.src = "./img/status_on.png";
  else img_stat.src = "./img/menu_opt.png";

  container.className = "table-button-panel";
  container.setAttribute(
    "title",
    "Functions are not available.\nUnlock row to interact."
  );
  img_edit.src = "./img/edit.png";
  img_del.src = "./img/delete.png";
  img_edit.alt = "edit row";
  img_del.alt = "delete row";
  img_edit.id = "icon-edit-row";
  img_del.id = "icon-delete-row";

  container.append(img_edit, img_del);
  img_edit.dataset.studentId = new_student.id;
  img_del.dataset.studentId = new_student.id;
  img_del.onclick = openConfirmWindowOne;
  img_edit.onclick = editIconClick;

  for (let i = 0; i < 7; i++) new_row.append(createElem("td"));

  new_row.children[0].append(checkbox);
  new_row.children[0].append(label);
  [
    new_student.group_name,
    new_student.full_name,
    new_student.gender,
    formattedDate(new_student.birth_date),
  ].forEach((text, i) => (new_row.children[i + 1].textContent = text));
  new_row.children[5].append(img_stat);
  new_row.children[6].append(container);

  if (!headCbxItem.checked) lockOptions(checkbox);
  else onDelete();

  tableBody.append(new_row);
}

function editIconClick(event) {
  const clckElem = event.target;

  if (clckElem.id === "icon-edit-row") {
    const studentId = clckElem.dataset.studentId;
    event.stopPropagation();

    const studentIndex = students.findIndex(
      (student) => student.id == studentId
    );
    if (studentIndex !== -1) {
      student = students[studentIndex];

      group_name_input.value = student.group_name;
      first_name_input.value = student.full_name.split(" ")[0];
      last_name_input.value = student.full_name.split(" ")[1];
      gender_input.value = student.gender;
      birth_date_input.value = student.birth_date;

      openWindow(false);
    }
  }
}

function formattedDate(date) {
  const dateValue = date;
  const [year, month, day] = dateValue.split("-");
  const formattedDate = `${day}.${month}.${year}`;
  return formattedDate;
}

function editRow(student) {
  console.log("editRow")

  const btnArray = Array.from(document.querySelectorAll("#icon-delete-row"));

  const rowIndex = btnArray.findIndex(
    (btn) => btn.dataset.studentId == student.id
  );

  if (rowIndex !== -1) {
    const row = btnArray[rowIndex].closest("tr");
    [
      student.group_name,
      student.full_name,
      student.gender,
      formattedDate(student.birth_date),
    ].forEach((text, i) => (row.children[i + 1].textContent = text));
  }
  console.log(JSON.stringify(student, null, 2));
}

function loadPage() {
  const new_student = new Student(
    "PZ-21",
    "Dmytro Solohub",
    "Male",
    "2006-07-24",
    ""
  );
  students.push(new_student);
  addRow(new_student);
}
avatarIcon.addEventListener("click", () => {
  loadPage();
});
