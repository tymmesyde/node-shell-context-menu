const tape = require('tape');
const { Registry } = require('rage-edit');
const shellContextMenu = require('../src/index');

const appPath = 'C:\\Windows\\explorer.exe';
const extensions = ['.jpeg'];
const options = {
	name: 'Explorer',
	icon: appPath,
	command: appPath,
	menu: 'Open with Explorer'
};

tape('registerCommand', async t => {
	try {
		await shellContextMenu.registerCommand();
	} catch(e) {
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
	t.end();
});

tape('registerDirectoryCommand', async t => {
	try {
		await shellContextMenu.registerDirectoryCommand();
	} catch(e) {
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
	t.end();
});

tape('registerOpenWithCommand', async t => {
	try {
		await shellContextMenu.registerOpenWithCommand();
	} catch(e) {
		t.equal(e.message, 'extensions is not specified');
	}

	try {
		await shellContextMenu.registerOpenWithCommand(extensions);
	} catch (e) {
		t.equal(e.message, 'options are empty');
	}

	await shellContextMenu.registerOpenWithCommand(extensions, { name: options.name, command: options.command });
    
	t.equal(await Registry.has(`HKCU\\Software\\Classes\\jpegfile\\shell\\${options.name}`), true);
	t.equal(await Registry.has(`HKCU\\Software\\Classes\\jpegfile\\shell\\${options.name}\\command`), true);
	t.end();
});

tape('removeCommand', async t => {
	await shellContextMenu.removeCommand(options.name);

	t.equal(await Registry.has(`HKCU\\Software\\Classes\\*\\shell\\${options.name}`), false);
	t.end();
});

tape('removeDirectoryCommand', async t => {
	await shellContextMenu.removeDirectoryCommand(options.name);

	t.equal(await Registry.has(`HKCU\\Software\\Classes\\Directory\\shell\\${options.name}`), false);
	t.end();
});

tape('removeOpenWithCommand', async t => {
	await shellContextMenu.removeOpenWithCommand(extensions, options.name);

	t.equal(await Registry.has(`HKCU\\Software\\Classes\\jpegfile\\shell\\${options.name}`), false);
	t.equal(await Registry.has(`HKCU\\Software\\Classes\\pngfile\\shell\\${options.name}`), false);
	t.end();
});
