import { describe, it, expect } from "vitest";
import { isValidEmail } from "../components/email";

describe("Email Validation Utility", () => {
  // Test valid email formats
  it("validates correct email addresses", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("test.user@domain.co.uk")).toBe(true);
    expect(isValidEmail("name+tag@company.org")).toBe(true);
  });

  // Test invalid email formats
  it("rejects invalid email addresses", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("notanemail")).toBe(false);
    expect(isValidEmail("@example.com")).toBe(false);
    expect(isValidEmail("user@")).toBe(false);
    expect(isValidEmail("user @example.com")).toBe(false);
  });

  // Test edge case: missing domain extension
  it("rejects emails without domain", () => {
    expect(isValidEmail("user@domain")).toBe(false);
  });

  // Test edge case: spaces in email
  it("rejects emails with spaces", () => {
    expect(isValidEmail("user name@example.com")).toBe(false);
  });
});
