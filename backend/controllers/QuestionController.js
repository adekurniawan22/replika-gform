const Form = require('../models/Form');
const mongoose = require('mongoose');

class QuestionController{
    async store(req,res)
    {
        try {
            if(!req.params.id){throw{code:400, message:'REQUIRED_FORM_ID'}}
            if(!mongoose.Types.ObjectId.isValid(req.params.id)){throw{code:400, message:'INVALID_FORM_ID'}}

            const newQuestion = {
                id: new mongoose.Types.ObjectId(),
                question: null,
                type: 'text',
                required: false,
                option: [],
            }

            const form = await Form.findOneAndUpdate({_id: req.params.id, userId: req.jwt.id}, 
                                                    {$push: {questions: newQuestion}}, 
                                                    {new: true})
            if(!form){throw{code:400, message:'FORM_UPDATE_FAILED'}}

            
            return res.status(200).json({
                status: true,
                message: 'ADD_QUESTION_SUCCESS',
                question: newQuestion,
                form
            })
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message
            })
        }
    }

    async update(req,res){
        try {
            if (!req.params.id) {
                throw { code: 400, message: 'REQUIRED_FORM_ID' };
            }
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                throw { code: 400, message: 'INVALID_FORM_ID' };
            }
            if (!req.params.questionId) {
                throw { code: 400, message: 'REQUIRED_QUESTION_ID' };
            }
            if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
                throw { code: 400, message: 'INVALID_QUESTION_ID' };
            }
    
            let field = {};
    
            if (req.body.hasOwnProperty('question')) {
                field['questions.$[indexQuestionId].question'] = req.body.question;
            }
            if (req.body.hasOwnProperty('required')) {
                field['questions.$[indexQuestionId].required'] = req.body.required;
            }
            if (req.body.hasOwnProperty('type')) {
                field['questions.$[indexQuestionId].type'] = req.body.type;
            }

            console.log(field);     
    
            const question = await Form.findOneAndUpdate(
                { _id: req.params.id, userId: req.jwt.id },
                { $set: field },
                {
                    arrayFilters: [{ 'indexQuestion.id': new mongoose.Types.ObjectId(req.params.questionId) }],
                    new: true
                }
            );
    
            if (!question) {
                throw { code: 400, message: 'UPDATE_QUESTION_FAILED' };
            }
    
            return res.status(200).json({
                status: true,
                message: 'UPDATE_QUESTION_SUCCESS',
                question
            });
        }catch(error){
            console.log(error);
            return res.status(400).json({
                status: false,
                message: error.message
            })
        }
    }
}
module.exports = new QuestionController();