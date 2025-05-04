const express = require("express");
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); // Files will be stored in the 'uploads' folder


const {login} = require("../controller/LoginController");
const {insertStudent} = require("../controller/StudentController");
const {getAllStudents} = require("../controller/StudentController");
const {getStudentById} = require("../controller/StudentController");
const {updateStudent} = require("../controller/StudentController");
const {bulkInsertStudents} = require("../controller/StudentController");

const {getAllVaccinationDrives} = require("../controller/VaccinationController");
const {insertVaccinationDrive} = require("../controller/VaccinationController");
const {updateVaccinationDrive} = require("../controller/VaccinationController");

const {getDashboardOverview} = require("../controller/DashboardController.js");


const {
    validateLogin,
    validateInsertStudent,
    validateStudentId,
    validateUpdateVaccinationStatus,
    validateBulkInsertFile,
    validateVaccinationDrive,
    validateGetAllStudents
  } = require("../middleware/validators");

router.get('/login',validateLogin,login)


router.post('/students',validateInsertStudent,insertStudent)

router.get('/students',validateGetAllStudents,getAllStudents)
router.get('/students/:id',validateStudentId,getStudentById)

router.patch('/students/:id/vaccinate',validateUpdateVaccinationStatus,updateStudent)
router.post('/students/bulk',upload.single('file'),validateBulkInsertFile,bulkInsertStudents)


router.get('/vaccinations',getAllVaccinationDrives)
router.post('/vaccinations',validateVaccinationDrive,insertVaccinationDrive)
router.patch('/vaccinations/:id',updateVaccinationDrive)

router.get('/dashboard/overview',getDashboardOverview)


module.exports = router