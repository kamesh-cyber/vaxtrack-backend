const fs = require('fs');
const csv = require('csv-parser');

function validateAndConvertCSVFile(file) {
    return new Promise((resolve, reject) => {
        const results = []
        const errors = []
        const validHeaders = ['_id','name', 'age', 'class','gender','dateOfBirth', 'vaccinations'];
        const filePath = file.path;

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                console.log('Data:', data);
                // Validate headers
                const headers = Object.keys(data);
                console.log('Headers:', headers);
                if (!validHeaders.every(header => headers.includes(header))) {
                    errors.push(`Invalid headers in row: ${JSON.stringify(data)}`);
                    return;
                }

                // Validate data types
                if (isNaN(data.age)) {
                    errors.push(`Invalid age in row: ${JSON.stringify(data)}`);
                    return;
                }
                if (isNaN(data.class)) {
                    errors.push(`Invalid class in row: ${JSON.stringify(data)}`);
                    return;
                }
                
                // Convert data to appropriate types
                results.push({
                    _id: data._id,
                    name: data.name,
                    age: parseInt(data.age),
                    class: parseInt(data.class),
                    dateOfBirth: data.dateOfBirth,
                    gender:data.gender,
                    vaccinations: data.vaccinations
                });
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
module.exports = {
    validateAndConvertCSVFile
} 