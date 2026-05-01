import { copyFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

copyFileSync(join(root, "blackbird-preview.html"), join(dist, "index.html"));
copyFileSync(join(root, "blackbird-module.jsx"), join(dist, "blackbird-module.jsx"));
copyFileSync(join(root, "manifest.webmanifest"), join(dist, "manifest.webmanifest"));
copyFileSync(join(root, "app-icon.svg"), join(dist, "app-icon.svg"));
copyFileSync(join(root, "sw.js"), join(dist, "sw.js"));

console.log("Blackbird preview built in dist/");
