#!/usr/bin/env node
// Encrypts assets/present/Geschenkkarte.pdf with AES-256-GCM, key derived
// from a password via PBKDF2-SHA256 (600k iterations). Output layout:
//   salt(16) | iv(12) | ciphertext+tag(rest)
// matches what WebCrypto's crypto.subtle.decrypt expects on the browser side.
//
// Usage:
//   GUTSCHEIN_PW='adsj41-darss2026' node scripts/encrypt-present.mjs
//
// Reads:  assets/present/Geschenkkarte.pdf
// Writes: assets/present/Geschenkkarte.enc

import { readFile, writeFile } from 'node:fs/promises';
import { randomBytes, pbkdf2Sync, createCipheriv } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const PDF_PATH = resolve(ROOT, 'assets/present/Geschenkkarte.pdf');
const OUT_PATH = resolve(ROOT, 'assets/present/Geschenkkarte.enc');

const PBKDF2_ITERATIONS = 600_000;
const SALT_LEN = 16;
const IV_LEN = 12;
const KEY_LEN = 32;

const password = process.env.GUTSCHEIN_PW;
if (!password) {
  console.error('GUTSCHEIN_PW env var not set. Aborting.');
  process.exit(1);
}

const pdf = await readFile(PDF_PATH);
const salt = randomBytes(SALT_LEN);
const iv = randomBytes(IV_LEN);
const key = pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, KEY_LEN, 'sha256');

const cipher = createCipheriv('aes-256-gcm', key, iv);
const ciphertext = Buffer.concat([cipher.update(pdf), cipher.final()]);
const tag = cipher.getAuthTag();
const ctWithTag = Buffer.concat([ciphertext, tag]);

const out = Buffer.concat([salt, iv, ctWithTag]);
await writeFile(OUT_PATH, out);

console.log(`OK · ${pdf.length}B PDF → ${out.length}B blob at ${OUT_PATH}`);
console.log(`Layout: salt(${SALT_LEN}) | iv(${IV_LEN}) | ciphertext+tag(${ctWithTag.length})`);
console.log(`PBKDF2-SHA256 iterations: ${PBKDF2_ITERATIONS}`);
