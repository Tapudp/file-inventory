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
                throw new Error('Server seems to be down!');
            }

            return response;
        } catch (e) {
            throw new Error('front-end service function might have some issue :: pingToServer', e);
        }
    },

    async getListOfFiles() {
        try {
            let response = await baseApiService({ url: `${fileAPIUrl}/files` });

            if (response.error !== null) {
                throw new Error('API call to backend fialed');
            }
            return response;

        } catch (e) {
            throw new Error('front-end service function might have some issue :: getListOfFiles', e)
        }
    },
}

export default FileService;