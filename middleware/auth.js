
const mongoDBClient = require('../services/MongoDBService.js')
const verifyLogin = async (req, res) => {
    const token = req.query.code
    const user = req.query.user
    if(!token) {
        return res.status(401).send("code not found")
    }
    if(!user) {
        return res.status(401).send("user not found")
    }
    const db = await mongoDBClient.client;
    const collection = db.collection("users");
    const result = await collection.findOne({username:user,token:token});
    console.log(result)
    if(!result) {
        return res.status(401).send("Unauthorized Login");
    }
    return res.status(200).send("Login Successful");
    }

module.exports = {
    verifyLogin
}