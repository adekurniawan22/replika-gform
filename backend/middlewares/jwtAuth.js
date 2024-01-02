require('dotenv').config()
const jwt = require('jsonwebtoken');

const jwtAuth = async (req, res, next) => {
    try {
        if (!req.headers.authorization) { throw { code: 401, message: 'UNAUTHORIZED' } }

        const token = req.headers.authorization.split(' ')[1]
        const verify = jwt.verify(token, process.env.JWT_ACCESS_TOKEN)
        req.jwt = verify
        next()
    } catch (error) {
        const errorJWT = ['invalid signature', 'jwt malformed', 'jwt must be provided', 'invalid token']
        if (error.message == 'jwt_expired') {
            error.message = 'REFRESH_TOKEN_EXPIRED'
        } else if (errorJWT.includes(error.message)) {
            error.message = 'INVALID_REFRESH_TOKEN'
        }
        return res.status(error.code || 500).json({
            message: error.message
        })
    }
}

module.exports = jwtAuth