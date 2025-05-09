const {getStudentById, insertStudent, getStudentsByClass, getStudentsByName, 
        updateStudentVaccinationStatus,bulkInsertStudents,getStudentsByVaccinationStatus,
        getStudentsByVaccineName,getReportsByFilters,
        getStudentsWithLimit} = require('../services/StudentService');

const {validateAndConvertCSVFile}  = require('../helpers/validateAndConvertCSVFile')
const {buildQueryFromFilters} = require("../helpers/buildQueryFromFilters");

const insert = async (req, res) => {
    try {
        console.log('Inserting student:');
        const response = await insertStudent(req, req.body);
        res.status(response.statusCode).send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}
const getAll = async (req, res) => {
    try {
        const offset = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || 0;
        req.offset = offset
        req.limit = limit;
        console.log('Getting all students:', req.query);
        if(req.query.class){
            console.log('Getting students by class:',req.query)
            grade = parseInt(req.query.class)
            const response = await getStudentsByClass(req, grade);
            res.status(response.statusCode).send(response);
            return
        }
        if(req.query.name){
            console.log('Getting students by name:',req.query)
            const response = await getStudentsByName(req, req.query.name);
            res.status(response.statusCode).send(response);
            return
        }
        if(req.query.vaccinationStatus){
            console.log('Getting students by vaccination status:',req.query)
            const response = await getStudentsByVaccinationStatus(req,req.query.vaccinationStatus);
            res.status(response.statusCode).send(response);
            return
        }
        if(req.query.vaccineName){
            console.log('Getting students by vaccine name:',req.query)
            const response = await getStudentsByVaccineName(req,req.query.vaccineName);
            res.status(response.statusCode).send(response);
            return
        }
        if(req.query.id) {
            console.log('Getting student by ID:',req.query.id);
            const response = await getStudentById(req, req.query.id);
            res.status(response.statusCode).send(response);
            return
        }
        console.log('Getting all students:' ,req.limit);
        const response = await getStudentsWithLimit(req);
        res.status(response.statusCode).send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

async function update(req, res) {
    try {
        console.log('Updating student by ID:',req.params.id);
        const response = await updateStudentVaccinationStatus(req.body, req.params.id);
        res.status(response.statusCode).send(response);
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
        res.status(response.statusCode).send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

const getReports = async (req, res) => {
    try {

        const offset = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || 0;
        req.offset = offset
        req.limit = limit;

        console.log('Getting reports:', req.query);
        const filters = {
            class: req.query.class,
            vaccinationStatus: req.query.vaccinationStatus,
            vaccineName: req.query.vaccineName,
        };


        const query = buildQueryFromFilters(filters);
        console.log('Query:', query);

        const response = await getReportsByFilters(req, query);
        res.status(response.statusCode).send(response);

    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    insertStudent: insert,
    getAllStudents: getAll,
    updateStudent: update,
    bulkInsertStudents: bulkInsert,
    getReportsByStudent: getReports
    
}