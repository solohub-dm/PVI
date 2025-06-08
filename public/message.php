<?php
require_once __DIR__ . '/api/auth_check.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Messages</title>
    <link rel="stylesheet" href="./css/main.css" />
    <link rel="stylesheet" href="./css/messages.css" /> <!-- Додаємо новий CSS -->
</head>
<body>
    <div id="header-placeholder"></div>
    <div id="sidebar-placeholder"></div>

    <div class="wrapper-main" id="wrapper-main">
        <main class="main-message">
            <aside class="chat-sidebar">
                <div class="chat-sidebar-header">
                    <h3>Chat room</h3>
                    <button class="new-chat-btn" id="new-chat-btn">
                        <img src="./img/icon/add.png" alt="New chat" style="width: 18px; height: 18px;"> <!-- Іконка + -->
                        <p>New chat room</p>
                    </button>
                </div>
                <ul class="chat-list" id="chat-list">
                    <!-- Елементи чатів будуть додані через JS -->
                    <!-- Приклад елемента чату:
                    <li class="chat-list-item active" data-chat-id="1">
                        <img src="./img/icon/avatar_dir_white.png" alt="User" class="avatar">
                        <span>Admin</span>
                    </li>
                    <li class="chat-list-item" data-chat-id="2">
                        <img src="./img/icon/avatar_dir_white.png" alt="User" class="avatar">
                        <span>Ann Smith</span>
                    </li>
                    -->
                </ul>
            </aside>

            <section class="chat-main-area">
                <div class="chat-header">
                    <h3 id="current-chat-name">Chat room Admin</h3>
                    <div class="chat-members">
                        <span>Members:</span>
                        <div id="chat-member-avatars">
                            <!-- Аватари учасників будуть додані через JS -->
                            <!-- <img src="./img/icon/avatar_dir_white.png" alt="Member" class="avatar" title="Admin">
                            <img src="./img/icon/avatar_dir_white.png" alt="Member" class="avatar" title="James Bond"> -->
                        </div>
                        <button class="add-member-btn" id="add-member-to-chat-btn" title="Add member">
                            <img src="./img/icon/add.png" alt="New chat"> <!-- Іконка + -->
                        </button>
                    </div>
                </div>
                <div class="messages-container" id="messages-container">
                    <!-- Повідомлення будуть додані через JS -->
                    <!-- Приклад повідомлення:
                    <div class="message-item received">
                        <img src="./img/icon/avatar_dir_white.png" alt="Admin" class="avatar">
                        <div class="message-content">
                            <div class="message-sender-name">Admin</div>
                            This is a message from Admin.
                        </div>
                    </div>
                    <div class="message-item sent">
                        <img src="./img/icon/avatar_dir_white.png" alt="Me" class="avatar">
                        <div class="message-content">
                             <div class="message-sender-name">Me</div>
                            This is my reply.
                        </div>
                    </div>
                     -->
                </div>
                <div class="message-input-area">
                    <textarea id="message-input" placeholder="Type your message..."></textarea>
                    <button class="send-message-btn" id="send-message-btn">
                        <img src="./img/icon/send.png" alt="Send"> <!-- Іконка відправки (змініть шлях якщо потрібно) -->
                    </button>
                </div>
            </section>
        </main>
    </div>

    <!-- Модальне вікно для створення/редагування чату (аналогічно до "таблиць") -->
    <div class="wrapped-shadow-panel" id="wrapped-shadow-panel-create-chat" style="display: none;">
        <div class="wrapped-window-panel create-window" id="wrapped-window-panel-create-chat-content">
            <div class="window-panel">
                <h3 class="text-window-title" id="create-chat-title">Create new chat room</h3>
                <h3 class="text-window-title" id="edit-chat-title">Edit chat room</h3>
                <img
                  src="./img/icon/close_dir.png"
                  alt="close window"
                  class="icon-close-window"
                  id="icon-close-window-create-chat"
                />
            </div>
            <hr class="line-horizontal" />
            <div class="window-body" id="window-body-create-chat">
                <form id="form-create-chat">
                    <fieldset id="fieldset-create-chat">
                        <legend>Chat data</legend>
                        <div class="form-item">
                            <label for="chat-name">Chat Name</label>
                            <input type="text" id="chat-name" name="chat-name" autocomplete="off" />
                            <div class="error-message" id="error-chat-name" style="display:none">
                                <button type="button" class="error-close-btn" onclick="this.parentElement.style.display='none'">×</button>
                                <span class="error-text-content"></span>
                            </div>
                        </div>
                        
                        <div class="form-item">
                            <label for="student-chat-input">Add student</label>
                            <div class="custom-select-input" id="custom-select-input-student-chat">
                                <input
                                  type="text"
                                  id="student-chat-input"
                                  name="student-chat-input"
                                  autocomplete="off"
                                  placeholder="Type to search students..."
                                />
                                <ul class="dropdown-list" id="dropdown-list-student-chat" style="display:none;"></ul>
                            </div>
                        </div>
                        <div class="form-item form-item-container">
                            <div class="selected-container" id="selected-container-student-chat"></div>
                        </div>

                        <div class="form-item">
                            <label for="teacher-chat-input">Add teacher</label>
                            <div class="custom-select-input" id="custom-select-input-teacher-chat">
                                <input
                                  type="text"
                                  id="teacher-chat-input"
                                  name="teacher-chat-input"
                                  autocomplete="off"
                                  placeholder="Type to search teachers..."
                                />
                                <ul class="dropdown-list" id="dropdown-list-teacher-chat" style="display:none;"></ul>
                            </div>
                        </div>
                        <div class="form-item form-item-container">
                            <div class="selected-container" id="selected-container-teacher-chat"></div>
                        </div>
                    </fieldset>
                </form>
            </div>
            <hr class="line-horizontal" />
            <div class="window-control-panel">
                <pre class="text-confirm" id="text-confirm-chat">
                  All changes will be discarded
                  Are you sure you want to exit?</pre>
                <button class="window-button" id="button-cancel-chat">Cancel</button>
                <button class="window-button-rev" id="button-create-chat" type="submit">Create</button>
                <button class="window-button-rev" id="button-save-chat" type="submit">Save</button>
                <button class="window-button" id="button-confirm-chat">Confirm</button>
            </div>
        </div>
    </div>
    
    <footer></footer>
    
    <script src="./js/components.js"></script>
    <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>

    <!-- <script src="./js/messages.js"></script> -->

</body>
</html>