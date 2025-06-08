const tableBody = getElement("#table-body");
const headCbxItem = getElement("#checkbox-table-head");

const addTableText = getElement("#add_student");
const editTableText = getElement("#edit_student");

const windowShadowPanelConfirm = getElement("#wrapped-shadow-panel-confirm");
const cancelConfirmWindowButton = getElement("#button-cancel-confirm");
const confirmConfirmWindowButton = getElement("#button-confirm-confirm");
const textConfirmWindow = getElement("#text-confirm-window");
const closeWindowIconCnf = getElement("#icon-close-window-confirm");

const windowShadowPanelInfo = getElement("#wrapped-shadow-panel-info");
const closeWindowIconInfo = getElement("#icon-close-window-info");
const group_name_span = getElement("#group-span");
const first_name_span = getElement("#first-name-span");
const last_name_span = getElement("#last-name-span");
const gender_span = getElement("#gender-span");
const birth_date_span = getElement("#birthday-date-span");

const deleteTableIcon = getElement("#icon-delete-table");

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
  if (!checkbox) return;
  const row = checkbox.closest("tr");
  const cell = row.cells[6];
  const div = cell.firstElementChild;

  if (!div) return;

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

  confirmConfirmWindowButton.onclick = async () => {
    const studentId = row.dataset.studentId;
    await deleteStudent(studentId);
    removeStudentRow(studentId);

    if (studentRowPool[studentId]) {
      studentRowPool[studentId].remove();
      delete studentRowPool[studentId];
    }

    bodyCbxItems = document.querySelectorAll(".table-body-checkbox");
    const anyChecked = Array.from(bodyCbxItems).some(
      (checkbox) => checkbox.checked
    );
    headCbxItem.checked = anyChecked;
    if (!anyChecked) offDelete();

    closeConfirmWindow();
  };

  windowShadowPanelConfirm.style.display = "block";
}

deleteTableIcon.addEventListener("click", openConfirmWindowAll);
function openConfirmWindowAll() {
  windowShadowPanelConfirm.style.display = "block";
  textConfirmWindow.textContent =
    "Are you sure to delete all unlocked rows in the table?";
  confirmConfirmWindowButton.onclick = async function () {

    const idsToDelete = [];

    const rows = tableBody.querySelectorAll("tr");
    rows.forEach((row) => {
      let cbx = row.cells[0].firstElementChild;
      if (cbx.checked) {
        idsToDelete.push(row.dataset.studentId);
      }
    });

    if (idsToDelete.length > 0) {
      await fetch("/website/public/api/table.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `action=removeStudents&tableId=${encodeURIComponent(tableId)}&studentIds[]=${idsToDelete.map(encodeURIComponent).join('&studentIds[]=')}`
      });
    }

    idsToDelete.forEach(studentId => {
      if (studentRowPool[studentId]) {
        studentRowPool[studentId].remove();
        delete studentRowPool[studentId];
      }
      removeStudentRow(studentId);
    });

    headCbxItem.checked = false;
    offDelete();
    closeConfirmWindow();
  };
}

async function deleteStudent(studentId) {
  try {
    const response = await fetch("/website/public/api/table.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `action=removeStudents&tableId=${encodeURIComponent(tableId)}&studentIds[]=${encodeURIComponent(studentId)}`
    });

    const result = await response.json();

    if (result.success) {
      console.log("Student deleted from table successfully");

      const index = students.findIndex(
        student => student.id === studentId
      );
      if (index !== -1) {
        students.splice(index, 1);
      }

    } else {
      console.error("Failed to delete student from table:", result.error);
      errorText.textContent = `Error: ${result.error}`;
    }
  } catch (err) {
    console.error("Fetch error:", err);
    errorText.textContent = "Network error. Please try again.";
  }
}

let currentPage = 0;
let tableId = null;
let lastLoadedCount = 0;

const prevPageBtn = document.getElementById("pagination-prev");
const nextPageBtn = document.getElementById("pagination-next");

const paginationCurrent = document.getElementById("pagination-current");

const visibilityChangeEvent = document.hidden ? "visibilitychange" : "webkitvisibilitychange";

