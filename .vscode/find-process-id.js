const fs = require('fs'), path = require('path');
const childProcess = require('child_process');
const util = require('util');
const execFile = util.promisify(childProcess.execFile);
const settings = require('./settings');
(async () => {
	const { stdout } = await execFile('WMIC', 'PROCESS get Caption,Commandline,Processid'.split(' '), { maxBuffer: 10 * 1024 * 1024 });

	const processId = stdout
		.trim()
		.split('\r\n')
		.map(line => (line.split('  ')))
		.filter(([n]) => n.startsWith('node.exe'))
		.map(parts => [...parts.filter(notFalse => notFalse).map(part => part.trim())])
		.map(parts => [...parts.filter(part => /^[0-9]+$/.test(part) || part.includes('node.exe')).slice(1)])
		.filter(parts => parts.length > 1)
		.map(([program, processId]) => program.includes('ts-node-dev') && +processId)
		.filter(notFalse => notFalse)[0];
	// 
	const emmet_variables = settings['emmet.variables'] || {};
	const newSettings = { ...settings, 'emmet.variables': { ...emmet_variables, processId } };
	await fs.writeFileSync(path.join(__dirname, 'settings.json'), JSON.stringify(newSettings, null, 4), { encoding: 'utf-8' });
	//=> [{pid: 3213, name: 'node', cmd: 'node test.js', ppid: 1, uid: 501, cpu: 0.1, memory: 1.5}, …]
})();