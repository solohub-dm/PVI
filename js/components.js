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

document.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log("load");

    await includeHTML("/website/components/header.php", "header-placeholder");
    await includeHTML("/website/components/sidebar.php", "sidebar-placeholder");

    let currentPath = window.location.pathname.split("/").pop();
    const navItems = document.querySelectorAll(".sidebar-menu-item");

    navItems.forEach((link) => {
      link.getAttribute("href") === "./" + currentPath
        ? link.classList.add("active")
        : link.classList.remove("active");
    });

    await loadScript("./js/main.js");

    if (currentPath === "index.php") {
      await loadScript("./js/table.js");
      outAllStudents();
    }


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


  } catch (error) {
    console.error("Error during initialization:", error);
  }
});