document.addEventListener(visibilityChangeEvent, function() {
  if (document.hidden) {
    console.log("The tab is inactive.");
  } else {
    console.log("The tab is active.");
    if (window.location.pathname.includes("index.php")) {

    }
  }
});

function createElem(tag) {
  return document.createElement(`${tag}`);
}

function createEmptyRow() {
  console.log("createEmptyRow");
  const isTeacher = (role === "teacher");
  console.log("isTeacher: ", isTeacher)
  const row = createElem("tr");
  const editable = canEditTable();

  let checkbox = createElem("input");
  checkbox.type = "checkbox";
  checkbox.className = "table-body-checkbox";
  checkbox.name = "lock";
  checkbox.onchange = bodyCbxChange;

  let label = createElem("label");
  label.className = "label-hidden";
  label.textContent = "Lock / unlock row";

  let img_stat = createElem("img");
  img_stat.className = "icon-status";
  img_stat.alt = "status";

  let container = createElem("div");

  let img_del = null;
  if (isTeacher) {
    img_del = createElem("img");
    img_del.src = "./img/icon/delete.png";
    img_del.alt = "delete row";
    img_del.className = "icon-delete-row";

    img_del.onclick = openConfirmWindowOne;
    container.append(img_del);
  }

  for (let i = 0; i < 7; i++) row.append(createElem("td"));

  if (isTeacher) {
    row.children[0].append(checkbox);
    row.children[0].append(label);
    row.children[6].append(container);
  }
  row.children[5].append(img_stat);

  console.log("row: ", row)
  return row;
}


function initRowsPool(size) {
  tableBody.innerHTML = "";
  freeRowsPool = [];
  studentRowPool = {};
  for (let i = 0; i < size; i++) {
    const row = createEmptyRow();
    freeRowsPool.push(row);
  }
}

function addRowToPool(row, student) {
  console.log("addRowToPool");
  console.log("row: ", row);

  for (let i = 1; i <= 4; i++) row.children[i].textContent = "";
  row.children[5].innerHTML = "";

  row.dataset.studentId = student.id;
  row.onclick = openInfo;

  let checkbox = row.children[0].querySelector("input[type=checkbox]");
  let label = row.children[0].querySelector("label");
  if (checkbox && label) {
    const cbxId = "checkbox-" + student.id;
    checkbox.id = cbxId;
    checkbox.checked = headCbxItem.checked;
    label.htmlFor = cbxId;
  }

  let img_stat = createElem("img");
  img_stat.className = "icon-status";
  img_stat.alt = "status";
  if (student.status === "1") student.status = true;
  if (student.status === "0") student.status = false;
  if (student.status === true) {
    img_stat.src = "./img/icon/status_on.png";
    img_stat.title = "Status: Active";
  } else {
    img_stat.src = "./img/icon/menu_opt.png";
    img_stat.title = "Status: Inactive";
  }
  row.children[5].append(img_stat);

  if (canEditTable()) {
    console.log("canEditTable() {");
    let img_del = row.children[6].querySelector(".icon-delete-row");
    if (img_del) {
      img_del.dataset.studentId = student.id;
    }
  }


  const fullName = student.full_name || [student.last_name, student.first_name].filter(Boolean).join(" ");
  [
    student.group_name,
    fullName,
    student.gender,
    formattedDate(student.birthday),
  ].forEach((text, i) => (row.children[i + 1].textContent = text));

  if (checkbox) {
    if (!headCbxItem.checked) lockOptions(checkbox);
    else onDelete();
  }
}
function openTableById(id) {
  tableId = id;
  localStorage.setItem('selectedTableId', id);
  currentPage = getTablePageMap()[id] !== undefined ? parseInt(getTablePageMap()[id], 10) : 0;
  loadTable();

}


let freeRowsPool = []; 
let studentRowPool = {}; 

