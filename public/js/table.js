const tableBody = getElement("#table-body");
const headCbxItem = getElement("#checkbox-table-head");

const addTableText = getElement("#add_student");
const editTableText = getElement("#edit_student");

const windowShadowPanelConfirm = getElement("#wrapped-shadow-panel-confirm");
const cancelConfirmWindowButton = getElement("#button-cancel-confirm");
const confirmConfirmWindowButton = getElement("#button-confirm-confirm");
const textConfirmWindow = getElement("#text-confirm-window");
const closeWindowIconCnf = getElement("#icon-close-window-confirm");

// const windowShadowPanelRedact = getElement("#wrapped-shadow-panel-redact");
// const confirmTableText = getElement("#text-confirm");
// const confirmTableButton = getElement("#button-confirm");
// const cancelTableButton = getElement("#button-cancel");
// const saveTableButton = getElement("#button-save");
// const createTableButton = getElement("#button-create");
// const closeWindowIconRdc = getElement("#icon-close-window-redact");

const windowShadowPanelInfo = getElement("#wrapped-shadow-panel-info");
const closeWindowIconInfo = getElement("#icon-close-window-info");
const group_name_span = getElement("#group-span");
const first_name_span = getElement("#first-name-span");
const last_name_span = getElement("#last-name-span");
const gender_span = getElement("#gender-span");
const birth_date_span = getElement("#birthday-date-span");

const deleteTableIcon = getElement("#icon-delete-table");
// const addTableIcon = getElement("#icon-add-row");

// const errorText = getElement("#error-text");
// const form_input = getElement("#form-student");
// const group_name_input = getElement("#select-group");
// const first_name_input = getElement("#first-name");
// const last_name_input = getElement("#last-name");
// const gender_input = getElement("#select-gender");
// const birth_date_input = getElement("#birthday-date");

const usernameText = getElement("#profile-username");
const avatarIcon = getElement("#icon-profile-avatar");

// let isAddMode = false;
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

// function closeLoginWindow() {
//   windowShadowPanelLogin.style.display = "none";
//   formLogin.reset();
//   errorTextLogin.textContent = "";
//   [
//     firstNameInputLogin,
//     lastNameInputLogin,
//     userPasswordLogin
//   ].forEach((input) => {
//     input.style.backgroundColor = "#ffffff";
//   }) ;
// }

// async function checkValidFormLogin() {
//   const firstName = firstNameInputLogin.value;
//   const lastName = lastNameInputLogin.value;
//   const password = userPasswordLogin.value;

//   try {
//     const response = await fetch('php/validation_login.php', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       body: `first-name=${encodeURIComponent(firstName)}&last-name=${encodeURIComponent(lastName)}&password=${encodeURIComponent(password)}`
//     });

//     const data = await response.json();

//     if (data.errors) {
//       errorTextLogin.textContent = Object.values(data.errors).join(" ");

//       if (data.fields) {
//         for (const [field, valid] of Object.entries(data.fields)) {
//           const input = document.querySelector(`[name="${field}"]`);
//           if (input) {
//             input.style.backgroundColor = valid ? "#ffffff" : colorError;
//           }
//         }
//       }

//       return null;
//     }

//     if (data.valid && data.id) {
//       return data.id;
//     } else {
//       errorTextLogin.textContent = "User not found or incorrect data.";
//       return null;
//     }
//   } catch (error) {
//     console.error("Login validation error:", error);
//     errorTextLogin.textContent = "Server error: " + error.message;

//     return null;
//   }
// }

// const colorError = "#f17e7e";

// function checkCorrectValueLogin() {
//   let isValid = false;
 
//   errorTextLogin.textContent = "";
//   [
//     firstNameInputLogin,
//     lastNameInputLogin,
//     userPasswordLogin
//   ].forEach((input) => {
//     input.style.backgroundColor = "#ffffff";
//   });

//   do {
//     let firstName = firstNameInputLogin.value;
//     if (firstName.trim() !== "" && !isValidName(firstName, errorTextLogin)) {
//       firstNameInputLogin.style.backgroundColor = colorError;
//       break;
//     }

//     let lastName = lastNameInputLogin.value;
//     if (lastName.trim() !== "" && !isValidName(lastName, errorTextLogin)) {
//       lastNameInputLogin.style.backgroundColor = colorError;
//       break;
//     }

