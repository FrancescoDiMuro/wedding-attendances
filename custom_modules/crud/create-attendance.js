import bodyParser from "../body-parser.js";
import { readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from "node:crypto";

export default async function createAttendance(request, fileName) {

    try {

        // Get the actual list of attendances
        let attendancesFileContent = await readFile(fileName, {encoding: 'utf-8', flag: 'a+'});

        // Set a new container for the JSON object
        let attendancesObject = null;

        // If there is at least a record, 
        // then parse the content of the file as a JSON object
        if(attendancesFileContent.length > 0) {
            attendancesObject = JSON.parse(attendancesFileContent);
        }
        // Else, create an empty object
        else {
            attendancesObject = {attendances: []};
        }
        
        // Get the request body
        let attendanceData = await bodyParser(request);

        // Get the data needed
        let attendanceName = attendanceData.name;
        let attendanceSurname = attendanceData.surname;

        // Search the attendance by name and surname
        let attendanceExists = attendancesObject.attendances.find((attendance) => {
            return (attendance.name == attendanceName) && (attendance.surname == attendanceSurname);
        }) != undefined;

        // If the attendance already exists
        if(attendanceExists) {
            
            // Inform the user
            let text = `The attendance with name '${attendanceName}' and surname '${attendanceSurname}' already exists.`
            
            // Exit the function
            return JSON.stringify({message: text});
        }

        // Generate a random UUID for the attendance id
        let attendanceId = randomUUID();
        
        // Assign the attendance id to the attendance data
        attendanceData.id = attendanceId;

        // Push the newly created record in the attendences array/JSON object
        attendancesObject.attendances.push(attendanceData);
        
        // Stringify the data, with no replacer and four spaces
        let attendanceDataStringified = JSON.stringify(
            attendanceData,
            null,
            4
        );

        // Write to the file
        await writeFile(
            fileName, 
            JSON.stringify(attendancesObject, null, 4), {
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