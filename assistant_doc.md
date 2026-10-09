Yeah. And I think you've identified the **actual lesson from both projects**: you're jumping into implementation before defining the system's behaviour, data, boundaries, and failure cases. The coding then exposes design gaps that you haven't decided on yet.

Let's document the Node CLI first. Here's a clean **reference sheet** you can keep with the project.

# Node.js CLI / Automation — Cheat Sheet

## 1. PowerShell: finding commands

### Show every command PowerShell knows

```powershell
Get-Command
```

Can produce a *lot* of output.

### Search commands by name

```powershell
Get-Command *tool*
```

For example, this can find things containing `tool`.

### Check one specific command

```powershell
Get-Command tools
Get-Command toolbox
Get-Command tee
```

This tells you what PowerShell thinks the command is.

### Show an alias

```powershell
Get-Alias tee
```

For example:

```text
tee -> Tee-Object
```

So `tee` wasn't your program — it was PowerShell's built-in alias.

### Show detailed information about a command

```powershell
Get-Command toolbox | Format-List *
```

Useful when you need to know **exactly where a command came from**.

---

# 2. Finding executables

### Find an executable using Windows PATH

```powershell
where.exe tools
where.exe toolbox
```

This is particularly useful for CLI debugging.

If you get:

```text
C:\Users\...\AppData\Roaming\npm\tools.cmd
```

you know Windows found a command registered there.

### Check your PATH

```powershell
$env:Path
```

More readable:

```powershell
$env:Path -split ';'
```

This shows all directories Windows searches when you type a command.

---

# 3. npm global stuff

### List globally installed npm packages

```powershell
npm list -g --depth=0
```

Example:

```text
tools@1.0.0
npm@11.5.2
pnpm@12.4.2
```

### Find npm's global installation directory

```powershell
npm config get prefix
```

On Windows you may see something around:

```text
C:\Users\<you>\AppData\Roaming\npm
```

That's why you found:

```text
toolbox.cmd
```

there.

### Find your current npm version

```powershell
npm --version
```

or:

```powershell
npm -v
```

### Find Node version

```powershell
node --version
```

or:

```powershell
node -v
```

---

# 4. npm project creation

### Create `package.json` interactively

```powershell
npm init
```

It asks questions such as:

```text
package name:
version:
description:
entry point:
```

### Create it automatically with defaults

```powershell
npm init -y
```

This is probably the one you'll use most often for experiments.

---

# 5. Your CLI's `package.json`

You have:

```json
{
  "name": "tools",
  "version": "1.0.0",
  "bin": {
    "tools": "./index.js"
  }
}
```

The important part is:

```json
"bin": {
    "tools": "./index.js"
}
```

It establishes:

```text
tools
  ↓
index.js
```

So when you type:

```powershell
tools
```

npm/your OS knows that `tools` should execute your `index.js`.

And:

```js
#!/usr/bin/env node
```

at the top of `index.js` tells the system:

> Run this file using Node.

---

# 6. Making your local CLI globally available

From inside your project:

```powershell
npm link
```

So your workflow is roughly:

```powershell
cd D:\Work\tools
npm link
```

Then you can go somewhere completely different:

```powershell
cd C:\Users\You\Desktop
tools
```

and it can still execute your project.

### Remove the global link

```powershell
npm unlink -g tools
```

This removes the global link rather than deleting your project.

---

# 7. Installing normal dependencies

If your code uses an external package:

```powershell
npm install <package>
```

For example:

```powershell
npm install chalk
```

This normally creates:

```text
node_modules/
package-lock.json
```

and adds the dependency to:

```json
"dependencies": {
    "chalk": "..."
}
```

### Install the dependencies of an existing project

If you receive a project containing:

```text
package.json
package-lock.json
```

run:

```powershell
npm install
```

You don't need to manually create `node_modules`.

---

# 8. Looking through your project

You used:

```powershell
Get-ChildItem -Recurse -File |
    Select-Object FullName
```

That's useful.

### Basic directory listing

```powershell
Get-ChildItem
```

Short form:

```powershell
dir
```

or:

```powershell
ls
```

### Recursively list files

```powershell
Get-ChildItem -Recurse
```

### Recursively list files only

```powershell
Get-ChildItem -Recurse -File
```

### Read a file directly

```powershell
Get-Content package.json
```

For your project:

```powershell
Get-Content index.js
Get-Content utils/logger.js
Get-Content utils/file.js
```

---

# 9. Your Node project architecture

Your recovered project is:

```text
tools/
│
├── package.json
├── index.js
├── help.txt
│
├── commands/
│   ├── add.js
│   ├── create.js
│   ├── delete.js
│   ├── help.js
│   └── rename.js
│
├── utils/
│   ├── file.js
│   └── logger.js
│
├── experiment/
│   └── path.js
│
├── box/
│   └── try.js
│
└── .continue/
    └── config.json
```

