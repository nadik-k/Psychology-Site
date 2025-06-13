const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const { JWT_SECRET } = require('./config');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/userRoutes');
const cardRoutes = require('./routes/cardRoutes');
const diaryRoutes = require('./routes/diaryRoutes');
const contactRoute = require('./routes/contact');
const messageRoutes = require('./routes/messageRoutes');
const anonymousRoutes = require('./routes/anonymousRoutes');
const Message = require('./models/messageModel');
const AnonymousMessage = require('./models/anonymousModel');
const postRoutes = require('./routes/postRoutes');
const eventRoutes = require('./routes/eventRoutes');
const statisticsRouter = require('./routes/statisticRoutes');
const liqpayRoutes = require('./routes/liqpayRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    }
});

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://nkudrya2004:VdZCvxBBNywppNrY@cluster0.81czigz.mongodb.net/Breathe_freely?retryWrites=true&w=majority')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB error:', err));

app.use('/api/users', userRoutes);
app.use('/api/cards', cardRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/diary', diaryRoutes);
app.use('/api', contactRoute);
app.use('/api/messages', messageRoutes);
app.use('/api/anonymous', anonymousRoutes)
app.use('/api/posts', postRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/static', statisticsRouter);
app.use('/api', liqpayRoutes);
app.use('/api/sessions', sessionRoutes);

io.on('connection', (socket) => {
    console.log('Користувач підключився:', socket.id);
    socket.on('send_message', async (data) => {
        try {
            const savedMsg = new Message(data);
            await savedMsg.save();
            io.emit('receive_message', savedMsg);
        } catch (err) {
            console.error('Помилка при збереженні повідомлення:', err);
        }
    });

    socket.on('read_messages', async ({ readerId, senderId }) => {
        try {
            await Message.updateMany(
                { senderId, receiverId: readerId, read: false },
                { $set: { read: true } }
            );
            io.emit('messages_read', { readerId, senderId });
        } catch (err) {
            console.error('Помилка при оновленні статусу прочитання:', err);
        }
    });

    socket.on('receive_message', (data) => {
        if (data.senderId !== myId) {
            setMessages(prev => [...prev, data]);

            if (activeUser && activeUser._id === data.senderId) {
                socket.emit('read_messages', {
                    readerId: myId,
                    senderId: data.senderId
                });
            }
        }
    });

    socket.on('create_anonymous_session', () => {
        const sessionId = uuidv4();
        anonymousChats[sessionId] = [];
        socket.join(sessionId);
        socket.emit('anonymous_session_created', { sessionId });
    });

    socket.on('join_anonymous_session', ({ sessionId }) => {
        if (anonymousChats[sessionId]) {
            socket.join(sessionId);
            socket.emit('anonymous_session_joined', { sessionId });
        } else {
            socket.emit('error', { message: 'Сесію не знайдено.' });
        }
    });

    socket.on('anon_join', (sessionId) => {
        socket.join(sessionId);
        console.log(`Користувач ${socket.id} приєднався до сесії: ${sessionId}`);
    });

    socket.on('anon_send_message', async (data) => {
        const { sessionId, text, authToken } = data;

        if (!sessionId || !text) {
            console.error('Недостатньо даних для надсилання повідомлення');
            return;
        }
        let sender = 'anonymous';
        if (authToken) {
            try {
                const decoded = jwt.verify(authToken, JWT_SECRET);
                if (decoded.role === 'psycholog') {
                    sender = 'psycholog';
                }
            } catch (err) {
                console.error('Невірний токен:', err);
            }
        }

        const newMessage = new AnonymousMessage({ sessionId, text, sender });
        try {
            await newMessage.save();
            io.to(sessionId).emit('anon_receive_message', newMessage);
        } catch (err) {
            console.error('Помилка збереження повідомлення:', err);
        }
    });

});

server.listen(5000, () => {
    console.log('Сервер запущено на http://localhost:5000');
});