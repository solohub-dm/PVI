const getElement = document.querySelector.bind(document);

const profilePanel = getElement("#profile-panel");
const profileMenu = getElement("#wrapper-profile-menu");

profilePanel.addEventListener("mouseenter", () => {
  profileMenu.style.display = "flex";
});
profilePanel.addEventListener("mouseleave", () => {
  profileMenu.style.display = "none";
});

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

// const mockRecentMessages = [
//     {
//         id: 'msg1',
//         chatId: '1', // ID чату, до якого належить повідомлення
//         senderName: 'Admin',
//         senderAvatar: './img/icon/avatar_rev_white.png', // Або шлях до реального аватара
//         text: 'This is the most recent message. Check out the new updates!',
//         timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 хвилин тому
//     },
//     {
//         id: 'msg2',
//         chatId: '2',
//         senderName: 'Ann Smith',
//         senderAvatar: './img/icon/avatar_rev_white.png',
//         text: 'Quick question about the task from yesterday. Can we discuss?',
//         timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 хвилин тому
//     },
//     {
//         id: 'msg3',
//         chatId: '1',
//         senderName: 'Admin',
//         senderAvatar: './img/icon/avatar_rev_white.png',
//         text: 'Reminder: Meeting at 3 PM today.',
//         timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 години тому
//     },
//     {
//         id: 'msg4', // Це повідомлення не повинно відображатися, бо є лише 3 слоти
//         chatId: '3',
//         senderName: 'John Bond',
//         senderAvatar: './img/icon/avatar_rev_white.png',
//         text: 'Got the files, thanks!',
//         timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 годин тому
//     }
// ];

function renderNotificationMenu(messages) {
    if (!notifMenuWrapper) return;

    notifMenuWrapper.innerHTML = ''; 

    const messagesToShow = messages.slice(0, 3);

    if (messagesToShow.length === 0) {
        const noMessagesItem = document.createElement('div');
        noMessagesItem.className = 'message-menu-item no-messages';
        noMessagesItem.innerHTML = `<p style="text-align: center; color: var(--white-normal); padding: 20px;">No new messages</p>`;
        notifMenuWrapper.appendChild(noMessagesItem);
        return;
    }

    messagesToShow.forEach(msg => {
        const menuItem = document.createElement('div');
        menuItem.className = 'message-menu-item';
        menuItem.dataset.chatId = msg.chatId;

        const maxTextLength = 70;
        const shortText = msg.text.length > maxTextLength 
                        ? msg.text.substring(0, maxTextLength) + '...' 
                        : msg.text;

        menuItem.innerHTML = `
            <div class="message-avatar-panel">
                <img src="${msg.senderAvatar || './img/icon/avatar_default.png'}" alt="avatar" class="icon-message-avatar" />
            </div>
            <div class="message-panel">
                <p class="message-username">${msg.senderName}</p>
                <p class="message-text">${shortText}</p>
            </div>
        `;

        menuItem.addEventListener('click', () => {
            localStorage.setItem('openChatId', msg.chatId);
            window.location.href = './message.php'; 
        });

        notifMenuWrapper.appendChild(menuItem);
    });
}

notifIcon.addEventListener("click", () => {
  window.location.href = './message.php';
//   isNotifOn = true;


//   notifIcon.animate(
//     [
//       { transform: "rotate( 0deg)    translateX( 0px)" },
//       { transform: "rotate( 17deg)    translateX( 6px)" },
//       { transform: "rotate(-17deg)    translateX(-6px)" },
//       { transform: "rotate( 12deg)    translateX( 3px)" },
//       { transform: "rotate(-12deg)    translateX(-3px)"  , offset: 0.5 },
//       { transform: "rotate( 7deg)     translateX( 2px)" },
//       { transform: "rotate(-7deg)     translateX(-2px)" },
//       { transform: "rotate( 0deg)    translateX( 0px)" },
//     ],
//     {
//       duration: 1000,
//       iterations: 1,
//     }
//   );

//   setTimeout(() => {
//     notifPanel.classList.toggle('active');
// *********************************

//     notifIcon.src = "./img/icon/notification_on_rev2.png";
//   }, 250);
});

// notifPanel.addEventListener("mouseenter", () => {
//   if (isNotifOn) {
//     isNotifOn = false;
//     // notifIcon.animate(
//     //   [
//     //     { transform: "rotate( 0deg) translateX( 0px)"},
//     //     { transform: "rotate( 7deg) translateX( 2px)"},
//     //     { transform: "rotate(-7deg) translateX(-2px)"},
//     //     { transform: "rotate( 3deg) translateX( 1px)"},
//     //     { transform: "rotate(-3deg) translateX(-1px)"},
//     //     { transform: "rotate( 0deg) translateX( 0x)"},
//     //   ],
//     //   {
//     //     duration: 500,
//     //     iterations: 1,
//     //   }
//     // );


//     setTimeout(() => {
//       if (notifPanel.classList.contains('active')) {
//         notifPanel.classList.remove('active');
//       }
//       notifIcon.src = "./img/icon/notification_off_rev2.png";
//     }, 250);
//   }
//   notifMenuWrapper.style.display = "flex";
// });
// notifPanel.addEventListener("mouseleave", () => {
//   notifMenuWrapper.style.display = "none";
// });

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

const logoutButton = getElement("#profile-menu-item-logout");
logoutButton.addEventListener("click", logout);

console.log("Logout button", logoutButton);

function logout() {

  fetch('./api/logout.php', {
    method: 'POST'
  })
  .then(response => {
    localStorage.removeItem('user');
    localStorage.removeItem('selectedTableId');
    localStorage.removeItem('paginationSize');
    localStorage.removeItem('tablePageMap');
    window.location.href = './auth.php';
  })
  .catch(() => {
    alert('Logout failed. Please try again later.');
  });
}
