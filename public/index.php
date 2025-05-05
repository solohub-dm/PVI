<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Student`s work management site. Page with a table of student data">
    <title>Students</title>
    <!-- <link rel="manifest" href="manifest.json"> -->

    <link rel="stylesheet" href="./css/main_table.css">

    <link id="css-link" rel="stylesheet" href="./css/main.css">
    <script>
      const cssLink = document.getElementById('css-link');
      cssLink.href = `./css/main.css?v=${new Date().getTime()}`;
    </script>

    <!-- <link rel="stylesheet" href="./css/main.css" />  -->
  </head>

  <body>
    <div id="header-placeholder"></div>
    <div id="sidebar-placeholder"></div>

    <div class="wrapper-main" id="wrapper-main">
      <main>
        <div class="table-panel">

          <div class="dropdown-table-select" id="dropdown-table-select">
            <button class="dropdown-table-btn" id="dropdown-table-btn">
              <h2 class="text-table-title" id="dropdown-table-title">
                Select table
              </h2>
              <span class="tooltip" id="dropdown-tooltip">Select table</span>
              <img class="dropdown-arrow" id="dropdown-arrow" src="./img/icon/list_open.png" alt="arrow" />
            </button>
            <ul class="dropdown-table-list" id="dropdown-table-list">
              <!-- <li class="dropdown-table-item" data-table="Students">
                <p>Students</p>
                <img src="./img/icon/edit_white.png" class="dropdown-icon" alt="edit" title="Edit" />
                <img src="./img/icon/delete_white.png" class="dropdown-icon" alt="delete" title="Delete" />
              </li>
              <li class="dropdown-table-item" data-table="Teachers">
                <p>Teachers</p>
                <img src="./img/icon/edit_white.png" class="dropdown-icon" alt="edit" title="Edit" />
                <img src="./img/icon/delete_white.png" class="dropdown-icon" alt="delete" title="Delete" />
              </li>
              <li class="dropdown-table-item" data-table="Groups">
                <p>Groups</p>
                <img src="./img/icon/edit_white.png" class="dropdown-icon" alt="edit" title="Edit" />
                <img src="./img/icon/delete_white.png" class="dropdown-icon" alt="delete" title="Delete" />
              </li> -->
              <li class="dropdown-table-item" id="dropdown-table-item-create">
                <p>Create new</p>
                <img src="./img/icon/add_white.png" class="dropdown-icon" id="dropdown-icon-create" alt="crate new table"/>
              </li>
            </ul>
          </div>

          <div class="wrapped-shadow-panel" id="wrapped-shadow-panel-create-table" style="display: none;">
            <div class="wrapped-window-panel" id="wrapped-window-panel-create-table">
              <div class="window-panel" id="window-panel-create-table">
                <h3 class="text-window-title" id="create-table-title">Create table</h3>
                <h3 class="text-window-title" id="Edit-table-title">Edit table</h3>
                <img
                  src="./img/icon/close_dir.png"
                  alt="close window"
                  class="icon-close-window"
                  id="icon-close-window-create-table"
                />
              </div>
              <hr class="line-horizontal" />
              <div class="window-body">
                <form id="form-create-table">
                  <fieldset id="fieldset-create-table">

                    <legend>Table data</legend>
                    
                    <div class="form-item">
                      <label for="table-name">Name</label>
                      <input type="text" id="table-name" name="table-name" autocomplete="off" />
                    </div>
                    
                    <div class="form-item">
                      <label for="student-input">Add student</label>
                      <div class="custom-select-input" id="custom-select-input-student">
                        <input
                          type="text"
                          id="student-input"
                          name="student-input"
                          autocomplete="off"
                          placeholder="Type to search..."
                        />
                        <ul class="dropdown-list" id="dropdown-list-student" style="display:none;"></ul>
                      </div>
                    </div>
                    <div class="form-item form-item-container">
                      <div class="selected-container" id="selected-container-student"></div>
                    </div>

                    <div class="form-item">
                      <label for="teacher-input">Add teacher</label>
                      <div class="custom-select-input" id="custom-select-input-teacher">
                        <input
                          type="text"
                          id="teacher-input"
                          name="teacher-input"
                          autocomplete="off"
                          placeholder="Type to search..."
                        />
                        <ul class="dropdown-list" id="dropdown-list-teacher" style="display:none;"></ul>
                      </div>
                    </div>
                    <div class="form-item form-item-container">
                      <div class="selected-container" id="selected-container-teacher"></div>
                    </div>

                  </fieldset>
                </form>
                <div class="error-panel">
                  <p class="error-text" id="error-text-create-table"></p>
                </div>
              </div>
              <hr class="line-horizontal" />
              <div class="window-control-panel">
                <pre class="text-confirm" id="text-confirm-table">
                  All changes will be discarded
                  Are you sure you want to exit?</pre
                >
                <button class="window-button" id="button-cancel-table">Cancel</button>
                <button
                  class="window-button-rev"
                  id="button-create-table"
                  type="submit"
                >
                  Create
                </button>
                <button class="window-button-rev" id="button-save-table" type="submit">
                  Save
                </button>
                <button class="window-button" id="button-confirm-table">Confirm</button>
              </div>
              
            </div>
          </div>
          
          <div class="table-control-panel">
            <img src="./img/icon/add.png" alt="add student" id="icon-add-row" />
            <img
              src="./img/icon/delete.png"
              alt="delete students"
              id="icon-delete-table"
            />
          </div>
        </div>
        <div class="wrapper-table">
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    id="checkbox-table-head"
                    checked="checked"
                  />
                  <label for="checkbox-table-head" class="label-hidden">Вибрати всі</label>
                </th>
                <th>Group</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Birthday</th>
                <th>Online</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody id="table-body"></tbody>
          </table>
        </div>
        <div class="pagination-panel">
          <div class="pagination-panel-item rev" id="pagination-start"><p></p></div>
          <div class="pagination-num-panel">
            <div class="pagination-panel-item dir" id="pagination-prev"><p></p></div>
            <div class="pagination-panel-item act" id="pagination-current"><p></p></div>
            <div class="pagination-panel-item dir" id="pagination-next"><p></p></div>
          </div>
          <div class="pagination-panel-item rev" id="pagination-end"><p></p></div>
      
          <div class="form-item" id="form-item-pagination">
            <label for="pagination-size">Size</label>
            <input type="number" id="pagination-size" name="pagination-size"/>
          </div>
  

          </div>
        </div>

        <div class="wrapped-shadow-panel" id="wrapped-shadow-panel-redact">
          <div class="wrapped-window-panel" id="wrapped-window-panel-redact">
            <div class="window-panel" id="window-panel-redact">
              <h3 class="text-window-title" id="add_student">Add student</h3>
              <h3 class="text-window-title" id="edit_student">Edit student</h3>
              <img
                src="./img/icon/close_dir.png"
                alt="close window"
                class="icon-close-window"
                id="icon-close-window-redact"
              />
            </div>
            <hr class="line-horizontal" />
            <div class="window-body">
              <form id="form-student">
                <fieldset id="fieldset-student">
                  <legend>Дані студента</legend>
                  <div class="form-item">
                    <label for="select-group">Group</label>
                    <select name="group" id="select-group">
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
                    <label for="first-name">First name</label>
                    <input
                      type="text"
                      id="first-name"
                      name="first-name"
                      autocomplete="off"
                    />
                  </div>
                  <div class="form-item">
                    <label for="last-name">Last name</label>
                    <input
                      type="text"
                      id="last-name"
                      name="last-name"
                      autocomplete="off"
                    />
                  </div>
                  <div class="form-item">
                    <label for="select-gender">Gender</label>
                    <select name="gender" id="select-gender">
                      <option value="selected">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div class="form-item">
                    <label for="birthday-date">Birthday</label>
                    <input type="date" name="birthday" id="birthday-date" lang="en-GB" />
                  </div>
                </fieldset>
              </form>
              <div class="error-panel">
                <p class="error-text" id="error-text"></p>
              </div>
            </div>
            <hr class="line-horizontal" />
            <div class="window-control-panel">
              <pre class="text-confirm" id="text-confirm">
                All changes will be discarded
                Are you sure you want to exit?</pre
              >
              <button class="window-button" id="button-cancel">Cancel</button>
              <button
                class="window-button-rev"
                id="button-create"
                type="submit"
              >
                Create
              </button>
              <button class="window-button-rev" id="button-save" type="submit">
                Save
              </button>
              <button class="window-button" id="button-confirm">Confirm</button>
            </div>
          </div>
        </div>

        <div class="wrapped-shadow-panel" id="wrapped-shadow-panel-info">
          <div class="wrapped-window-panel" id="wrapped-window-panel-info">
            <div class="window-panel" id="window-panel-info">
              <h3 class="text-window-title" id="sudent-info">Student info</h3>
              <img
                src="./img/icon/close_dir.png"
                alt="close window"
                class="icon-close-window"
                id="icon-close-window-info"
              />
            </div>
            <hr class="line-horizontal" />
            <div class="window-body">
              <div class="form-item">
                <span class="text-property">Group:</span>
                <span class="text-value" id="group-span"></span>
              </div>
              <div class="form-item">
                <span class="text-property">First name:</span>
                <span class="text-value" id="first-name-span"></span>
              </div>
              <div class="form-item">
                <span class="text-property">Last name:</span>
                <span class="text-value" id="last-name-span"></span>
              </div>
              <div class="form-item">
                <span class="text-property">Gender:</span>
                <span class="text-value" id="gender-span"></span>
              </div>
              <div class="form-item">
                <span class="text-property">Birthday:</span>
                <span class="text-value" id="birthday-date-span"></span>
              </div>
            </div>
            <hr class="line-horizontal" />
          </div>
        </div>

        <div class="wrapped-shadow-panel" id="wrapped-shadow-panel-confirm">
          <div class="wrapped-window-panel" id="wrapped-window-panel-confirm">
            <div class="window-panel" id="window-panel-confirm">
              <h3 class="sss">Confirm</h3>
              <img
                src="./img/icon/close_dir.png"
                alt="close window"
                class="icon-close-window"
                id="icon-close-window-confirm"
              />
            </div>
            <hr class="line-horizontal" />
            <div class="window-body">
              <p class="text-confirm-window" id="text-confirm-window">Sure?</p>
            </div>
            <hr class="line-horizontal" />
            <div class="window-control-panel">
              <button class="window-button" id="button-cancel-confirm">
                Cancel
              </button>
              <button
                class="window-button-rev"
                id="button-confirm-confirm"
                type="submit"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <script src="./js/components.js"></script>
    <!-- <script>
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/sw.js")
          .then(() => console.log("Service Worker registered"))
          .catch((err) =>
            console.error("Service Worker registration failed", err)
          );
      }
    </script> -->
  </body>
</html>
