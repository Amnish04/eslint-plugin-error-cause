/**
 * This patch makes sure that the default export in the bundled output is CJS compatible like so:
 *
 * ```js
 * module.exports = plugin.
 * ```
 *
 * By default, the generated export from ESM typescript looks like:
 *
 * ```js
 * exports.default = plugin;
 * ```
 *
 * which is incompatible with tools like `eslint-doc-generator`;
 *
 * We can't directly use ESM style export in typescript source code as it can't be used to generate type declarations in final bundle.
 */

const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../dist/index.js');
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/exports\.default\s*=\s*plugin;/, 'module.exports = plugin;');
fs.writeFileSync(file, content);
