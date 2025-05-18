<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <!-- <link rel="stylesheet" href="../css/header.css"> -->
</head>
<body> 

  <header class="wrapper-header">
      <h1 class="text-logo"><a href="./index.php">CMS</a></h1>
      <div class="header-control-panel">
        <div class="notification-panel" id="notification-panel">
          <img src="./img/icon/notification_off_rev2.png" alt="notification icon" id="icon-notification"/>
          <div id="wrapper-message-menu">
            <div class="message-menu-item"> 
              <div class="message-avatar-panel">
                <img src="./img/icon/avatar_rev_white.png" alt="avatar" class="icon-message-avatar" />
              </div>
              <div class="message-panel">
                <p class="message-username">username</p>
                <p class="message-text">This is message sent to this user. Lorem ipsum dolor sit amet consectetur 
                adipisicing elit. Assumenda repellat reprehenderit error suscipit, possimus laboriosam harum 
                quia voluptate odit! Est?</p>
              </div>
            </div>
            <div class="message-menu-item"> 
              <div class="message-avatar-panel">
                <img src="./img/icon/avatar_rev_white.png" alt="avatar" class="icon-message-avatar" />
              </div>
              <div class="message-panel">
                <p class="message-username">username</p>
                <p class="message-text">This is message sent to this user. Lorem ipsum dolor sit amet consectetur 
                adipisicing elit. Temporibus ipsam veritatis, enim eum illo nisi voluptas praesentium.</p>
              </div>
            </div>
            <div class="message-menu-item"> 
              <div class="message-avatar-panel">
                <img src="./img/icon/avatar_rev_white.png" alt="avatar" class="icon-message-avatar" />
              </div>
              <div class="message-panel">
                <p class="message-username">username</p>
                <p class="message-text">This is message sent to this user.</p>
              </div>
            </div>
          </div>
        </div>
        <div id="profile-panel">
          <img src="./img/icon/avatar_dir_white.png" alt="profile avatar" id="icon-profile-avatar" />
          <p class="profile-username" id="profile-username"></p>
          <div id="wrapper-profile-menu">
            <p class="profile-menu-item"><a href="./profile.php">Profile</a></p>
            <p class="profile-menu-item" id="profile-menu-item-logout"><a href="#">Log out</a></p>
          </div>
        </div>
    </div>
  </header> 
</body>
</html>
