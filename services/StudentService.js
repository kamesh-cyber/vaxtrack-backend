const mongoDBClient = require('../services/MongoDBService.js')
const {checkForDuplicateVaccinations} = require('../helpers/checkForDuplicateVaccinations')

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

function generateRollNumber(grade) {
    const prefix = grade< 10 ? "0" + grade : grade;
    console.log("Prefix: ", prefix);
    const rollNumber = Math.floor(1000 + Math.random() * 9000);
    return prefix +""+ rollNumber;

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
            driveId: body.driveId,
            vaccineName: body.vaccineName
        }
    }

    if (student) {
        console.log("Student retrieved successfully");
        const duplicateVaccination = checkForDuplicateVaccinations(student, updateBody);
        if (duplicateVaccination) {
            console.log(duplicateVaccination);
            console.log("Duplicate vaccination found");
            message = {
                success: false,
                error: "Duplicate vaccination found",
            };
            return message
        }
        const result = await collection.updateOne(
            { _id: id },
            { $push: updateBody}
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
module.exports = {
    insertStudent,
    getAllStudents,
    getStudentById,
    getStudentsByClass,
    getStudentsByName,
    updateStudentVaccinationStatus
};