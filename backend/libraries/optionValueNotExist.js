const optionValueNotExist = async (form, answers) => {
    const found = form.questions.filter((question) => {
        if (question.type == "Radio" || question.type == "Dropdown") {
            const answer = answers.find(
                (answer) => answer.questionId == question.id
            );
            if (answer) {
                const option = question.options.find(
                    (option) => option.value === answer.value
                );
                if (option === undefined) {
                    return true;
                }
            }
        }
    });
    return found.length > 0 ? true : false;
};

module.exports = optionValueNotExist;
