import { edges, nodes, passes } from "@/data/roads";
import type { Leg, Month, PassId, RoadEdge } from "@/types";

export interface Route {
  path: string[];
  edges: RoadEdge[];
  km: number;
  hours: number;
  passes: PassId[];
}

const adjacency = new Map<string, { to: string; edge: RoadEdge }[]>();
for (const edge of edges) {
  if (!adjacency.has(edge.from)) adjacency.set(edge.from, []);
  if (!adjacency.has(edge.to)) adjacency.set(edge.to, []);
  adjacency.get(edge.from)!.push({ to: edge.to, edge });
  adjacency.get(edge.to)!.push({ to: edge.from, edge });
}

export function getNode(id: string) {
  return nodes.find((n) => n.id === id);
}

export function getPass(id: PassId) {
  return passes.find((p) => p.id === id)!;
}

export function isPassOpen(id: PassId, month: Month | number) {
  return getPass(id).openMonths.includes(month as Month);
}

/**
 * Fastest route between two towns (Dijkstra on driving hours).
 * When `month` is given, roads over passes closed that month are skipped.
 * Returns null when no route exists.
 */
export function findRoute(from: string, to: string, month?: number): Route | null {
  if (from === to) return { path: [from], edges: [], km: 0, hours: 0, passes: [] };

  const dist = new Map<string, number>([[from, 0]]);
  const prev = new Map<string, { node: string; edge: RoadEdge }>();
  const visited = new Set<string>();

  while (true) {
    let current: string | null = null;
    let best = Infinity;
    for (const [node, d] of dist) {
      if (!visited.has(node) && d < best) {
        best = d;
        current = node;
      }
    }
    if (current === null) return null;
    if (current === to) break;
    visited.add(current);

    for (const { to: next, edge } of adjacency.get(current) ?? []) {
      if (month !== undefined && edge.pass && !isPassOpen(edge.pass, month)) continue;
      const candidate = best + edge.hours;
      if (candidate < (dist.get(next) ?? Infinity)) {
        dist.set(next, candidate);
        prev.set(next, { node: current, edge });
      }
    }
  }

  const path: string[] = [to];
  const routeEdges: RoadEdge[] = [];
  let cursor = to;
  while (cursor !== from) {
    const step = prev.get(cursor)!;
    routeEdges.unshift(step.edge);
    path.unshift(step.node);
    cursor = step.node;
  }

  return {
    path,
    edges: routeEdges,
    km: routeEdges.reduce((sum, e) => sum + e.km, 0),
    hours: routeEdges.reduce((sum, e) => sum + e.hours, 0),
    passes: routeEdges.flatMap((e) => (e.pass ? [e.pass] : [])),
  };
}

export function routeToLeg(route: Route): Leg {
  return {
    from: route.path[0],
    to: route.path[route.path.length - 1],
    km: route.km,
    hours: route.hours,
    roads: [...new Set(route.edges.map((e) => e.road))],
    passes: route.passes,
  };
}

/** Drive time from Islamabad in the best season, used for sorting and facts. */
export function hoursFromIslamabad(nodeId: string) {
  return findRoute("islamabad", nodeId)?.hours ?? 0;
}

export function kmFromIslamabad(nodeId: string) {
  return findRoute("islamabad", nodeId)?.km ?? 0;
}
