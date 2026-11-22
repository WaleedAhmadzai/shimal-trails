// Automated test for Rule 1 (capacity). Run with:  npm test   (node --test)
// It imports the SAME function the React app uses in BookingPanel and planValidation.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkTravellerCount, MAX_TRAVELLERS_PER_BOOKING } from './travellerLimit.js';

test('accepts an ordinary valid group (3 travellers, 10 seats left)', () => {
  const result = checkTravellerCount(3, 10);
  assert.equal(result.ok, true);
  assert.equal(result.code, 'OK');
  assert.equal(result.max, 8);
});

test('accepts exactly the booking limit of 8 travellers', () => {
  assert.equal(MAX_TRAVELLERS_PER_BOOKING, 8);
  const result = checkTravellerCount(8, 20);
  assert.equal(result.ok, true);
});

test('rejects 9 travellers, one above the booking limit', () => {
  const result = checkTravellerCount(9, 20);
  assert.equal(result.ok, false);
  assert.equal(result.code, 'ABOVE_BOOKING_LIMIT');
  assert.match(result.message, /up to 8 travellers/);
});

test('accepts travellers exactly equal to the seats left (5 of 5)', () => {
  assert.equal(checkTravellerCount(5, 5).ok, true);
});

test('rejects more travellers than seats left (6 with 5 seats)', () => {
  const result = checkTravellerCount(6, 5);
  assert.equal(result.ok, false);
  assert.equal(result.code, 'NOT_ENOUGH_SEATS');
  assert.equal(result.max, 5);
});

test('rejects 0 travellers, below the minimum of 1', () => {
  assert.equal(checkTravellerCount(0, 10).code, 'BELOW_MINIMUM');
});

test('rejects any booking on a sold-out departure', () => {
  assert.equal(checkTravellerCount(1, 0).code, 'SOLD_OUT');
});
