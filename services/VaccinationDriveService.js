const mongoDBClient = require('../services/MongoDBService.js')

async function getAllVaccinationDrives(req) {
    const  db = await mongoDBClient.client;
    const collection = db.collection("vaccination_drives");
    const vaccinationDrives = await collection.find({}).toArray();
    let message = {};
    if (vaccinationDrives.length > 0) {
        console.log("Vaccination drives retrieved successfully");
        message = {
            success: true,
            data: vaccinationDrives,
        };
    } else {
        console.log("No vaccination drives found");
        message = {
            success: false,
            error: "data not found",
        };
    }
    return message
}
async function insertVaccinationDrive (req, drive) {
    const db = await mongoDBClient.client;
    const collection = db.collection("vaccination_drives");
    const result = await collection.insertOne(drive);
    let message = {};
    if (result.acknowledged) {
        console.log("Vaccination drive inserted successfully");
        message = {
            success: true,
            data: result,
        };
    } else {
        console.log("Vaccination drive insertion failed");
        message = {
            success: false,
            error: "insert failed",
        };
    }
    return message
}
module.exports = {
    getAllVaccinationDrives,
    insertVaccinationDrive
}