function fillRowsWithStudents(students) {
  tableBody.innerHTML = "";

  const studentIds = new Set(students.map(s => String(s.id)));

  Object.entries(studentRowPool).forEach(([id, row]) => {
    if (!studentIds.has(id)) {
      freeRowsPool.push(row);
      if (row.parentNode) row.parentNode.removeChild(row);
      delete studentRowPool[id];
    }
  });

  const pageSize = parseInt(paginationSize.value, 10) || 5;
  const visibleStudents = students.slice(0, pageSize);

  visibleStudents.forEach((student, idx) => {
    let row = studentRowPool[student.id];
    if (!row) {
      row = freeRowsPool.shift() || createEmptyRow();
      addRowToPool(row, student);
      studentRowPool[student.id] = row;
    }

    if (tableBody.rows[idx] !== row) {
      if (tableBody.rows.length > idx) {
        tableBody.insertBefore(row, tableBody.rows[idx]);
      } else {
        tableBody.appendChild(row);
      }
    }
  });
}

function removeStudentRow(studentId) {
  const row = studentRowPool[studentId];
  if (row) {

    for (let i = 0; i < 7; i++) row.children[i].innerHTML = "";
    row.removeAttribute("data-student-id");
    row.onclick = null;

    freeRowsPool.push(row);

    if (row.parentNode) row.parentNode.removeChild(row);
    delete studentRowPool[studentId];
  }
}

const paginationStart = document.getElementById("pagination-start");
const paginationEnd = document.getElementById("pagination-end");

let totalStudents = 0; 
let maxPage = 0;

function markLastVisibleColumns() {
  const ths = Array.from(document.querySelectorAll("thead th"));
  ths.forEach(th => th.classList.remove("last-visible-col"));
  const lastVisibleTh = ths.reverse().find(th => th.style.display !== "none");
  if (lastVisibleTh) lastVisibleTh.classList.add("last-visible-col");

  document.querySelectorAll("tbody tr").forEach(tr => {
    const tds = Array.from(tr.children);
    tds.forEach(td => td.classList.remove("last-visible-col"));
    const lastVisibleTd = tds.reverse().find(td => td.style.display !== "none");
    if (lastVisibleTd) lastVisibleTd.classList.add("last-visible-col");
  });
}


async function loadTable() {
  if (!tableId) return;
  const pageSize = parseInt(paginationSize.value, 10) || 5;
  const offset = currentPage * pageSize;

  try {
    const response = await fetch(`/website/public/api/table.php?action=getStudents&tableId=${encodeURIComponent(tableId)}&limit=${pageSize}&offset=${offset}`);
    const result = await response.json();

    totalStudents = result.total || 0; 
    maxPage = Math.max(1, Math.ceil(totalStudents / pageSize));
    if ((!result.students || result.students.length === 0) && currentPage > 0) {
      currentPage = maxPage - 1;
      saveCurrentPageForTable(tableId, currentPage);
      return loadTable(); 
    }

    if (result.students && result.students.length > 0) {
      fillRowsWithStudents(result.students);
      updateTableColumnsVisibility(); 
      markLastVisibleColumns();
      updateTableHeaderVisibility();
      lastLoadedCount = result.students.length;
    } else {
      fillRowsWithStudents([]);
      updateTableHeaderVisibility();
      lastLoadedCount = 0;
    }

    updatePagination();
  } catch (err) {
    console.error("Failed to load students:", err);
    fillRowsWithStudents([]);
    updateTableHeaderVisibility();
    lastLoadedCount = 0;
    updatePagination();
  }
}

function updatePagination() {
  if (paginationStart) {
    const active = (currentPage >= 2);
    paginationStart.style.opacity = (currentPage >= 2) ? "1" : "0.5";
    paginationStart.style.pointerEvents = (currentPage >= 2) ? "auto" : "none";
    paginationStart.querySelector("p").textContent = active ? "1" : "";
  }
  if (prevPageBtn) {
    prevPageBtn.style.opacity = (currentPage >= 1) ? "1" : "0.5";
    prevPageBtn.style.pointerEvents = (currentPage >= 1) ? "auto" : "none";
    prevPageBtn.querySelector("p").textContent = (currentPage >= 1) ? (currentPage) : "";
  }
  if (paginationCurrent) {
    paginationCurrent.querySelector("p").textContent = (currentPage + 1).toString();
  }
  if (nextPageBtn) {
    nextPageBtn.style.opacity = (currentPage <= maxPage - 2) ? "1" : "0.5";
    nextPageBtn.style.pointerEvents = (currentPage <= maxPage - 2) ? "auto" : "none";
    nextPageBtn.querySelector("p").textContent = (currentPage <= maxPage - 2) ? (currentPage + 2) : "";
  }
  if (paginationEnd) {
    const active = (currentPage <= maxPage - 3);
    paginationEnd.style.opacity = active ? "1" : "0.5";
    paginationEnd.style.pointerEvents = active ? "auto" : "none";
    paginationEnd.querySelector("p").textContent = active ? maxPage.toString() : "";
  }
}

