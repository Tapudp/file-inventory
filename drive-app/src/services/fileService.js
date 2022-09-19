const fileAPIUrl = 'http://localhost:3001'

async function baseApiService({ url = '', method = 'GET', data = {} }) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: method !== 'GET' ? JSON.stringify(data) : null // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
}

let FileService = {
    async pingToServer() {
        try {
            let response = await baseApiService({ url: `${fileAPIUrl}/` });

            if (response.error !== null) {
                alert("Server seems to be down!")
                throw new Error('Server seems to be down!');
            }

            return response;
        } catch (e) {
            throw new Error('front-end service function might have some issue :: pingToServer', e);
        }
    },

    async getListOfFiles({ currentPathId }) {
        try {
            let response = await baseApiService({
                url: `${fileAPIUrl}/files?currentPathId=${currentPathId}`,
                data: {
                    currentPathId
                }
            });

            if (response.error !== null) {
                alert('API call to backend failed')
                throw new Error('API call to backend failed');
            }
            return response;

        } catch (e) {
            throw new Error('front-end service function might have some issue :: getListOfFiles', e)
        }
    },

    async createNewFileObject(fileDetails = {
        fileName: 'test-compulsary',
        fileContent: 'test-nullable',
        isFolder: 'video-compulsary',
        fileParentId: 'test-nullable',
        newFileId: 'test-compulsary'
    }) {
        try {
            let response = await baseApiService({
                url: `${fileAPIUrl}/files/create`,
                method: 'POST',
                data: fileDetails
            });

            if (response.error !== null) {
                alert('There was an issue from service :: ')
                throw new Error('There was an issue from service :: ', response.error);
            }
            return response;

        } catch (e) {
            throw new Error('front-end service function might have some issue :: getListOfFiles', e)
        }
    },

    async removeFileObject({ fileId = '' }) {
        try {
            let response = await baseApiService({
                url: `${fileAPIUrl}/files/remove?fileId=${fileId}`,
                method: 'DELETE',
            });

            if (response.error !== null) {
                alert('There was an issue from service :: ')
                throw new Error('There was an issue from service :: ', response.error);
            }
            return response;

        } catch (e) {
            throw new Error('front-end service function might have some issue :: getListOfFiles', e)
        }
    },

    async updateFileObject({ fileId = '', destinationId = '', destinationName = '' }) {
        try {
            let response = await baseApiService({
                url: `${fileAPIUrl}/files/update`,
                method: 'PUT',
                data: {
                    fileId,
                    destinationId,
                    destinationName
                }
            });

            if (response.error !== null) {
                alert('There was an issue from service :: ')
                throw new Error('There was an issue from service :: ', response.error);
            }
            return response;

        } catch (e) {
            throw new Error('front-end service function might have some issue :: getListOfFiles', e)
        }
    },
}

export default FileService;