//     let password = userPasswordLogin.value;
//     if (password.trim() !== "" && password.length < 2) {
//       errorTextLogin.textContent = "Password must be longer than one symbols.";
//       userPasswordLogin.style.backgroundColor = colorError;
//       break;
//     }

//     isValid = true;
//   } while (0);

//   return isValid;
// }

// function checkFormEmptyLogin() {
//   let isValid = false;

//   do {
//     if (firstNameInputLogin.value.trim() === "") {
//       errorTextLogin.textContent = "Enter first name first."
//       firstNameInputLogin.style.backgroundColor = colorError;
//       break;
//     }

//     if (lastNameInputLogin.value.trim() === "") {
//       errorTextLogin.textContent = "Enter last name first."
//       lastNameInputLogin.style.backgroundColor = colorError;
//       break;
//     }
    
//     isValid = true;
//   } while (false);

//   return isValid;
// }

// function openLoginWindow() {
//   windowShadowPanelLogin.style.display = "flex";
// }

// async function tryLogin() { 
//   if (!checkCorrectValueLogin() || !checkFormEmptyLogin()) return;

//   const id = await checkValidFormLogin();
//   if (!id) return;

//   const userInfo = {
//     firstName: firstNameInputLogin.value,
//     lastName: lastNameInputLogin.value,
//     password: userPasswordLogin.value,
//     role: lastNameInputLogin.value == "Admin" ? "Teacher" : "Student",
//     id: id
//   }

//   closeLoginWindow();
// }

// function loginTeacherRole() {

// }

// function loginStudentRole() {
  
// }

// function loginOut() {
  
// }

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

  const studentIndex = students.findIndex((student) => student.id === studentId);
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
  const studentId = row.dataset.studentId;
  deleteStudent(studentId);

  row.remove();

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

async function deleteStudent(studentId) {
  try {
    const response = await fetch("php/del_student.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `id=${encodeURIComponent(studentId)}`
    });

    const result = await response.json();

    if (result.success) {
      console.log("Student deleted successfully");

      const index = students.findIndex(
        student => student.id === studentId
      );
      if (index !== -1) {
        students.splice(index, 1);
      }

    } else {
      console.error("Failed to delete student:", result.error);
      errorText.textContent = `Error: ${result.error}`;
    }
  } catch (err) {
    console.error("Fetch error:", err);
    errorText.textContent = "Network error. Please try again.";
  }
}

function deleteUnlockRow() {
  if (headCbxItem.checked) {
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach((row) => {
      let cbx = row.cells[0].firstElementChild;
      if (cbx.checked) {

        // const cbxIndex = bodyCbxItems.findIndex((checkbox) => checkbox == cbx);
        // if (cbxIndex !== -1) {
        //   bodyCbxItems.splice(cbxIndex, 1);
        // }
        const studentId = row.dataset.studentId;
        deleteStudent(studentId)

        row.remove();
      }
    });
    headCbxItem.checked = false;
  }
  closeConfirmWindow();
}

// addTableIcon.addEventListener("click", () => { openWindow(true)});
// closeWindowIconRdc.addEventListener("click", closeWindow);

// function isFormEmpty() {
//   return (
//     group_name_input.value == "selected" &&
//     first_name_input.value == "" &&
//     last_name_input.value == "" &&
//     gender_input.value == "selected" &&
//     birth_date_input.value == ""
//   );
// }

// function isFormChanged() {
//   return !(
//     group_name_input.value === student.group_name &&
//     first_name_input.value === student.full_name.split(" ")[0] &&
//     last_name_input.value === student.full_name.split(" ")[1] &&
//     gender_input.value === student.gender &&
//     birth_date_input.value === student.birth_date
//   );
// }

// cancelTableButton.addEventListener("click", confirmAction);
// function confirmAction() {
//   let is;
//   let ms;
//   if (!isAddMode) {
//     is = isFormChanged();
//   } else {
//     ms = isFormEmpty();
//   }

//   if ((isAddMode && !ms) || isCnfMode || is) {
//     displayButtons();
//     isCnfMode = !isCnfMode;
//   } else {
//     closeWindow();
//   }
// }

// confirmTableButton.addEventListener("click", confirmedCancel);
// function confirmedCancel() {
//   closeWindow();
// }

// function displayButtons() {
//   let displayDir = isCnfMode ? "block" : "none";
//   let displayRev = isCnfMode ? "none" : "block";
//   let hidden = isCnfMode ? 0 : 1;

