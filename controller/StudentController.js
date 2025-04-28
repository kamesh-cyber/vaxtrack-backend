const { parse } = require('dotenv');
const { get } = require('../routes/serverRouter');
const { getAllStudents, getStudentById, insertStudent, getStudentsByClass
    , getStudentsByName, updateStudentVaccinationStatus,bulkInsertStudents,getStudentsByVaccinationStatus,getStudentsByVaccineName} = require('../services/StudentService');
const {validateAndConvertCSVFile}  = require('../helpers/validateAndConvertCSVFile')
const insert = async (req, res) => {
    try {
        console.log('Inserting student:');
        const response = await insertStudent(req, req.body);
        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}
const getAll = async (req, res) => {
    try {
        if(req.query.class){
            console.log('Getting students by class:',req.query)
            grade = parseInt(req.query.class)
            const response = await getStudentsByClass(req, grade);
            res.status(200).send(response);
            return
        }
        if(req.query.name){
            console.log('Getting students by name:',req.query)
            const response = await getStudentsByName(req, req.query.name);
            res.status(200).send(response);
            return
        }
        if(req.query.vaccinationStatus){
            console.log('Getting students by vaccination status:',req.query)
            const response = await getStudentsByVaccinationStatus(req.query.vaccinationStatus);
            res.status(200).send(response);
            return
        }
        if(req.query.vaccineName){
            console.log('Getting students by vaccine name:',req.query)
            const response = await getStudentsByVaccineName(req.query.vaccineName);
            res.status(200).send(response);
            return
        }
        console.log('Getting all students:');
        const response = await getAllStudents(req);
        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

const getById = async (req, res) => {
    try {
        console.log('Getting student by ID:',req.params.id);
        const response = await getStudentById(req, req.params.id);
        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

async function update(req, res) {
    try {
        console.log('Updating student by ID:',req.params.id);
        const response = await updateStudentVaccinationStatus(req.body, req.params.id);
        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

async function bulkInsert(req, res) {
    try {
        console.log('Bulk inserting students:',req.file);
        const convertedData = await validateAndConvertCSVFile(req.file)
        console.log('Converted data:', convertedData); 
        const response = await bulkInsertStudents(convertedData);
        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}
module.exports = {
    insertStudent: insert,
    getAllStudents: getAll,
    getStudentById: getById,
    updateStudent: update,
    bulkInsertStudents: bulkInsert
    
}