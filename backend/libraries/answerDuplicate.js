const answerDuplicate = async (answers) => {
    var seen = new Set();
    return answers.some((answer) => {
        if (seen.has(answer.questionId)) {
            return true;
        }
        seen.add(answer.questionId);
    });
};

module.exports = answerDuplicate;
