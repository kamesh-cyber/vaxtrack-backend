const mongoDBClient = require('../services/MongoDBService.js')
const mongo = require('mongodb');
const {checkForSchedulingConflicts} = require('../helpers/checkForSchedulingConflicts')
const status_codes = require('../helpers/statusCode')
const {addActiveStatus} = require('../helpers/addActiveStatus');
const { capitalizeFirstLetter } = require('../helpers/capitalizeFirstLetter.js');

async function getAllVaccinationDrives(req) {
    const  db = await mongoDBClient.client;
    const collection = db.collection("vaccination_drives");
    const sort = {scheduled_date: 1}
    const limit = req.limit 
    const offset = req.offset
    let vaccinationDrives = await collection.find({}).sort(sort).toArray();
    let message = {};
    vaccinationDrives = addActiveStatus(vaccinationDrives);
    if (vaccinationDrives.length > 0) {
        console.log("Vaccination drives retrieved successfully");
        message = {
            statusCode: status_codes.OK,
            success: true,
            data: vaccinationDrives
        };
    } else {
        console.log("No vaccination drives found");
        message = {
            statusCode: status_codes.NOT_FOUND,
            success: false,
            error: "No Vaccination Drives found",
        };
    }
    return message
}
async function getVaccinationDriveWithLimit(req) {
    const  db = await mongoDBClient.client;
    const collection = db.collection("vaccination_drives");
    const sort = {scheduled_date: 1}
    const limit = req.limit 
    const offset = req.offset
    const result = await collection.aggregate([
        {
            $facet: {
                paginatedResults: [
                    { $sort: sort },
                    { $skip: offset },
                    { $limit: limit }
                ],
                totalCount: [
                    { $count: 'count' }
                ]
            }
        }
    ]).toArray();
    let vaccinationDrives = result[0].paginatedResults;
    const totalCount = result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0;
    let message = {};
    vaccinationDrives = addActiveStatus(vaccinationDrives);
    if (vaccinationDrives.length > 0) {
        console.log("Vaccination drives retrieved successfully");
        message = {
            statusCode: status_codes.OK,
            success: true,
            data: vaccinationDrives,
            totalCount: totalCount,
        };
    } else {
        console.log("No vaccination drives found");
        message = {
            statusCode: status_codes.NOT_FOUND,
            success: false,
            error: "No Vaccination Drives found",
        };
    }
    return message
}
async function insertVaccinationDrive (req, drive) {
    const db = await mongoDBClient.client;
    const collection = db.collection("vaccination_drives");
    drive.name = capitalizeFirstLetter(drive.name);
    drive.created_on = new Date();
    drive.updated_on = new Date();
    console.log('before drive: '+ JSON.stringify(drive))
    drive.scheduled_date = new Date(drive["scheduled_date"]);
    console.log('drive: '+ JSON.stringify(drive))
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
    if(drive["classes"]){
        updateBody["classes"] = drive["classes"];
    }
    console.log('updateBody: '+ JSON.stringify(updateBody))
    const vaccinationData = await collection.find({scheduled_date: updateBody.scheduled_date},{projection:["classes"]}).toArray();
    console.log('vaccinationData '+ JSON.stringify(vaccinationData))
    const conflict = checkForSchedulingConflicts(vaccinationData,updateBody)
    if(conflict){
        return {
            statusCode: status_codes.BAD_REQUEST,
            success: false,
            error: "Drive already exists for classes: " + conflict.join(", "),
        };
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
            data: `Vaccination drive ${id} updated successfully`,
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
            error: `No Vaccination Drive exists for ${id}`,
        };
    }
    return message
}
async function getVaccinationDriveByName(name) {
    const db = await mongoDBClient.client;
    const collection = db.collection("vaccination_drives");
    let vaccinationDrive = await collection.find  ({ name: name }).toArray();
    let message = {}; 
    vaccinationDrive = addActiveStatus(vaccinationDrive);
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
            error: `No Vaccination drive exist for ${name}`,
        };
    }
    return message
}

async function getVaccinationDriveByClass(className) {
    const db = await mongoDBClient.client;
    const collection = db.collection("vaccination_drives");
    console.log('className: '+ className)
    let vaccinationDrive = await collection.find({ classes: className }).toArray();
    vaccinationDrive = addActiveStatus(vaccinationDrive);
    console.log('vaccinationDrive: '+ JSON.stringify(vaccinationDrive))
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
            error: `No Vaccination drives found for grade ${className}`
        };
    }
    return message
}

module.exports = {
    getAllVaccinationDrives,
    insertVaccinationDrive,
    updateVaccinationDrive,
    getVaccinationDriveByName,
    getVaccinationDriveByClass,
    getVaccinationDriveWithLimit
}