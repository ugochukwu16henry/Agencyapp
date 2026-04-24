import { describe, expect, it } from "vitest";

import { assertRole, hasRole } from "@/lib/rbac";

describe("rbac guards", () => {
  it("allows role checks for included roles", () => {
    expect(hasRole("ADMIN", ["ADMIN"])).toBe(true);
    expect(hasRole("PARTNER", ["ADMIN"])).toBe(false);
  });

  it("throws on unauthorized roles", () => {
    expect(() => assertRole("USER", ["ADMIN"])).toThrowError("Unauthorized");
  });
});
