function includeHTML(file, elementId, callback) {
  fetch(file)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(elementId).innerHTML = data;
      if (callback) callback();
    })
    .catch((error) => console.error('Error loading ${file}:', error));
}

document.addEventListener("DOMContentLoaded", () => {
  includeHTML("./components/header.html", "header-placeholder", () => {
    const script = document.createElement("script");
    script.src = "./js/main.js";
    script.type = "text/javascript";
    document.head.appendChild(script);
  });
  includeHTML("./components/sidebar.html", "sidebar-placeholder", () => {
    let currentPath = window.location.pathname.split("/").pop();
    const navItems = document.querySelectorAll(".sidebar-menu-item");
  
      if (navItems.length > 0) {
        navItems.forEach((link) => {
          link.getAttribute("href") === "./" + currentPath
            ? link.classList.add("active")
            : link.classList.remove("active");
        });
      }
  });


}); 