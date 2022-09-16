const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database');

router.get('/', (req, res) => {
    console.log('>>>>base app route has been called', req.params);
    res.status(200).json({ data: '<><> drive service has been called on base route <><>', error: null });
})


router.get('/files', (req, res) => {
    console.log('>>>> /files get route has been called', req.params);
    const sqlSelect = 'SELECT * FROM drivefiles;';
    db.query(sqlSelect, (err, result) => {
        if (err) {
            console.error("<><>sql query failed<><>", err)
            res.status(500).json({ error: err, data: null });
        }
        console.log("<><> made this query <><>", sqlSelect, result);
        res.status(200).json({ error: null, data: result });
    });
});

router.post('/files/insert', (req, res) => {
    console.log('>>>> /files/insert post route has been called', req.params);
    const rootId = uuidv4();
    const newFileId = uuidv4();
    // const sqlInsert = `INSERT INTO drivefiles (id, fileName, fileContent, isFolder, parentPathId) VALUES (UUID_TO_BIN(UUID()), 'firstFile', 'firstContent', true, UUID_TO_BIN(UUID()));`
    const sqlInsert = `INSERT INTO drivefiles (selfPathId, fileName, fileContent, isFolder, parentPathId) VALUES ('${newFileId}', 'firstFile', 'firstContent', true, '${rootId}');`

    db.query(sqlInsert, (err, result) => {
        if (err) {
            console.error("<><>sql query failed<><>", err);
            res.status(500).json({ error: err, data: null });
        }
        res.status(200).json({
            error: null,
            data: {
                fileCreated: true,
                fileDetails: {
                    selfPathId: newFileId,
                    fileName: 'firstFile',
                    fileContent: 'firstContent',
                    isFolder: true,
                    parentPathId: rootId
                }
            }
        });
        console.log("<><> made this query <><>", sqlInsert);
    })
});

module.exports = router;