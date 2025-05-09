const fs = require('fs');
const csv = require('csv-parser');
const {generateRollNumber} = require('../helpers/generateRollNumber'); 

function validateAndConvertCSVFile(file) {
    return new Promise((resolve, reject) => {
        const results = []
        const errors = []
        const validHeaders = ['name', 'age', 'class','gender','dateOfBirth'];
        const filePath = file.path;

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                console.log('Data:', data);
                const headers = Object.keys(data);
                console.log('Headers:', headers);
                if (isEmptyRow(data)) {
                    console.log('Skipping empty row');
                    return; // Skip empty rows
                }
                if (!validHeaders.every(header => headers.includes(header))) {
                    errors.push(`Invalid headers in row: ${JSON.stringify(data)}`);
                    return;
                }

                if (isNaN(data.age)) {
                    errors.push(`Invalid age in row: ${JSON.stringify(data)}`);
                    return;
                }
                if (isNaN(data.class)) {
                    errors.push(`Invalid class in row: ${JSON.stringify(data)}`);
                    return;
                }
                
                const convertdData = {
                    _id: generateRollNumber(parseInt(data.class)),
                    name: data.name,
                    age: parseInt(data.age),
                    class: parseInt(data.class),
                    dateOfBirth: data.dateOfBirth,
                    gender:data.gender,
                    created_on: new Date(),
                    updated_on: new Date()
                }
                results.push(convertdData);
            })
            .on('end', () => {
                if (errors.length > 0) {
                    reject(errors);
                } else {
                    console.log('All data processed successfully');
                    resolve(results);
                }
            })
            .on('error', (error) => {
                reject([`Error reading file: ${error.message}`]);
            });
    });
}
function isEmptyRow(data) {
    console.log('Checking if row is empty:', data.length);
    if (Object.keys(data).length === 0) return true;
    
    return Object.values(data).every(value => {
        return value === undefined || 
               value === null || 
               value.toString().trim() === '';
    });
}
module.exports = {
    validateAndConvertCSVFile
} 