const { getAllStudents } = require("./StudentService");
const { getAllVaccinationDrives } = require("./VaccinationDriveService");

async function getDashboardOverviewService(req) {   
    req.limit = 100;
    req.offset = 0;
    const students = await getAllStudents(req);
    console.log("Students retrieved successfully");
    const vaccinationDrives = await getAllVaccinationDrives(req);
    let numberOfStudentsVaccinated = 0
    numberOfStudentsVaccinated = students.data.filter(student => student.vaccinations).length;

    let percentageOfStudentsVaccinated = 0
    if (students.success && students.data.length > 0) {
        percentageOfStudentsVaccinated = Math.ceil((numberOfStudentsVaccinated / students.data.length) * 100);
        
    }
    let upcomingDrives = [];
    if (vaccinationDrives.success && vaccinationDrives.data.length > 0) {
        let today = new Date();
        let maximumDate = new Date()
        maximumDate.setDate(today.getDate() + 30);
        upcomingDrives = vaccinationDrives.data.filter(drive => (new Date(drive.scheduled_date) < maximumDate && new Date(drive.scheduled_date) > today));
    }

    let message = {};
    if (students.success) {
        console.log("Dashboard overview retrieved successfully");
        message = {
            success: true,
            data: {
                totalStudents: students.data.length,
                totalVaccinationDrives: vaccinationDrives?.data?.length,
                numberOfStudentsVaccinated: numberOfStudentsVaccinated,
                percentageOfStudentsVaccinated: percentageOfStudentsVaccinated,
                upcomingDrives:upcomingDrives
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