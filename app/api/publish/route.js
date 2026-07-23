import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

function toSlug(name) {
  return (name || "landing")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

export async function POST(request) {
  try {
    const { html, name, landingId, prevFilename } = await request.json();

    const slug = toSlug(name);
    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const filename = `${slug}-${date}-${landingId}.html`;

    const dir = path.join(process.cwd(), "public", "landing");
    await mkdir(dir, { recursive: true });

    // Remove previous file if name or date changed
    if (prevFilename && prevFilename !== filename) {
      const prev = path.join(dir, prevFilename);
      if (existsSync(prev)) await unlink(prev).catch(() => {});
    }

    await writeFile(path.join(dir, filename), html, "utf-8");

    return NextResponse.json({ success: true, filename, url: `/landing/${filename}` });
  } catch (e) {
    console.error("publish error:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
