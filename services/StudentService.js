const mongoDBClient = require('../services/MongoDBService.js')
const {checkForDuplicateVaccinations} = require('../helpers/checkForDuplicateVaccinations');
const {generateRollNumber} = require('../helpers/generateRollNumber');
const status_codes = require('../helpers/statusCode');

async function getAllStudents(req) {
    const db = await mongoDBClient.client;
    const collection = db.collection("students");
    const offset = req.offset;
    const limit = req.limit;
    const sort  = {_id: 1}
    const students = await collection.find().sort(sort).limit(limit).skip(offset).toArray();
    let message = {};
    if (students.length > 0) {
        console.log("Students retrieved successfully");
        message = {
            statusCode: status_codes.OK,
            success: true,
            data: students,
        };
    } else {
        console.log("No students found");
        message = {
            statusCode: status_codes.NOT_FOUND,
            success: false,
            error: "data not found",
        };
    }
    return message
}


async function insertStudent(req, body) {
    const db = await mongoDBClient.client;
    const collection = db.collection("students");

    const student = {
        _id: generateRollNumber(body.class),
        name: body.name,
        age: body.age,
        class: body.class,
        gender:body.gender,
        dateOfBirth: body.dateOfBirth,
        created_on: new Date(),
        updated_on: new Date()
    };
    const result = await collection.insertOne(student);
    let message = {};
    if (result.acknowledged) {
        console.log("Student inserted successfully");
         message = {
            statusCode: status_codes.CREATED,
            message: "Student inserted successfully",
            studentId: result.insertedId,
        };
        
    } else {
        console.log("Failed to insert student");
         message = {
            statusCode: status_codes.INTERNAL_SERVER_ERROR,
            success: false,
            error: "Failed to insert student",
        };
    }
    return message
}
async function getStudentById(req, id) {
    const db = await mongoDBClient.client;
    const collection = db.collection("students");
    const student = await collection.findOne({ _id: id });
    let message = {};
    if (student) {
        console.log("Student retrieved successfully");
        message = {
            statusCode: status_codes.OK,
            success: true,
            data: student,
        };
    } else {
        console.log("Student not found");
        message = {
            statusCode: status_codes.NOT_FOUND,
            success: false,
            error: "Student not found",
        };
    }
    return message
}
async function getStudentsByClass(req, className) {
    const offset = req.offset;
    const limit = req.limit;
    const sort  = {_id: 1}

    const db = await mongoDBClient.client;
    const collection = db.collection("students");
    const students = await collection.find({ class: className }).sort(sort).skip(offset).limit(limit).toArray();
    let message = {};
    if (students.length > 0) {
        console.log("Students retrieved successfully");
        message = {
            statusCode: status_codes.OK,
            success: true,
            data: students,
        };
    } else {
        console.log("No students found");
        message = {
            statusCode: status_codes.NOT_FOUND,
            success: false,
            error: "data not found",
        };
    }
    return message
}
async function getStudentsByName(req, name) {
    const offset = req.offset
    const limit  = req.limit
    const sort   = {_id:1}
    const db = await mongoDBClient.client;
    const collection = db.collection("students");
    const students = await collection.find({ name: { $regex: name, $options: "i" } }).sort(sort).limit(limit).skip(offset).toArray();
    let message = {};
    if (students.length > 0) {
        console.log("Students retrieved successfully");
        message = {
            statusCode: status_codes.OK,
            success: true,
            data: students,
        };
    } else {
        console.log("No students found");
        message = {
            statusCode: status_codes.NOT_FOUND,
            success: false,
            error: "data not found",
        };
    }
    return message
}
async function updateStudentVaccinationStatus(body,id) {
    const db = await mongoDBClient.client;
    const collection = db.collection("students");
    const student = await collection.findOne({ _id: id });
    let message = {};
    const updateBody = {
        vaccinations: {
            vaccineName: body.vaccineName,
            vaccinatedOn: body.vaccinatedOn
        }
    }

    if (student) {
        console.log("Student retrieved successfully");
        const duplicateVaccination = checkForDuplicateVaccinations(student, updateBody);
        if (duplicateVaccination) {
            console.log("Duplicate vaccination found");
            message = {
                statusCode: status_codes.BAD_REQUEST,
                success: false,
                error: "Duplicate vaccination found",
            };
            return message
        }
        const result = await collection.updateOne(
            { _id: id },
            { $push: updateBody,
            $set: { updated_on: new Date() } }
        );
        if (result.modifiedCount > 0) {
            message = {
                statusCode: status_codes.OK,
                success: true,
                data: updateBody,
            };
        } else {
            message = {
                statusCode:status_codes.INTERNAL_SERVER_ERROR,
                success: false,
                error: "Failed to update vaccination status",
            };
        }
    } else {
        console.log("Student not found");
        message = {
            statusCode:status_codes.NOT_FOUND,
            success: false,
            error: "Student not found",
        };
    }
    return message
}
async function bulkInsertStudents(dataToInsert) {
    const db = await mongoDBClient.client;
    const collection = db.collection("students");
    const result = await collection.insertMany(dataToInsert);
    if(result.acknowledged){
        console.log("Students inserted successfully");
        const idArray = Object.values(result.insertedIds)
        return {
            statusCode: status_codes.OK,
            success: true,
            data: idArray
        };
    }
    else{
        console.log("Failed to insert students");
        return {
            statusCode:status_codes.INTERNAL_SERVER_ERROR,
            success: false,
            error: "Failed to insert students",
        };
    }



    
}
async function getStudentsByVaccinationStatus(req,vaccinationStatus) {
    const offset = req.offset
    const limit = req.limit
    const sort = {_id:1}
    const db = await mongoDBClient.client;
    const collection = db.collection("students");
    vaccinationStatus = vaccinationStatus === "true" ? true : false;
    const students = await collection.find({ "vaccinations": {$exists: vaccinationStatus} }).sort(sort).limit(limit).skip(offset).toArray();
    let message = {};
    if (students.length > 0) {
        console.log("Students retrieved successfully");
        message = {
            statusCode: status_codes.OK,
            success: true,
            data: students,
        };
    } else {
        console.log("No students found");
        message = {
            statusCode: status_codes.NOT_FOUND,
            success: false,
            error: "data not found",
        };
    }
    return message
}
async function getStudentsByVaccineName(req,vaccineName) {
    const limit = req.limit
    const offset = req.offset
    const sort = {_id:1}
    const db = await mongoDBClient.client;
    const collection = db.collection("students");
    const students = await collection.find({ vaccinations: { $elemMatch: {vaccineName:vaccineName} }} ,{projection:{name:1,gender:1,"vaccinations.$":1}}).sort(sort).skip(offset).limit(limit).toArray();
    let message = {};
    if (students.length > 0) {
        console.log("Students retrieved successfully");
        message = {
            statusCode: status_codes.OK,
            success: true,
            data: students,
        };
    } else {
        console.log("No students found");
        message = {
            statusCode: status_codes.NOT_FOUND,
            success: false,
            error: "data not found",
        };
    }
    return message
}

module.exports = {
    insertStudent,
    getAllStudents,
    getStudentById,
    getStudentsByClass,
    getStudentsByName,
    updateStudentVaccinationStatus,
    bulkInsertStudents,
    getStudentsByVaccinationStatus,
    getStudentsByVaccineName
};