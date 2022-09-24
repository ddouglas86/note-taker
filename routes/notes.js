const notes = require('express').Router();
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils.js');
const uuid = require('../helpers/uuid.js');

notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
});

notes.get('/:id', (req, res) =>{
    const noteId = req.params.note_id;
    readFromFile('./db/db.json').then((data) => JSON.parse(data)).then((json) => {
        const result = json.filter((note) => note.note_id === noteId);
        
        return result.length > 0
        ? res.json(result)
        : res.json('Invalid note id');
    });
});

notes.post('/', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
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

notes.delete('/:id', (req, res) => {
    const noteId = req.params.id;
    readFromFile('./db/db.json').then((data) => JSON.parse(data)).then((json) =>{
        const result = json.filter((note) => note.id !== noteId);

        writeToFile('./db/db.json', result);

        res.json(`Note ${noteId} was deleted`);

    });
});

module.exports = notes;