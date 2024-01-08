const emailNotValid = async (form, answers) => {
    const found = form.questions.filter((question) => {
        if (question.type == "Email") {
            const answer = answers.find((answer) => answer.questionId == question.id);

            if (question.required === false) {
                if (answer === undefined || answer.value === undefined || answer.value === null || answer.value === "") {
                    return false;
                }
            }

            if (answer) {
                const regex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
                if (!regex.test(answer.value)) {
                    return true;
                }
            }
        }
    });

    let kesalahan = [];
    for (let i = 0; i < found.length; i++) {
        kesalahan.push(found[i].question);
    }

    return kesalahan;
};

module.exports = emailNotValid;
