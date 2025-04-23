const { getAllStudents } = require("./StudentService");
const { getAllVaccinationDrives } = require("./VaccinationDriveService");

async function getDashboardOverviewService(req) {   
    const students = await getAllStudents(req);
    const vaccinationDrives = await getAllVaccinationDrives(req);
    let numberOfStudentsVaccinated = 0
    numberOfStudentsVaccinated = students.data.filter(student => student.vaccinations).length;

    let percentageOfStudentsVaccinated = 0
    if (students.success && students.data.length > 0) {
        percentageOfStudentsVaccinated = Math.ceil((numberOfStudentsVaccinated / students.data.length) * 100);
        
    }

    let message = {};
    if (students.success && vaccinationDrives.success) {
        console.log("Dashboard overview retrieved successfully");
        message = {
            success: true,
            data: {
                totalStudents: students.data.length,
                totalVaccinationDrives: vaccinationDrives.data.length,
                numberOfStudentsVaccinated: numberOfStudentsVaccinated,
                percentageOfStudentsVaccinated: percentageOfStudentsVaccinated
            },
        };
    } else {
        console.log("Failed to retrieve dashboard overview");
        message = {
            success: false,
            error: "Failed to retrieve dashboard overview",
        };
    }
    return message;
}
module.exports = {
    getDashboardOverviewService,
};