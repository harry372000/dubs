import { describe, it, expect } from "vitest";
import { SUPPORTED_LANGUAGES, JOB_STATUS_LABELS } from "@/lib/constants";
import type { JobStatus } from "@/lib/types";

describe("SUPPORTED_LANGUAGES", () => {
  it("has at least 13 supported (non-coming-soon) languages", () => {
    const supported = SUPPORTED_LANGUAGES.filter((l) => l.supported);
    expect(supported.length).toBeGreaterThanOrEqual(13);
  });

  it("every entry has a non-empty code, label, and boolean supported flag", () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(lang.code.length).toBeGreaterThan(0);
      expect(lang.label.length).toBeGreaterThan(0);
      expect(typeof lang.supported).toBe("boolean");
    }
  });

  it("all supported language codes are 2-letter lowercase strings", () => {
    const supported = SUPPORTED_LANGUAGES.filter((l) => l.supported);
    for (const lang of supported) {
      expect(lang.code).toMatch(/^[a-z]{2}$/);
    }
  });

  it("no two languages share the same code", () => {
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('contains Hindi with code "hi" marked as supported', () => {
    const hindi = SUPPORTED_LANGUAGES.find((l) => l.code === "hi");
    expect(hindi).toBeDefined();
    expect(hindi?.supported).toBe(true);
  });

  it('contains Spanish with code "es" marked as supported', () => {
    const spanish = SUPPORTED_LANGUAGES.find((l) => l.code === "es");
    expect(spanish).toBeDefined();
    expect(spanish?.supported).toBe(true);
  });

  it('contains French with code "fr" marked as supported', () => {
    expect(SUPPORTED_LANGUAGES.find((l) => l.code === "fr")?.supported).toBe(true);
  });

  it('contains Japanese with code "ja" marked as supported', () => {
    expect(SUPPORTED_LANGUAGES.find((l) => l.code === "ja")?.supported).toBe(true);
  });

  it('"Coming Soon" labels are only on unsupported entries', () => {
    const comingSoon = SUPPORTED_LANGUAGES.filter((l) => l.label.includes("Coming Soon"));
    expect(comingSoon.length).toBeGreaterThan(0);
    for (const lang of comingSoon) {
      expect(lang.supported).toBe(false);
    }
  });

  it("no supported language has a Coming Soon label", () => {
    const supported = SUPPORTED_LANGUAGES.filter((l) => l.supported);
    for (const lang of supported) {
      expect(lang.label).not.toContain("Coming Soon");
    }
  });
});

describe("JOB_STATUS_LABELS", () => {
  const allStatuses: JobStatus[] = ["pending", "dubbing", "done", "failed"];

  it("has a label for all four statuses", () => {
    for (const status of allStatuses) {
      expect(JOB_STATUS_LABELS[status]).toBeTruthy();
    }
  });

  it("all labels are non-empty strings", () => {
    for (const status of allStatuses) {
      expect(typeof JOB_STATUS_LABELS[status]).toBe("string");
      expect(JOB_STATUS_LABELS[status].length).toBeGreaterThan(0);
    }
  });

  it('"pending" label communicates a queued state', () => {
    expect(JOB_STATUS_LABELS["pending"].toLowerCase()).toMatch(/queue/);
  });

  it('"dubbing" label communicates in-progress state', () => {
    expect(JOB_STATUS_LABELS["dubbing"].toLowerCase()).toMatch(/dub|progress|working/);
  });

  it('"done" label communicates readiness', () => {
    expect(JOB_STATUS_LABELS["done"].toLowerCase()).toMatch(/ready|watch|done|complete/);
  });

  it('"failed" label communicates failure', () => {
    expect(JOB_STATUS_LABELS["failed"].toLowerCase()).toMatch(/fail|error/);
  });
});
