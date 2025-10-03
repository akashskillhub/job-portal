import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "resumes");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// PDF file signature validation
const PDF_SIGNATURES = [
  Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d]), // %PDF-
];

/**
 * Validates if a buffer contains a valid PDF file signature
 */
function validatePDFSignature(buffer: Buffer): boolean {
  // Check if buffer starts with %PDF-
  for (const signature of PDF_SIGNATURES) {
    if (buffer.slice(0, signature.length).equals(signature)) {
      return true;
    }
  }
  return false;
}

/**
 * Validates if a buffer contains a valid PDF structure
 */
function validatePDFStructure(buffer: Buffer): boolean {
  const content = buffer.toString("latin1");

  // Check for PDF header
  if (!content.startsWith("%PDF-")) {
    return false;
  }

  // Check for EOF marker
  if (!content.includes("%%EOF")) {
    return false;
  }

  // Check for xref table or cross-reference stream
  if (!content.includes("xref") && !content.includes("/Type /XRef")) {
    return false;
  }

  return true;
}

export async function saveResume(file: File, studentId: string): Promise<string> {
  // Validate file type by MIME type
  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed");
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size must be less than 5MB");
  }

  // Convert file to buffer for validation
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Validate PDF file signature
  if (!validatePDFSignature(buffer)) {
    throw new Error("Invalid PDF file: File signature does not match PDF format");
  }

  // Validate PDF structure
  if (!validatePDFStructure(buffer)) {
    throw new Error("Invalid PDF file: File structure is corrupted or invalid");
  }

  // Create upload directory if it doesn't exist
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }

  // Generate unique filename
  const timestamp = Date.now();
  const filename = `${studentId}-${timestamp}.pdf`;
  const filepath = path.join(UPLOAD_DIR, filename);

  // Save file
  await writeFile(filepath, buffer);

  // Return public URL
  return `/uploads/resumes/${filename}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}