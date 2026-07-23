import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(request, { params }) {
  const { filename } = await params;

  // Basic security: only allow .html files, no path traversal
  if (!filename || !filename.endsWith(".html") || filename.includes("..") || filename.includes("/")) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const filePath = path.join(process.cwd(), "data", "landings", filename);
    const html = await readFile(filePath, "utf-8");
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new NextResponse("Landing no encontrada", { status: 404 });
  }
}
