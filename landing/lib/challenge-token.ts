import crypto from "crypto";
import type { ChallengePath } from "./challenges";

export type ChallengeTokenPayload = {
  userId: number;
  path: ChallengePath;
  day: number;
};

const algorithm = "aes-256-gcm";
const tokenVersion = "v1";

function getEncryptionKey(): Buffer {
  const secret = process.env.CHALLENGE_TOKEN_SECRET;

  if (!secret) {
    throw new Error(
      "Missing CHALLENGE_TOKEN_SECRET environment variable for challenge tokens.",
    );
  }

  return crypto.createHash("sha256").update(secret).digest();
}

function toBase64Url(buffer: Buffer): string {
  return buffer.toString("base64url");
}

function fromBase64Url(value: string): Buffer {
  return Buffer.from(value, "base64url");
}

function isChallengePath(path: unknown): path is ChallengePath {
  return path === "stability" || path === "saving" || path === "investing";
}

function validatePayload(payload: unknown): ChallengeTokenPayload {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid challenge token payload.");
  }

  const candidate = payload as Partial<ChallengeTokenPayload>;

  if (
    typeof candidate.userId !== "number" ||
    !Number.isInteger(candidate.userId) ||
    candidate.userId <= 0
  ) {
    throw new Error("Invalid challenge token user.");
  }

  if (!isChallengePath(candidate.path)) {
    throw new Error("Invalid challenge token path.");
  }

  if (
    typeof candidate.day !== "number" ||
    !Number.isInteger(candidate.day) ||
    candidate.day < 0
  ) {
    throw new Error("Invalid challenge token day.");
  }

  return {
    userId: candidate.userId,
    path: candidate.path,
    day: candidate.day,
  };
}

export function encryptChallengeToken(payload: ChallengeTokenPayload): string {
  const validPayload = validatePayload(payload);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, getEncryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(validPayload), "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    tokenVersion,
    toBase64Url(iv),
    toBase64Url(encrypted),
    toBase64Url(authTag),
  ].join(".");
}

export function decryptChallengeToken(token: string): ChallengeTokenPayload {
  const [version, ivValue, encryptedValue, authTagValue] = token.split(".");

  if (
    version !== tokenVersion ||
    !ivValue ||
    !encryptedValue ||
    !authTagValue
  ) {
    throw new Error("Invalid challenge token format.");
  }

  const decipher = crypto.createDecipheriv(
    algorithm,
    getEncryptionKey(),
    fromBase64Url(ivValue),
  );
  decipher.setAuthTag(fromBase64Url(authTagValue));

  const decrypted = Buffer.concat([
    decipher.update(fromBase64Url(encryptedValue)),
    decipher.final(),
  ]);

  return validatePayload(JSON.parse(decrypted.toString("utf8")));
}
