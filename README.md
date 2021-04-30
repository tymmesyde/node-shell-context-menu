[![NPM](https://nodei.co/npm/shell-context-menu.png?compact=true)](https://npmjs.org/package/shell-context-menu)

# node-shell-context-menu

Add a context menu item command on Windows

## Install

```bash
npm i shell-context-menu
```

## Usage

```js
const shellContextMenu = require('shell-context-menu');

const options = {
    name: 'MyApp',
    command: 'C:\\MyPath\\MyApp.exe --open'
};

await shellContextMenu.registerOpenWithCommand(['.jpeg', '.png'], options);
```
```js
const shellContextMenu = require('shell-context-menu');

const options = {
    name: 'MyScript',
    command: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
    args: ['-WindowStyle','hidden','C:\\Users\\Default\\Documents\\do_some_task_and_open_it.ps1']
};

await shellContextMenu.registerOpenWithCommand(['.txt'], options);
```

*Note: It will add the file/folder as argument at the end of the command or args*

## registerCommand

Create a context menu item on files

```js
const options = {
    name: 'Explorer',
    icon: 'C:\\Windows\\explorer.exe', // You can specify a path to an ico file or directly put the path of your app and it will automatically find the icon
    command: 'C:\\Windows\\explorer.exe',
    menu: 'Open with Explorer'
};

await shellContextMenu.registerCommand(options);
```

## registerDirectoryCommand

Create a context menu item only on folders

```js
const options = {
    name: 'Explorer',
    icon: 'C:\\MyPath\\icon.ico', // You can specify a path to an ico file or directly put the path of your app and it will automatically find the icon
    command: 'C:\\Windows\\explorer.exe',
    menu: 'Open with Explorer'
};

await shellContextMenu.registerDirectoryCommand(options);
```

## registerOpenWithCommand

Create a context menu item `OpenWith` on specific filetypes

```js
const options = {
    name: 'Explorer',
    command: 'C:\\Windows\\explorer.exe'
};

await shellContextMenu.registerOpenWithCommand(['.jpeg', '.png'], options);
```

## removeCommand

Remove a named command

```js
await shellContextMenu.removeCommand('Explorer');
```

## removeDirectoryCommand

Remove a named directory command

```js
await shellContextMenu.removeDirectoryCommand('Explorer');
```

## removeOpenWithCommand

Remove a named `OpenWith` command for given filetypes

```js
await shellContextMenu.removeOpenWithCommand(['.jpeg', '.png'], 'Explorer');
```