//   if (isAddMode) createTableButton.style.display = displayDir;
//   else saveTableButton.style.display = displayDir;

//   confirmTableButton.style.display = displayRev;
//   confirmTableText.style.opacity = hidden;
//   confirmTableText.style.cursor = isCnfMode ? "default" : "auto";
// }

// function openWindow(isOpenInAddMode) {
//   isAddMode = isOpenInAddMode;
//   if (isOpenInAddMode)
//     birth_date_input.value = "2000-01-01";
//   displayWindow(true);
// }
// function closeWindow() {
//   displayWindow(false);
//   isAddMode = false;
//   confirmTableButton.style.display = "none";
//   confirmTableText.style.opacity = 0;
//   isCnfMode = false;
//   form_input.reset();
// }

// function displayWindow(isDisplayed) {
//   let display = isDisplayed ? "block" : "none";
//   errorText.textContent = "";
//   [
//     group_name_input,
//     first_name_input,
//     last_name_input,
//     gender_input,
//     birth_date_input
//   ].forEach((input) => {
//     input.style.backgroundColor = "#ffffff";
//   }) ;

//   if (isAddMode) {
//     addTableText.style.display = display;
//     createTableButton.style.display = display;
//   } else {
//     editTableText.style.display = display;
//     saveTableButton.style.display = display;
//   }
//   windowShadowPanelRedact.style.display = display;
// }

// first_name_input.addEventListener("input", checkCorrectValue);
// last_name_input.addEventListener("input", checkCorrectValue);
// birth_date_input.addEventListener("input", checkCorrectValue);
// group_name_input.addEventListener("focus", checkCorrectValue);
// gender_input.addEventListener("focus", checkCorrectValue);

// async function checkFormValid() {
//   if (!checkCorrectValue() || !checkFormEmpty()) {
//     console.log("checkFormValid: false");
//     return false;
//   }

//   const fields = [
//     { name: "first-name", value: first_name_input.value },
//     { name: "last-name", value: last_name_input.value },
//     { name: "birthday", value: birth_date_input.value },
//     { name: "group", value: group_name_input.value },
//     { name: "gender", value: gender_input.value }
//   ];

//   for (const { name, value } of fields) {
//     const hasError = await validateFieldServer(name, value);
//     if (hasError) {
//       console.log("checkFormValid: false");
//       return false;
//     }
//   }

//   console.log("checkFormValid: true");
//   return true;
// }

// function checkCorrectValue() {
//   let isValid = false;
 
//   errorText.textContent = "";
//   [
//     group_name_input,
//     first_name_input,
//     last_name_input,
//     gender_input,
//     birth_date_input
//   ].forEach((input) => {
//     input.style.backgroundColor = "#ffffff";
//   }) ;

//   do {
//     let firstName = first_name_input.value;
//     if (firstName.trim() !== "" && !isValidName(firstName)) {
//       first_name_input.style.backgroundColor = colorError;
//       break;
//     }

//     let lastName = last_name_input.value;
//     if (lastName.trim() !== "" && !isValidName(lastName)) {
//       last_name_input.style.backgroundColor = colorError;
//       break;
//     }

//     let date = birth_date_input.value;
//     if (date.trim() !== "" && !isValidDate(date)) {
//       birth_date_input.style.backgroundColor = colorError;
//       break;
//     }

//     isValid = true;
//   } while (0);

//   return isValid;
// }


// function checkFormEmpty() {
//   let isValid = false;

//   do {
//     if (group_name_input.value === "selected") {
//       errorText.textContent = "Enter group name first."
//       group_name_input.style.backgroundColor = colorError;
//       break;
//     } 

//     if (first_name_input.value.trim() === "") {
//       errorText.textContent = "Enter first name first."
//       first_name_input.style.backgroundColor = colorError;
//       break;
//     }

//     if (last_name_input.value.trim() === "") {
//       errorText.textContent = "Enter last name first."
//       last_name_input.style.backgroundColor = colorError;
//       break;
//     }

//     if (gender_input.value === "selected") {
//       errorText.textContent = "Enter group name first."
//       gender_input.style.backgroundColor = colorError;
//       break;
//     } 

//     if (birth_date_input.value === "") {
//       errorText.textContent = "Enter date first."
//       birth_date_input.style.backgroundColor = colorError;
//       break;
//     }
    
