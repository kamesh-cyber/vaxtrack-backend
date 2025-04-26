const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const { Parser } = require('json2csv');
const path = require('path');

// Generate CSV report
async function generateCSVReport(data) {
    try {
        const fields = Object.keys(data[0]);
        const parser = new Parser({ fields });
        const csv = parser.parse(data);
        const filePath = path.join(__dirname, '../uploads', `report-${Date.now()}.csv`);
        fs.writeFileSync(filePath, csv);
        return filePath;
    } catch (error) {
        throw new Error(`Error generating CSV report: ${error.message}`);
    }
}

// Generate Excel report
async function generateExcelReport(data) {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report');
        
        // Add headers
        const headers = Object.keys(data[0]);
        worksheet.addRow(headers);
        
        // Add data rows
        data.forEach(row => {
            worksheet.addRow(Object.values(row));
        });
        
        const filePath = path.join(__dirname, '../uploads', `report-${Date.now()}.xlsx`);
        await workbook.xlsx.writeFile(filePath);
        return filePath;
    } catch (error) {
        throw new Error(`Error generating Excel report: ${error.message}`);
    }
}

    // Generate PDF report with a simple table
async function generatePDFReport(data) {
    try {
        const doc = new PDFDocument({ margin: 50 });
        const filePath = path.join(__dirname, '../uploads', `report-${Date.now()}.pdf`);
        const stream = fs.createWriteStream(filePath);
        
        doc.pipe(stream);
        
        // Add title
        doc.fontSize(16).text('Vaccination Report', { align: 'center' });
        doc.moveDown();
        
        // Extract headers
        const headers = Object.keys(data[0]);
        
        // Table configuration
        const tableTop = 150;
        const cellPadding = 5;
        const colWidth = (doc.page.width - 100) / headers.length;
        
        // Draw headers
        let xPos = 50;
        headers.forEach(header => {
            doc.fontSize(10).text(header, xPos, tableTop, { width: colWidth, align: 'center' });
            xPos += colWidth;
        });
        
        // Draw horizontal line below headers
        doc.moveTo(50, tableTop + 20)
           .lineTo(50 + (colWidth * headers.length), tableTop + 20)
           .stroke();
        
        // Draw rows
        let yPos = tableTop + 30;
        
        data.forEach(row => {
            xPos = 50;
            headers.forEach(header => {
                let value = row[header];
                
                // Format value if needed
                if (value === null || value === undefined) value = '';
                if (typeof value === 'object') value = JSON.stringify(value);
                
                doc.fontSize(9).text(String(value), xPos, yPos, { 
                    width: colWidth,
                    align: 'center',
                    lineBreak: false
                });
                
                xPos += colWidth;
            });
            
            yPos += 20;
            
            // Draw horizontal line after each row
            doc.moveTo(50, yPos - 5)
               .lineTo(50 + (colWidth * headers.length), yPos - 5)
               .stroke();
        });
        
        doc.end();

        console.log('PDF report generated at:', filePath);
        return await new Promise((resolve, reject) => {
            stream.on('finish', () => resolve(filePath));
            stream.on('error', reject);
        });
    } catch (error) {
        throw new Error(`Error generating PDF report: ${error.message}`);
    }
}

// Main function to generate report based on format
async function generateReport(data, format) {
    switch (format.toLowerCase()) {
        case 'csv':
            return generateCSVReport(data);
        case 'excel':
            return generateExcelReport(data);
        case 'pdf':
            return await generatePDFReport(data);
        default:
            throw new Error('Unsupported format');
    }
}

module.exports = {
    generateReport
};