const questionIdNotValid = async (form, answers) => {
    const found = answers.filter((answer) => {
        let question = form.questions.some((question) => question.id == answer.questionId);
        if (question === false) {
            return true;
        }
    });

    let kesalahan = [];
    for (let i = 0; i < found.length; i++) {
        kesalahan.push(found[i].questionId);
    }

    return kesalahan;
};

module.exports = questionIdNotValid;
