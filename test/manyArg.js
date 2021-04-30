const tape = require('tape');
const {Registry} = require('rage-edit');
const shellContextMenu = require('../src/index');

const appPath = 'C:\\Windows\\explorer.exe';
const options = {
	name: 'Explorer',
	icon: appPath,
	command: appPath,
	menu: 'Open with Explorer',
	args: ['/e', '/n']
};

tape('registerCommand with many args', async t => {
	try {
		await shellContextMenu.registerCommand();
	} catch (e) {
		t.equal(e.message, 'options are empty');
	}

	try {
		await shellContextMenu.registerCommand({});
	} catch (e) {
		t.equal(e.message, 'name is not specified');
	}

	await shellContextMenu.registerCommand(options);

	t.equal(await Registry.has(`HKCU\\Software\\Classes\\*\\shell\\${options.name}`), true);
	t.equal(await Registry.has(`HKCU\\Software\\Classes\\*\\shell\\${options.name}\\command`), true);
	t.equal(await Registry.get(`HKCU\\Software\\Classes\\*\\shell\\${options.name}\\command`, ''), '"C:\\Windows\\explorer.exe" "/e" "/n" "%1"');
	t.end();
});

tape('registerDirectoryCommand with many args', async t => {
	try {
		await shellContextMenu.registerDirectoryCommand();
	} catch (e) {
		t.equal(e.message, 'options are empty');
	}

	try {
		await shellContextMenu.registerDirectoryCommand({});
	} catch (e) {
		t.equal(e.message, 'name is not specified');
	}

	await shellContextMenu.registerDirectoryCommand(options);

	t.equal(await Registry.has(`HKCU\\Software\\Classes\\Directory\\shell\\${options.name}`), true);
	t.equal(await Registry.has(`HKCU\\Software\\Classes\\Directory\\shell\\${options.name}\\command`), true);
	t.equal(await Registry.get(`HKCU\\Software\\Classes\\Directory\\shell\\${options.name}\\command`, ''), '"C:\\Windows\\explorer.exe" "/e" "/n" "%1"');
	t.end();
});

tape('removeCommand with many args', async t => {
	await shellContextMenu.removeCommand(options.name);

	t.equal(await Registry.has(`HKCU\\Software\\Classes\\*\\shell\\${options.name}`), false);
	t.end();
});

tape('removeDirectoryCommand with many args', async t => {
	await shellContextMenu.removeDirectoryCommand(options.name);

	t.equal(await Registry.has(`HKCU\\Software\\Classes\\Directory\\shell\\${options.name}`), false);
	t.end();
});

