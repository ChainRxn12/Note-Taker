const PORT = process.env.PORT || 3001;
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

uuidv4();

const express = require('express');
const app = express();

const allNotes = require('./db/db.json');

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/notes', (req, res) => {
    res.json(allNotes.slice(1));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});


//create the createNewNote function
function createNewNote(body, notesArray) {
    const newNote = body;
    if (!Array.isArray(notesArray))
    notesArray = [];

    if (notesArray.length === 0)
    notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNote);
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notesArray, null, 2));

    return newNote;
};

//post new notes
app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, allNotes);
    res.json(newNote);
});


//delete notes

function deleteNote(id, notesArray) {
    for(let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id === id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notesArray, null, 2));

            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, allNotes);
    res.json(true);
});


// port listener
app.listen(PORT, () => console.log(`Server Listening on port ${PORT}`));