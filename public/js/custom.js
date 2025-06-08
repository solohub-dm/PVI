
function noMatchInput(dropdownTable) {
    dropdownTable.innerHTML = "";
    const li = document.createElement("li");
    li.className = "no-match";
    li.textContent = "No matches found";
    li.addEventListener("mousedown", function (e) {
      e.preventDefault(); 
    });
    dropdownTable.appendChild(li);
    dropdownTable.style.display = "block";
  }
  
  async function loadAllUsers() {
  let arrays = {
    students: [],
    teachers: []
  };
  let res = await fetch('/website/public/api/search.php?action=searchAllStudents&limit=10000');
  let data = await res.json();
  if (data && data.results) arrays.students = data.results;
  console.log("studentsArray: ", arrays.students);

  res = await fetch('/website/public/api/search.php?action=searchAllTeachers&limit=10000');
  data = await res.json();
  if (data && data.results) arrays.teachers = data.results;
  console.log("teachersArray: ", arrays.teachers);

  return arrays;
}
  
function setupAutocomplete(inputId, dropdownId, selectedId, name, searchType, getArray, getArraySelected, limit = 100, excludeId = null) {
    console.log("Setting up autocomplete for:", getArray());
    const input = document.querySelector(inputId);
    if (!input) return;
    const dropdownTable = document.querySelector(dropdownId);
    const selectedContainer = document.querySelector(selectedId);

    function getSelectedItems() {
      return getArraySelected ? getArraySelected() : [];
    }

  async function fetchMatches(query) {
    console.log("Fetching matches for query:", query);
    if (!query) return [];
    const array = typeof getArray === "function" ? getArray() : [];
    console.log("Type of getArray:", typeof getArray);
    console.log("getArray:", getArray());
    console.log("Array for search:", array);
    const q = query.toLowerCase();
    return array.filter(
      u =>
        (u.first_name && u.first_name.toLowerCase().startsWith(q) ||
        u.last_name && u.last_name.toLowerCase().startsWith(q)) &&
        (!excludeId || String(u.id) !== String(excludeId)) 
    );
  }

    function createdDropdownTableListItem(dropdownTable, item) {
      const li = document.createElement("li");
      li.innerHTML = `
        <img src="../${item.url_avatar || 'img/icon/avatar_dir_white.png'}" alt="avatar" class="dropdown-avatar" style="width:24px;height:24px;border-radius:50%;margin-right:8px;">
        <span>
          <span>${item.last_name}</span>
          <span>${item.first_name}</span>
        </span>
      `;
      li.addEventListener("mousedown", function (e) {
        e.preventDefault();
        chooseItem(item);
      });
      dropdownTable.appendChild(li);
    }
    
    input.addEventListener("input", async function () {
      const value = input.value.trim();
      dropdownTable.innerHTML = "";

      if (value.length === 0) {
        dropdownTable.style.display = "none";
        return;
      }

      const matches = await fetchMatches(value);
      console.log("Matches:", matches);
      if (matches.length === 0) {
        noMatchInput(dropdownTable);
      } else if (matches.length > limit) {
        dropdownTable.style.display = "none";
      } else {
        let isSome = false;
        matches.forEach(item => {
          const selectedItems = getSelectedItems();
          if (!selectedItems.some(sel => sel.id === item.id)) {
            createdDropdownTableListItem(dropdownTable, item);
            isSome = true;
          }
        });
        if (isSome)
          dropdownTable.style.display = "block";
        else
          noMatchInput(dropdownTable);
      }
    });
    
  
    function chooseItem(item) {
      const selectedItems = getSelectedItems();
      selectedItems.push(item);
      renderSelected();
      input.value = "";
      dropdownTable.style.display = "none";
    }
  
    if (selectedId !== undefined) renderSelected();
  
    function renderSelected() {
        const selectedItems = getSelectedItems();
        selectedContainer.innerHTML = "";
        if (selectedItems.length === 0) {
          const emptyText = document.createElement("div");
          emptyText.className = "selected-empty-text";
          emptyText.textContent = "No " + name + "s added yet...";
          selectedContainer.appendChild(emptyText);
        } else {
          selectedItems.forEach(item => {
            const div = document.createElement("div");
            div.className = "selected-item";
            div.setAttribute("data-id", item.id);

            div.innerHTML = `
              <img src="../${item.url_avatar || 'img/icon/avatar_dir_white.png'}" alt="avatar" class="selected-avatar" style="width:24px;height:24px;border-radius:50%;margin-right:8px;">
              <span>
                <span>${item.last_name}</span>
                <span>${item.first_name}</span>
              </span>
            `;

            const removeBtn = document.createElement("span");
            removeBtn.className = "remove-item";
            removeBtn.textContent = "×";
            removeBtn.title = "Remove";
            removeBtn.addEventListener("click", function () {
              const selectedItems = getSelectedItems();
                const idx = selectedItems.findIndex(n => n.id === item.id);
                if (idx !== -1) selectedItems.splice(idx, 1);
                renderSelected();
                if (typeof updateConfirmState === "function") updateConfirmState();
            });
            div.appendChild(removeBtn);
            selectedContainer.appendChild(div);
          });
        }
      }
    
    document.addEventListener("mousedown", function (e) {
      if (!input.contains(e.target) && !dropdownTable.contains(e.target)) {
        dropdownTable.style.display = "none";
      }
    });
  
    input.addEventListener("focus", function () {
      console.log("Input focused");
      input.dispatchEvent(new Event("input"));
    });

    renderSelected();
    return { renderSelected };
  }

  console.log("Custom JS loaded");