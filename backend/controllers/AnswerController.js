const mongoose = require("mongoose");
const Form = require("../models/Form");
const Answer = require("../models/Answer");
const answerDuplicate = require("../libraries/answerDuplicate");
const questionRequiredButEmpty = require("../libraries/questionRequiredButEmpty");
const optionValueNotExist = require("../libraries/optionValueNotExist");
const questionIdNotValid = require("../libraries/questionIdNotValid");
const emailNotValid = require("../libraries/emailNotValid");

class AnswerController {
    async store(req, res) {
        try {
            if (!req.params.formId) {
                throw { code: 428, message: "REQUIRED_FORM_ID" };
            }
            if (!mongoose.Types.ObjectId.isValid(req.params.formId)) {
                throw { code: 400, message: "INVALID_FORM_ID" };
            }

            const form = await Form.findById(req.params.formId);

            const isDuplicate = await answerDuplicate(req.body.answers);
            if (isDuplicate) {
                throw { code: 404, message: "DUPLICATE_ANSWER" };
            }

            const isQuestionRequiredButEmpty = await questionRequiredButEmpty(form, req.body.answers);
            if (isQuestionRequiredButEmpty) {
                throw { code: 404, message: "QUESTION_REQUIRED_BUT_EMPTY" };
            }

            const isOptionValueNotExist = await optionValueNotExist(form, req.body.answers);
            if (isOptionValueNotExist.length > 0) {
                throw { code: 404, message: "INVALID_VALUE_QUESTION", question: isOptionValueNotExist };
            }

            const isQuestionIdNotValid = await questionIdNotValid(form, req.body.answers);
            if (isQuestionIdNotValid.length > 0) {
                throw { code: 404, message: "INVALID_QUESTION_ID", question: { questionId: isQuestionIdNotValid } };
            }

            const isEmailNotValid = await emailNotValid(form, req.body.answers);
            if (isEmailNotValid.length > 0) {
                throw { code: 404, message: "INVALID_QUESTION_EMAIL", question: isEmailNotValid };
            }

            let fields = {};
            req.body.answers.forEach((answer) => {
                fields[answer.questionId] = answer.value;
            });

            const answer = await Answer.create({
                formId: req.params.formId,
                userId: req.jwt.id,
                ...fields,
            });
            if (!answer) {
                throw { code: 500, message: "ADD_ANSWER_FAILED" };
            }

            return res.status(200).json({
                status: true,
                message: "ADD_ANSWER_SUCCESS",
                answer,
            });
        } catch (error) {
            const response = {
                status: false,
                message: error.message,
            };

            if (error.question) {
                response.question = error.question;
            }
            return res.status(400).json({ response });
        }
    }
}

module.exports = new AnswerController();