if (paginationStart) {
  paginationStart.addEventListener("click", () => {
    if (currentPage >= 2) {
      currentPage = 0;
      saveCurrentPageForTable(tableId, currentPage);
      loadTable();
    }
  });
}
if (prevPageBtn) {
  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      saveCurrentPageForTable(tableId, currentPage);
      loadTable();
    }
  });
}
if (nextPageBtn) {
  nextPageBtn.addEventListener("click", () => {
    if (currentPage < maxPage - 1) {
      currentPage++;
      saveCurrentPageForTable(tableId, currentPage);
      loadTable();
    }
  });
}
if (paginationEnd) {
  paginationEnd.addEventListener("click", () => {
    if (currentPage <= maxPage - 3) {
      currentPage = maxPage - 1;
      saveCurrentPageForTable(tableId, currentPage);
      loadTable();
    }
  });
}

const paginationSize = document.getElementById("pagination-size");
const savedPageSize = localStorage.getItem('paginationSize');
paginationSize.value = savedPageSize ? savedPageSize : 5;

const MIN_PAGE_SIZE = 1;
const MAX_PAGE_SIZE = 100;

function validatePaginationSize() {
  let value = parseInt(paginationSize.value, 10);
  if (isNaN(value) || value < MIN_PAGE_SIZE) value = MIN_PAGE_SIZE;
  if (value > MAX_PAGE_SIZE) value = MAX_PAGE_SIZE;
  paginationSize.value = value;
  localStorage.setItem('paginationSize', value);
  currentPage = 0;
  saveCurrentPageForTable(tableId, currentPage);
  loadTable();
  updatePagination();
}

function canEditTable() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const table = tables.find(t => t.id == tableId);
  console.log("user: ", user)
  console.log("table: ", table)
  console.log("user.role: ", user && user.role)
  console.log("table.id_created_by: ", table && table.id_created_by)
  return user && (user.role === 'teacher' && (table && table.id_created_by == user.id));
}

function updateTableHeaderVisibility() {
  console.log("updateTableHeaderVisibility")
  const editable = canEditTable();
  console.log("editable: ", editable)
  const thCheckbox = document.getElementById("th-checkbox");
  const thOptions = document.getElementById("th-options");
  if (thCheckbox) thCheckbox.style.display = editable ? "" : "none";
  if (thOptions) thOptions.style.display = editable ? "" : "none";
}


function updateTableColumnsVisibility() {
  console.log("updateTableColumnsVisibility")
  const editable = canEditTable();
  console.log("editable: ", editable)

  document.querySelectorAll("th, td").forEach(cell => {
    const idx = cell.cellIndex;
    if (idx === 0 || idx === cell.parentElement.cells.length - 1) {
      cell.style.display = editable ? "" : "none";
    }
  });
}

paginationSize.addEventListener("input", function(e) {
  this.value = this.value.replace(/[^\d]/g, '');
});

paginationSize.addEventListener("change", validatePaginationSize);
paginationSize.addEventListener("blur", validatePaginationSize);
paginationSize.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    validatePaginationSize();
    paginationSize.blur();
  }
});

function formattedDate(date) {
  const dateValue = date;
  const [year, month, day] = dateValue.split("-");
  const formattedDate = `${day}.${month}.${year}`;
  return formattedDate;
}

