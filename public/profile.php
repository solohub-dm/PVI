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
    <style>
        .profile-panel {
          max-width: 480px;
          margin: 0 auto;
          background: var(--white-normal);
          border: 2px solid var(--darkblue);
          border-radius: 8px;
          box-shadow: 2px 4px 8px var(--shadow-lite);
        }
  
        
        #fieldset-profile {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        #avatar-item {
          flex-direction: column;
          align-items: center;
          justify-content: center;
    position: relative;

        }

        #avatar-item label {
          text-align: center;
        }
        
  .avatar-upload-wrapper {
    position: relative;
    /* display: inline-block; */
    cursor: pointer;
  }
  #profile-avatar-preview {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    border: 2px solid var(--darkblue);
    object-fit: cover;
    margin-bottom: 8px;
    display: block;
  }
  .avatar-overlay {
    position: absolute;
    top: 0; left: 0;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: var(--shadow);
    color: var(--white-accent);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
    z-index: 2;
  }
  .avatar-upload-wrapper:hover .avatar-overlay,
  .avatar-overlay:focus-within {
    opacity: 1;
    pointer-events: all;
  }
  .avatar-overlay-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
  .avatar-overlay-content button {
    background: var(--header-normal);
    color: var(--white-mormal);
    border: none;
    border-radius: 6px;
    padding: 4px;
    width: 64px;
    font-size: 13px;
    cursor: pointer;
    opacity: 0.95;
    transition: background 0.2s;
  }
  .avatar-overlay-content button:hover {
    background: var(--header-accent);
    color: var(--white-accent);
  }
        </style>

</head>
<body>
  <div id="header-placeholder"></div>
  <div id="sidebar-placeholder"></div>
  <div class="wrapper-main" id="wrapper-main">
    <main>
      <div class="profile-panel">
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
          <input type="file" id="profile-avatar" name="profile-avatar" accept="image/*" style="display:none;" />
        </div>
        
        <div class="form-item">
        <label for="first-name">First Name</label>
        <input type="text" id="first-name" name="first-name" autocomplete="off">
        </div>
        <div class="form-item">
        <label for="last-name">Last Name</label>
        <input type="text" id="last-name" name="last-name" autocomplete="off">
        </div>
        <div class="form-item">
        <label for="gender">Gender</label>
        <select id="gender" name="gender">
            <option value="selected">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
        </select>
        </div>
        <div class="form-item">
        <label for="group">Group</label>
        <select id="group" name="group">
            <option value="selected">Select group</option>
            <option value="PZ-21">PZ-21</option>
            <option value="PZ-22">PZ-22</option>
            <option value="PZ-23">PZ-23</option>
            <option value="PZ-24">PZ-24</option>
            <option value="PZ-25">PZ-25</option>
            <option value="PZ-26">PZ-26</option>
        </select>
        </div>
        <div class="form-item">
        <label for="birthday">Birthday</label>
        <input type="date" id="birthday" name="birthday">
        </div>
        <div class="form-item" id="email-field">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" autocomplete="off">
          </div>
          <div class="form-item" id="password-field">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" autocomplete="off">
          </div>
          <div class="form-item" id="confirm-password-field">
            <label for="confirm-password">Repeat</label>
            <input type="password" id="confirm-password" name="confirm-password" autocomplete="off">
          </div>
      </fieldset>
      <div class="error-panel">
        <p class="error-text" id="error-text-profile"></p>
      </div>
    </form>
  </div>
  <hr class="line-horizontal" />
  <div class="window-control-panel">
    <button class="window-button" type="button" id="button-cancel-profile">Reset</button>
    <button class="window-button-rev" type="submit" id="button-save-profile">Save</button>
  </div>
</div>
    </main>
  </div>
  <script>
    const avatarPreview = document.getElementById('profile-avatar-preview');
    const avatarInput = document.getElementById('profile-avatar');
    const avatarUploadBtn = document.getElementById('avatar-upload-btn');
    const avatarRemoveBtn = document.getElementById('avatar-remove-btn');
    const avatarWrapper = document.getElementById('avatar-item');
    
    // Відкрити вибір файлу по кліку на кнопку
    avatarUploadBtn.addEventListener('click', () => {
      avatarInput.click();
    });
    
    // Оновити прев'ю після вибору файлу
    avatarInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(ev) {
          avatarPreview.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Видалити аватар (скинути на стандартний)
    avatarRemoveBtn.addEventListener('click', () => {
      avatarPreview.src = './img/icon/avatar_dir_white.png';
      avatarInput.value = '';
    });
    
    // Drag & Drop підтримка
    avatarWrapper.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.stopPropagation();
      avatarWrapper.classList.add('dragover');
    });
    avatarWrapper.addEventListener('dragleave', function(e) {
      e.preventDefault();
      e.stopPropagation();
      avatarWrapper.classList.remove('dragover');
    });
    avatarWrapper.addEventListener('drop', function(e) {
      e.preventDefault();
      e.stopPropagation();
      avatarWrapper.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(ev) {
          avatarPreview.src = ev.target.result;
        };
        reader.readAsDataURL(file);
        avatarInput.files = e.dataTransfer.files;
      }
    });
    </script>
  <script src="./js/components.js"></script>
</body>
</html>