const { faker } = require("@faker-js/faker");
const Answer = require("../models/Answer");

const run = async (limit) => {
    try {
        let data = [];
        for (let i = 0; i < limit; i++) {
            data.push({
                "65990fa961e3f3abfc728219": faker.helpers.arrayElement([40, 41]),
                "65990fab61e3f3abfc72821b": faker.helpers.arrayElements(["Nasi Goreng", "Mie Ayam", "Bakso", "Sate Ayam"]),
                "65990fab61e3f3abfc72821d": faker.internet.email(),
                formId: "65990f9a61e3f3abfc728217",
                userId: "659953fc724c581c35d7e6ec",
                createdAt: new Date(), // Use the current date for createdAt
                updatedAt: new Date(),
            });
        }

        const fakeData = await Answer.insertMany(data);
        console.log(`Data sebanyak : ${fakeData.length} telah ditambahkan ke tabel answers`);
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit();
    }
};

module.exports = { run };
