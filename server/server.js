const express = require('express');
const http = require('http');
const { Server } = require("socket.io"); 
const mongoose = require('mongoose');

const Message = require('./models/Message'); 
const ChatRoom = require('./models/ChatRoom'); 

const app = express();
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Chat server is running!');
});

const httpServer = http.createServer(app); 
const io = new Server(httpServer, {        
    cors: {
        origin: "http://localhost",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 4000; 
const MONGODB_URI = 'mongodb://localhost:27017/chatAppDb';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const onlineUsers = new Map(); 

function addUserOnline(userId, socketId) {
    if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socketId);
    console.log(`User ${userId} (socket ${socketId}) is online. Total sockets for user: ${onlineUsers.get(userId).size}`);
}

function removeUserOnline(userId, socketId) {
    if (onlineUsers.has(userId)) {
        onlineUsers.get(userId).delete(socketId);
        if (onlineUsers.get(userId).size === 0) {
            onlineUsers.delete(userId);
            console.log(`User ${userId} is offline (all sockets disconnected).`);
            return true;
        }
        console.log(`User ${userId} (socket ${socketId}) disconnected. Sockets remaining: ${onlineUsers.get(userId).size}`);
    }
    return false;
}

async function broadcastUserStatusChange(userId, isOnline) {
    const userIdStr = String(userId);
    console.log(`[SERVER] Broadcasting status for ${userIdStr}: ${isOnline}`);
    try {
        const userChatRooms = await ChatRoom.find({ members: userIdStr }).select('members');
        const affectedUserIds = new Set();
        userChatRooms.forEach(room => {
            room.members.forEach(memberId => {
                if (String(memberId) !== userIdStr) {
                    affectedUserIds.add(String(memberId));
                }
            });
        });

        affectedUserIds.forEach(affectedUserIdStr => {
            if (onlineUsers.has(affectedUserIdStr)) {
                onlineUsers.get(affectedUserIdStr).forEach(socketId => {
                    console.log(`[SERVER] Emitting 'userStatusChanged' to socket ${socketId} for user ${userIdStr} (${isOnline})`);
                    io.to(socketId).emit('userStatusChanged', { userId: userIdStr, online: isOnline });
                });
            } else {
                 console.log(`[SERVER] Affected user ${affectedUserIdStr} is not in onlineUsers map (for status broadcast).`);
            }
        });
        console.log(`[SERVER] Broadcasted status for ${userIdStr} (${isOnline}) to ${affectedUserIds.size} unique users.`);
    } catch (error) {
        console.error("[SERVER] Error broadcasting user status:", error);
    }
}



io.on('connection', (socket) => {
    console.log('[SERVER] A user connected:', socket.id);
    let currentUserId = null;

    socket.on('authenticate', async (userId) => {
        const userIdStr = String(userId); 
        console.log(`[SERVER] authenticate event received for socket ${socket.id} with userId: ${userIdStr}`);
        try {
            if (userIdStr) {
                currentUserId = userIdStr;
                addUserOnline(currentUserId, socket.id);
                await broadcastUserStatusChange(currentUserId, true);
                console.log(`[SERVER] User ${currentUserId} authenticated with socket ${socket.id}`);

                const userChats = await ChatRoom.find({ members: currentUserId })
                                                .sort({ lastMessageAt: -1 });
                console.log(`[SERVER] Found ${userChats.length} chats for user ${currentUserId}. Emitting myChatsList.`);
                socket.emit('myChatsList', userChats);
            } else {
                console.log('[SERVER] Authentication failed for socket:', socket.id, '- no userId provided.');
                socket.disconnect(true);
            }
        } catch (error) {
            console.error('[SERVER] CRITICAL ERROR in authenticate handler:', error);
            socket.emit('authError', { message: 'Authentication process failed on server.' });
            // socket.disconnect(true); 
        }
    });

    socket.on('authenticate', async (userId) => {
        try { 
            if (userId) {
                currentUserId = userId;

                if (typeof addUserOnline === 'function') {
                    addUserOnline(currentUserId, socket.id);
                } else {
                    console.error("addUserOnline is not defined!");
                }
                if (typeof broadcastUserStatusChange === 'function') {
                    await broadcastUserStatusChange(currentUserId, true);
                } else {
                    console.error("broadcastUserStatusChange is not defined!");
                }
                
                console.log(`User ${currentUserId} authenticated with socket ${socket.id}`);

                const userChats = await ChatRoom.find({ members: currentUserId })
                                                .sort({ lastMessageAt: -1 });
                socket.emit('myChatsList', userChats);
            } else {
                console.log('Authentication failed for socket:', socket.id, '- no userId provided.');
                socket.disconnect(true);
            }
        } catch (error) { 
            console.error('Error in authenticate event handler:', error);
            socket.emit('authError', { message: 'Authentication process failed on server.' });
            // socket.disconnect(true);
        }
    });

    socket.on('joinRoom', async (chatId) => {
        Object.keys(socket.rooms).forEach(room => {
            if (room !== socket.id) {
                socket.leave(room);
                console.log(`Socket ${socket.id} left room ${room}`);
            }
        });
        
        socket.join(chatId);
        console.log(`Socket ${socket.id} joined room ${chatId}`);

        try {
            const messages = await Message.find({ chatId: chatId })
                                          .sort({ timestamp: 1 }) 
                                          .limit(50);
            socket.emit('chatHistory', { chatId: chatId, messages: messages });
        } catch (error) {
            console.error('Error fetching chat history:', error);
            socket.emit('chatError', { chatId: chatId, message: 'Could not load chat history.' });
        }
    });

    socket.on('sendMessage', async (messageData) => {
        if (!currentUserId || String(currentUserId) !== String(messageData.senderId)) { // Порівнюємо як рядки
            console.warn('[SERVER] sendMessage: senderId mismatch or user not authenticated for this socket.');
            return;
        }
        try {
            const newMessage = new Message({
                chatId: messageData.chatId,
                senderId: currentUserId,
                senderName: messageData.senderName,
                senderAvatar: messageData.avatar,
                text: messageData.text,
                timestamp: new Date(messageData.timestamp)
            });
            const savedMessage = await newMessage.save();
            
            await ChatRoom.findByIdAndUpdate(messageData.chatId, { lastMessageAt: savedMessage.timestamp });
            
            console.log('[SERVER] Message saved:', savedMessage._id, 'to chat', messageData.chatId);
            io.to(messageData.chatId).emit('newMessage', savedMessage);

            const room = await ChatRoom.findById(messageData.chatId).select('members');
            if (room) {
                room.members.forEach(memberId => {
                    if (onlineUsers.has(String(memberId))) {
                        onlineUsers.get(String(memberId)).forEach(socketId => {
                          if (socketId !== socket.id) {
                            io.to(socketId).emit('chatActivity', {
                                chatId: messageData.chatId,
                                lastMessage: savedMessage
                            });
                          }
                        });
                    }
                });
            }

        } catch (error) {
            console.error('[SERVER] Error saving/broadcasting message:', error);
            socket.emit('messageError', { originalMessage: messageData, error: 'Could not send message.' });
        }
    });

    socket.on('createChat', async (data) => { 
        if (!currentUserId || String(currentUserId) !== String(data.creatorId)) {
            console.warn('[SERVER] createChat: creatorId mismatch or user not authenticated.');
            return;
        }
        if (!data.memberIds.includes(String(data.creatorId))) {
            data.memberIds.push(String(data.creatorId));
        }

        try {
            // Перевірка, чи чат з такими ж учасниками (крім назви) вже існує (опціонально)
            // const sortedMembers = [...new Set(data.memberIds)].sort();
            // let existingRoom = await ChatRoom.findOne({ members: { $all: sortedMembers, $size: sortedMembers.length } });
            // if (existingRoom) {
            //     console.log('[SERVER] Chat with these members already exists:', existingRoom);
            //     socket.emit('chatCreationError', { error: 'Chat with these members already exists.' });
            //     // Можна надіслати існуючу кімнату
            //     // socket.emit('addedToChat', existingRoom);
            //     return;
            // }

            const newChatRoom = new ChatRoom({
                name: data.name,
                members: [...new Set(data.memberIds)].map(id => String(id)), 
                createdBy: String(data.creatorId),
                lastMessageAt: new Date() 
            });
            const savedChatRoom = await newChatRoom.save();
            
            console.log('[SERVER] ChatRoom created:', savedChatRoom._id);

            socket.join(savedChatRoom._id.toString());
            console.log(`[SERVER] Creator ${currentUserId} (socket ${socket.id}) joined new room ${savedChatRoom._id.toString()}`);

            savedChatRoom.members.forEach(memberId_str => {
                if (onlineUsers.has(memberId_str)) {
                    onlineUsers.get(memberId_str).forEach(socketId => {
                        io.to(socketId).emit('addedToChat', savedChatRoom);
                        const memberSocket = io.sockets.sockets.get(socketId);
                        if(memberSocket) {
                            memberSocket.join(savedChatRoom._id.toString());
                            console.log(`[SERVER] Instructed user ${memberId_str} (socket ${socketId}) to join room ${savedChatRoom._id.toString()}`);
                        }
                    });
                }
            });
        } catch (error) {
            console.error('[SERVER] Error creating chat room:', error);
            socket.emit('chatCreationError', { error: 'Could not create chat: ' + error.message });
        }
    });

    socket.on('disconnect', async () => {
        console.log('[SERVER] User disconnected:', socket.id, 'Current User ID for this socket was:', currentUserId);
        if (currentUserId) {
            const userIsNowFullyOffline = removeUserOnline(currentUserId, socket.id);
            if (userIsNowFullyOffline) {
                await broadcastUserStatusChange(currentUserId, false);
            }
        }
    });
});

httpServer.listen(PORT, () => {
    console.log(`Chat server listening on *:${PORT}`);
});