async function refreshStudentRows() {

  const pageSize = parseInt(paginationSize.value, 10) || 5;
  const offset = currentPage * pageSize;
  const response = await fetch(`/website/public/api/table.php?action=getStudentsStatusUpdated&tableId=${encodeURIComponent(tableId)}&limit=${pageSize}&offset=${offset}`);
  const result = await response.json();
  const backendStudents = result.students || [];

  // console.log("refreshStudentRows: ", backendStudents);

  const backendIds = new Set(backendStudents.map(s => String(s.id)));
  const currentIds = new Set(Object.keys(studentRowPool));

  for (const id of currentIds) {
    if (!backendIds.has(id)) {
      const row = studentRowPool[id];
      if (row) {
        freeRowsPool.push(row);
        if (row.parentNode) row.parentNode.removeChild(row);
        delete studentRowPool[id];
      }
    }
  }

  const missingIds = backendStudents
    .map(s => String(s.id))
    .filter(id => !studentRowPool[id]);
  // console.log("missingIds: ", missingIds);
  let newStudentsData = [];
  if (missingIds.length > 0) {
    const resp = await fetch('/website/public/api/table.php?action=getStudentsByIds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `ids=${encodeURIComponent(JSON.stringify(missingIds))}`
    });
    const data = await resp.json();
    if (data.success && Array.isArray(data.students)) {
      newStudentsData = data.students;
    }
  }

  backendStudents.forEach(student => {
    if (!studentRowPool[student.id]) {
      const fullData = newStudentsData.find(s => String(s.id) === String(student.id));
      if (fullData) {
        let row = freeRowsPool.shift() || createEmptyRow();
        addRowToPool(row, fullData);
        studentRowPool[student.id] = row;
        tableBody.appendChild(row);
      }
    } else if (
      student.status_updated_at > last_updated_at
    ) {
      updateRowStatus(studentRowPool[student.id], student.status);
    }
  });
}

function updateRowStatus(row, status) {
  let img_stat = row.children[5].querySelector("img.icon-status");
  if (!img_stat) {
    img_stat = createElem("img");
    img_stat.className = "icon-status";
    img_stat.alt = "status";
    row.children[5].append(img_stat);
  }
  if (status === "1" || status === true) {
    img_stat.src = "./img/icon/status_on.png";
    img_stat.title = "Status: Active";
  } else {
    img_stat.src = "./img/icon/menu_opt.png";
    img_stat.title = "Status: Inactive";
  }
}
let last_updated_at = new Date().toISOString();
setInterval(() => {
  if (tableId) {
    refreshStudentRows();
    last_updated_at = new Date().toISOString();
  }
}, 3000);

const createTableModal = document.getElementById("wrapped-shadow-panel-create-table");
const closeCreateTable = document.getElementById("icon-close-window-create-table");
const cancelCreateTable = document.getElementById("button-cancel-table");
const dropDownCreateTableButton = getElement("#dropdown-table-item-create");
const createBtn = document.getElementById("button-create-table");
const saveBtn = document.getElementById("button-save-table");
const confirmBtn = document.getElementById("button-confirm-table");
const textConfirm = document.getElementById("text-confirm-table");
const formCreateTable = document.getElementById("form-create-table");

let isCreateMode = true;

let studentsArray = [];
let teachersArray = [];

let studentsArraySelected = [];
let teachersArraySelected = [];

function updateConfirmState() {
  if (isConfirmMode && !isFormChanged()) {
    setCreateMode(isCreateMode);
    isConfirmMode = false;
  }
}

let studentsArraySelectedSaved = [];
let teachersArraySelectedSaved = [];

