import { describe, it, expect, vi, beforeEach } from "vitest";
import { createClient } from "../lib/supabase/client";
import { createBrowserClient } from "@supabase/ssr";

// Mock Supabase browser client for testing
vi.mock("@supabase/ssr", () => ({
  createBrowserClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
  })),
}));

describe("Supabase Client", () => {
  // Reset environment and mocks before each test
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
    vi.clearAllMocks();
  });

  it("creates a Supabase client", () => {
    const client = createClient();
    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
  });

  it("client has auth methods", () => {
    const client = createClient();
    expect(client.auth.getSession).toBeDefined();
    expect(client.auth.signInWithPassword).toBeDefined();
    expect(client.auth.signOut).toBeDefined();
  });

  it("uses environment variables", () => {
    createClient();
    expect(createBrowserClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "test-anon-key"
    );
  });
});