//     isValid = true;
//   } while (false);

//   return isValid;
// }

// async function validateFieldServer(field, value) {
//   const controller = new AbortController();
//   const timeout = setTimeout(() => controller.abort(), 3000);

//   try {
//     const response = await fetch('php/validation.php', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       body: `field=${encodeURIComponent(field)}&value=${encodeURIComponent(value)}`,
//       signal: controller.signal
//     });

//     clearTimeout(timeout);

//     if (!response.ok) {
//       console.error(`Server returned error: ${response.status}`);
//       if (typeof errorText !== "undefined") {
//         errorText.textContent = `Server returned error: ${response.status}`;
//       }
//       return 1;
//     }

//     const data = await response.json();

//     const input = document.querySelector(`[name="${field}"]`);
//     if (!input) {
//       console.warn(`Input element not found for field: ${field}`);
//     }

//     if (!data.valid) {
//       if (input) input.style.backgroundColor = colorError;

//       if (data.errors && data.errors[field]) {
//         if (typeof errorText !== "undefined") {
//           errorText.textContent = "Server validation error: " + data.errors[field];
//         }
//         console.warn(`Validation failed: ${data.errors[field]}`); 
//       } else {
//         if (typeof errorText !== "undefined") {
//           errorText.textContent = "Unknown validation error.";
//         }
//         console.warn("Validation failed: Unknown reason."); 
//       }

//       return 1;
//     } else {
//       if (input) input.style.backgroundColor = "#ffffff";
//       return 0;
//     }

//   } catch (error) {
//     if (error.name === 'AbortError') {
//       console.error("Server response timeout"); 
//       if (typeof errorText !== "undefined") {
//         errorText.textContent = "Server took too long to respond. Please try again later.";
//       }
//     } else {
//       console.error("Fetch error:", error);
//       if (typeof errorText !== "undefined") {
//         errorText.textContent = "Network or server error occurred: " + error.message;
//       }
//     }
//     return 1;
//   }
// }


// createTableButton.addEventListener("click", tryAddRow);

// async function tryAddRow() {
//   console.log("tryAddRow");
//   const isValid = await checkFormValid();

//   if (!isValid) {
//     console.log("Form is not valid.");
//     return;
//   }

//   const studentData = {
//     first_name: first_name_input.value,
//     last_name: last_name_input.value,
//     birthday: birth_date_input.value,
//     group: group_name_input.value,
//     gender: gender_input.value
//   };

//   try {
//     // const response = await fetch("php/add_student.php", {
//     //   method: "POST",
//     //   headers: {
//     //     "Content-Type": "application/x-www-form-urlencoded"
//     //   },
//     //   body: new URLSearchParams(studentData)
//     // });

//     const result = await response.json();

//     if (result.success) {
//       console.log("Student added successfully");

//       // outAllStudents();
//       closeWindow();

//       if (result.password) {
//         alert("Student added. Temporary password: " + result.password);
//       }

//     } else {
//       console.error("Server error:", result.errors);
//       errorText.textContent = Object.values(result.errors).join(" ");
//     }
//   } catch (error) {
//     console.error("Network/server error:", error);
//     errorText.textContent = "Could not connect to server.";
//   }
// }

// function outAllStudents() {

//   tableBody.innerHTML = "";

//   console.log("outAllStudents");
  
//   const loadedStudents = loadStudents();

//   loadedStudents.then((students) => {

//     students.forEach(student => {

//       addRow(student);
//     });
//   }).catch(err => {
//     console.error("Error processing students:", err);
//   });
// }

const visibilityChangeEvent = document.hidden ? "visibilitychange" : "webkitvisibilitychange";

document.addEventListener(visibilityChangeEvent, function() {
  if (document.hidden) {
    console.log("The tab is inactive.");
  } else {
    console.log("The tab is active.");
    if (window.location.pathname.includes("index.php")) {
      // outAllStudents();
    }
  }
});

// async function loadStudents() {

//   console.log("loadStudents");
//   try {
//     const response = await fetch("php/get_students.php");
//     const result = await response.json();

//     if (!result.success) {
//       console.error("Error loading students:", result.error);
//       return [];
//     }

//     students = [];
//     if (Array.isArray(result.students)) {

//       result.students.forEach(studentData => {
//         const studentId = Number(studentData.Id);
        
