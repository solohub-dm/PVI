function includeHTML(file, elementId) {
  return new Promise((resolve, reject) => {
    fetch(file)
      .then((response) => response.text())
      .then((data) => {
        document.getElementById(elementId).innerHTML = data;
        resolve();
      })
      .catch((error) => {
        console.error(`Error loading ${file}:`, error);
        reject(error);
      });
  });
}

function loadScript(scriptSrc) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.type = "text/javascript";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

let role;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log("load");

    await includeHTML("./components/header.php", "header-placeholder");
    await includeHTML("./components/sidebar.php", "sidebar-placeholder");

    let currentPath = window.location.pathname.split("/").pop();
    const navItems = document.querySelectorAll(".sidebar-menu-item");

    navItems.forEach((link) => {
      link.getAttribute("href") === "./" + currentPath
        ? link.classList.add("active")
        : link.classList.remove("active");
    });

    await loadScript("./js/main.js");

    if (currentPath === "index.php") {
      await loadScript("./js/custom.js");
      await loadScript("./js/table.js");

      const user = JSON.parse(localStorage.getItem('user') || 'null');
      role = user ? user.role : null;
      console.log("User role:", role);
      const deleteTableIcon = getElement("#icon-delete-table");
      if (role === "student") {
        deleteTableIcon.style.display = "none";
      }
    }

    await loadScript("./js/valid.js");


    const isOpen = localStorage.getItem("menuOpen") === "true";
    if (isOpen) {
      sidebarWrapper.classList.add("no-transition");
      openSidebar();
      setTimeout(() => {
        sidebarWrapper.classList.remove("no-transition");
      }, 50);
    }

    const notificationIcon = document.getElementById('icon-notification');

    notificationIcon.addEventListener('click', () => {
      notificationIcon.classList.toggle('active');
    });
  
    notificationIcon.addEventListener('mouseover', () => {
      if (notificationIcon.classList.contains('active')) {
        notificationIcon.classList.remove('active');
      }
    }); 

    console.log("DOMContentLoaded");

    const user = JSON.parse(localStorage.getItem('user') || 'null');
    console.log("User data:", user);
    const avatarIcon = document.getElementById('icon-profile-avatar');
    const usernameText = document.getElementById('profile-username');
  
    if (user) {
      if (avatarIcon && user.url_avatar) {
        avatarIcon.src = '../' + user.url_avatar;
      }
      if (usernameText && user.first_name && user.last_name) {
        usernameText.textContent = `${user.first_name} ${user.last_name}`;
      }
    }

    const paginationSize = document.getElementById("pagination-size");
  if (paginationSize && paginationSize.value) {
    const pageSize = parseInt(paginationSize.value, 10) || 5;
    initRowsPool(pageSize);
    const savedTableId = localStorage.getItem('selectedTableId');
    if (savedTableId) {
      openTableById(savedTableId);
    }
  }


  } catch (error) {
    console.error("Error during initialization:", error);
  }
});

console.log("load end");