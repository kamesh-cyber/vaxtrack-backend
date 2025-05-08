
const { getAllVaccinationDrives,insertVaccinationDrive ,updateVaccinationDrive,getVaccinationDriveByName,getVaccinationDriveByClass, getVaccinationDriveWithLimit} = require('../services/VaccinationDriveService');
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
        const limit = parseInt(req.query.limit) || 0;
        const offset = parseInt(req.query.offset) || 0;
        req.limit = limit;
        req.offset = offset;
        if(req.query.name){
            console.log('Getting vaccination drive by name:',req.query.name)
            const response = await getVaccinationDriveByName(req.query.name);
            res.status(response.statusCode).send(response);
            return
        }
        if (req.query.class){
            console.log('Getting vaccination drive by class:',req.query.class)
            const response = await getVaccinationDriveByClass(req.query.class);
            res.status(response.statusCode).send(response);
            return
        }
        console.log('Getting all vaccination drives:');
        const response = limit==0?await getAllVaccinationDrives(req):await getVaccinationDriveWithLimit(req);
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