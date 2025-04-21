
const auth = require("../middleware/auth");
const login = async (req, res) => {
    const code = req.query.code
    return auth.verifyLogin(req, res);
}


module.exports = {
    login
}