const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database');

router.get('/', (req, res) => {
    console.log(':: ::', new Date().toISOString(), '>>>>base app route has been called', req.params);
    res.status(200).json({ data: '<><> drive service has been called on base route <><>', error: null });
})


router.get('/files', (req, res) => {
    console.log(':: ::', new Date().toISOString(), '>>>> /files get route has been called', req.query);
    if (!req.body || !req.query.currentPathId) {
        res.status(400).json({
            error: {
                message: 'currentPathId field is required to process this query. It seems to be missing.'
            }
        })
        throw new Error('currentPathId field is required to process this query. It seems to be missing.');
    }

    // const derivedPathId = req.body.currentPathId === 'root' ? null : req.body.currentPathId
    const sqlSelect = `SELECT * FROM drivefiles WHERE parentId = "${req.query.currentPathId}";`;
    db.query(sqlSelect, (err, result) => {
        if (err) {
            console.error(':: ::', new Date().toISOString(), "<><>sql query failed<><>", err)
            res.status(500).json({ error: err, data: null });
        }
        console.log(':: ::', new Date().toISOString(), "<><> made this query <><>", sqlSelect, result);
        res.status(200).json({ error: null, data: result });
    });
});

router.post('/files/create', (req, res) => {
    console.log(':: ::', new Date().toISOString(), '>>>> /files/insert post route has been called', req.body);
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
            console.error(':: ::', new Date().toISOString(), "<><>sql query failed<><>", err);
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
            console.log(':: ::', new Date().toISOString(), "<><> this query was successful <><>", sqlInsert);
        } catch (e) {
            console.error(':: ::', new Date().toISOString(), '<><> there was some error while making this query <><>', sqlInsert, e);
        }
    })
});

module.exports = router;