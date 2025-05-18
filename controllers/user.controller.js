const { validationResult } = require("express-validator");
const {registerUserService,loginUserService,updateUserService,deleteUserService} = require("../services/user.service");

const registerUser = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    try {
        const result = await registerUserService(req.body);
        return res.status(result.status).json({ success: result.success, message: result.message });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

const loginUser = async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    try {
        const result = await loginUserService(req.body);
        return res.status(result.status).json(result);
    } catch (err) {
        return res.status(err.status || 500).json({ success: false, message: err.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const result = await updateUserService(req.params.id, req.body);
        return res.status(result.status).json({ success: result.success, message: result.message });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const result = await deleteUserService(req.params.id);
        return res.status(result.status).json({ success: result.success, message: result.message });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    updateUser,
    deleteUser
};