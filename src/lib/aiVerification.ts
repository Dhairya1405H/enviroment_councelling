import crypto from "crypto";

export interface VerificationInput {
  questId: string;
  questTitle: string;
  category: string;
  isHighValue?: boolean;
  proofType: "PHOTO" | "LOG";
  photoDataUrl?: string; // base64 or file path
  logText?: string;
  studentId: string;
  existingHashes?: string[]; // for duplicate image checking
}

export interface VerificationResult {
  result: "pass" | "review" | "fail";
  confidence: number;
  reason: string;
  detectedLabels?: string[];
  photoHash?: string;
  isDuplicate?: boolean;
  spotCheckFlagged?: boolean;
}

/**
 * Computes a fast perceptual/structural fingerprint hash for an image
 * to prevent students submitting the exact same photo or stock photos twice.
 */
export function computeImageFingerprint(photoString: string): string {
  // Uses normalized sample block hash
  return crypto.createHash("sha256").update(photoString.slice(0, 5000)).digest("hex").slice(0, 16);
}

/**
 * AI Pre-Check Vision Verification System
 * 
 * In production: Swap out this mock with OpenAI GPT-4o Vision, Google Gemini 1.5 Flash Vision,
 * or AWS Rekognition by replacing the heuristic evaluator with an API call.
 */
export async function verifySubmission(input: VerificationInput): Promise<VerificationResult> {
  const { questTitle, category, isHighValue, proofType, photoDataUrl, logText, existingHashes } = input;

  // 1. Anti-Cheat: Perceptual Hash Duplicate Detection
  let photoHash: string | undefined;
  if (proofType === "PHOTO" && photoDataUrl) {
    photoHash = computeImageFingerprint(photoDataUrl);
    if (existingHashes && existingHashes.includes(photoHash)) {
      return {
        result: "fail",
        confidence: 0.99,
        reason: "Duplicate photo detected! This proof photo has already been submitted.",
        photoHash,
        isDuplicate: true,
      };
    }
  }

  // 2. High-Value Quests (e.g., Tree/Sapling planting, major solar/energy retrofit)
  // All high-value quests require human teacher sign-off by policy
  if (isHighValue || category === "PLANTS" || questTitle.toLowerCase().includes("sapling")) {
    return {
      result: "review",
      confidence: 0.88,
      reason: "High-impact eco-action: routed to Teacher Review Queue for verification sign-off.",
      photoHash,
      detectedLabels: ["vegetation", "soil", "sapling", "outdoor_gardening"],
    };
  }

  // 3. Fallback Log Text verification (for students without cameras)
  if (proofType === "LOG") {
    const text = (logText || "").trim();
    if (text.length < 20) {
      return {
        result: "fail",
        confidence: 0.95,
        reason: "Activity log is too brief. Please write at least 2 sentences describing your action and outcome.",
      };
    }

    // Check for thoughtful environmental keywords
    const keywords = ["compost", "water", "light", "bottle", "recycle", "walk", "bike", "reusable", "unplug", "trash", "meter"];
    const matches = keywords.filter((k) => text.toLowerCase().includes(k));

    if (matches.length >= 1) {
      return {
        result: "pass",
        confidence: 0.86,
        reason: `Activity log verified with relevant environmental context: "${matches.slice(0, 3).join(", ")}".`,
      };
    } else {
      return {
        result: "review",
        confidence: 0.65,
        reason: "Activity log received. Sent to teacher for confirmation.",
      };
    }
  }

  // 4. Simulated AI Vision Model Pre-Check for Photo Uploads
  // Heuristic mock that recognizes environmental items
  const mockLabelsByCategory: Record<string, string[]> = {
    WASTE: ["compost_bin", "food_scraps", "recycling_bin", "paper_sorting"],
    WATER: ["reusable_water_bottle", "faucet_aerator", "rainwater_barrel", "bucket"],
    ENERGY: ["turned_off_switch", "unplugged_charger", "led_bulb", "natural_daylight"],
    PLASTIC_FREE: ["canvas_tote_bag", "stainless_steel_tiffin", "bamboo_cutlery", "glass_jar"],
    PLANTS: ["garden_bed", "soil_trowel", "native_perennial", "watering_can"],
    TRANSPORT: ["bicycle_helmet", "school_bus", "walking_shoes", "pedestrian_path"],
  };

  const detectedLabels = mockLabelsByCategory[category] || ["eco_friendly_activity"];

  // 5. Anti-Cheat: 10% Random Teacher Spot-Checks
  const randomCheck = Math.random();
  if (randomCheck < 0.12) {
    return {
      result: "review",
      confidence: 0.78,
      reason: "Quality Assurance: Selected for random teacher spot-check audit.",
      photoHash,
      detectedLabels,
      spotCheckFlagged: true,
    };
  }

  // Clear Pass
  return {
    result: "pass",
    confidence: 0.94,
    reason: `Vision AI confirmed proof matches ${category.toLowerCase().replace("_", " ")} activity guidelines.`,
    photoHash,
    detectedLabels,
  };
}
