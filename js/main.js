const getElement = document.querySelector.bind(document);

const profilePanel  = getElement("#profile-panel");
const profileMenu   = getElement("#wrapper-profile-menu");
const usernameText   = getElement("#profile-username");
const avatarIcon   = getElement("#icon-profile-avatar");

const notifPanel    = getElement("#notification-panel");
const notifMenu     = getElement("#wrapper-message-menu");
const notifIcon     = getElement("#icon-notification");

let isNotifOn = false;

class Student {
  static count = 0;
  constructor(group, name, gender, birthday, status) {
    this.id = Student.count++;
    this.group_name = group;
    this.full_name = name;
    this.gender = gender;
    this.birth_date = birthday;
    this.status = status;
  }
}

const students = [];
let student = null;

// notifIcon.addEventListener("click", () => {
//     window.location.href = "message.html";
// });
notifIcon.addEventListener("click", () => {
    isNotifOn = true;

    notifIcon.animate([
        { transform: 'rotate(  0deg)    translateX( 0px)' },
        { transform: 'rotate( 25deg)    translateX( 6px)' },
        { transform: 'rotate(-25deg)    translateX(-6px)' },
        { transform: 'rotate( 20deg)    translateX( 3px)' },
        { transform: 'rotate(-20deg)    translateX(-3px)', offset: 0.5},
        { transform: 'rotate( 10deg)    translateX( 2px)' },
        { transform: 'rotate(-10deg)    translateX(-2px)' },
        { transform: 'rotate(  0deg)    translateX( 0px)' }
      ], {
        duration: 1000,
        iterations: 1
      });

    setTimeout(() => {
        notifIcon.src = "./img/notification_on_rev2.png"; 
    }, 250);
});


notifPanel.addEventListener("mouseenter", () => {
    if (isNotifOn) {
        isNotifOn = false;

        notifIcon.animate([
            { transform: 'rotate( 0deg)' },
            { transform: 'rotate( 7deg)' },
            { transform: 'rotate(-7deg)' },
            { transform: 'rotate( 2deg)' },
            { transform: 'rotate(-2deg)' },
            { transform: 'rotate( 0deg)' }
          ], {
            duration: 500,
            iterations: 1
          });
          
        setTimeout(() => {
            notifIcon.src = "./img/notification_off_rev2.png";  
        }, 250);
    }
    notifMenu.style.display = "flex";
});
notifPanel.addEventListener("mouseleave", () => {
    notifMenu.style.display = "none";
});

profilePanel.addEventListener("mouseenter", () => {
    profileMenu.style.display = "flex";
});
profilePanel.addEventListener("mouseleave", () => {
    profileMenu.style.display = "none";
});

const burgerMenu = getElement("#burger-menu");
const sidebarWrapper = getElement("#wrapper-sidebar");
const mainWrapper = getElement("#wrapper-main");
const sidebarBody = getElement("#sidebar-body");

burgerMenu.addEventListener("mouseenter", openSidebar)
mainWrapper.addEventListener("mouseenter", closeSidebar)

function openSidebar() {
  sidebarBody.classList.add("sidebar-open");
  localStorage.setItem("menuOpen", "true");
}

function closeSidebar() {
  sidebarBody.classList.remove("sidebar-open");
  localStorage.setItem("menuOpen", "false"); 
}



