const fs = require("fs");
const path = require("path");

const {createFile,createFolder} = require('../utils/file');
const {pass,fail,info,logErrors} = require('../utils/logger');

function create(args) {

    const type = args[0];
    const target = args[1];

    if (!target) {
        console.log("No path provided.");
        return;
    }

    const targetPath = path.resolve(target);

    switch (type) {

        case "file":
            createFile(targetPath, args.slice(2).join(" "));
            break;

        case "folder":
            createFolder(targetPath);
            break;

        default:
            info("Unknown create type.");
    }

}

module.exports = create;