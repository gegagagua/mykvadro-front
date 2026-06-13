import { describe, it, expect } from "vitest";
import bcrypt from "bcryptjs";
import {
  createToken,
  verifyToken,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";

describe("token create/verify", () => {
  it("round-trips a user id", () => {
    const token = createToken(42);
    expect(verifyToken(token)).toBe(42);
  });

  it("returns null for an empty string", () => {
    expect(verifyToken("")).toBeNull();
  });

  it("returns null for a malformed token (no dot)", () => {
    expect(verifyToken("notavalidtoken")).toBeNull();
  });

  it("returns null for a tampered signature (last char changed)", () => {
    const token = createToken(7);
    const last = token.slice(-1);
    const swapped = last === "a" ? "b" : "a";
    const tampered = token.slice(0, -1) + swapped;
    expect(verifyToken(tampered)).toBeNull();
  });

  it("returns null for a valid-looking payload with the wrong signature", () => {
    const token = createToken(99);
    const [payload] = token.split(".");
    const forged = `${payload}.${Buffer.from("not-the-real-signature").toString("base64url")}`;
    expect(verifyToken(forged)).toBeNull();
  });
});

describe("password hashing", () => {
  it("hashes a password that verifyPassword accepts and rejects wrong input", () => {
    const hash = hashPassword("s3cret!");
    expect(verifyPassword("s3cret!", hash)).toBe(true);
    expect(verifyPassword("wrong", hash)).toBe(false);
  });

  it("verifies a PHP/Laravel $2y$ prefixed hash via normalization", () => {
    const native = bcrypt.hashSync("password", 12);
    // bcryptjs produces $2b$ (or $2a$); rewrite the prefix to PHP's $2y$.
    const phpHash = "$2y$" + native.slice(4);
    expect(phpHash.startsWith("$2y$")).toBe(true);
    expect(verifyPassword("password", phpHash)).toBe(true);
  });
});
