// const path = require('path');
// const readLine = require("node:readline/promises")

// // console.log(path.join('src', 'components', 'Button.js'))
// // console.log(path.basename("./notes/test.md"));
// // console.log(path.extname("notes.md"));
// // console.log(path.dirname("./notes/test.md"));
// // const fullPath = path.resolve("./notes/test.md");

// // console.log(fullPath);

// // const hip = require('child_process')

console.log(process.arch);
// console.log(process.cpuUsage());

// console.log(process.uptime())
// console.log(process.cwd())
// // console.log(process.cwd())

// const startUsage = process.cpuUsage();
// // const listen = process.addListener();
// // { user: 38579, system: 6986 }

// // spin the CPU for 500 milliseconds
// // const now = Date.now();
// // while (Date.now() - now < 500);

// console.log(process.platform);
// // console.log(process.env);
// console.log(process.memoryUsage());
// console.log(new readLine.Interface);
// console.timeLog(process.uptime());

// const { spawn } = require('child_process');

// const ls = spawn('node', ['--version']);

// ls.stdout.on('data', data => {
//   console.log(data.toString());
// });

// ls.on('close', code => {
//   console.log(`Exited with ${code}`);
// });



// // if (process.platform == 'win32') {
    
// // }
// exec('dir', (err, stdout, stderr) => {
    //   if (err) throw err;
    
//   console.log(stdout);
//   console.log(process.platform);

// });
// const cp = require('child_process');

const { exec, spawn } = require('child_process');

// exec('date', (err, stdout, stderr) => {
//     if (err) {
//         console.log(err);
//         return;
//     }

//     console.log(stdout);
//     console.log(stderr);
// });

exec('cd', { cwd: '..' }, (err, stdout) => {
    console.log(stdout);
});

// const { exec } = require('child_process');

exec('cd', (err, stdout) => {
    console.log(stdout);
});

// const { exec } = require('child_process');
// tee()

// const { spawn } = require('child_process');

spawn('powershell', {
    stdio: 'inherit'
});
// spawn.stdin.write('date \n')
// exec(
//   'Get-Date',
//   { shell: 'powershell.exe' },
//   (err, stdout, stderr) => {
//     console.log(stdout);
    
//     console.log(stderr);
//   }
// );

// spawn(
//   'date',
//   { shell: 'powershell.exe' },
//   (err, stdout, stderr) => {
//     console.log(stdout);
//     console.log(stderr);
//   }
// );

// const { spawn } = require('child_process');

async function tee() {
    
    // const child = spawn('powershell');
    
    // await child.stdin.write('dir\n');
    
    const child = spawn('powershell', {
        stdio: 'inherit'
    });
    await child.stdout.on('data', data => {
        console.log(data.toString());
    });
    await child.stdin.write('date \n');
    // child.stdin.write('cd ..\n');
    // child.stdin.write('dir\n');
    // child.stdin.write('exit\n');
}
