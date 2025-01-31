import { readFile } from 'node:fs/promises';

export default async function retrieveAttendances(fileName) {
    
    try {
        let fileContent = await readFile(fileName, {encoding: 'utf-8'}, );
        console.log(fileContent);
        return fileContent;
    } catch (error) {
        console.error(error);
        return null;
    }
};