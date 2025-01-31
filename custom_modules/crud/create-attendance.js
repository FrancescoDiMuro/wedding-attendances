import bodyParser from "../body-parser.js";
import { readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from "node:crypto";

export default async function createAttendance(request, fileName) {

    try {

        // Get the actual list of attendances
        let attendances = await readFile(fileName, {encoding: 'utf-8', flag: 'a+'});

        // If there is at least a record, 
        // then parse the content of the file as a JSON object
        if(attendances.length > 0) {
            attendances = JSON.parse(attendances);
        }
        // Else, create an empty array
        else {
            attendances = [];
        }
        
        // Generate a random UUID for the attendance id
        let attendanceId = randomUUID();
        
        // Parse the request body
        let attendanceData = await bodyParser(request);
        
        // Assign the attendance id to the attendance data
        attendanceData.id = attendanceId;

        // Push the newly created record in the attendences array/JSON object
        attendances.push(attendanceData);
        
        // Stringify the data, with no replacer and four spaces
        let attendanceDataStringified = JSON.stringify(
            attendanceData,
            null,
            4
        );

        // Write to the file
        await writeFile(
            fileName, 
            JSON.stringify(attendances), {
                encoding: 'utf-8',
                flag: 'w'
            }
        );

        return attendanceDataStringified;

    } catch (error) {
        console.log(error);
        return null;
    }
};