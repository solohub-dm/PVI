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

let notifPanel;
let notifMenuWrapper;
let notifIcon;
let isNotificationMenuOpen = false;
let hasUnreadGlobalNotifications = false;

let recentNotificationMessages = [];

function addMessageToNotifications(messageData, senderDetails) {
    if (!notifPanel || !notifIcon || !notifMenuWrapper) {
        console.warn("Notification elements not yet initialized in components.js");
        return;
    }

    console.log("[ComponentsJS] Adding message to notifications:", messageData);

    const notificationItem = {
        id: messageData._id || messageData.id || ('temp_' + Date.now()),
        chatId: String(messageData.chatId), 
        senderName: senderDetails.first_name ? `${senderDetails.first_name} ${senderDetails.last_name || ''}`.trim() : (senderDetails.name || 'Unknown Sender'),
        senderAvatar: `../${senderDetails.url_avatar || 'img/icon/avatar_default.png'}`, // Шлях відносно HTML
        text: messageData.text,
        timestamp: new Date(messageData.timestamp),
        read: false
    };

    recentNotificationMessages.unshift(notificationItem);
    if (recentNotificationMessages.length > 3) {
        recentNotificationMessages.pop();
    }

    hasUnreadGlobalNotifications = true;
    updateNotificationBellIcon(true); 
    if (isNotificationMenuOpen) {
        renderNotificationMenu(recentNotificationMessages);
    }
}

function updateNotificationBellIcon(hasUnread) {
    if (notifIcon) {
        if (hasUnread) {
            notifIcon.src = "./img/icon/notification_on_rev2.png"; 
            notifIcon.classList.add('active-notification-bell'); 
        } else {
            notifIcon.src = "./img/icon/notification_off_rev2.png";
            notifIcon.classList.remove('active-notification-bell');
        }
    }
    hasUnreadGlobalNotifications = hasUnread;
}

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
        menuItem.dataset.messageId = msg.id; 

        const maxTextLength = 60;
        const shortText = msg.text.length > maxTextLength
                        ? msg.text.substring(0, maxTextLength) + '...'
                        : msg.text;

        menuItem.innerHTML = `
            <div class="message-avatar-panel">
                <img src="${msg.senderAvatar}" alt="avatar" class="icon-message-avatar" />
            </div>
            <div class="message-panel">
                <p class="message-username">${msg.senderName}</p>
                <p class="message-text">${shortText}</p>
            </div>
        `;

        menuItem.addEventListener('click', () => {
            localStorage.setItem('openChatId', msg.chatId);
            if (!window.location.pathname.includes('message.php')) {
                window.location.href = './message.php';
            } else {
                if (typeof selectChat === 'function' && currentChatId !== msg.chatId) { 
                    selectChat(msg.chatId);
                } else if (typeof initMessagePage === 'object' && typeof initMessagePage.selectChat === 'function') { 
                    initMessagePage.selectChat(msg.chatId);
                }
            }
            markNotificationsAsRead(msg.chatId); 
            closeNotificationMenu();
        });
        notifMenuWrapper.appendChild(menuItem);
    });
}

function openNotificationMenu() {
    if (!notifMenuWrapper || !notifPanel) return;
    renderNotificationMenu(recentNotificationMessages); 
    notifMenuWrapper.style.display = "flex";
    notifPanel.classList.add('active-menu-notifications'); 
    isNotificationMenuOpen = true;
}

function closeNotificationMenu() {
    if (!notifMenuWrapper || !notifPanel) return;
    notifMenuWrapper.style.display = "none";
    notifPanel.classList.remove('active-menu-notifications');
    isNotificationMenuOpen = false;

    if (recentNotificationMessages.every(msg => msg.read)) {
        if (!hasUnreadGlobalNotifications) { 
        updateNotificationBellIcon(false);
        }
    }
}

function markChatAsReadOnClient(chatId) { 
    const chatIdStr = String(chatId);
    console.log(`[ComponentsJS] Marking chat ${chatIdStr} as read for notifications.`);
    
    let notificationsWereRemoved = false;
    const initialLength = recentNotificationMessages.length;

    recentNotificationMessages = recentNotificationMessages.filter(msg => msg.chatId !== chatIdStr);

    if (recentNotificationMessages.length < initialLength) {
        notificationsWereRemoved = true;
    }

    if (notificationsWereRemoved) {
        if (isNotificationMenuOpen) {
            renderNotificationMenu(recentNotificationMessages); 
        }
        const stillHasUnreadInMenu = recentNotificationMessages.length > 0;
        updateNotificationBellIcon(stillHasUnreadInMenu);
    }
}


function markNotificationsAsRead(clickedChatId) {
    const clickedChatIdStr = String(clickedChatId);

    recentNotificationMessages = recentNotificationMessages.filter(msg => msg.chatId !== clickedChatIdStr);
    
    const stillHasUnreadInMenu = recentNotificationMessages.length > 0;
    updateNotificationBellIcon(stillHasUnreadInMenu);

    if (isNotificationMenuOpen) {
        renderNotificationMenu(recentNotificationMessages);
    }
    closeNotificationMenu();
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log("load");

    await includeHTML("./components/header.php", "header-placeholder");

    notifPanel = document.getElementById("notification-panel");
    notifMenuWrapper = document.getElementById("wrapper-message-menu");
    notifIcon = document.getElementById("icon-notification");

    if (notifPanel && notifIcon && notifMenuWrapper) {

        renderNotificationMenu(recentNotificationMessages);
        updateNotificationBellIcon(hasUnreadGlobalNotifications); 

        notifIcon.addEventListener("click", (event) => {
            event.stopPropagation(); 
            if (isNotificationMenuOpen) {
                closeNotificationMenu();
            } else {
                openNotificationMenu();
                markNotificationsAsRead(); 
                hasUnreadGlobalNotifications = false; 
                updateNotificationBellIcon(false);
            }
        });

        notifPanel.addEventListener("mouseenter", () => {
            if (hasUnreadGlobalNotifications && !isNotificationMenuOpen) {
                 // updateNotificationBellIcon(false); // Тимчасово вимикаємо, поки курсор над ним
            }

            if(!isNotificationMenuOpen) {
                 openNotificationMenu();
            }
        });
        notifPanel.addEventListener("mouseleave", () => {
            // if(!notifPanel.classList.contains('active-menu-notifications')) { 
                 closeNotificationMenu();
            // }
        });

        document.addEventListener('click', function(event) {
            if (notifPanel && !notifPanel.contains(event.target) && isNotificationMenuOpen) {
                closeNotificationMenu();
            }
        });

    } else {
        console.warn("Notification panel elements not found in header.");
    }


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
      await loadScript("./js/messages.js");
    
    if (currentPath === "message.php") {
      await loadScript("./js/custom.js");
      await initMessagePage(true);
      console.log("Loading message.js");
    } else {
      await initMessagePage(false);
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

    notificationIcon.addEventListener('mouseover', () => {
        if (notificationIcon.classList.contains('active')) {
        notificationIcon.classList.remove('active');
        }
    }); 

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