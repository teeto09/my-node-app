const express = require('express');
const socketio = require('socket.io');
const bodyParser = require('body-parser');

// Set up the app
const app = express();
const server = app.listen(3000, () => {
    // console.log('Server running on port 3000');
});

// Set up Socket.io
const io = socketio(server);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define routes
app.post('/talks', (req, res) => {
    // Add a talk to the database
    var speaker = req.body.speaker
    res.send(`Talk added successfully by ${speaker}`);
});

app.post('/attendees', (req, res) => {
    // Add an attendee to the database
    res.send('Attendee added successfully');
});

app.post('/talks/:talkId/attendees/:attendeeId', (req, res) => {
    // Add an attendee to a talk in the database
    res.send('Attendee added to talk successfully');
});

// Set up real-time chat using Socket.io
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', ({ talkId, attendeeId }) => {
        socket.join(talkId);
        console.log(`${attendeeId} joined talk ${talkId}`);
    });

    socket.on('chatMessage', ({ talkId, attendeeId, message }) => {
        io.to(talkId).emit('message', { attendeeId, message });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});