async function openCreateTableModal(value, tableId = null) {
  console.log("openCreateTableModal: ", value, tableId);
  isCreateMode = value;

  showTableNameError("");

  if (isCreateMode) {
    formCreateTable.reset();
    studentsArraySelected.length = 0;
    teachersArraySelected.length = 0;
    studentsArraySelectedSaved.length = 0;
    teachersArraySelectedSaved.length = 0;
    window._initialTableName = "";
  if (studentAutocomplete) studentAutocomplete.renderSelected();
  if (teacherAutocomplete) teacherAutocomplete.renderSelected();
    let arrays;
    arrays = await loadAllUsers();
    console.log("openCreateTableModal 1 arrays: ", arrays);
    studentsArray = arrays.students || [];
    teachersArray = arrays.teachers || [];

    setCreateMode(true);
    createTableModal.style.display = "flex";
    return;
  }

  formCreateTable.reset();
  try {
    const response = await fetch(`/website/public/api/table.php?action=getFullInfo&tableId=${encodeURIComponent(tableId)}`);
    const result = await response.json();

    if (result.success && result.data) {
      const table = result.data;

      formCreateTable.elements["table-name"].value = table.name || "";
      if (formCreateTable.elements["table-description"])
        formCreateTable.elements["table-description"].value = table.description || "";

        window._initialTableName = table.name || "";

      studentsArraySelected.length = 0;
      teachersArraySelected.length = 0;
      if (Array.isArray(table.students)) {
        studentsArraySelected.push(...table.students);
      }
      if (Array.isArray(table.teachers)) {
        teachersArraySelected.push(...table.teachers);
      }

      studentsArraySelectedSaved = studentsArraySelected.map(s => s.id);
      teachersArraySelectedSaved = teachersArraySelected.map(t => t.id);

      if (studentAutocomplete) studentAutocomplete.renderSelected();
      if (teacherAutocomplete) teacherAutocomplete.renderSelected();
      let arrays;
      arrays = await loadAllUsers();
      console.log("openCreateTableModal 2 arrays: ", arrays);
      studentsArray = arrays.students || [];
      teachersArray = arrays.teachers || [];
      setCreateMode(false);
      createTableModal.style.display = "flex";    
    }
  } catch (err) {
    console.error("Failed to load table info:", err);
  }
}
function closeCreateTableModal() {
  createTableModal.style.display = "none";
  setCreateMode(true);
  isConfirmMode = false;
}
const dropdownTable = document.getElementById("dropdown-table-select");

function isFormChanged() {
  const nameChanged = formCreateTable.elements["table-name"].value !== (window._initialTableName || "");

  console.log(studentsArraySelected, " ", studentsArraySelectedSaved);
  console.log(teachersArraySelected, " ", teachersArraySelectedSaved);
  const studentsChanged = JSON.stringify(studentsArraySelected.map(s => String(s.id)).sort()) !== JSON.stringify((studentsArraySelectedSaved || []).map(String).sort());
  const teachersChanged = JSON.stringify(teachersArraySelected.map(t => String(t.id)).sort()) !== JSON.stringify((teachersArraySelectedSaved || []).map(String).sort());
    
  return nameChanged || studentsChanged || teachersChanged;
} 

const tableNameInput = document.getElementById("table-name");
const tableNameError = document.getElementById("error-table-name");
const tableNameErrorText = tableNameError.querySelector(".error-text-content");

function showTableNameError(message) {
  tableNameErrorText.textContent = message;
  tableNameError.style.display = message ? "block" : "none";
  tableNameInput.classList.toggle("input-error", !!message);
}

function validateTableName() {
  const value = tableNameInput.value.trim();

  if (!value) {
    showTableNameError("Field cannot be empty.");
    return false;
  }
  if (value.length < 3) {
    showTableNameError("Name must be at least 3 characters.");
    return false;
  }
  if (!/^[A-Za-z0-9_]+$/.test(value)) {
    showTableNameError("Only letters, digits and _ are allowed.");
    return false;
  }
  if (!/^[A-Z][a-z0-9_]*$/.test(value)) {
    showTableNameError("First letter must be uppercase, others lowercase or digits/_");
    return false;
  }

  showTableNameError("");
  return true;
}

tableNameInput.addEventListener("input", validateTableName);
tableNameInput.addEventListener("blur", validateTableName);

let isConfirmMode = false;
cancelCreateTable.onclick = function () {
   console.log("Cancel clicked, isFormChanged:", isFormChanged(), "isConfirmMode:", isConfirmMode);
  if (isConfirmMode) {
    setCreateMode(isCreateMode);
    isConfirmMode = false;
    return;
  }

  console.log(saveBtn, " ", createBtn, " ", confirmBtn, " ", cancelCreateTable);
  if (isFormChanged()) {
    console.log("Changes detected, showing confirm dialog");

    createBtn.style.display = "none";
    saveBtn.style.display = "none";
    confirmBtn.style.display = "block";
    textConfirm.style.opacity = 5;
    textConfirm.textContent = "All changes will be discarded.\nAre you sure you want to exit?";
    isConfirmMode = true;
  } else {
    closeCreateTableModal();
  }
  console.log(saveBtn, " ", createBtn, " ", confirmBtn, " ", cancelCreateTable);

};
confirmBtn.onclick = function () {
  closeCreateTableModal();

  isConfirmMode = false;
};

