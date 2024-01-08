const connection = require("./connection");
connection();

const args = process.argv;

let limit = 10;
if (args[3]) {
    limit = parseInt(args[3]);
}

const fakerFile = args[2];
const { run } = require(`./faker/${fakerFile}.js`);
run(limit);
