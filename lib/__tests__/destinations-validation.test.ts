import { describe, expect, it } from "vitest";
import {
  EMPTY_FILTERS,
  filtersToQuery,
  parseFilters,
  queryDestinations,
  suggestRelaxations,
} from "@/lib/destinations";
import { EMPTY_REQUEST, isPakistaniMobile, validateTripRequest } from "@/lib/validation";

describe("destination search", () => {
  it("finds Saif-ul-Malook by any spelling", () => {
    for (const q of ["saiful muluk", "Saif ul Malook", "saif-ul-malook"]) {
      expect(queryDestinations({ ...EMPTY_FILTERS, q }).map((d) => d.slug)).toContain("saif-ul-malook");
    }
  });

  it("filters by region and month together", () => {
    const result = queryDestinations({ ...EMPTY_FILTERS, region: "gilgit-baltistan", month: 8 });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((d) => d.region === "gilgit-baltistan" && d.bestMonths.includes(8))).toBe(true);
  });

  it("sorts highest first", () => {
    const result = queryDestinations({ ...EMPTY_FILTERS, sort: "altitude" });
    expect(result[0].slug).toBe("khunjerab-pass");
  });
  
  it("sorts lowest altitude first", () => {
    const result = queryDestinations({ ...EMPTY_FILTERS, sort: "lowest" });
    for (let i = 1; i < result.length; i++) {
      expect(result[i].altitudeM).toBeGreaterThanOrEqual(result[i - 1].altitudeM);
    }
  });

  it("suggests which filter to remove when nothing matches", () => {
    const f = { ...EMPTY_FILTERS, q: "hunza", region: "azad-kashmir" as const };
    expect(queryDestinations(f)).toHaveLength(0);
    expect(suggestRelaxations(f).map((s) => s.key)).toContain("region");
  });

  it("parses and rebuilds the URL, dropping bad values", () => {
    const f = parseFilters({ q: "lake", month: "13", region: "mars", sort: "altitude", family: "1" });
    expect(f).toMatchObject({ q: "lake", month: 0, region: "", sort: "altitude", family: true });
    expect(filtersToQuery(f)).toBe("?q=lake&family=1&sort=altitude");
  });
});

describe("trip request validation", () => {
  const today = "2026-11-26";
  const valid = {
    ...EMPTY_REQUEST,
    fullName: "Ayesha Khan",
    mobile: "0300 1234567",
    email: "ayesha@example.com",
    startDate: "2026-12-10",
    tier: "standard" as const,
    agree: true,
  };

  it("accepts a complete form", () => {
    expect(validateTripRequest(valid, today)).toEqual({});
  });

  it("reports every missing field on an empty form", () => {
    const errors = validateTripRequest(EMPTY_REQUEST, today);
    expect(Object.keys(errors).sort()).toEqual(["agree", "email", "fullName", "mobile", "startDate", "tier"]);
  });

  it("accepts Pakistani mobile formats", () => {
    expect(isPakistaniMobile("+92 300 1234567")).toBe(true);
    expect(isPakistaniMobile("0300-1234567")).toBe(true);
    expect(isPakistaniMobile("12345")).toBe(false);
  });

  it("needs 3 days' notice, exactly 3 is fine", () => {
    expect(validateTripRequest({ ...valid, startDate: "2026-11-28" }, today).startDate).toBeDefined();
    expect(validateTripRequest({ ...valid, startDate: "2026-11-29" }, today).startDate).toBeUndefined();
  });

  it("needs a place when pickup is Other", () => {
    expect(validateTripRequest({ ...valid, pickupCity: "Other" }, today).pickupOther).toBeDefined();
  });
});
