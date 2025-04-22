
const { getAllVaccinationDrives,insertVaccinationDrive ,updateVaccinationDrive} = require('../services/VaccinationDriveService');
const insert = async (req, res) => {
    try {
        console.log('Inserting vaccination drive:');
        const response = await insertVaccinationDrive(req, req.body);
        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}
const getAll = async (req, res) => {
    try {
        console.log('Getting all vaccination drives:');
        const response = await getAllVaccinationDrives(req);
        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}
const update = async (req, res) => {
    try {
        console.log('Updating vaccination drive:');
        const id = req.params.id
        const response = await updateVaccinationDrive(id, req.body);
        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    insertVaccinationDrive : insert,
    getAllVaccinationDrives : getAll,
    updateVaccinationDrive : update
}