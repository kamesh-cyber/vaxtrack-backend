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

router.get('/login', login)

router.post('/students',insertStudent)

router.get('/students',getAllStudents)
router.get('/students/:id',getStudentById)
router.put('/students/:id',getStudentById)
router.patch('/students/:id/vaccinate',updateStudent)
router.post('/students/bulk',upload.single('file') ,bulkInsertStudents)

module.exports = router