This actually gives us a pretty strong clue about your intended architecture.

You appear to have separated:

```text
index.js
    ↓
CLI entry point / command router

commands/
    ↓
What the CLI can DO

utils/
    ↓
Reusable functionality

experiment/
    ↓
Testing ideas

box/
    ↓
Scratch code

package.json
    ↓
Project/npm configuration
```

That's a reasonable architecture.

---

# 10. Your `exec` confusion

This is probably the next thing we need to document properly.

There are **three different concepts** that can get mixed together:

### A. PowerShell command

```powershell
tools create file help.txt "hello"
```

PowerShell starts your executable.

### B. Your Node CLI

```text
tools
  ↓
index.js
  ↓
parse arguments
  ↓
identify "create"
  ↓
load commands/create.js
  ↓
execute create operation
```

### C. Node's `exec`

If somewhere in your Node code you have:

```js
exec(...)
```

that's something different.

Node's `child_process.exec()` lets **your Node program ask the operating system to execute another shell command**.

Conceptually:

```text
Your CLI
   ↓
Node
   ↓
exec("some shell command")
   ↓
Operating system / shell
   ↓
command executes
```

So if you're confused about `exec`, that's completely separate from the fact that `tools` itself is a CLI.

We'll want to inspect where you actually use `exec` before deciding what you intended it to do.

---

# 11. Your debugging checklist

This is the part I'd actually put in your project docs.

```text
CLI DEBUGGING CHECKLIST

1. Does the command exist?
   Get-Command tools

2. Where is it coming from?
   Get-Command tools | Format-List *
   where.exe tools

3. Is npm aware of the package?
   npm list -g --depth=0

4. Where is npm's global directory?
   npm config get prefix

5. Is this project linked?
   npm list -g --depth=0

6. What does package.json say?
   Get-Content package.json

7. What is the CLI entry point?
   Check "bin" in package.json

8. Does the entry file exist?
   Check index.js

9. Does the entry file have the Node shebang?
   #!/usr/bin/env node

10. Is Node working?
    node -v

11. Is npm working?
    npm -v

12. What files actually exist?
    Get-ChildItem -Recurse -File

13. Read the relevant source:
    Get-Content <file>

14. If something says "not a function":
    Check what argument was actually passed.

15. If something says "undefined":
    Check where that variable/property should have been defined.

16. If a command isn't found:
    Check PATH / npm global installation / npm link.
```

---

# 12. And your bigger realisation

I think you're onto something, but I'd slightly correct this:

> "that's why many project managers earn more than developers"

That's **not generally because system design is harder than coding**. Pay depends heavily on industry, seniority, responsibility, company, scarcity, and management scope.

But your underlying observation **is correct**:

> **Writing code is not the same thing as designing a system.**

Your library project demonstrated it perfectly.

You had:

```text
"How do I calculate the fine?"
```

but the harder question was:

```text
"What exactly does a member record contain?
What does a loan contain?
Can one member have multiple loans?
Where does the due date live?
What happens when a book is returned?
What happens if the member owes too much?
What is the state of a book?"
```

Until those are decided, coding becomes patchwork.

Your `tools` project has the same issue.

Before adding another command, you want to define:

```text
TOOLS CLI
│
├── PURPOSE
│
├── COMMANDS
│   ├── create
│   ├── add
│   ├── delete
│   ├── rename
│   └── help
│
├── INPUT
│   └── CLI arguments
│
├── COMMAND ROUTING
│
├── FILE OPERATIONS
│
├── ERROR HANDLING
│
└── OUTPUT / LOGGING
```

Then for each command:

```text
COMMAND: create file

INPUT:
    tools create file <path> [content]

VALIDATION:
    Is path provided?
    Is parent directory valid?
    Does file already exist?

ACTION:
    Create directory if necessary
    Create file

SUCCESS:
    "File created."

FAILURE:
    Explain what went wrong.
```

**That is the missing layer between "I have an idea" and "I start writing JavaScript."**

And honestly, your recovered folder is perfect for learning this because you've already built something messy enough to reverse-engineer. Instead of throwing it away and rebuilding immediately, I'd document **what Past You intended this system to do**, then compare that against what the code actually does. That's much better practice than simply getting an AI to rewrite it.

There are actually multiple levels here
This is worth documenting because you'll encounter it again.
Level 1 — Your terminal
For example:
PowerShell

or:
Command Prompt

These are shells.
Level 2 — Node
Your program:
node index.js

is running as a process inside that shell.
Level 3 — Child process
Your Node program can start another process:
exec(...)

or:
spawn(...)

or:
execFile(...)

Now you have:
PowerShell
   │
   └── Node
         │
         └── child process

And those processes have their own:
- stdin
- stdout
- stderr
- exit codes
- environment
- working directory
That's why terminal automation gets complicated surprisingly quickly.