//         const new_student = new Student(
//           studentData.GroupName,
//           studentData.FirstName + " " + studentData.LastName,
//           studentData.FirstName,
//           studentData.LastName,
//           studentData.Gender,
//           studentData.Birthday,
//           studentData.Status,
//           studentId
//         );

//         new_student.id = studentId;
//         students.push(new_student);
//       });

//     } else {
//       console.error("No students array found in the response.");
//       return [];
//     }

//     return students;

//   } catch (err) {
//     console.error("Fetch error:", err);
//     return []; 
//   }
// }

// saveTableButton.addEventListener("click", saveForm);
// function saveForm() {
//   if (checkFormValid()) {
//     student.group_name = group_name_input.value;
//     student.full_name = first_name_input.value + " " + last_name_input.value;
//     student.first_name = first_name_input.value;
//     student.last_name = last_name_input.value;
//     student.gender = gender_input.value;
//     student.birth_date = birth_date_input.value;

//     editRow(student);
//     closeWindow();
//     student = null;
//   }
// }

function createElem(tag) {
  return document.createElement(`${tag}`);
}

function addRow(student) {

  const new_row = createElem("tr");
  let container = createElem("div");
  let img_edit = createElem("img");
  let img_del = createElem("img");
  let img_stat = createElem("img");
  let checkbox = createElem("input");

  new_row.dataset.studentId = student.id;
  new_row.onclick = openInfo;

  checkbox.type = "checkbox";
  checkbox.checked = headCbxItem.checked;
  checkbox.className = "table-body-checkbox";
  checkbox.name = "lock";
  const cbxId = "checkbox-" + student.id;
  checkbox.id = cbxId;
  checkbox.onchange = bodyCbxChange;

  let label = createElem("label");
  label.className = "label-hidden";
  label.htmlFor = cbxId;
  label.textContent = "Lock / unlock row";
  
  img_stat.className = "icon-status";
  img_stat.alt = "status";

  if (student.status === true) {
    img_stat.src = "./img/icon/status_on.png";
    img_stat.title = "Status: Active";
  } else {
    img_stat.src = "./img/icon/menu_opt.png";
    img_stat.title = "Status: Inactive";
  } 

  container.className = "table-button-panel";
  container.setAttribute(
    "title",
    "Functions are not available.\nUnlock row to interact."
  );
  img_edit.src = "./img/icon/edit.png";
  img_del.src = "./img/icon/delete.png";
  img_edit.alt = "edit row";
  img_del.alt = "delete row";
  img_edit.id = "icon-edit-row";
  img_del.id = "icon-delete-row";

  container.append(img_edit, img_del);
  // img_edit.dataset.studentId = student.id;
  img_del.dataset.studentId = student.id;
  img_del.onclick = openConfirmWindowOne;
  // img_edit.onclick = editIconClick;

  for (let i = 0; i < 7; i++) new_row.append(createElem("td"));

  new_row.children[0].append(checkbox);
  new_row.children[0].append(label);
  [
    student.group_name,
    student.full_name,
    student.gender,
    formattedDate(student.birth_date),
  ].forEach((text, i) => (new_row.children[i + 1].textContent = text));
  new_row.children[5].append(img_stat);
  new_row.children[6].append(container);

  if (!headCbxItem.checked) lockOptions(checkbox);
  else onDelete();

  tableBody.append(new_row);
}

// function editIconClick(event) {
//   const clckElem = event.target;
//   console.log("editIconClick");
//   if (clckElem.id === "icon-edit-row") {
//     const studentId = clckElem.dataset.studentId;

//     event.stopPropagation();

//     const studentIndex = students.findIndex(
//       (student) => student.id == studentId
//     );

//     if (studentIndex !== -1) {
//       student = students[studentIndex];

//       group_name_input.value = student.group_name;
//       first_name_input.value = student.full_name.split(" ")[0];
//       last_name_input.value = student.full_name.split(" ")[1];
//       gender_input.value = student.gender;
//       birth_date_input.value = student.birth_date;

//       openWindow(false);
//     }
//   }
// }

function formattedDate(date) {
  const dateValue = date;
  const [year, month, day] = dateValue.split("-");
  const formattedDate = `${day}.${month}.${year}`;
  return formattedDate;
}



