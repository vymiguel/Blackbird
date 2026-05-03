import { copyFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const root = process.cwd();
const viteBin = join(root, "node_modules", "vite", "bin", "vite.js");
const result = spawnSync(process.execPath, [viteBin, "build"], { stdio: "inherit" });

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

const dist = join(root, "dist");
for (const file of ["manifest.webmanifest", "app-icon.svg", "sw.js"]) {
  const source = join(root, file);
  if (existsSync(source)) {
    copyFileSync(source, join(dist, file));
  }
}

console.log("Blackbird app built in dist/");
