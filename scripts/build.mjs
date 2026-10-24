import { mkdir, copyFile, writeFile } from 'node:fs/promises';
const output = new URL('../dist/', import.meta.url);
await mkdir(output, { recursive: true });
// Only publish frontend assets; never upload the entire checkout.
for (const file of ['index.html', 'style.css', 'app.js', 'model.js']) {
  await copyFile(new URL(`../${file}`, import.meta.url), new URL(file, output));
}
await writeFile(new URL('.nojekyll', output), '');
console.log('GitHub Pages frontend assets prepared in dist/');
