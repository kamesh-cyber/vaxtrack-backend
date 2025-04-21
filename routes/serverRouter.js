const express = require("express");
const router = express.Router();

const {login} = require("../controller/LoginController");
const {insertStudent} = require("../controller/StudentController");
const {getAllStudents} = require("../controller/StudentController");
const {getStudentById} = require("../controller/StudentController");

router.get('/login', login)

router.post('/students',insertStudent)

router.get('/students',getAllStudents)
router.get('/students/:id',getStudentById)
router.put('/students/:id',getStudentById)

module.exports = router