textConfirm.onclick = function () {

};

confirmBtn.addEventListener("blur", function () {
  setTimeout(() => {
    if (createTableModal.style.display === "block" && isConfirmMode) {
      setCreateMode(isCreateMode);
      isConfirmMode = false;
    }
  }, 200);
});

dropDownCreateTableButton.addEventListener("click", async function (e) {
  e.stopPropagation();
  await openCreateTableModal(true);
  dropdownTable.classList.remove("open");
});

createBtn.onclick = async function (e) {
  e.preventDefault();
  if (!validateTableName()) return;

  const studentsToAdd = studentsArraySelected.map(s => s.id);
  const teachersToAdd = teachersArraySelected.map(t => t.id);

  const name = formCreateTable.elements["table-name"].value;

  const description = "";
  const response = await fetch('/website/public/api/table.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      action: 'createFullInfo',
      name: name,
      description: description,
      studentsToAdd: JSON.stringify(studentsToAdd),
      teachersToAdd: JSON.stringify(teachersToAdd)

    })
  });

  const result = await response.json();
  if (result.success) {
    closeCreateTableModal();
    await loadUserTables(); 
    if (result.tableId) { 
      openTableById(result.tableId); 
      const found = tables.find(t => t.id == result.tableId);
      dropdownTableTitle.textContent = found ? found.label : "Select Table";
    }
  } else {
    alert("Error creating table");
  }
};
saveBtn.onclick = async function (e) {
  e.preventDefault();
  if (!validateTableName()) return;

  const currentStudents = studentsArraySelected.map(s => s.id);
  const currentTeachers = teachersArraySelected.map(t => t.id);

  const studentsToAdd = currentStudents.filter(id => !studentsArraySelectedSaved.includes(id));
  const studentsToRemove = studentsArraySelectedSaved.filter(id => !currentStudents.includes(id));
  const teachersToAdd = currentTeachers.filter(id => !teachersArraySelectedSaved.includes(id));
  const teachersToRemove = teachersArraySelectedSaved.filter(id => !currentTeachers.includes(id));

  const name = formCreateTable.elements["table-name"].value;

  const description = "";
  
  const response = await fetch('/website/public/api/table.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      action: 'updateFullInfo',
      tableId: tableId,
      name: name,
      description: description,
      studentsToAdd: JSON.stringify(studentsToAdd),
      studentsToRemove: JSON.stringify(studentsToRemove),
      teachersToAdd: JSON.stringify(teachersToAdd),
      teachersToRemove: JSON.stringify(teachersToRemove)
    })
  });
  
  const result = await response.json();
  if (result.success) {
    closeCreateTableModal();
  } else {
    alert("Error updating table: " + (result.error || ""));
  }
};

const createTitle = document.getElementById("create-table-title");
const editTitle = document.getElementById("Edit-table-title");

function setCreateMode(mode) {
  console.log("setCreateMode: ", mode);
  isCreateMode = mode;
  createBtn.style.display = mode ? "block" : "none";
  saveBtn.style.display = mode ? "none" : "block";
  confirmBtn.style.display = "none";
  textConfirm.style.opacity = 0;

  if (createTitle && editTitle) {
    createTitle.style.display = mode ? "block" : "none";
    editTitle.style.display = mode ? "none" : "block";
  }
}

closeCreateTable.addEventListener("click", closeCreateTableModal);


let studentAutocomplete;
let teacherAutocomplete;
let user; 

async function init() {
  console.log("init");
  let arrays = await loadAllUsers();
  console.log("loadAllUsers: ", arrays);
  studentsArray = arrays.students || [];
  teachersArray = arrays.teachers || [];

    studentAutocomplete = setupAutocomplete(
    "#student-input",
    "#dropdown-list-student",
    "#selected-container-student",
    "student",
    "searchStudents",
    () => studentsArray,
    () => studentsArraySelected
  );

  user = JSON.parse(localStorage.getItem('user') || 'null');
  teacherAutocomplete = setupAutocomplete(
    "#teacher-input",
    "#dropdown-list-teacher",
    "#selected-container-teacher",
    "teacher",
    "searchTeachers",
    () => teachersArray,
    () => teachersArraySelected,
    15,
    user ? user.id : null
  );
}
init();


