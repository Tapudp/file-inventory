const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database');

router.get('/', (req, res) => {
    console.log('>>>>base app route has been called', req.params);
    res.status(200).json({ data: '<><> drive service has been called on base route <><>', error: null });
})


router.get('/files', (req, res) => {
    console.log('>>>> /files get route has been called', req.body);
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

router.post('/files/create', (req, res) => {
    console.log('>>>> /files/insert post route has been called', req.body);
    if (!req.body || !req.body.fileName || !req.body.fileType || !req.body.newFileId) {
        res.status(400).json({
            error: {
                message: 'fileName, fileType, newFileId fields are required to process this query. One of them was missing.'
            }
        })
        throw new Error('fileName, fileType, newFileId fields are required to process this query. One of them was missing.');
    }

    const { fileName, fileContent, fileType, fileParentId, newFileId } = req.body;

    const isFolder = fileType === 'folder';
    const sqlInsert = `INSERT INTO drivefiles (fileName, fileContent, isFolder, parentId, fileId) VALUES ('${fileName}', '${fileContent}', ${isFolder}, '${fileParentId}', '${newFileId}');`

    db.query(sqlInsert, (err, result) => {
        if (err) {
            console.error("<><>sql query failed<><>", err);
            res.status(500).json({ error: err, data: null });
        }
        try {
            res.status(200).json({
                error: null,
                data: {
                    fileCreated: true,
                    fileDetails: {
                        fileId: newFileId,
                        fileName,
                        fileContent,
                        isFolder,
                        parentId: fileParentId
                    }
                }
            });
            console.log("<><> this query was successful <><>", sqlInsert);
        } catch (e) {
            console.error('<><> there was some error while making this query <><>', sqlInsert, e);
        }
    })
});

module.exports = router;