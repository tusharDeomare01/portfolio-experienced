/**
 * optimize-globe.mjs
 *
 * Optimizes src/data/globe.json for use as a decorative Three.js globe:
 *   1. Strips `properties` from each feature (replaced with {})
 *   2. Strips the root-level `crs` field
 *   3. Reduces coordinate precision to 1 decimal place (~11 km)
 *   4. Applies Douglas-Peucker simplification (tolerance 0.5 degrees)
 *   5. Writes compact JSON (no whitespace)
 */

import { readFileSync, writeFileSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const GLOBE_PATH = resolve(__dirname, "../src/data/globe.json");
const TOLERANCE = 0.5; // degrees
const PRECISION = 1; // decimal places

// ── Douglas-Peucker line simplification ─────────────────────────────────

function perpendicularDistance(P, A, B) {
  const dx = B[0] - A[0];
  const dy = B[1] - A[1];
  const lengthSq = dx * dx + dy * dy;

  if (lengthSq === 0) {
    const ex = P[0] - A[0];
    const ey = P[1] - A[1];
    return Math.sqrt(ex * ex + ey * ey);
  }

  const t = ((P[0] - A[0]) * dx + (P[1] - A[1]) * dy) / lengthSq;
  const clamped = Math.max(0, Math.min(1, t));
  const projX = A[0] + clamped * dx;
  const projY = A[1] + clamped * dy;
  const ex = P[0] - projX;
  const ey = P[1] - projY;
  return Math.sqrt(ex * ex + ey * ey);
}

function douglasPeucker(points, tolerance) {
  if (points.length <= 2) return points;

  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;

  const stack = [[0, points.length - 1]];

  while (stack.length > 0) {
    const [start, end] = stack.pop();
    let maxDist = 0;
    let maxIndex = start;

    for (let i = start + 1; i < end; i++) {
      const d = perpendicularDistance(points[i], points[start], points[end]);
      if (d > maxDist) {
        maxDist = d;
        maxIndex = i;
      }
    }

    if (maxDist > tolerance) {
      keep[maxIndex] = 1;
      if (maxIndex - start > 1) stack.push([start, maxIndex]);
      if (end - maxIndex > 1) stack.push([maxIndex, end]);
    }
  }

  const result = [];
  for (let i = 0; i < points.length; i++) {
    if (keep[i]) result.push(points[i]);
  }
  return result;
}

// ── Coordinate helpers ──────────────────────────────────────────────────

function roundCoord(coord) {
  return [
    parseFloat(coord[0].toFixed(PRECISION)),
    parseFloat(coord[1].toFixed(PRECISION)),
  ];
}

function simplifyRing(ring) {
  const simplified = douglasPeucker(ring, TOLERANCE);
  if (simplified.length < 4) {
    if (ring.length < 4) return ring.map(roundCoord);
    const third = Math.floor(ring.length / 3);
    return [
      roundCoord(ring[0]),
      roundCoord(ring[third]),
      roundCoord(ring[third * 2]),
      roundCoord(ring[0]),
    ];
  }
  return simplified.map(roundCoord);
}

function simplifyCoordinates(geometry) {
  switch (geometry.type) {
    case "Polygon":
      geometry.coordinates = geometry.coordinates.map(simplifyRing);
      break;
    case "MultiPolygon":
      geometry.coordinates = geometry.coordinates.map((polygon) =>
        polygon.map(simplifyRing)
      );
      break;
  }
  return geometry;
}

// ── Main ────────────────────────────────────────────────────────────────

const sizeBefore = statSync(GLOBE_PATH).size;
console.log("Before: " + (sizeBefore / 1024).toFixed(1) + " KB");

const geojson = JSON.parse(readFileSync(GLOBE_PATH, "utf-8"));

// 1. Strip root-level crs
delete geojson.crs;

// 2. Process each feature
for (const feature of geojson.features) {
  feature.properties = {};

  if (feature.geometry) {
    simplifyCoordinates(feature.geometry);
  }
}

// 3. Write compact JSON
const output = JSON.stringify(geojson);
writeFileSync(GLOBE_PATH, output, "utf-8");

const sizeAfter = statSync(GLOBE_PATH).size;
console.log("After:  " + (sizeAfter / 1024).toFixed(1) + " KB");
console.log(
  "Saved:  " + ((sizeBefore - sizeAfter) / 1024).toFixed(1) + " KB (" +
  (((sizeBefore - sizeAfter) / sizeBefore) * 100).toFixed(1) + "% reduction)"
);
