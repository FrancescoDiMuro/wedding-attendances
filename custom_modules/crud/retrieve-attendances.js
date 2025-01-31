import { readFile } from 'node:fs/promises';

export default async function retrieveAttendances(fileName) {
    
    try {
        // Read the content of the file and return it
        return await readFile(fileName, {encoding: 'utf-8'}, );
    } catch (error) {
        console.error(error);
        return null;
    }
};