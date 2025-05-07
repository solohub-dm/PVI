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

          <div id="additional-fields" autocomplete="off">
            
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
            <div class="form-item">
              <label for="role">Role</label>
              <select id="role" name="role">
                <option value="selected">Select role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
              <div class="error-message" id="error-role">
                <button type="button" class="error-close-btn" onclick="this.parentElement.style.display='none'">&times;</button>
                <span class="error-text-content"></span>
              </div>
            </div>
            <div class="form-item" id="form-item-group">
              <label for="group">Group</label>
              <input type="text" id="group" name="group" autocomplete="off">
              <div class="error-message" id="error-group">
                <button type="button" class="error-close-btn" onclick="this.parentElement.style.display='none'">&times;</button>
                <span class="error-text-content"></span>
              </div>
            </div>

            <div class="form-item">
              <label for="birthday">Birthday</label>
              <input type="date" id="birthday" name="birthday">
              <div class="error-message" id="error-birthday">
                <button type="button" class="error-close-btn" onclick="this.parentElement.style.display='none'">&times;</button>
                <span class="error-text-content"></span>
              </div>
            </div>
          </div>

          <div class="form-item" id="email-field">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" autocomplete="off">
            <div class="error-message" id="error-email">
              <button type="button" class="error-close-btn" onclick="this.parentElement.style.display='none'">&times;</button>
              <span class="error-text-content"></span>
            </div>
          </div>
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

  <!-- <script src="./js/custom.js"></script> -->
  <script src="./js/valid.js"></script>
  <script src="./js/auth.js"></script>
</body>
</html>
