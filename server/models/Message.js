const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    chatId: { type: String, required: true, index: true }, // ID чату (може бути ID кімнати socket.io або ваш власний)
    senderId: { type: String, required: true }, // ID відправника (з вашої основної бази даних)
    senderName: { type: String, required: true }, // Ім'я відправника (для зручності)
    senderAvatar: { type: String }, // Шлях до аватара відправника
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
    // Можна додати: receiverId (якщо це приватний чат один на один), status ('sent', 'delivered', 'read')
});

// Додамо індекс для швидкого пошуку повідомлень по chatId та сортування по timestamp
messageSchema.index({ chatId: 1, timestamp: -1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;