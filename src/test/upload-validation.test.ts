import { describe, expect, it } from "vitest";
import { MAX_FILE_BYTES, storedNameSchema, validateUpload } from "@/lib/upload-validation";

describe("Document upload validation", () => {
  it.each([
    ["document.pdf", "application/pdf", [37, 80, 68, 70, 45]],
    ["photo.jpg", "image/jpeg", [255, 216, 255]],
    ["photo.jpeg", "image/jpeg", [255, 216, 255]],
    ["photo.png", "image/png", [137, 80, 78, 71, 13, 10, 26, 10]],
    ["photo.webp", "image/webp", [82, 73, 70, 70, 0, 0, 0, 0, 87, 69, 66, 80]],
  ])("accepts %s with its matching signature", (name, type, header) => {
    expect(validateUpload({ name, type, size: 100 }, new Uint8Array(header))).toBeNull();
  });
  it("rejects executable files", () => {
    expect(validateUpload({ name: "file.exe", type: "application/octet-stream", size: 100 })).not.toBeNull();
  });
  it("rejects mismatched extensions", () => {
    expect(validateUpload({ name: "photo.pdf", type: "image/png", size: 100 })).not.toBeNull();
  });
  it("rejects renamed invalid file content", () => {
    expect(validateUpload({ name: "photo.png", type: "image/png", size: 100 }, new TextEncoder().encode("not a photo"))).not.toBeNull();
  });
  it("allows 10 MB but rejects anything larger", () => {
    expect(MAX_FILE_BYTES).toBe(10485760);
    expect(validateUpload({ name: "file.pdf", type: "application/pdf", size: 10485760 })).toBeNull();
    expect(validateUpload({ name: "file.pdf", type: "application/pdf", size: 10485761 })).not.toBeNull();
  });
  it("rejects empty files", () => {
    expect(validateUpload({ name: "file.pdf", type: "application/pdf", size: 0 })).not.toBeNull();
  });
  it("rejects path traversal in stored names", () => {
    expect(storedNameSchema.safeParse("../other/file.pdf").success).toBe(false);
    expect(storedNameSchema.safeParse("00000000-0000-0000-0000-000000000000--file.pdf").success).toBe(true);
  });
});