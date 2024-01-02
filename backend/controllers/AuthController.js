require('dotenv').config()
const User = require('../models/User');
const emailExist = require('../libraries/emailExist');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateAccesToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, { expiresIn: process.env.JWT_ACCESS_TOKEN_EXP })
}

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, { expiresIn: process.env.JWT_REFRESH_TOKEN_EXP })
}

class AuthController {
    async register(req, res) {
        try {
            if (!req.body.fullname) { throw { code: 400, message: 'FULLNAME_IS_REQUIRED' } }
            if (!req.body.email) { throw { code: 400, message: 'EMAIL_IS_REQUIRED' } }
            if (!req.body.password) { throw { code: 400, message: 'PASSWORD_IS_REQUIRED' } }
            if (req.body.password.length < 6) { throw { code: 400, message: 'PASSWORD_MINIMUM_6_CHARACTER' } }

            const checkEmail = await emailExist(req.body.email);
            if (checkEmail) { throw { code: 400, message: 'EMAIL_ALREADY_EXIST' } }

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hashSync(req.body.password, salt);

            const user = await User.create({
                fullname: req.body.fullname,
                email: req.body.email,
                password: hash,
            })
            return res.status(201).json({
                status: true,
                message: 'USER_REGISTER_SUCCESS',
                user
            })
        } catch (error) {
            return res.status(error.code || 500).json({
                message: error.message
            })
        }
    }

    async login(req, res) {
        const { email, password } = req.body
        try {
            if (!email) { throw { code: 400, message: 'EMAIL_IS_REQUIRED' } }
            if (!password) { throw { code: 400, message: 'PASSWORD_IS_REQUIRED' } }

            const user = await User.findOne({ email: email });
            if (!user) { throw { code: 404, message: 'USER_NOT_FOUND' } }

            const isPasswordValid = await bcrypt.compareSync(password, user.password)
            if (!isPasswordValid) { throw { code: 400, message: 'INVALID_PASSWORD' } }

            const accessToken = await generateAccesToken({ id: user._id })
            const refreshToken = await generateRefreshToken({ id: user._id })

            return res.status(200).json({
                status: true,
                message: 'USER_LOGIN_SUCCESS',
                fullname: user.fullname,
                accessToken: accessToken,
                refreshToken: refreshToken,
            })
        } catch (error) {
            return res.status(error.code || 500).json({
                message: error.message
            })
        }
    }
}

module.exports = new AuthController();