import { readFile } from 'node:fs/promises';

export default async function retrieveTotals(filePath) {

    try {
        
        // Read the file, parse the JSON and extract the attendances attribute
        let attendances = JSON.parse(
            await readFile(filePath, {encoding: 'utf-8'})
        ).attendances;

        // Initialize counters
        let totalAdults = 0;
        let totalChildren = 0;

        // For each attendance
        attendances.forEach((attendance) => {
                
            // Increment counters
            totalAdults += attendance.adults_number;
            totalChildren += Number(attendance.children_number);
        });

        return JSON.stringify(
            {
                'total_adults': totalAdults,
                'total_children': totalChildren
            },
            null,
            4
        );

    } catch (error) {
        console.log(error);
        return null;
    }
};