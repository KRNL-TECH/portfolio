// الاستخدام:  npm run add-project
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { execSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const dataFile = path.join(root, "data", "projects.json");
const rl = readline.createInterface({ input: process.stdin });
const lines = rl[Symbol.asyncIterator]();
const ask = async (q) => {
  process.stdout.write(q);
  const { value } = await lines.next();
  return value ?? "";
};
const clean = (s) => s.trim().replace(/^["']|["']$/g, "");

const title = (await ask("اسم المشروع: ")).trim();
const desc = (await ask("وصف قصير: ")).trim();
const imgInput = clean(await ask("مسار الصورة (اسحب الملف هنا أو سيبه فاضي): "));
const link = (await ask("لينك المشروع (اختياري): ")).trim();

if (!title || !desc) {
  console.error("الاسم والوصف مطلوبين.");
  process.exit(1);
}

let image = "";
if (imgInput) {
  if (!fs.existsSync(imgInput)) {
    console.error("الصورة مش موجودة في المسار ده.");
    process.exit(1);
  }
  const ext = path.extname(imgInput).toLowerCase();
  const name = `${Date.now()}${ext}`;
  fs.mkdirSync(path.join(root, "public", "projects"), { recursive: true });
  fs.copyFileSync(imgInput, path.join(root, "public", "projects", name));
  image = `/projects/${name}`;
}

const projects = JSON.parse(fs.readFileSync(dataFile, "utf8"));
projects.unshift({ title, desc, image, link });
fs.writeFileSync(dataFile, JSON.stringify(projects, null, 2) + "\n");
console.log("✓ اتضاف المشروع.");

const go = (await ask("أرفع على الموقع دلوقتي (git push)؟ (y/n): ")).trim().toLowerCase();
rl.close();
if (go === "y") {
  execSync(`git add -A && git commit -m "add project: ${title.replace(/"/g, "")}" && git push`, {
    cwd: root,
    stdio: "inherit",
  });
  console.log("✓ اترفع. الموقع هيتحدث بعد دقيقة تقريباً.");
}