const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatRoomSchema = new Schema({
    // _id буде автоматично згенеровано MongoDB і може використовуватися як chatId
    name: { type: String, required: true },
    members: [{ type: String }], // Масив ID користувачів (з вашої основної бази даних)
    createdBy: { type: String, required: true }, // ID користувача, що створив чат
    createdAt: { type: Date, default: Date.now },
    lastMessageAt: { type: Date, default: Date.now } // Для сортування чатів за останнім повідомленням
});

chatRoomSchema.index({ members: 1 }); // Індекс по учасниках для пошуку чатів користувача
chatRoomSchema.index({ lastMessageAt: -1 });

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;