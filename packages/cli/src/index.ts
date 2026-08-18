#!/usr/bin/env node
const [command = 'help'] = process.argv.slice(2);
const commands: Record<string, string> = { install: 'Install AXSD', start: 'Start the control plane', status: 'Show service status', resources: 'List resources', policies: 'List policies', sessions: 'List sessions', executions: 'List executions', approve: 'Approve a pending action', deny: 'Deny a pending action', stop: 'Stop an execution', logs: 'Show audit logs' };
if (command === 'help') { console.log(Object.entries(commands).map(([name, description]) => `${name.padEnd(12)} ${description}`).join('\n')); process.exit(0); }
if (!commands[command]) { console.error(`Unknown command: ${command}`); process.exit(1); }
console.log(`${command}: CLI command is registered; connect it to the API with AXSD_API_URL.`);