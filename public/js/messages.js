let initMessagePage = async function(isMessagePage = true) {

    const socket = io('http://localhost:4000');

    socket.on('connect', () => {
        console.log('Connected to Socket.IO chat server! Socket ID:', socket.id);
        if (currentUser && currentUser.id) {
            console.log(`Emitting 'authenticate' with userId: ${currentUser.id}`);
            socket.emit('authenticate', currentUser.id);
        } else {
            console.error("currentUser or currentUser.id is undefined, cannot authenticate.");
        }
        // socket.emit('clientTestEvent', { user: currentUser.id, message: 'Hello from client!' });
    });

    socket.on('serverTestEvent', (data) => {
        console.log('Message from server:', data);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from Socket.IO chat server.');
    });


    let chatList;
    let messagesContainer;
    let messageInput;
    let sendMessageBtn;
    let currentChatNameHeader;
    let chatMemberAvatarsContainer;
    let newChatBtn;
    let createChatModal;
    let closeCreateChatBtn;
    let cancelCreateChatBtn;
    let createChatSubmitBtn;
    let saveChatSubmitBtn;
    let confirmChatBtn;
    let textConfirmChat;
    let formCreateChat;
    let createChatTitle;
    let editChatTitle;
    let addMemberToChatBtn;

    async function initInterface() {
        if (isMessagePage) {
            chatList = document.getElementById('chat-list');
            messagesContainer = document.getElementById('messages-container');
            messageInput = document.getElementById('message-input');
            sendMessageBtn = document.getElementById('send-message-btn');
            currentChatNameHeader = document.getElementById('current-chat-name');
            chatMemberAvatarsContainer = document.getElementById('chat-member-avatars');
            newChatBtn = document.getElementById('new-chat-btn');
            createChatModal = document.getElementById('wrapped-shadow-panel-create-chat');
            closeCreateChatBtn = document.getElementById('icon-close-window-create-chat');
            cancelCreateChatBtn = document.getElementById('button-cancel-chat');
            createChatSubmitBtn = document.getElementById('button-create-chat');
            saveChatSubmitBtn = document.getElementById('button-save-chat'); 
            confirmChatBtn = document.getElementById('button-confirm-chat');
            textConfirmChat = document.getElementById('text-confirm-chat');
            formCreateChat = document.getElementById('form-create-chat');
            createChatTitle = document.getElementById('create-chat-title');
            editChatTitle = document.getElementById('edit-chat-title');
            addMemberToChatBtn = document.getElementById('add-member-to-chat-btn');
        }
    }
    
    await initInterface();

    let StudentsArray = [];
    let TeachersArray = [];

    let userOnlineStatuses = new Map();

    let currentUser = JSON.parse(localStorage.getItem('user')) || { id: 'currentUser', name: 'Me', avatar: './img/icon/avatar_default.png', online: true }; // Поточний користувач завжди онлайн для себе
    if (currentUser && currentUser.id !== 'currentUser' && currentUser.online === undefined) {
        currentUser.online = true; 
    }
    let currentChatId = null;
    let isChatCreateMode = true; 
    let isChatConfirmMode = false;

    async function startLoadAllUsers() {
        let arrays = await loadAllUsers();
        StudentsArray = arrays.students;
        TeachersArray = arrays.teachers;
        console.log("START INIT");
        console.log("studentsArray: ", StudentsArray);
        console.log("teachersArray: ", TeachersArray);
    }
    await startLoadAllUsers();


    let clientChats = [
    ];

    const chatToOpen = localStorage.getItem('openChatId');
    if (chatToOpen && isMessagePage) {
        selectChat(chatToOpen);
        localStorage.removeItem('openChatId'); 
    } else if (clientChats.length > 0 && !currentChatId) { 
         selectChat(clientChats[0].id); 
    }

    let selectedStudentsForChat = [];
    let selectedTeachersForChat = [];
    let initialChatName = "";
    let initialChatMembers = [];

    function createAvatarWithStatus(member, baseClass = 'avatar', isWithStatus = true) {
        // console.log("createAvatarWithStatus called with member:", member);
        
        const avatarWrapper = document.createElement('div');
        if (baseClass === 'avatar-chatlist') { 
            avatarWrapper.className = 'avatar-wrapper-chatlist';
        } else {
            avatarWrapper.className = 'avatar-wrapper';
        }

        const img = document.createElement('img');
        const avatarPath = member.url_avatar || 'public/img/icon/avatar_dir.png';
        img.src = avatarPath.startsWith('../') ? avatarPath : `../${avatarPath}`;
        img.alt = member.name || `${member.first_name || ''} ${member.last_name || ''}`.trim();
        img.className = baseClass;
        avatarWrapper.appendChild(img);

        const isOnline = (member.online !== undefined ? member.online : (userOnlineStatuses.get(member.id) || false)) || member.status == "1";

        if (isWithStatus && (isOnline || (currentUser && member.id === currentUser.id))) {
            // console.log("Member is current user or online:", member);
            const statusIndicator = document.createElement('div');
            statusIndicator.className = 'online-status-indicator';
            const statusImg = document.createElement('img');
            statusImg.src = './img/icon/status_on.png'; 
            statusImg.alt = 'Online';
            statusIndicator.appendChild(statusImg);
            avatarWrapper.appendChild(statusIndicator);
        }
        return avatarWrapper;
    }


    function renderChatList() {
        if (!chatList) return;
        chatList.innerHTML = '';
        clientChats.forEach(chat => {
            const li = document.createElement('li');
            li.className = 'chat-list-item';
            li.dataset.chatId = chat.id;
            if (chat.id === currentChatId) {
                li.classList.add('active');
            }

            const displayMember = chat.members.find(m => String(m.id) !== String(currentUser.id)) || chat.members[0] || { first_name: 'Chat', url_avatar: 'img/icon/avatar_default.png', online: false };
            
            const avatarElement = createAvatarWithStatus(displayMember, 'avatar', false);
            li.appendChild(avatarElement);
            
            const spanName = document.createElement('span');
            spanName.textContent = chat.name;
            li.appendChild(spanName);

            if (chat.unreadCount && chat.unreadCount > 0 && chat.id !== currentChatId) {
                const unreadBadge = document.createElement('span');
                unreadBadge.className = 'unread-badge';
                unreadBadge.textContent = chat.unreadCount > 9 ? '9+' : chat.unreadCount;
                li.appendChild(unreadBadge);
            }
            
            li.addEventListener('click', () => selectChat(chat.id));
            chatList.appendChild(li);
        });
    }
    function renderMessages(chatId) {
        const chat = clientChats.find(c => c.id === chatId);
        messagesContainer.innerHTML = '';
        if (chat) {
            currentChatNameHeader.textContent = `Chat room ${chat.name}`;
            renderChatMembers(chat.members);

            chat.messages.forEach(msg => {
                appendMessageToDom(msg, chat.members); 
            });
            scrollToBottom();
        } else {
            currentChatNameHeader.textContent = 'Select a chat';
            chatMemberAvatarsContainer.innerHTML = '';
        }
    }

    function appendMessageToDom(msg, chatMembers) {
        const messageEl = document.createElement('div');
        messageEl.classList.add('message-item');
        const isSent = msg.senderId === currentUser.id;
        messageEl.classList.add(isSent ? 'sent' : 'received');

        const sender = chatMembers.find(m => m.id === msg.senderId) || 
                       (isSent ? currentUser : { name: msg.senderName, avatar: msg.avatar, online: false });
        
        // console.log("appendMessageToDom called with sender:", sender);
        const avatarElement = createAvatarWithStatus(sender, 'avatar');

        const messageContentDiv = document.createElement('div');
        messageContentDiv.className = 'message-content';
        messageContentDiv.innerHTML = `
            ${!isSent ? `<div class="message-sender-name">${sender.name || sender.first_name || 'User'}</div>` : ''}
            ${msg.text}
        `;
        
        messageEl.appendChild(avatarElement);
        messageEl.appendChild(messageContentDiv);
        messagesContainer.appendChild(messageEl);
    }

    function renderChatMembers(members) {
        // console.log("=====================================");
        // console.log("renderChatMembers called with members:", members);

        chatMemberAvatarsContainer.innerHTML = '';
        members.forEach(member => {
            const avatarElement = createAvatarWithStatus(member, 'avatar'); 
            avatarElement.title = member.name || `${member.first_name || ''} ${member.last_name || ''}`.trim();
            chatMemberAvatarsContainer.appendChild(avatarElement);
        });
        // console.log("=====================================");

    }

    function selectChat(chatId) {
    const chatIdStr = String(chatId);

//    if (currentChatId === chatIdStr && messagesContainer && messagesContainer.innerHTML !== '' && !messagesContainer.innerHTML.includes('Loading messages...')) {
//         console.log(`[CLIENT] Chat ${chatIdStr} is already selected and messages are loaded.`);
//         socket.emit('getChatMemberStatuses', chatIdStr);
//         return;
//     }

    console.log(`[CLIENT] Selecting chat: ${chatIdStr}. Previous chat: ${currentChatId}`);

    // if (currentChatId && currentChatId !== chatIdStr) {
    //     console.log(`[CLIENT] Emitting 'leaveRoom' for ${currentChatId}`);
    //     socket.emit('leaveRoom', currentChatId);
    // }

    currentChatId = chatIdStr;

    const chat = clientChats.find(c => String(c.id) === chatIdStr);
    if (chat) {
        if (chat.unreadCount > 0) {
            chat.unreadCount = 0;
            if (typeof markChatAsReadOnClient === 'function') {
                markChatAsReadOnClient(chatIdStr);
            }
        }
    }

    if (isMessagePage)
        renderChatList(); 

    if (messagesContainer) {
        messagesContainer.innerHTML = '<p style="text-align:center; color: var(--darkblue); opacity:0.5;">Loading messages...</p>'; // Показати індикатор завантаження
    } else {
        console.error("[CLIENT] messagesContainer element not found!");
    }
    
    if (messageInput) {
        messageInput.focus();
    }

    console.log(`[CLIENT] Client selected chat ID: ${chatIdStr}, emitting joinRoom`);
    socket.emit('joinRoom', chatIdStr); 
}


    socket.on('joinRoom', (chatId) => {
        // Object.keys(socket.rooms).forEach(room => {
        //     if (room !== socket.id) socket.leave(room);
        // });
        socket.join(chatId);
        console.log(`User ${socket.id} joined room ${chatId}`);
    });

    function sendMessage() {
        const text = messageInput.value.trim();
        if (text && currentChatId) {
            const chat = clientChats.find(c => c.id === currentChatId); 
            if (chat) {
                const messageData = {
                    chatId: currentChatId,
                    senderId: currentUser.id,
                    senderName: currentUser.first_name || 'Me',
                    text: text,
                    avatar: currentUser.url_avatar || currentUser.avatar || './img/icon/avatar_dir.png',
                    timestamp: new Date()
                };

                socket.emit('sendMessage', messageData);

                // chat.messages.push(messageData);
                // appendMessageToDom(messageData, chat.members);
                messageInput.value = '';
                scrollToBottom();
            }
        }
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    if (isMessagePage) {
        sendMessageBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    }
    

    socket.on('myChatsList', (chatsFromServer) => {
        console.log('[CLIENT] Received myChatsList:', chatsFromServer);
        clientChats = chatsFromServer.map(chat => {
            const members = chat.members.map(memberId => {
                const userDetail = StudentsArray.find(s => String(s.id) === String(memberId)) ||
                                TeachersArray.find(t => String(t.id) === String(memberId)) ||
                                { id: memberId, first_name: 'Unknown', last_name: 'User', url_avatar: 'img/icon/avatar_default.png' }; // шлях без ../
                return { ...userDetail, online: userOnlineStatuses.get(String(memberId)) || (currentUser.id === String(memberId) ? true : false) };
            });
            return {
                id: chat._id,
                name: chat.name,
                members: members,
                messages: [],
                lastMessageAt: chat.lastMessageAt,
                unreadCount: chat.unreadCount || 0
            };
        }).sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
        
        if (!isMessagePage) return;

        renderChatList();

        const chatToOpen = localStorage.getItem('openChatId');
        if (chatToOpen && clientChats.some(c => c.id === chatToOpen)) {
            selectChat(chatToOpen);
            localStorage.removeItem('openChatId');
        } else if (clientChats.length > 0 && !currentChatId) {
            selectChat(clientChats[0].id);
        } else if (clientChats.length === 0) {
            renderMessages(null);
            currentChatNameHeader.textContent = 'No chats available. Create one!';
            if (chatMemberAvatarsContainer) chatMemberAvatarsContainer.innerHTML = '';
        }
    });
        
    socket.on('userStatusChanged', ({ userId, online }) => {
        console.log(`[CLIENT] UserStatusChanged: User ${userId} is now ${online ? 'online' : 'offline'}`);
        userOnlineStatuses.set(String(userId), online);

        let chatListNeedsUpdate = false;
        let currentChatMembersNeedUpdate = false;

        if (!isMessagePage) return;

        clientChats.forEach(chat => {
            const member = chat.members.find(m => String(m.id) === String(userId));
            if (member) {
                if (member.online !== online) {
                    member.online = online;
                    chatListNeedsUpdate = true;
                    if (chat.id === currentChatId) {
                        currentChatMembersNeedUpdate = true;
                    }
                }
            }
        });

        if (chatListNeedsUpdate) renderChatList();
        if (currentChatMembersNeedUpdate) {
            const currentChat = clientChats.find(c => c.id === currentChatId);
            if (currentChat) renderChatMembers(currentChat.members);
        }
    });

    socket.on('chatMembersStatus', ({ chatId, statuses }) => {
        console.log(`[CLIENT] Received chatMembersStatus for chat ${chatId}:`, statuses);
        if (chatId === currentChatId) {
            const chat = clientChats.find(c => c.id === chatId);
            if (chat) {
                statuses.forEach(statusUpdate => {
                    userOnlineStatuses.set(String(statusUpdate.userId), statusUpdate.online);
                    const member = chat.members.find(m => String(m.id) === String(statusUpdate.userId));
                    if (member) member.online = statusUpdate.online;
                });

                if (isMessagePage) {
                    renderChatMembers(chat.members);
                    renderChatList();
                }
            }
        }
    });

    socket.on('newMessage', (messageDataFromServer) => {
    console.log('[CLIENT] NewMessage received from server:', messageDataFromServer);
    const chat = clientChats.find(c => String(c.id) === String(messageDataFromServer.chatId)); // Порівняння як рядків
    if (chat) {
        chat.lastMessageAt = messageDataFromServer.timestamp; 

        let existingMessage = null;
        if (messageDataFromServer._id) {
            existingMessage = chat.messages.find(m => String(m._id) === String(messageDataFromServer._id));
        }

        if (!existingMessage && messageDataFromServer.tempId) {
            existingMessage = chat.messages.find(m => m.tempId === messageDataFromServer.tempId);
        }

        if (!existingMessage && String(messageDataFromServer.senderId) === String(currentUser.id) && !messageDataFromServer.tempId && !messageDataFromServer._id) {
             existingMessage = chat.messages.find(m => 
                !m._id && 
                m.text === messageDataFromServer.text &&
                String(m.senderId) === String(messageDataFromServer.senderId) &&
                Math.abs(new Date(m.timestamp).getTime() - new Date(messageDataFromServer.timestamp).getTime()) < 3000 
            );
        }


        if (existingMessage) {
            console.log(`[CLIENT] Updating existing message (possibly optimistic):`, existingMessage, 'with data from server:', messageDataFromServer);
        
            Object.assign(existingMessage, {...messageDataFromServer, timestamp: new Date(messageDataFromServer.timestamp)});
            if (existingMessage.tempId && messageDataFromServer._id) { 
                delete existingMessage.tempId; 
            }
            if (String(messageDataFromServer.chatId) === String(currentChatId)) {
                 renderMessages(currentChatId); 
            }

        } else {
            console.log('[CLIENT] Adding new message from server to chat:', messageDataFromServer);
            chat.messages.push({...messageDataFromServer, timestamp: new Date(messageDataFromServer.timestamp)});
            if (isMessagePage && String(messageDataFromServer.chatId) === String(currentChatId)) {
                appendMessageToDom(messageDataFromServer, chat.members);
                scrollToBottom();

                if (typeof markChatAsReadOnClient === 'function') {
                    markChatAsReadOnClient(currentChatId);
                }
            } else {
                // chat.unreadCount = (chat.unreadCount || 0) + 1;
                console.log(`[CLIENT] New message for chat ${chat.name} (ID: ${chat.id}) not currently selected, trying to add message into notifications.`);
                if (typeof addMessageToNotifications === 'function') {
                    console.log(`[CLIENT] Adding message to notifications for chat ${chat.name} (ID: ${chat.id})`);
                    const senderDetails = StudentsArray.find(s => String(s.id) === String(messageDataFromServer.senderId)) ||
                                        TeachersArray.find(t => String(t.id) === String(messageDataFromServer.senderId)) ||
                                        { first_name: messageDataFromServer.senderName || 'System', last_name: '', url_avatar: messageDataFromServer.senderAvatar || 'img/icon/avatar_default.png' };
                    addMessageToNotifications(messageDataFromServer, senderDetails);
                }
                console.log(`[CLIENT] New message for hidden chat ${chat.name}, unread: ${chat.unreadCount}`);
            }
        }

        clientChats.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
        if (isMessagePage)
        renderChatList(); 
    } else {
        console.warn(`[CLIENT] Received newMessage for an unknown chat ID: ${messageDataFromServer.chatId}`);
    }
});

    socket.on('chatActivity', ({ chatId, lastMessage }) => {
    console.log('[CLIENT] Received chatActivity for chat:', chatId, 'last message sender:', lastMessage.senderId);
    const chat = clientChats.find(c => String(c.id) === String(chatId));
    if (chat) {
        const oldLastMessageAt = chat.lastMessageAt;
        chat.lastMessageAt = lastMessage.timestamp;

        if (String(chatId) !== String(currentChatId) && String(lastMessage.senderId) !== String(currentUser.id)) {
            chat.unreadCount = (chat.unreadCount || 0) + 1;
            console.log(`[CLIENT] chatActivity: Unread count for ${chat.name} is now ${chat.unreadCount}`);

            if (typeof addMessageToNotifications === 'function') {
                 const senderDetails = StudentsArray.find(s => String(s.id) === String(lastMessage.senderId)) ||
                                    TeachersArray.find(t => String(t.id) === String(lastMessage.senderId)) ||
                                    { first_name: lastMessage.senderName || 'System', last_name: '', url_avatar: lastMessage.senderAvatar || 'img/icon/avatar_default.png' };

                const isNotificationAlreadyAdded = recentNotificationMessages.some(nMsg => nMsg.id === (lastMessage._id || lastMessage.id));
                if (!isNotificationAlreadyAdded) {
                    addMessageToNotifications(lastMessage, senderDetails);
                }
            }
        }

        // Сортуємо, тільки якщо час дійсно змінився (для оптимізації)
        if (new Date(chat.lastMessageAt).getTime() !== new Date(oldLastMessageAt).getTime() || chat.unreadCount > 0) {
            clientChats.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
            renderChatList();
        }
    } else {
        console.warn(`[CLIENT] Received chatActivity for an unknown chat ID: ${chatId}`);
    }
});

   
socket.on('addedToChat', (newChatRoomData) => {
    console.log('[CLIENT] You have been added to a new chat or chat updated:', newChatRoomData);
    const existingChatIndex = clientChats.findIndex(chat => String(chat.id) === String(newChatRoomData._id));

    const membersForClient = newChatRoomData.members.map(memberId => {
        const memberIdStr = String(memberId);
        const userDetail = StudentsArray.find(s => String(s.id) === memberIdStr) ||
                           TeachersArray.find(t => String(t.id) === memberIdStr) ||
                           { id: memberIdStr, first_name: 'Unknown', last_name: 'User', url_avatar: 'img/icon/avatar_default.png' };
        return { ...userDetail, online: userOnlineStatuses.get(memberIdStr) || (currentUser.id === memberIdStr ? true : false) };
    });

    const chatClientObject = {
        id: String(newChatRoomData._id),
        name: newChatRoomData.name,
        members: membersForClient,
        messages: existingChatIndex > -1 ? clientChats[existingChatIndex].messages : [],
        lastMessageAt: newChatRoomData.lastMessageAt || newChatRoomData.createdAt || new Date().toISOString(),
        unreadCount: (String(newChatRoomData.createdBy) !== String(currentUser.id) && existingChatIndex === -1) ? 1 : (existingChatIndex > -1 ? clientChats[existingChatIndex].unreadCount : 0)
    };

    if (existingChatIndex > -1) {
        clientChats[existingChatIndex] = chatClientObject;
        console.log('[CLIENT] Updated existing chat:', chatClientObject.name);
    } else {

        clientChats.unshift(chatClientObject);
        console.log('[CLIENT] Added new chat:', chatClientObject.name);

        if (String(newChatRoomData.createdBy) !== String(currentUser.id)) {
            if (typeof addMessageToNotifications === 'function') {
                const systemNotificationMessage = {
                    _id: 'system_added_' + newChatRoomData._id,
                    chatId: newChatRoomData._id,
                    senderId: 'system',
                    text: `You were added to chat "${newChatRoomData.name}"`,
                    timestamp: newChatRoomData.createdAt || new Date().toISOString()
                };
                const creatorDetails = StudentsArray.find(s => String(s.id) === String(newChatRoomData.createdBy)) ||
                                     TeachersArray.find(t => String(t.id) === String(newChatRoomData.createdBy)) ||
                                     { first_name: 'System', last_name: '', url_avatar: 'img/icon/avatar_default.png' };
                addMessageToNotifications(systemNotificationMessage, creatorDetails);
            }
        }
    }

    clientChats.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
    renderChatList();

    if ((String(newChatRoomData.createdBy) === String(currentUser.id) && existingChatIndex === -1) ||
        (existingChatIndex > -1 && String(clientChats[existingChatIndex].id) === String(currentChatId)) ||
        (existingChatIndex === -1 && clientChats.length > 0 && String(clientChats[0].id) === String(newChatRoomData._id) && !currentChatId) ) {
        selectChat(newChatRoomData._id);
    }
});

    socket.on('chatHistory', (data) => {
        console.log('Received chatHistory:', data);
        if (isMessagePage && data.chatId === currentChatId) {
            const chat = clientChats.find(c => c.id === data.chatId); 
            if (chat) {
                chat.messages = data.messages;          
                renderMessages(data.chatId);  
            }
        }
    });

    socket.on('chatError', (errorData) => {
        console.error('Chat Error from server:', errorData);
        if (errorData.chatId === currentChatId) {
            messagesContainer.innerHTML = `<p style="text-align:center; color:red;">Error: ${errorData.message}</p>`;
        }
    });

    socket.on('messageError', (errorData) => {
        console.error('Message Error from server:', errorData);
        alert(`Could not send message: ${errorData.error}`);
    });

    socket.on('chatCreated', (newChatRoom) => {
        console.log('Chat successfully created by server:', newChatRoom);
        const chatExists = clientChats.some(chat => chat.id === newChatRoom._id);
        if (!chatExists) {
            const membersForClient = newChatRoom.members.map(memberId => {
                return StudentsArray.find(s => s.id === memberId) || 
                    TeachersArray.find(t => t.id === memberId) || 
                    { id: memberId, name: 'Unknown User', avatar: './img/icon/avatar_dir.png', online: false };
            });

            clientChats.unshift({
                id: newChatRoom._id,
                name: newChatRoom.name,
                members: membersForClient,
                messages: [] 
            });
            renderChatList();
            selectChat(newChatRoom._id); 
        }
    });

    socket.on('chatCreationError', (errorData) => {
        console.error('Chat Creation Error:', errorData);
        alert(`Error creating chat: ${errorData.error}`);
    });

    socket.on('addedToChat', (newChatRoom) => {
        console.log('You have been added to a new chat:', newChatRoom);
        const chatExists = clientChats.some(chat => chat.id === newChatRoom._id);
        if (!chatExists) {
            const membersForClient = newChatRoom.members.map(memberId => {
                return StudentsArray.find(s => s.id === memberId) || 
                    TeachersArray.find(t => t.id === memberId) || 
                    { id: memberId, name: 'Unknown User', avatar: './img/icon/avatar_dir.png', online: false };
            });
            clientChats.unshift({
                id: newChatRoom._id,
                name: newChatRoom.name,
                members: membersForClient,
                messages: []
            });
            renderChatList();
        }
    });

    async function openCreateChatModal(isCreating, chatIdToEdit = null) {
        isChatCreateMode = isCreating;
        formCreateChat.reset();
        showChatNameError(""); 
        selectedStudentsForChat = [];
        selectedTeachersForChat = [];

        let arrays;
        arrays = await loadAllUsers();
        StudentsArray = arrays.students;    
        TeachersArray = arrays.teachers;
        
        if (isChatCreateMode) {
            createChatTitle.style.display = 'block';
            editChatTitle.style.display = 'none';
            createChatSubmitBtn.style.display = 'block';
            saveChatSubmitBtn.style.display = 'none';
            initialChatName = "";
            initialChatMembers = [];
        } else {
            createChatTitle.style.display = 'none';
            editChatTitle.style.display = 'block';
            createChatSubmitBtn.style.display = 'none';
            saveChatSubmitBtn.style.display = 'block';

            const chat = clientChats.find(c => c.id === chatIdToEdit);
            if (chat) {
                document.getElementById('chat-name').value = chat.name;
                initialChatName = chat.name;
                chat.members.forEach(member => {
                    if (member.id !== currentUser.id) { 
                        if (StudentsArray.find(s => s.id === member.id)) {
                            selectedStudentsForChat.push(member);
                        } else if (TeachersArray.find(t => t.id === member.id)) {
                            selectedTeachersForChat.push(member);
                        }
                    }
                });
                initialChatMembers = [...selectedStudentsForChat, ...selectedTeachersForChat].map(m => m.id);
            }
        }

        studentChatAutocomplete.renderSelected();
        teacherChatAutocomplete.renderSelected();

        confirmChatBtn.style.display = 'none';
        textConfirmChat.style.opacity = 0;
        isChatConfirmMode = false;
        createChatModal.style.display = 'flex';
    }

    function closeCreateChatModal() {
        createChatModal.style.display = 'none';
        isChatConfirmMode = false;
    }

    function isChatFormChanged() {
        const nameChanged = document.getElementById('chat-name').value !== initialChatName;
        const currentSelectedMembers = [...selectedStudentsForChat, ...selectedTeachersForChat].map(m => m.id).sort();
        const initialMembersSorted = [...initialChatMembers].sort();
        const membersChanged = JSON.stringify(currentSelectedMembers) !== JSON.stringify(initialMembersSorted);
        return nameChanged || membersChanged;
    }
    
    function showChatNameError(message) {
        const errorDiv = document.getElementById('error-chat-name');
        const input = document.getElementById('chat-name');
        if (errorDiv && input) {
            input.classList.toggle('input-error', !!message);
            const textSpan = errorDiv.querySelector('.error-text-content');
            textSpan.textContent = message;
            errorDiv.style.display = message ? 'block' : 'none';
        }
    }

    function validateChatName() {
        const nameInput = document.getElementById('chat-name');
        const value = nameInput.value.trim();
        if (!value) {
            showChatNameError("Chat name cannot be empty.");
            return false;
        }
        showChatNameError("");
        return true;
    }

    if (isMessagePage) {
    document.getElementById('chat-name').addEventListener('input', validateChatName);


    newChatBtn.addEventListener('click', () => openCreateChatModal(true));
    addMemberToChatBtn.addEventListener('click', () => {
        if(currentChatId) {
            openCreateChatModal(false, currentChatId);
        } else {
            alert("Please select a chat first.");
        }
    });

    closeCreateChatBtn.addEventListener('click', closeCreateChatModal);
    
    cancelCreateChatBtn.addEventListener('click', () => {
        if (isChatConfirmMode) {
            createChatSubmitBtn.style.display = isChatCreateMode ? 'block' : 'none';
            saveChatSubmitBtn.style.display = isChatCreateMode ? 'none' : 'block';
            confirmChatBtn.style.display = 'none';
            textConfirmChat.style.opacity = 0;
            isChatConfirmMode = false;
            return;
        }
        if (isChatFormChanged()) {
            createChatSubmitBtn.style.display = 'none';
            saveChatSubmitBtn.style.display = 'none';
            confirmChatBtn.style.display = 'block';
            textConfirmChat.style.opacity = 5;
            isChatConfirmMode = true;
        } else {
            closeCreateChatModal();
        }
    });

    confirmChatBtn.addEventListener('click', closeCreateChatModal);

    // createChatSubmitBtn.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     if (!validateChatName()) return;
    //     const chatName = document.getElementById('chat-name').value;
    //     const members = [currentUser, ...selectedStudentsForChat, ...selectedTeachersForChat];
        
    //     const newChat = {
    //         id: 'chat' + Date.now(), // Mock ID
    //         name: chatName,
    //         members: members,
    //         messages: [ { id: 'msys1', senderId: 'system', senderName: 'System', text: `Chat room "${chatName}" created.`, avatar: './img/icon/avatar_dir.png' }] // Системне повідомлення
    //     };
    //     clientChats.unshift(newChat); // Додати на початок списку
    //     currentChatId = newChat.id;
    //     renderChatList();
    //     selectChat(newChat.id);
    //     closeCreateChatModal();
    //     // Тут буде API запит на створення чату
    // });

    createChatSubmitBtn.addEventListener('click', async (e) => { 
        e.preventDefault();
        if (!validateChatName()) return;
        const chatName = document.getElementById('chat-name').value;
        
        const selectedMemberIds = [
            currentUser.id,
            ...selectedStudentsForChat.map(s => s.id),
            ...selectedTeachersForChat.map(t => t.id) 
        ];
        const uniqueMemberIds = [...new Set(selectedMemberIds)];

        console.log('Attempting to create chat with name:', chatName, 'and members:', uniqueMemberIds);
        socket.emit('createChat', { 
            name: chatName, 
            memberIds: uniqueMemberIds,
            creatorId: currentUser.id 
        });
        
        closeCreateChatModal();
    });

    saveChatSubmitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!validateChatName()) return;
        if (!currentChatId) return;

        const chatName = document.getElementById('chat-name').value;
        const members = [currentUser, ...selectedStudentsForChat, ...selectedTeachersForChat];
        
        const chatIndex = clientChats.findIndex(c => c.id === currentChatId);
        if (chatIndex > -1) {
            clientChats[chatIndex].name = chatName;
            clientChats[chatIndex].members = members;
 
            clientChats[chatIndex].messages.push({ id: 'msys_edit'+Date.now(), senderId: 'system', senderName: 'System', text: `Chat room settings updated.`, avatar: './img/icon/avatar_dir.png' });
        }
        renderChatList();
        selectChat(currentChatId);
        closeCreateChatModal();
    });
    }

    const studentChatAutocomplete = (typeof setupAutocomplete === 'function' && isMessagePage) ? setupAutocomplete(
        "#student-chat-input",
        "#dropdown-list-student-chat",
        "#selected-container-student-chat",
        "student",
        null,
        () => StudentsArray.filter(t => t.id !== currentUser.id),
        () => selectedStudentsForChat
    ) : { renderSelected: () => console.warn("setupAutocomplete not loaded for student chat") };

    const teacherChatAutocomplete = (typeof setupAutocomplete === 'function' && isMessagePage) ? setupAutocomplete(
        "#teacher-chat-input",
        "#dropdown-list-teacher-chat",
        "#selected-container-teacher-chat",
        "teacher",
        null,
        () => TeachersArray.filter(t => t.id !== currentUser.id), 
        () => selectedTeachersForChat,
        15,
        currentUser.role === 'teacher' ? currentUser.id : null
    ) : { renderSelected: () => console.warn("setupAutocomplete not loaded for teacher chat") };

    if (isMessagePage) {
        if (clientChats.length > 0) {
            selectChat(clientChats[0].id);
        } else {
            renderChatList();
            renderMessages(null); 
        }
    }
    
};