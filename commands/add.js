const {addToFile} = require('../utils/file');
// const {pass,fail,info,logErrors} = require('../utils/logger');


async function add(args) {

    const target = args[0];

    if (!target)
        return info("No file specified.");

    const content = args.slice(1).join(" ");

    await addToFile(target, content);

}

module.exports = add;