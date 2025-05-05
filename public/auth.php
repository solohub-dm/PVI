<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Authentication</title>
  <link id="css-link1" rel="stylesheet" href="./css/main.css">
  <link id="css-link2" rel="stylesheet" href="./css/auth.css">
  
  <script>
    const cssLink1 = document.getElementById('css-link1');
    cssLink1.href = `./css/auth.css?v=${new Date().getTime()}`;
  </script>
  <script>
    const cssLink2 = document.getElementById('css-link2');
    cssLink2.href = `./css/main.css?v=${new Date().getTime()}`;
  </script>

</head>
<body>
  <div class="wrapped-shadow-panel" id="wrapped-shadow-panel-login">
    <div class="wrapped-window-panel signin-mode" id="wrapped-window-panel-login">
      
      <!-- Ліва частина -->
      <div class="form-half" id="form-left">
        
        <h3 class="text-window-title" id="auth-title-reg">Register</h3>
        <h3 class="text-window-title" id="auth-title-sign">Sign In</h3>
        <form id="auth-form">

          <div id="additional-fields">
            
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
              <label for="role">Role</label>
              <select id="role" name="role">
                <option value="selected">Select role</option>
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
              </select>
            </div>
            <div class="form-item" id="form-item-group" >
              <label for="group">Group</label>
              <div class="custom-select-input" id="custom-select-input-group">
                <input
                  type="text"
                  id="group-input"
                  name="group"
                  autocomplete="off"
                  placeholder="Type to search..."
                />
                <ul class="dropdown-list" id="dropdown-list-group" style="display:none;"></ul>
              </div>
            </div>

            <div class="form-item">
              <label for="birthday">Birthday</label>
              <input type="date" id="birthday" name="birthday">
            </div>
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
     
          
          <button type="button" class="window-button-rev" id="auth-submit"><span id="span-sign">Sign In</span><span id="span-reg">Register</span></button>

        </form>
      </div>

      <!-- Права частина -->
      <div class="form-half" id="form-right">
        <div class="form-half-text-panel" id="form-half-sign-in">
          <h3 class="text-window-title" id="welcome-title">Welcome back!</h3>
          <p id="welcome-text">
            Great to see you back! We're happy to have you here again.
          </p>
          <a id="toggle-auth-mode-sign">No account yet? Register...</a>
        </div>
        <div class="form-half-text-panel" id="form-half-register">
          <h3 class="text-window-title" id="welcome-title">Join us!</h3>
          <p id="welcome-text">
            Create an account to become part of our community. 
          </p>
          <a id="toggle-auth-mode-reg">Already have an account? Sign In...</a>
        </div>
        
      </div>
      
    </div>
  </div>

  <script src="./js/usual.js"></script>
  <script src="./js/custom.js"></script>

  <script>
    const groupField = getElement("#form-item-group");
    const roleInput = getElement("#role");
    roleInput.addEventListener("change", function () {
      const selectedValue = roleInput.value;
      if (selectedValue === "Student") {
        groupField.style.display = "flex";
      } else {
        groupField.style.display = "none";
      }
    });

    const toggleAuthModeButtonReg = document.getElementById('toggle-auth-mode-reg');
    const toggleAuthModeButtonSign = document.getElementById('toggle-auth-mode-sign');
    const authTitle = document.getElementById('auth-title');
    const authSubmitButton = document.getElementById('auth-submit');
    const welcomeTitle = document.getElementById('welcome-title');
    const welcomeText = document.getElementById('welcome-text');
    const panel = document.getElementById('wrapped-window-panel-login');

    let isRegisterMode = false;

    function toggleAuthMode() {
      isRegisterMode = !isRegisterMode;

      panel.classList.toggle('register-mode', isRegisterMode);
      panel.classList.toggle('signin-mode', !isRegisterMode);
    }

    toggleAuthModeButtonReg.addEventListener('click', toggleAuthMode);
    toggleAuthModeButtonSign.addEventListener('click', toggleAuthMode);

    const groupsArray = ["54321", "65432", "76543"];

    setupAutocomplete(
      "#group-input",
      "#dropdown-list-group",
      groupsArray
    );
  </script>
</body>
</html>
