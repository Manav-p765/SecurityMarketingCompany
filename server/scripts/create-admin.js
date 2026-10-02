/**
 * Creates an admin user for /admin. Asks for name, email and password; the
 * password is never echoed or stored anywhere except as a bcrypt hash.
 *
 *   npm run create-admin            (from server/, or the repo root)
 *
 * Uses MONGODB_URI from server/.env — point it at the production database
 * to create the first live admin. There are no default credentials.
 */
import 'dotenv/config';
import readline from 'node:readline';
import mongoose from 'mongoose';
import { AdminUser } from '../src/models/AdminUser.js';
import { hashPassword, validatePassword } from '../src/routes/admin/auth.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      // Print the question, then swallow every keystroke echo.
      rl._writeToOutput = (text) => {
        if (text.includes(question)) process.stdout.write(question);
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write('\n');
      resolve(answer.trim());
    });
  });
}

async function main() {
  if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI in server/.env first.');
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  console.log(`Connected to ${mongoose.connection.host}/${mongoose.connection.name}\n`);

  const name = await ask('Name: ');
  if (!name) throw new Error('A name is required.');

  const email = (await ask('Email: ')).toLowerCase();
  if (!EMAIL_RE.test(email)) throw new Error('That is not a valid email address.');
  if (await AdminUser.exists({ email })) throw new Error(`An admin user with ${email} already exists.`);

  const password = await ask('Password (at least 10 characters): ', { hidden: true });
  const problem = validatePassword(password);
  if (problem) throw new Error(problem);
  if ((await ask('Repeat password: ', { hidden: true })) !== password) throw new Error('The passwords do not match.');

  const user = await AdminUser.create({ name, email, role: 'admin', passwordHash: await hashPassword(password) });
  console.log(`\nCreated admin ${user.name} <${user.email}>. Sign in at /admin.`);
}

main()
  .catch((err) => {
    console.error(`\nNot created: ${err.message}`);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
