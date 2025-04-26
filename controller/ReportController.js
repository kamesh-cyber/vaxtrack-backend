
const fs = require('fs');
const {getStudentsByVaccineName, getStudentsByVaccinationStatus} = require('../services/StudentService');
const {generateReport} = require('../helpers/generateReport');
const contentTypes = {
    'csv': 'text/csv',
    'pdf': 'application/pdf',
    'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  };

async function generateStudentReport(req, res) {
    try {
        console.log('Generating student report in :',req.query.reportType); //csv,pdf,excel
        const {vaccineName,reportType} = req.query;
        res.setHeader('Content-Type', contentTypes[reportType]);
        const filename = `vaccination_report_${Date.now()}.${reportType}`;
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`); 

        if(vaccineName){
            console.log('Getting students by vaccination name:',vaccineName)
            const response = await getStudentsByVaccineName(vaccineName);
            console.log('List of students by vaccination name:',response)
            if(response.success === false){
                res.status(404).send(response);
                return
            }
            const reportPath = await generateReport(response.data, reportType)
            console.log('Report generated at:',reportPath)
            const fileStream = fs.createReadStream(reportPath);
            fileStream.pipe(res);
            fileStream.on('error', (err) => {
                console.error('File stream error:', err);
                if (!res.headersSent) {
                  res.status(500).send('Error streaming file');
                }
              });
            res.status(200).sendFile(reportPath);
            return
        }


        
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    generateStudentReport
}