const dropdownTableList = document.getElementById("dropdown-table-list");
const dropdownTableTitle = document.getElementById("dropdown-table-title");

function getTablePageMap() {
  return JSON.parse(localStorage.getItem('tablePage') || '{}');
}
function setTablePageMap(map) {
  localStorage.setItem('tablePage', JSON.stringify(map));
}

function saveCurrentPageForTable(tableId, page) {
  const map = getTablePageMap();
  map[tableId] = page;
  setTablePageMap(map);
}

function createDropdownTableButton(name, id, isCreator = false) {
  const li = document.createElement("li");
  li.className = "dropdown-table-item";
  li.setAttribute("data-table", name);

  li.addEventListener("click", (e) => {
    if (e.target.classList.contains("dropdown-icon")) return;
    dropdownTableTitle.textContent = name;
    dropdownTable.classList.remove("open");
    openTableById(id);
  });

  const p = document.createElement("p");
  p.textContent = name;
  li.appendChild(p);

  if (isCreator) {
    let imgEdit = document.createElement("img");
    imgEdit.src = "./img/icon/edit_white.png";
    imgEdit.className = "dropdown-icon";
    imgEdit.alt = "edit";
    imgEdit.title = "Edit";
    li.appendChild(imgEdit);

    imgEdit.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownTable.classList.remove("open");
      tableId = id;
      openCreateTableModal(false, id);
    });
  }


  let imgDelete = document.createElement("img");
  imgDelete.src = "./img/icon/delete_white.png";
  imgDelete.className = "dropdown-icon";
  imgDelete.alt = "delete";
  imgDelete.title = "Delete";
  li.appendChild(imgDelete);

  imgDelete.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownTable.classList.remove("open");
    windowShadowPanelConfirm.style.display = "block";
    textConfirmWindow.textContent = `Are you sure you want to delete table "${name}"?`;
    if (isCreator) textConfirmWindow.textContent += "\nYou created this table, so deleting it will remove it for all users.";

    confirmConfirmWindowButton.onclick = async function () {
      try {
        const response = await fetch('/website/public/api/table.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            action: 'deleteTable',
            tableId: id
          })
        });
        const result = await response.json();
        if (result.success) {
            const map = getTablePageMap();
          delete map[id];
          setTablePageMap(map);
          loadUserTables();
          closeConfirmWindow();
        } else {
          alert("Error deleting table");
        }
      } catch (err) {
        alert("Network error");
      }
    };
  });

  dropdownTableList.prepend(li);
}

const tables = [];

async function loadUserTables() {
  console.log("loadUserTables")
  try {
    const res = await fetch('/website/public/api/table.php?action=getUserTables');
    const data = await res.json();
    if (data.success && Array.isArray(data.tables)) {
      tables.length = 0;
      data.tables.forEach(t => tables.push({ id: t.id, label: t.name, id_created_by: t.id_created_by }));
      updateTableList();
      console.log("tables: ", tables);

      const savedTableId = localStorage.getItem('selectedTableId');
      if (savedTableId) {
        const found = tables.find(t => t.id == savedTableId);
        if (!found) {
          localStorage.removeItem('selectedTableId');
          tableId = null;
        } else {
          tableId = savedTableId;
        }
      }

    } else {
      console.error("Failed to load tables:", data.error);
    }
  } catch (err) {
    console.error("Network error loading tables:", err);
  }
}

loadUserTables();

function updateTableList() {
  dropdownTableList.innerHTML = "";
  dropdownTableList.appendChild(dropDownCreateTableButton);

  tables.forEach(btn => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const isCreator = user && btn.id_created_by === user.id;
    createDropdownTableButton(btn.label, btn.id, isCreator);
  });

  const dropdownTableTitle = document.getElementById("dropdown-table-title");
  const savedTableId = localStorage.getItem('selectedTableId');
  const found = tables.find(t => t.id == savedTableId);

  if (found) {
    dropdownTableTitle.textContent = found.label;
  } else {
    dropdownTableTitle.textContent = "Select table";
    localStorage.removeItem('selectedTableId');
    tableId = null;
  }
}

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
