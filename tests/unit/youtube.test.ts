import { describe, it, expect } from "vitest";
import { extractVideoId, getThumbnailUrl } from "@/lib/youtube";

describe("extractVideoId", () => {
  // ── Standard watch URLs ──────────────────────────────────────────────────
  it("extracts ID from standard watch URL", () => {
    expect(extractVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts ID from watch URL without www", () => {
    expect(extractVideoId("https://youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts ID from watch URL with extra query params (timestamp, playlist)", () => {
    expect(
      extractVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s&list=PL123ABC")
    ).toBe("dQw4w9WgXcQ");
  });

  it("extracts ID when v param is not first in query string", () => {
    expect(
      extractVideoId("https://www.youtube.com/watch?list=PL123&v=dQw4w9WgXcQ")
    ).toBe("dQw4w9WgXcQ");
  });

  // ── Short URLs ───────────────────────────────────────────────────────────
  it("extracts ID from youtu.be short URL", () => {
    expect(extractVideoId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts ID from youtu.be URL with ?si tracking param", () => {
    expect(extractVideoId("https://youtu.be/dQw4w9WgXcQ?si=abc123XYZ")).toBe("dQw4w9WgXcQ");
  });

  // ── Shorts ───────────────────────────────────────────────────────────────
  it("extracts ID from YouTube Shorts URL", () => {
    expect(extractVideoId("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  // ── Embed URLs ───────────────────────────────────────────────────────────
  it("extracts ID from embed URL", () => {
    expect(extractVideoId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  // ── Special characters in IDs ────────────────────────────────────────────
  it("handles IDs with underscores and hyphens", () => {
    expect(extractVideoId("https://www.youtube.com/watch?v=a_b-cDe1234")).toBe("a_b-cDe1234");
  });

  // ── Invalid inputs ───────────────────────────────────────────────────────
  it("returns null for a Vimeo URL", () => {
    expect(extractVideoId("https://vimeo.com/123456789")).toBeNull();
  });

  it("returns null for a plain string", () => {
    expect(extractVideoId("not a url at all")).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(extractVideoId("")).toBeNull();
  });

  it("returns null for a YouTube URL with no video ID", () => {
    expect(extractVideoId("https://www.youtube.com/watch")).toBeNull();
  });

  it("returns null for a YouTube URL with an ID shorter than 11 characters", () => {
    expect(extractVideoId("https://www.youtube.com/watch?v=short")).toBeNull();
  });

  it("returns null for a YouTube URL with an ID longer than 11 characters", () => {
    // The URL parser's searchParams.get("v") returns the full value "dQw4w9WgXcQx"
    // which fails the /^[a-zA-Z0-9_-]{11}$/ check — correctly returns null
    expect(extractVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQx")).toBeNull();
  });

  it("returns null for a random HTTPS URL that is not YouTube", () => {
    expect(extractVideoId("https://example.com/watch?v=dQw4w9WgXcQ")).toBeNull();
  });

  it("returns null for a YouTube channel URL", () => {
    expect(extractVideoId("https://www.youtube.com/@SomeChannel")).toBeNull();
  });
});

describe("getThumbnailUrl", () => {
  it("returns the hqdefault thumbnail URL for a video ID", () => {
    expect(getThumbnailUrl("dQw4w9WgXcQ")).toBe(
      "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
    );
  });

  it("includes the video ID verbatim in the URL", () => {
    const id = "a_b-cDe1234";
    expect(getThumbnailUrl(id)).toContain(id);
  });
});
