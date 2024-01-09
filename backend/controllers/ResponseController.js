const mongoose = require("mongoose");
const Form = require("../models/Form");
const Answer = require("../models/Answer");

class ResponseController {
    async lists(req, res) {
        try {
            if (!req.params.formId) {
                throw { code: 428, message: "REQUIRED_FORM_ID" };
            }
            if (!mongoose.Types.ObjectId.isValid(req.params.formId)) {
                throw { code: 400, message: "INVALID_FORM_ID" };
            }

            const form = await Form.findOne({ _id: req.params.formId, userId: req.jwt.id }).populate("answers");
            if (!form) {
                throw { code: 400, message: "FORM_NOT_FOUND" };
            }

            return res.status(200).json({
                status: true,
                message: "SUCCESS_GET_ANSWER",
                form,
                total_answers: form.answers.length,
                answers: form.answers,
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message,
            });
        }
    }

    async summaries(req, res) {
        try {
            if (!req.params.formId) {
                throw { code: 428, message: "REQUIRED_FORM_ID" };
            }
            if (!mongoose.Types.ObjectId.isValid(req.params.formId)) {
                throw { code: 400, message: "INVALID_FORM_ID" };
            }

            const form = await Form.findOne({ _id: req.params.formId, userId: req.jwt.id }).populate("answers");
            if (!form) {
                throw { code: 400, message: "FORM_NOT_FOUND" };
            }

            const summaries = form.questions.map((question) => {
                const summary = {
                    type: question.type,
                    question: question.question,
                    required: question.required,
                    answers: form.answers.map((answer) => answer[question.id]),
                };
                return summary;
            });

            return res.status(200).json({
                status: true,
                message: "SUCCESS_GET_ANSWER",
                summaries,
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message,
            });
        }
    }
}

module.exports = new ResponseController();
