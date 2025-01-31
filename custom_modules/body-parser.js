export default async function bodyParser(request) {

    // Initialize an empty buffer
    let data = '';
    
    // Let's create a Promise, so we can run the code asynchronousely
    return new Promise((resolve, reject) => {
        
        // For every 'data' event, concatenate the chunk of data arrived
        // The data will be in Bytes
        request.on('data', (chunk) => {
            console.log(`Chunk: ${chunk}`);
            data += chunk;
        });

        // As soon as we receive the 'end' event, we parse the Bytes to JSON,
        // and resolve the promise, returning it and its result to the caller
        request.on('end', () => {
            try {
                resolve(JSON.parse(data)); 
            }
            // Some error? Then reject the promise and return the error 
            catch (error) {
                reject(error);
            }
        });
    });
};