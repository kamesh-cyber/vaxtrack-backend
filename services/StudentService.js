const mongoDBClient = require('../services/MongoDBService.js')
const {checkForDuplicateVaccinations} = require('../helpers/checkForDuplicateVaccinations');
const {generateRollNumber} = require('../helpers/generateRollNumber');

async function getAllStudents(req) {
    const db = await mongoDBClient.client;
    const collection = db.collection("students");
    const students = await collection.find({}).toArray();
    let message = {};
    if (students.length > 0) {
        console.log("Students retrieved successfully");
        message = {
            success: true,
            data: students,
        };
    } else {
        console.log("No students found");
        message = {
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
            message: "Student inserted successfully",
            studentId: result.insertedId,
        };
        
    } else {
        console.log("Failed to insert student");
         message = {
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
            success: true,
            data: student,
        };
    } else {
        console.log("Student not found");
        message = {
            success: false,
            error: "Student not found",
        };
    }
    return message
}
async function getStudentsByClass(req, className) {
    const db = await mongoDBClient.client;
    const collection = db.collection("students");
    const students = await collection.find({ class: className }).toArray();
    let message = {};
    if (students.length > 0) {
        console.log("Students retrieved successfully");
        message = {
            success: true,
            data: students,
        };
    } else {
        console.log("No students found");
        message = {
            success: false,
            error: "data not found",
        };
    }
    return message
}
async function getStudentsByName(req, name) {
    const db = await mongoDBClient.client;
    const collection = db.collection("students");
    const students = await collection.find({ name: { $regex: name, $options: "i" } }).toArray();
    let message = {};
    if (students.length > 0) {
        console.log("Students retrieved successfully");
        message = {
            success: true,
            data: students,
        };
    } else {
        console.log("No students found");
        message = {
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
                success: true,
                data: updateBody,
            };
        } else {
            message = {
                success: false,
                error: "Failed to update vaccination status",
            };
        }
    } else {
        console.log("Student not found");
        message = {
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
        return {
            success: true,
            data: result.insertedIds,
        };
    }
    else{
        console.log("Failed to insert students");
        return {
            success: false,
            error: "Failed to insert students",
        };
    }



    
}
async function getStudentsByVaccinationStatus(vaccinationStatus) {
    const db = await mongoDBClient.client;
    const collection = db.collection("students");
    vaccinationStatus = vaccinationStatus === "true" ? true : false;
    const students = await collection.find({ "vaccinations": {$exists: vaccinationStatus} }).toArray();
    let message = {};
    if (students.length > 0) {
        console.log("Students retrieved successfully");
        message = {
            success: true,
            data: students,
        };
    } else {
        console.log("No students found");
        message = {
            success: false,
            error: "data not found",
        };
    }
    return message
}
async function getStudentsByVaccineName(vaccineName) {
    const db = await mongoDBClient.client;
    const collection = db.collection("students");
    const students = await collection.find({ vaccinations: { $elemMatch: {vaccineName:vaccineName} }} ,{projection:{name:1,gender:1,"vaccinations.$":1}}).toArray();
    let message = {};
    if (students.length > 0) {
        console.log("Students retrieved successfully");
        message = {
            success: true,
            data: students,
        };
    } else {
        console.log("No students found");
        message = {
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