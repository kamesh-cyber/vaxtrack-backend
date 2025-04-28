const mongoDBClient = require('../services/MongoDBService.js')
const mongo = require('mongodb');
const {checkForSchedulingConflicts} = require('../helpers/checkForSchedulingConflicts')
const status_codes = require('../helpers/statusCode')

async function getAllVaccinationDrives(req) {
    const  db = await mongoDBClient.client;
    const collection = db.collection("vaccination_drives");
    const vaccinationDrives = await collection.find({}).toArray();
    let message = {};
    if (vaccinationDrives.length > 0) {
        console.log("Vaccination drives retrieved successfully");
        message = {
            statusCode: status_codes.OK,
            success: true,
            data: vaccinationDrives,
        };
    } else {
        console.log("No vaccination drives found");
        message = {
            statusCode: status_codes.NOT_FOUND,
            success: false,
            error: "data not found",
        };
    }
    return message
}
async function insertVaccinationDrive (req, drive) {
    const db = await mongoDBClient.client;
    const collection = db.collection("vaccination_drives");
    drive.created_on = new Date();
    drive.updated_on = new Date();
    // drive.created_by = req.user.username;
    drive["scheduled_date"] = new Date(drive["scheduled_date"]);
    const vaccinationData = await collection.find({scheduled_date: drive.scheduled_date},{projection:["classes"]}).toArray();
    const conflict = checkForSchedulingConflicts(vaccinationData,drive)
    if(conflict){
        return {
            statusCode: status_codes.BAD_REQUEST,
            success: false,
            error: "Drive already exists for classes: " + conflict.join(", "),
        };
    }
    const result = await collection.insertOne(drive);
    let message = {};
    if (result.acknowledged) {
        console.log("Vaccination drive inserted successfully");
        message = {
            statusCode: status_codes.CREATED,
            success: true,
            data: result,
        };
    } else {
        console.log("Vaccination drive insertion failed");
        message = {
            statusCode: status_codes.INTERNAL_SERVER_ERROR,
            success: false,
            error: "insert failed",
        };
    }
    return message
}

async function updateVaccinationDrive (id, drive) {
    const db = await mongoDBClient.client;
    const collection = db.collection("vaccination_drives");
    const updated_on = new Date();
    updateBody = {updated_on: updated_on}
    if(drive["scheduled_date"]){
        drive["scheduled_date"] = new Date(drive["scheduled_date"]);
        updateBody["scheduled_date"] = drive["scheduled_date"];
    }
    if(drive["available_doses"]){
        updateBody["available_doses"] = drive["available_doses"];
    }
    const result = await collection.updateOne(
        { _id: new mongo.ObjectId(id) },
        { $set: updateBody }
    );
    let message = {};
    if (result.acknowledged) {
        console.log("Vaccination drive updated successfully");
        message = {
            statusCode: status_codes.OK,
            success: true,
            data: result,
        };
    } else {
        console.log("Vaccination drive update failed");
        message = {
            statusCode: status_codes.INTERNAL_SERVER_ERROR,
            success: false,
            error: "update failed",
        };
    }
    return message
}

async function getVacccinationDriveById (id) {
    const db = await mongoDBClient.client;
    const collection = db.collection("vaccination_drives");
    const vaccinationDrive = await collection.findOne({ _id: new mongo.ObjectId(id) });
    let message = {};
    if (vaccinationDrive) {
        console.log("Vaccination drive retrieved successfully");
        message = {
            statusCode: status_codes.OK,
            success: true,
            data: vaccinationDrive,
        };
    } else {
        console.log("Vaccination drive not found");
        message = {
            statusCode: status_codes.NOT_FOUND,
            success: false,
            error: "data not found",
        };
    }
    return message
}
async function getVaccinationDriveByName(name) {
    const db = await mongoDBClient.client;
    const collection = db.collection("vaccination_drives");
    const vaccinationDrive = await collection.find  ({ name: name }).toArray();
    let message = {}; 
    if (vaccinationDrive.length > 0) {
        console.log("Vaccination drive retrieved successfully");
        message = {
            statusCode: status_codes.OK,
            success: true,
            data: vaccinationDrive,
        };
    } else {
        console.log("Vaccination drive not found");
        message = {
            statusCode: status_codes.NOT_FOUND,
            success: false,
            error: "data not found",
        };
    }
    return message
}


module.exports = {
    getAllVaccinationDrives,
    insertVaccinationDrive,
    updateVaccinationDrive,
    getVaccinationDriveByName
}