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
    if (!req.query.currentPathId) {
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
        const finalResult = result.map((it, idx) => {
            return Object.assign({}, it, {
                // isFolder: !!Number(response.isChecked), // OR
                isFolder: Boolean(Number(it.isFolder))
            });
        })
        console.log(':: ::', new Date().toISOString(), "<><> made this query <><>", sqlSelect, finalResult);
        res.status(200).json({ error: null, data: finalResult });
    });
});

router.post('/files/create', (req, res) => {
    console.log(':: ::', new Date().toISOString(), '>>>> /files/insert post route has been called', req.body);
    if (!req.body || !req.body.fileName || !req.body.newFileId || !req.body.parentName) {
        res.status(400).json({
            error: {
                message: 'fileName, isFolder, newFileId, parentName fields are required to process this query. One of them was missing.'
            }
        })
        throw new Error('fileName, isFolder, newFileId, parentName fields are required to process this query. One of them was missing.');
    }

    const { fileName, fileContent, isFolder, parentId, parentName, newFileId } = req.body;

    const sqlInsert = `INSERT INTO drivefiles (fileName, fileContent, isFolder, parentId, parentName, fileId) VALUES ("${fileName.toString()}", "${fileContent.toString()}", ${isFolder}, "${parentId}", "${parentName.toString()}", "${newFileId}");`

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
                        parentId: parentId,
                        parentName: parentName
                    }
                }
            });
            console.log(':: ::', new Date().toISOString(), "<><> this query was successful <><>", sqlInsert);
        } catch (e) {
            console.error(':: ::', new Date().toISOString(), '<><> there was some error while making this query <><>', sqlInsert, e);
        }
    })
});

router.delete('/files/remove', (req, res) => {
    console.log(':: ::', new Date().toISOString(), '>>>> /files/delete post route has been called', req.body);
    if (!req.query) {
        res.status(400).json({
            error: {
                message: 'File-id query seems to be missing in the query params.'
            }
        })
        throw new Error('File-id query seems to be missing in the query params.');
    }

    const sqlRemove = `DELETE FROM drivefiles WHERE fileId = "${req.query.fileId}" OR parentId = "${req.query.fileId}";`

    db.query(sqlRemove, (err, result) => {
        if (err) {
            console.error(':: ::', new Date().toISOString(), "<><>sql query failed<><>", err);
            res.status(500).json({ error: err, data: null });
        }
        try {
            res.status(200).json({
                error: null,
                data: {
                    fileRemoved: true,
                    fileDetails: {
                        fileId: req.query.fileId,
                    }
                }
            });
            console.log(':: ::', new Date().toISOString(), "<><> this query was successful <><>", sqlRemove);
        } catch (e) {
            console.error(':: ::', new Date().toISOString(), '<><> there was some error while making this query <><>', sqlRemove, e);
        }
    })
});

router.put('/files/update', (req, res) => {
    console.log(':: ::', new Date().toISOString(), '>>>> /files/update put route has been called', req.body);
    if (!req.body || !req.body.fileId || !req.body.destinationId || !req.body.destinationName) {
        res.status(400).json({
            error: {
                message: 'File-id or destination-id or destination-name seems to be missing in the request body.'
            }
        })
        throw new Error('File-id or destination-id or destination-name seems to be missing in the request body.');
    }

    // pre-assumed fixed that destination-id will be of type folder
    // front-end design itself won't show video type objects as destinations
    const sqlUpdate = `UPDATE drivefiles SET parentId = "${req.body.destinationId}", parentName = "${req.body.destinationName}" WHERE fileId = "${req.body.fileId}";`

    db.query(sqlUpdate, (err, result) => {
        if (err) {
            console.error(':: ::', new Date().toISOString(), "<><>sql query failed<><>", err);
            res.status(500).json({ error: err, data: null });
        }
        try {
            res.status(200).json({
                error: null,
                data: {
                    fileUpdated: true,
                    fileDetails: {
                        fileId: req.body.fileId,
                        parentId: req.body.destinationId,
                        parentName: req.body.destinationName
                    }
                }
            });
            console.log(':: ::', new Date().toISOString(), "<><> this query was successful <><>", sqlUpdate);
        } catch (e) {
            console.error(':: ::', new Date().toISOString(), '<><> there was some error while making this query <><>', sqlUpdate, e);
        }
    })
});

module.exports = router;