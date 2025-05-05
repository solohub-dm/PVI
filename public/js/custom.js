
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
  
  
  function setupAutocomplete(inputId, dropdownId, dataArray, selectedId, name) {
  
    const input = getElement(inputId);
    if (!input) return;
    const dropdownTable = getElement(dropdownId);
    const selectedContainer = getElement(selectedId);
    let selectedItems = [];
  
    function createdDropdownTableListItem(dropdownTable, item) {
      const li = document.createElement("li");
      li.textContent = item;
      li.addEventListener("mousedown", function (e) {
        e.preventDefault();
        chooseItem(item);
      });
      dropdownTable.appendChild(li);
    }
  
    input.addEventListener("input", function () {
      const value = input.value.trim();
      dropdownTable.innerHTML = "";
      
      let filtered = [];
      if (value.length > 0) {
        filtered = dataArray.filter(item => item.startsWith(value));
      }
  
      console.log("Filtered items:", filtered);
  
      if (filtered.length === 0 && value.length > 0) {
        noMatchInput(dropdownTable);
      } else if (filtered.length > 0) {
        let isSome = false;
        if (selectedId !== undefined) {
          filtered.forEach(item => {
            if (!selectedItems.includes(item)) {
              createdDropdownTableListItem(dropdownTable, item);
              isSome = true;
            }
          });
  
          if (isSome)
            dropdownTable.style.display = "block";
          else {
            noMatchInput(dropdownTable);
          }
  
        } else {
          filtered.forEach(item => {
            createdDropdownTableListItem(dropdownTable, item);
          });
          dropdownTable.style.display = "block";
        }
      } else {
        dropdownTable.style.display = "none";
      }
    });
  
  
    function chooseItem(item) {
        console.log("Item chosen:", item);
      if (selectedId !== undefined) {
        selectedItems.push(item);
        renderSelected();
        input.value = "";
      } else {
        input.value = item;
      }
      dropdownTable.style.display = "none";

    }
  
    if (selectedId !== undefined) renderSelected();
  
    function renderSelected() {
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
          div.textContent = item;
          
          const removeBtn = document.createElement("span");
          removeBtn.className = "remove-item";
          removeBtn.textContent = "×";
          removeBtn.title = "Remove";
          removeBtn.addEventListener("click", function () {
            selectedItems = selectedItems.filter(n => n !== item);
            renderSelected();
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
  }

  console.log("Custom JS loaded");