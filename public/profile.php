<?php
require_once __DIR__ . './api/auth_check.php';
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile</title>
    <link id="css-link" rel="stylesheet" href="./css/main.css" />
    <script>
        const cssLink = document.getElementById('css-link');
        cssLink.href = `./css/main.css?v=${new Date().getTime()}`;
    </script>
    <link id="css-link" rel="stylesheet" href="./css/profile.css" />

</head>
<body>
  <div id="header-placeholder"></div>
  <div id="sidebar-placeholder"></div>
  <div class="wrapper-main" id="wrapper-main">
    <main>
      <div class="wrapped-window-panel" id="wrapped-window-panel-profile">
        <div class="window-panel" id="window-panel-profile">
          <h3 class="text-window-title">Edit profile</h3>
        </div>
        <hr class="line-horizontal" />
        <div class="window-body">
          <form id="profile-form" enctype="multipart/form-data">
            <fieldset id="fieldset-profile">
              <legend>User data</legend>
              <div class="form-item" id="avatar-item">
                <label for="profile-avatar" style="display: none;">Avatar</label>
                <div class="avatar-upload-wrapper" id="avatar-upload-wrapper">
                  <img id="profile-avatar-preview" src="./img/icon/avatar_dir_white.png" alt="avatar" />
                  <div class="avatar-overlay" id="avatar-overlay">
                    <div class="avatar-overlay-content">
                      <button type="button" id="avatar-upload-btn">Load</button>
                      <button type="button" id="avatar-remove-btn">Delete</button>
                    </div>
                  </div>
                </div>
                <input type="file" id="profile-avatar" name="avatar" accept="image/*" style="display:none;" />
              </div>
              
              <div class="form-item">
                <label for="first-name">First Name</label>
                <input type="text" id="first-name" name="first-name" autocomplete="off">
                <div class="error-message" id="error-first-name">
                  <button type="button" class="error-close-btn" onclick="this.parentElement.style.display='none'">&times;</button>
                  <span class="error-text-content"></span>
                </div>
              </div>
              <div class="form-item">
                <label for="last-name">Last Name</label>
                <input type="text" id="last-name" name="last-name" autocomplete="off">
                <div class="error-message" id="error-last-name">
                  <button type="button" class="error-close-btn" onclick="this.parentElement.style.display='none'">&times;</button>
                  <span class="error-text-content"></span>
                </div>
              </div>
              <div class="form-item">
              <label for="gender">Gender</label>
                <select id="gender" name="gender">
                    <option value="selected">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                <div class="error-message" id="error-gender">
                  <button type="button" class="error-close-btn" onclick="this.parentElement.style.display='none'">&times;</button>
                  <span class="error-text-content"></span>
                </div>
              </div>
              <!-- <div class="form-item"> -->
              <!-- <label for="group">Group</label>
                <select id="group" name="group">
                    <option value="selected">Select group</option>
                    <option value="PZ-21">PZ-21</option>
                    <option value="PZ-22">PZ-22</option>
                    <option value="PZ-23">PZ-23</option>
                    <option value="PZ-24">PZ-24</option>
                    <option value="PZ-25">PZ-25</option>
                    <option value="PZ-26">PZ-26</option>
                </select>
              </div> -->
              <div class="form-item">
                <label for="birthday">Birthday</label>
                <input type="date" id="birthday" name="birthday">
                <div class="error-message" id="error-birthday">
                  <button type="button" class="error-close-btn" onclick="this.parentElement.style.display='none'">&times;</button>
                  <span class="error-text-content"></span>
                </div>
              </div>
              <!-- <div class="form-item" id="email-field">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" autocomplete="off">
              </div> -->
              <div class="form-item" id="password-field">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" autocomplete="off">
                <div class="error-message" id="error-password">
                  <button type="button" class="error-close-btn" onclick="this.parentElement.style.display='none'">&times;</button>
                  <span class="error-text-content"></span>
                </div>
              </div>
              <div class="form-item" id="confirm-password-field">
                <label for="confirm-password">Repeat</label>
                <input type="password" id="confirm-password" name="confirm-password" autocomplete="off">
                <div class="error-message" id="error-confirm-password">
                  <button type="button" class="error-close-btn" onclick="this.parentElement.style.display='none'">&times;</button>
                  <span class="error-text-content"></span>
                </div>
              </div>
            </fieldset>
            <div class="error-panel">
              <p class="error-text" id="error-text-profile"></p>
            </div>
          </form>
        </div>
        <hr class="line-horizontal" />
        <div class="window-control-panel">
          <button class="window-button non-active" type="button" id="button-cancel-profile">Reset</button>
          <button class="window-button-rev non-active" type="button" id="button-save-profile">Save</button>
        </div>
      </div>
    </main>
  </div>
  <script src="./js/components.js"></script>
  <script src="./js/valid.js"></script>
  <script src="./js/profile.js"></script>
  <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
</body>
</html>