const getElement = document.querySelector.bind(document);

const profilePanel = getElement("#profile-panel");
const profileMenu = getElement("#wrapper-profile-menu");


const notifPanel = getElement("#notification-panel");
const notifMenu = getElement("#wrapper-message-menu");
const notifIcon = getElement("#icon-notification");

let isNotifOn = false;

class Student {
  constructor(group, name, first_name, last_name, gender, birthday, status, id) {

    this.group_name = group;
    this.full_name = name;
    this.first_name = first_name;
    this.last_name = last_name;
    this.gender = gender;
    this.birth_date = birthday;
    this.status = status;
    this.id = id;
  }
}

let students = [];
let student = null;

// notifIcon.addEventListener("click", () => {
//     window.location.href = "message.php";
// });
notifIcon.addEventListener("click", () => {
  isNotifOn = true;


  // notifIcon.animate(
  //   [
  //     { transform: "rotate( 0deg)    translateX( 0px)" },
  //     { transform: "rotate( 17deg)    translateX( 6px)" },
  //     { transform: "rotate(-17deg)    translateX(-6px)" },
  //     { transform: "rotate( 12deg)    translateX( 3px)" },
  //     { transform: "rotate(-12deg)    translateX(-3px)"  , offset: 0.5 },
  //     { transform: "rotate( 7deg)     translateX( 2px)" },
  //     { transform: "rotate(-7deg)     translateX(-2px)" },
  //     { transform: "rotate( 0deg)    translateX( 0px)" },
  //   ],
  //   {
  //     duration: 1000,
  //     iterations: 1,
  //   }
  // );

  setTimeout(() => {
    notifPanel.classList.toggle('active');

    notifIcon.src = "./img/icon/notification_on_rev2.png";
  }, 250);
});

notifPanel.addEventListener("mouseenter", () => {
  if (isNotifOn) {
    isNotifOn = false;
    // notifIcon.animate(
    //   [
    //     { transform: "rotate( 0deg) translateX( 0px)"},
    //     { transform: "rotate( 7deg) translateX( 2px)"},
    //     { transform: "rotate(-7deg) translateX(-2px)"},
    //     { transform: "rotate( 3deg) translateX( 1px)"},
    //     { transform: "rotate(-3deg) translateX(-1px)"},
    //     { transform: "rotate( 0deg) translateX( 0x)"},
    //   ],
    //   {
    //     duration: 500,
    //     iterations: 1,
    //   }
    // );


    setTimeout(() => {
      if (notifPanel.classList.contains('active')) {
        notifPanel.classList.remove('active');
      }
      notifIcon.src = "./img/icon/notification_off_rev2.png";
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

burgerMenu.addEventListener("mouseenter", openSidebar);
mainWrapper.addEventListener("mouseenter", closeSidebar);

function openSidebar() {
  sidebarBody.classList.add("sidebar-open");
  localStorage.setItem("menuOpen", "true");
}

function closeSidebar() {
  sidebarBody.classList.remove("sidebar-open");
  localStorage.setItem("menuOpen", "false");
}
