const { fail,pass,info,logErrors } = require('./logger');
const fs = require('fs').promises;
const path = require("path");

async function createFolder(folderPath){

    try{

        await logErrors(()=>{fs.mkdir(folderPath,{
            recursive:true
        })});

        pass(`Folder ready: ${folderPath}`);

    }

    catch(err){

        fail(err.message);

    }

}

async function createFile(filePath, content = "") {

    const folder = path.dirname(filePath);

    await createFolder(folder);

    try {

        await logErrors(()=>{fs.access(filePath)});

        return fail("File already exists. try 'tools add' command");

    }

    catch {

        await logErrors(()=>{ fs.writeFile(filePath, content)})

        pass("File created.");

    }

}

async function addToFile(filePath, content) {
    if (!content) {
        info("Missing content to add.");
        return;
    }

    try {

        await logErrors(()=>{fs.access(filePath)});

        await logErrors(()=>{fs.appendFile(filePath, `\n\n${content}`)})

        pass("File Updated!");
    }

    catch (err) {
        fail(err.message)
        fail("File doesn't exist yet, try 'tools create' command")
    }

}



module.exports = { createFolder , createFile, addToFile }

