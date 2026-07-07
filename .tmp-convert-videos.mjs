import { readdirSync, statSync, mkdirSync, renameSync, unlinkSync } from "fs";
import { join, extname, dirname, basename } from "path";
import { execFileSync } from "child_process";

const ROOT = process.argv[2] || "public/assets";
const VIDEO_EXT = new Set([".mp4", ".mov"]);
const MAX_WIDTH = 1920;

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else if (VIDEO_EXT.has(extname(entry).toLowerCase())) acc.push(full);
  }
  return acc;
}

const files = walk(ROOT);
console.log(`Found ${files.length} video files under ${ROOT}`);

let ok = 0;
let fail = 0;
let totalBefore = 0;
let totalAfter = 0;

// cap the long edge at MAX_WIDTH regardless of orientation, never upscale
const scaleFilter = `scale=w='if(gt(iw,ih),min(${MAX_WIDTH},iw),-2)':h='if(gt(iw,ih),-2,min(${MAX_WIDTH},ih))'`;

for (const file of files) {
  const ext = extname(file);
  const dir = dirname(file);
  const base = basename(file, ext);
  const mp4Out = join(dir, `${base}.mp4`);
  const webmOut = join(dir, `${base}.webm`);
  const mp4Tmp = join(dir, `${base}.tmp.mp4`);

  try {
    const before = statSync(file).size;
    mkdirSync(dir, { recursive: true });

    // H.264 MP4 (broad compatibility)
    execFileSync(
      "ffmpeg",
      [
        "-y",
        "-i", file,
        "-vf", scaleFilter,
        "-c:v", "libx264",
        "-crf", "26",
        "-preset", "medium",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        mp4Tmp,
      ],
      { stdio: "pipe" }
    );

    // AV1 WebM (smaller, modern browsers)
    execFileSync(
      "ffmpeg",
      [
        "-y",
        "-i", file,
        "-vf", scaleFilter,
        "-c:v", "libsvtav1",
        "-crf", "34",
        "-preset", "8",
        "-c:a", "libopus",
        "-b:a", "96k",
        webmOut,
      ],
      { stdio: "pipe" }
    );

    // swap tmp into place (source and mp4Out may be the same path)
    if (ext.toLowerCase() === ".mov") unlinkSync(file);
    renameSync(mp4Tmp, mp4Out);

    const after = statSync(mp4Out).size + statSync(webmOut).size;
    totalBefore += before;
    totalAfter += after;
    ok++;
    console.log(
      `OK  ${file} (${(before / 1024 / 1024).toFixed(1)}MB -> mp4+webm ${(after / 1024 / 1024).toFixed(1)}MB)`
    );
  } catch (e) {
    fail++;
    console.error(`FAIL ${file}: ${e.message}`);
  }
}

console.log(`\nDone. ${ok} converted, ${fail} failed.`);
console.log(
  `Total: ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB`
);
