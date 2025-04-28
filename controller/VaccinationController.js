
const { getAllVaccinationDrives,insertVaccinationDrive ,updateVaccinationDrive,getVaccinationDriveByName} = require('../services/VaccinationDriveService');
const insert = async (req, res) => {
    try {
        console.log('Inserting vaccination drive:');
        const response = await insertVaccinationDrive(req, req.body);
        res.status(response.statusCode).send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}
const getAll = async (req, res) => {
    try {
        if(req.query.name){
            console.log('Getting vaccination drive by name:',req.query.name)
            const response = await getVaccinationDriveByName(req.query.name);
            res.status(response.statusCode).send(response);
            return
        }
        console.log('Getting all vaccination drives:');
        const response = await getAllVaccinationDrives(req);
        res.status(response.statusCode).send(response);
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
        res.status(response.statusCode).send(response);
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