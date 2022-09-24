const notes = require('express').Router();
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils.js');
const uuid = require('../helpers/uuid.js');

notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
});

notes.post('/', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            note_id: uuid(),
        };
        readAndAppend(newNote, './db/db.json');

        const response = {
            body: newNote
        };

        res.json(response);
    } else {
        res.json('Error saving note');
    }
});

notes.delete('/:note_id', (req, res) => {
    const noteId = req.params.note_id;
    readFromFile('./db/db.json').then((data) => JSON.parse(data)).then((json) =>{
        const result = json.filter((note) => note.note_id !== noteId);

        writeToFile('./db/db.json', result);

    });
});

module.exports = notes;