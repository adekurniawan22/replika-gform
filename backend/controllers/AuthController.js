require("dotenv").config();
const User = require("../models/User");
const emailExist = require("../libraries/emailExist");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const isEmailValid = require("../libraries/isEmailValid");

const generateAccesToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXP,
    });
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXP,
    });
};

class AuthController {
    async register(req, res) {
        try {
            if (!req.body.fullname) {
                throw { code: 400, message: "FULLNAME_IS_REQUIRED" };
            }
            if (!req.body.email) {
                throw { code: 400, message: "EMAIL_IS_REQUIRED" };
            }
            if (!req.body.password) {
                throw { code: 400, message: "PASSWORD_IS_REQUIRED" };
            }
            if (req.body.password.length < 6) {
                throw { code: 400, message: "PASSWORD_MINIMUM_6_CHARACTER" };
            }

            if (!isEmailValid(req.body.email)) {
                throw { code: 400, message: "INVALID_EMAIL" };
            }

            const checkEmail = await emailExist(req.body.email);
            if (checkEmail) {
                throw { code: 400, message: "EMAIL_ALREADY_EXIST" };
            }

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hashSync(req.body.password, salt);

            const user = await User.create({
                fullname: req.body.fullname,
                email: req.body.email,
                password: hash,
            });

            let payload = { id: user._id };
            const accessToken = await generateAccesToken(payload);
            const refreshToken = await generateRefreshToken(payload);

            return res.status(201).json({
                status: true,
                message: "USER_REGISTER_SUCCESS",
                fullname: user.fullname,
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        } catch (error) {
            return res.status(error.code || 500).json({
                message: error.message,
            });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            if (!email) {
                throw { code: 400, message: "EMAIL_IS_REQUIRED" };
            }
            if (!password) {
                throw { code: 400, message: "PASSWORD_IS_REQUIRED" };
            }
            if (!isEmailValid(req.body.email)) {
                throw { code: 400, message: "INVALID_EMAIL" };
            }

            const user = await User.findOne({ email: email });
            if (!user) {
                throw { code: 404, message: "USER_NOT_FOUND" };
            }

            const isPasswordValid = await bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                throw { code: 400, message: "INVALID_PASSWORD" };
            }

            let payload = { id: user._id };
            const accessToken = await generateAccesToken(payload);
            const refreshToken = await generateRefreshToken(payload);

            return res.status(200).json({
                status: true,
                message: "USER_LOGIN_SUCCESS",
                fullname: user.fullname,
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        } catch (error) {
            return res.status(error.code || 500).json({
                message: error.message,
            });
        }
    }

    async refresh_Token(req, res) {
        try {
            if (!req.body.refreshToken) {
                throw { code: 400, message: "REFRESH_TOKEN_REQUIRED" };
            }

            const verifyResfrehToken = jwt.verify(req.body.refreshToken, process.env.JWT_REFRESH_TOKEN);
            let payload = { id: verifyResfrehToken.id };
            const accessToken = await generateAccesToken(payload);
            const refreshToken = await generateRefreshToken(payload);

            return res.status(200).json({
                status: true,
                message: "REFRESH_TOKEN_SUCCESS",
                accessToken,
                refreshToken,
            });
        } catch (error) {
            const errorJWT = ["invalid signature", "jwt malformed", "jwt must be provided", "invalid token"];
            if (error.message == "jwt_expired") {
                error.message = "REFRESH_TOKEN_EXPIRED";
            } else if (errorJWT.includes(error.message)) {
                error.message = "INVALID_REFRESH_TOKEN";
            }
            return res.status(error.code || 500).json({
                message: error.message,
            });
        }
    }
}

module.exports = new AuthController();
