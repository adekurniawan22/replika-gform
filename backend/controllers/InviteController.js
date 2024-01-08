const mongoose = require("mongoose");
const Form = require("../models/Form");
const User = require("../models/User");

class InviteController {
    async index(req, res) {
        try {
            if (!req.params.id) {
                throw { code: 400, message: "REQUIRED_FORM_ID" };
            }
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                throw { code: 400, message: "INVALID_ID" };
            }

            const form = await Form.findOne({ _id: req.params.id, userId: req.jwt.id }).select("invites");
            if (!form) {
                throw { code: 400, message: "INVITES_NOT_FOUND" };
            }

            return res.status(200).json({
                status: true,
                message: "EMAIL_INVITES_FOUND",
                invites: form.invites,
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message,
            });
        }
    }
    async store(req, res) {
        try {
            if (!req.params.id) {
                throw { code: 400, message: "REQUIRED_FORM_ID" };
            }
            if (!req.body.email) {
                throw { code: 400, message: "REQUIRED_EMAIL" };
            }
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                throw { code: 400, message: "INVALID_ID" };
            }

            const emailUser = await User.findOne({ _id: req.jwt.id, email: req.body.email });
            if (emailUser) {
                throw { code: 400, message: "CANT_INVITE_YOURSELF" };
            }

            const emailInvited = await Form.findOne({ _id: req.params.id, userId: req.jwt.id, invites: { $in: req.body.email } });
            if (emailInvited) {
                throw { code: 400, message: "EMAIL_ALREADY_INVITED" };
            }

            const regex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
            if (!regex.test(req.body.email)) {
                throw { code: 400, message: "INVALID_EMAIL" };
            }

            const form = await Form.findOneAndUpdate(
                { _id: req.params.id, userId: req.jwt.id },
                { $push: { invites: req.body.email } },
                { new: true }
            );
            if (!form) {
                throw { code: 400, message: "INVITED_FAILED" };
            }

            return res.status(200).json({
                status: true,
                message: "INVITED_SUCCESS",
                email: req.body.email,
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message,
            });
        }
    }

    async destroy(req, res) {
        try {
            if (!req.params.id) {
                throw { code: 400, message: "REQUIRED_FORM_ID" };
            }
            if (!req.body.email) {
                throw { code: 400, message: "REQUIRED_EMAIL" };
            }
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                throw { code: 400, message: "INVALID_ID" };
            }

            const emailInvited = await Form.findOne({ _id: req.params.id, userId: req.jwt.id, invites: { $in: req.body.email } });
            if (!emailInvited) {
                throw { code: 400, message: "EMAIL_NOT_FOUND" };
            }

            const form = await Form.findOneAndUpdate(
                { _id: req.params.id, userId: req.jwt.id },
                { $pull: { invites: req.body.email } },
                { new: true }
            );
            if (!form) {
                throw { code: 400, message: "REMOVE_INVITED_FAILED" };
            }

            return res.status(200).json({
                status: true,
                message: "REMOVE_INVITED_SUCCESS",
                email: req.body.email,
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message,
            });
        }
    }
}

module.exports = new InviteController();
