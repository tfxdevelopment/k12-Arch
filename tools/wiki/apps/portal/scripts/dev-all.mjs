import { spawn } from 'node:child_process';

const commands = [
  { name: 'docs', command: 'npm run dev --prefix ../docs' },
  { name: 'scalar', command: 'npm run dev --prefix ../scalar' },
  { name: 'storybook', command: 'npm run dev --prefix ../storybook' },
  { name: 'portal', command: 'npm run dev:shell' }
];

const children = [];

for (const item of commands) {
  const child = spawn(item.command, {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true,
    env: process.env
  });

  children.push(child);

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`[${item.name}] exited with code ${code}`);
    }
  });
}

function shutdown() {
  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
