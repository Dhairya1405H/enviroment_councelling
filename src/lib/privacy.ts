import fs from "fs";
import path from "path";

/**
 * Child Privacy Photo Management
 * 
 * In accordance with school student privacy protections (FERPA / COPPA / GDPR-K),
 * student proof images are strictly temporary verification tokens.
 * Upon successful verification by AI or teacher approval, the raw photograph file
 * is scheduled for deletion / purged from the local disk, retaining only the verification
 * cryptographic audit hash and completion metadata.
 */

export async function purgeStudentProofPhoto(photoUrl: string | null): Promise<boolean> {
  if (!photoUrl) return false;

  try {
    // Only purge uploaded local files in /uploads/
    if (photoUrl.startsWith("/uploads/")) {
      const filename = path.basename(photoUrl);
      const filePath = path.join(process.cwd(), "public", "uploads", filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
    }
  } catch (err) {
    console.error("Failed to safely delete verified proof photo:", err);
  }
  return false;
}
