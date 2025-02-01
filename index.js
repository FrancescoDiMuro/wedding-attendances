'use strict';

// Imports
import { createServer } from 'node:http';
import { URL } from 'node:url';
import HTTP from './custom_modules/http-status-code.js';
import retrieveAttendances from './custom_modules/crud/retrieve-attendances.js';
import createAttendance from './custom_modules/crud/create-attendance.js';
import retrieveTotals from './custom_modules/crud/retrieve-totals.js';

// App constants
const protocol = 'http';
const hostname = '127.0.0.1';
const port = 8000;
const baseUrl = `${protocol}://${hostname}:${port}`
const responseHeaders = {
    'Content-Type': 'application/json'
};

// File of attendances
const attendancesFileName = './data/attendances.json';


// Create the server
const server = createServer();

// Handler for each request
// In order to use promises, we need to use 'async' instruction
server.on('request', async (req, res) => {

    try {
        // Get the request method
        let requestMethod = req.method;
        
        // Parse the URL to extract pathname and query parameters
        let requestUrl = new URL(req.url, baseUrl);
        
        // Extract the needed information (deconstructing)
        let {pathname: route, searchParams: queryParameters} = requestUrl;

        // Log from where the request arrived
        console.log(`${requestMethod} request received from ${route}`);

        /* ---------- Routes ---------- */
        // GET /ping
        if(route === '/ping' && requestMethod === 'GET') {
            let response = JSON.stringify(
                {message: 'pong'}
            );
            res.writeHead(HTTP.OK, 'OK', responseHeaders);
            res.end(response);
        }
        // GET /attendances
        else if (route === '/attendances' && requestMethod === 'GET') {
            let response = await retrieveAttendances(attendancesFileName);
            res.writeHead(HTTP.OK, 'OK', responseHeaders);
            res.end(response);
        }
        // POST /attendances
        else if (route === '/attendances' && requestMethod === 'POST') {
            let response = await createAttendance(req, attendancesFileName);
            res.writeHead(HTTP.CREATED, 'OK', responseHeaders);
            res.end(response);
        }
        // GET /totals
        else if (route === '/totals' && requestMethod === 'GET') {
            let response = await retrieveTotals(attendancesFileName);
            res.writeHead(HTTP.OK, 'OK', responseHeaders);
            res.end(response);
        }
        // Undefined route
        else {
            let response = JSON.stringify(
                {message: `Route ${route} not found.`}
            );
            res.writeHead(HTTP.OK, 'OK', responseHeaders);
            res.end(response);
        }
        
        // Conditionally log the query parameters
        if(queryParameters.size > 0) console.log(`Query parameters: ${queryParameters}`);
    } catch (error) {
        console.log(`Error occurred:\n${error}`);
    }
});

// Add the server listener (a.k.a., start the server)
server.listen(port, hostname, () => {
    console.log(`Server is running on ${baseUrl}`);
});