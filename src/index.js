'use strict';
const {Registry} = require('rage-edit');
const SOFTWARE_CLASSES = 'HKCU\\Software\\Classes\\';

exports.registerCommand = async options => {
	if (!options) throw new Error('options are empty');

	const {name, icon, command, menu, args} = options;
	if (!name) throw new Error('name is not specified');
	if (!command) throw new Error('command is not specified');
	if (!menu) throw new Error('menuName is not specified');
	const joinArgs = args ? ' ' + (Array.isArray(args) ? args.map(arg => `"${arg}"`).join(' ') : `"${args}"`) : '';

	try {
		await Registry.set(`${SOFTWARE_CLASSES}*\\shell\\${name}`);
		await Registry.set(`${SOFTWARE_CLASSES}*\\shell\\${name}`, '', menu);
		if (icon) await Registry.set(`${SOFTWARE_CLASSES}*\\shell\\${name}`, 'Icon', (icon.endsWith('.exe') ? `${icon},0` : icon));
		await Registry.set(`${SOFTWARE_CLASSES}*\\shell\\${name}\\command`, '', `"${command}"${joinArgs} "%1"`);
	} catch (e) {
		return Promise.reject(e);
	}

	return Promise.resolve();
};

exports.registerDirectoryCommand = async options => {
	if (!options) throw new Error('options are empty');

	const {name, icon, command, menu, args} = options;
	if (!name) throw new Error('name is not specified');
	if (!command) throw new Error('command is not specified');
	if (!menu) throw new Error('menu is not specified');
	const joinArgs = args ? ' ' + (Array.isArray(args) ? args.map(arg => `"${arg}"`).join(' ') : `"${args}"`) : '';

	try {
		await Registry.set(`${SOFTWARE_CLASSES}Directory\\shell\\${name}`);
		await Registry.set(`${SOFTWARE_CLASSES}Directory\\shell\\${name}`, '', menu);
		if (icon) await Registry.set(`${SOFTWARE_CLASSES}Directory\\shell\\${name}`, 'Icon', (icon.endsWith('.exe') ? `${icon},0` : icon));
		await Registry.set(`${SOFTWARE_CLASSES}Directory\\shell\\${name}\\command`, '', `"${command}"${joinArgs} "%1"`);
	} catch (e) {
		return Promise.reject(e);
	}

	return Promise.resolve();
};

exports.registerOpenWithCommand = async (extensions, options) => {
	if (!extensions || !extensions.length) throw new Error('extensions is not specified');
	if (!options) throw new Error('options are empty');

	const {name, command, args} = options;
	if (!name) throw new Error('name is not specified');
	if (!command) throw new Error('command is not specified');
	const joinArgs = args ? ' ' + (Array.isArray(args) ? args.map(arg => `"${arg}"`).join(' ') : `"${args}"`) : '';

	try {
		await Promise.all((await findExtensionNames(extensions)).map(async n => {
			await Registry.set(`${SOFTWARE_CLASSES}${n}`);
			await Registry.set(`${SOFTWARE_CLASSES}${n}\\shell\\${name}`);
			await Registry.set(`${SOFTWARE_CLASSES}${n}\\shell\\${name}\\command`, '', `"${command}"${joinArgs} "%1"`);
		}));
	} catch (e) {
		return Promise.reject(e);
	}

	return Promise.resolve();
};

exports.removeCommand = async name => {
	if (!name) throw new Error('name is not specified');

	try {
		await Registry.delete(`${SOFTWARE_CLASSES}*\\shell\\${name}`);
	} catch (e) {
		return Promise.reject(e);
	}

	return Promise.resolve();
};

exports.removeDirectoryCommand = async name => {
	if (!name) throw new Error('name is not specified');

	try {
		await Registry.delete(`${SOFTWARE_CLASSES}Directory\\shell\\${name}`);
	} catch (e) {
		return Promise.reject(e);
	}

	return Promise.resolve();
};

exports.removeOpenWithCommand = async (extensions, name) => {
	if (!extensions) throw new Error('extensions is not specified');
	if (!name) throw new Error('name is not specified');

	try {
		await Promise.all((await findExtensionNames(extensions)).map(async n => await Registry.delete(`${SOFTWARE_CLASSES}${n}\\shell\\${name}`)));
	} catch (e) {
		return Promise.reject(e);
	}

	return Promise.resolve();
};

async function findExtensionNames(exts) {
	const {ses_root} = await Registry.get('HKCR');
	return Promise.all(Object.keys(ses_root).filter(e => exts.includes(e)).map(async k => (await Registry.get(`HKCR\\${k}`)).$values['']));
}