async function editRow(student) {
  console.log("editRow")

  try {

    console.log(student);
    const response = await fetch('php/cng_student.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `id=${encodeURIComponent(student.id)}&first_name=${encodeURIComponent(student.first_name)}&last_name=${encodeURIComponent(student.last_name)}&gender=${encodeURIComponent(student.gender)}&birthday=${encodeURIComponent(student.birth_date)}&group=${encodeURIComponent(student.group_name)}&status=${encodeURIComponent(student.status)}`
    });
    const result = await response.json();

    if (result.success) {

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

    } else {
      console.error("Failed to update student:", result.error);
      errorText.textContent = `Error: ${result.error}`;
    }
  } catch (err) {
    console.error("Fetch error:", err);
    errorText.textContent = "Network error. Please try again.";
  }
}

const createTableModal = document.getElementById("wrapped-shadow-panel-create-table");
const closeCreateTable = document.getElementById("icon-close-window-create-table");
const cancelCreateTable = document.getElementById("button-cancel-create-table");
const dropDownCreateTableButton = getElement("#dropdown-table-item-create");

function openCreateTableModal() {
  createTableModal.style.display = "flex";
  document.body.style.overflow = "hidden";

}
function closeCreateTableModal() {
  createTableModal.style.display = "none";
  document.body.style.overflow = "";
}
const dropdownTable = document.getElementById("dropdown-table-select");


dropDownCreateTableButton.addEventListener("click", function (e) {
  e.stopPropagation();
  openCreateTableModal();
  dropdownTable.classList.remove("open");
});

closeCreateTable.addEventListener("click", closeCreateTableModal);
// cancelCreateTable.addEventListener("click", closeCreateTableModal);

const studentsArray = ["12345", "14445", "23456", "34567", "12561", "12313", "12346", "12367", "12348"];
const teachersArray = ["54321", "65432", "76543"];

setupAutocomplete(
  "#student-input",
  "#dropdown-list-student",
  studentsArray,
  "#selected-container-student",
  "students"
);

setupAutocomplete(
  "#teacher-input",
  "#dropdown-list-teacher",
  teachersArray,
  "#selected-container-teacher",
  "teacher"
);

const dropdownTableList = document.getElementById("dropdown-table-list");
const dropdownTableTitle = document.getElementById("dropdown-table-title");

function createDropdownTableButton(name, id) {
  const li = document.createElement("li");
  li.className = "dropdown-table-item";
  li.setAttribute("data-table", name);

  li.addEventListener("click", (e) => {
    if (e.target.classList.contains("dropdown-icon")) return;
    dropdownTableTitle.textContent = name;
    dropdownTable.classList.remove("open");
  });

  const p = document.createElement("p");
  p.textContent = name;
  li.appendChild(p);

  let img = undefined; 
  img = document.createElement("img");
  img.src = "./img/icon/edit_white.png";
  img.className = "dropdown-icon";
  img.alt = "edit";
  img.title = "Edit";
  li.appendChild(img);

  img.addEventListener("click", (e) => {
    e.stopPropagation();
    // TODO: Відкрити вікно в режимі редагування
    dropdownTable.classList.remove("open");
  });
  
  img = document.createElement("img");
  img.src = "./img/icon/delete_white.png";
  img.className = "dropdown-icon";
  img.alt = "delete";
  img.title = "Delete";
  li.appendChild(img);

  img.addEventListener("click", (e) => {
    e.stopPropagation();
    // TODO: Відкрити вікно уточнення видалення
    dropdownTable.classList.remove("open");
  });
  
  dropdownTableList.prepend(li);
}

const tables = [
  { id: 1, label: "Students" },
  { id: 2, label: "Teachers" },
  { id: 3, label: "Groups" }
];

function updateTableList() {
  dropdownTableList.innerHTML = "";
  dropdownTableList.appendChild(dropDownCreateTableButton);

  tables.forEach(btn => {
    createDropdownTableButton(btn.label, btn.id);
  });
}
updateTableList();


function createDropdownTable() {
  const btn = getElement("#dropdown-table-btn");
  const arrow = getElement("#dropdown-arrow");

  btn.addEventListener("click", function (e) {
    e.stopPropagation("dropdownTableButton clicked");
    dropdownTable.classList.toggle("open");
    arrow.src = dropdownTable.classList.contains("open")
      ? "./img/icon/list_close.png"
      : "./img/icon/list_open.png";
  });

  document.addEventListener("click", function () {
    dropdownTable.classList.remove("open");
    arrow.src = "./img/icon/list_open.png";
  });
};
createDropdownTable();
