const Form = require('../models/Form');
const mongoose = require('mongoose');

class OptionController{
    async store(req,res){
        try {
            if (!req.params.id) {throw { code: 400, message: 'REQUIRED_FORM_ID' };}
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {throw { code: 400, message: 'INVALID_FORM_ID' };}
            if (!req.params.questionId) {throw { code: 400, message: 'REQUIRED_QUESTION_ID' };}
            if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {throw { code: 400, message: 'INVALID_QUESTION_ID' };}
            if(!req.body.option){throw { code: 400, message: 'REQUIRED_OPTION' };}

            const option = {
                id: new mongoose.Types.ObjectId(),
                value: req.body.option
            }

            const form = await Form.findOneAndUpdate({_id: req.params.id, userId: req.jwt.id},
                                                    {$push: {"questions.$[indexQuestion].options": option}},
                                                    {
                                                        arrayFilters: [{ 'indexQuestion.id': new mongoose.Types.ObjectId(req.params.questionId) }],
                                                        new: true
                                                    });
            if(!form){throw{code:400, message:'ADD_OPTION_FAILED'}}

            return res.status(201).json({
                status: true,
                message: 'ADD_OPTION_SUCCESS',
                option
            })

        }catch(error){
            return res.status(400).json({
                status: false,
                message: error.message
            })
        }
    }

    async update(req, res){
        console.log(req.params.optionId);
        try {
            if (!req.params.id) {throw { code: 400, message: 'REQUIRED_FORM_ID' };}
            if (!req.params.questionId) {throw { code: 400, message: 'REQUIRED_QUESTION_ID' };}
            if (!req.params.optionId) {throw { code: 400, message: 'REQUIRED_OPTION_ID' };}
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {throw { code: 400, message: 'INVALID_FORM_ID' };}
            if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {throw { code: 400, message: 'INVALID_QUESTION_ID' };}
            if (!mongoose.Types.ObjectId.isValid(req.params.optionId)) {throw { code: 400, message: 'INVALID_OPTION_ID' };}

            if(!req.body.option){throw{ code: 400, message: 'REQUIRED_OPTION_'}}

            const question = await Form.findOne({ _id: req.params.id, userId: req.jwt.id });
            if (!question) {
                throw { code: 400, message: 'UPDATE_OPTION_FAILED' };
            }

            const indexQuestion = question.questions.findIndex(q => q.id.toString() === req.params.questionId);

            if (indexQuestion === -1) {
                throw { code: 400, message: 'QUESTION_ID_ERROR' };
            }

            const indexOption = question.questions[indexQuestion].options.findIndex(o => o.id.toString() === req.params.optionId);

            if (indexOption === -1) {
                throw { code: 400, message: 'OPTION_ID_ERROR' };
            }

            const updatedQuestion = await Form.findOneAndUpdate(
                { _id: req.params.id, userId: req.jwt.id },
                { $set: { [`questions.${indexQuestion}.options.${indexOption}.value`]: req.body.option } },
                { new: true }
            );

            if (!updatedQuestion) {
                throw { code: 500, message: 'UPDATE_OPTIONS_FAILED' };
            }

            return res.status(200).json({
                status: true,
                message: 'UPDATE_OPTION_SUCCESS',
                option: updatedQuestion.questions[indexQuestion].options[indexOption]
            });
  
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                status: false,
                message: error.message
            })
        }
    }
}

module.exports = new OptionController(); 