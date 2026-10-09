#!/usr/bin/env node

// file system import
const fs = require("fs");
const path = require("path")

// Command imports
const create = require("./commands/create"); 
const add = require("./commands/add"); 
const { ChildProcess } = require("child_process");

const command = process.argv[2]; // commands
const args = process.argv.slice(3); // arguments
const target = process.argv[4];

// command router
switch (command) {

    case "create":

        create(args)
        break;

    case "add":
        add(args)
        break;

    case "back":
        
        break;

    case "help":
        console.log(`
            Commands:
            tools add {file name // dir}
            tools create {file || folder} <name> 'Content to add'
            tools delete <name>
            tools back
            tools help
        `);
        break;

    default:
        console.log("Unknown command. Run: tools help");
}
