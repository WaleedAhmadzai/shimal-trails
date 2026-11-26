import { describe, expect, it } from "vitest";
import { destinations } from "@/data/destinations";
import {
  buildTripPlan,
  checkTrip,
  estimateCost,
  findRoute,
  parseSharedItinerary,
  planTrip,
  serializeItinerary,
} from "@/lib/itinerary";
import type { Itinerary } from "@/types";

const base: Itinerary = {
  startDate: "2027-07-10",
  startCity: "islamabad",
  travellers: 4,
  tier: "standard",
  stops: [],
};

describe("data", () => {
  it("has at least 15 destinations with unique slugs", () => {
    expect(destinations.length).toBeGreaterThanOrEqual(15);
    expect(new Set(destinations.map((d) => d.slug)).size).toBe(destinations.length);
  });

  it("gives every destination a credited photo", () => {
    for (const d of destinations) {
      expect(d.photo, d.slug).toBeDefined();
      expect(d.photo!.author.length, d.slug).toBeGreaterThan(0);
      expect(d.photo!.sourceUrl, d.slug).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
    }
  });

  it("keeps every summary within 160 characters", () => {
    for (const d of destinations) expect(d.summary.length).toBeLessThanOrEqual(160);
  });

  it("can route from Islamabad to every destination in its best month", () => {
    for (const d of destinations) {
      expect(findRoute("islamabad", d.nodeId, d.bestMonths[0]), d.slug).not.toBeNull();
    }
  });
});

describe("findRoute", () => {
  it("uses Babusar Pass in summer", () => {
    const route = findRoute("naran", "chilas", 7)!;
    expect(route.passes).toContain("babusar");
  });

  it("goes round by the Karakoram Highway when Babusar is closed", () => {
    const route = findRoute("naran", "chilas", 1)!;
    expect(route.passes).not.toContain("babusar");
    expect(route.path).toContain("besham");
  });

  it("finds no road to Khunjerab in January", () => {
    expect(findRoute("passu", "khunjerab", 1)).toBeNull();
  });
});

describe("buildTripPlan", () => {
  it("returns no days for an empty itinerary", () => {
    expect(buildTripPlan(base).days).toHaveLength(0);
  });

  it("splits the long drive to Hunza with a transit night", () => {
    const plan = buildTripPlan({ ...base, stops: [{ slug: "hunza-valley", nights: 2 }] });
    expect(plan.days[0].sleepAt).not.toBe("Hunza Valley");
    expect(plan.days.every((d) => d.driveHours <= 9 + 2)).toBe(true);
    expect(plan.days.at(-1)!.kind).toBe("return");
  });

  it("adds nights - 1 explore days at a stop", () => {
    const plan = buildTripPlan({ ...base, stops: [{ slug: "nathiagali", nights: 3 }] });
    expect(plan.days.filter((d) => d.kind === "explore")).toHaveLength(2);
    expect(plan.days).toHaveLength(4);
  });

  it("dates days from the start date", () => {
    const plan = buildTripPlan({ ...base, stops: [{ slug: "nathiagali", nights: 1 }] });
    expect(plan.days[1].date).toBe("2027-07-11");
  });
});

describe("checkTrip", () => {
  it("flags a destination closed in the trip month", () => {
    const it2 = { ...base, startDate: "2027-01-10", stops: [{ slug: "deosai-plains", nights: 1 }] };
    const warnings = checkTrip(it2, buildTripPlan(it2));
    expect(warnings.some((w) => w.id === "closed-deosai-plains" && w.severity === "error")).toBe(true);
  });

  it("warns about a big altitude jump to Deosai straight from the road", () => {
    const it2 = { ...base, stops: [{ slug: "skardu", nights: 0 }, { slug: "deosai-plains", nights: 1 }] };
    const warnings = checkTrip(it2, buildTripPlan(it2));
    expect(warnings.some((w) => w.id.startsWith("altitude"))).toBe(true);
  });

  it("does not warn on a gentle trip that stays below 3,000 m", () => {
    const it2 = { ...base, stops: [{ slug: "hunza-valley", nights: 2 }, { slug: "passu-gulmit", nights: 1 }] };
    const warnings = checkTrip(it2, buildTripPlan(it2));
    expect(warnings.some((w) => w.id.startsWith("altitude"))).toBe(false);
  });

  it("flags short notice", () => {
    const it2 = { ...base, stops: [{ slug: "nathiagali", nights: 1 }] };
    const warnings = checkTrip(it2, buildTripPlan(it2), "2027-07-09");
    expect(warnings.some((w) => w.id === "notice")).toBe(true);
  });
});

describe("estimateCost", () => {
  it("picks a Hiace for 5 travellers and adds a 10% buffer", () => {
    const it2 = { ...base, travellers: 5, stops: [{ slug: "nathiagali", nights: 1 }] };
    const cost = estimateCost(it2, buildTripPlan(it2));
    expect(cost.vehicle).toMatch(/Hiace/);
    expect(cost.buffer).toBe(Math.round((cost.stay + cost.transport + cost.food) * 0.1));
    expect(cost.perPerson).toBe(Math.round(cost.total / 5));
  });

  it("costs more at premium than economy", () => {
    const stops = [{ slug: "hunza-valley", nights: 3 }];
    const eco = planTrip({ ...base, tier: "economy", stops }).cost.total;
    const pre = planTrip({ ...base, tier: "premium", stops }).cost.total;
    expect(pre).toBeGreaterThan(eco);
  });
});

describe("share links", () => {
  it("round-trips an itinerary", () => {
    const it2: Itinerary = { ...base, stops: [{ slug: "skardu", nights: 2 }, { slug: "shigar-valley", nights: 1 }] };
    const parsed = parseSharedItinerary(new URLSearchParams(serializeItinerary(it2)))!;
    expect(parsed.itinerary).toEqual(it2);
    expect(parsed.skipped).toEqual([]);
  });

  it("skips unknown places and clamps nights", () => {
    const parsed = parseSharedItinerary(new URLSearchParams("plan=atlantis:2,skardu:99"))!;
    expect(parsed.skipped).toEqual(["atlantis"]);
    expect(parsed.itinerary.stops).toEqual([{ slug: "skardu", nights: 7 }]);
  });
});
