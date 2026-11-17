// ai-judge-rich-01: "Make the AI judge rich" (program/v1).
//
// This program writes one short plan to /output/entry.txt: the plan an AI
// agent would follow to turn $100, a computer with internet access and 30
// days into the most money, with no human doing the work. A judge reads two
// plans at a time and picks the one it would follow itself, so the plan
// below is written to be followed, not admired: a real service, real buyers,
// real prices, a day-one action, kill/scale rules and a cash reserve.
//
// The gate takes UTF-8 text of 1 to 1,000 characters (code points, line ends
// included) that is not only white space, and the judge reads exactly the
// bytes written, so this program writes the plan with no trailing line end
// and checks the length before writing. It runs twice with no network and
// both runs must write the same bytes: the plan is a fixed string, there is
// no clock, no randomness and no I/O besides the single write.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The plan, one line per step. Each line earns its place: what is sold, who
// pays, where buyers are found, the price, what happens on day one, how the
// money compounds, and the edge over a thousand agents selling the same gig.
const PLAN_LINES = [
  'Sell what buyers already pay for: Amazon listing rewrites — title, 5 bullets, description — $29, 24-hour delivery.',
  'Day 1: one-page site with a payment link, paid in advance. Find 50 sellers asking for listing help in forums and on X; send each a free rewritten bullet.',
  'Days 2-7: deliver within 24 hours, collect a review per buyer, post reviews on the site. List it on Fiverr and Upwork too. Target 2 orders a day by day 7; reinvest the first $100 in promoted listings.',
  'Days 8-21: scale the winner, kill the loser — the channel earning more per hour gets all the time. Add a $49 upsell: listing plus 7 backend keywords. Keep $40 reserve untouched.',
  'Days 22-30: raise the price to $39, run the best package 24/7, drop any channel under $10 an hour. Reconcile nightly. End day 30 all liquid in USDC — even at half pace, about $500, not a gamble.',
  'Edge: a thousand agents can sell the same gig — I win on speed and proof: a free sample before anyone pays, delivery while humans sleep.',
];

const PLAN = PLAN_LINES.join('\n');

// The gate counts Unicode code points, so count them that way, not bytes.
const lengthInCodePoints = [...PLAN].length;
if (lengthInCodePoints < 1 || lengthInCodePoints > 1000) {
  throw new Error(`plan must be 1 to 1,000 characters, got ${lengthInCodePoints}`);
}
if (PLAN.trim().length === 0) {
  throw new Error('plan must hold more than white space');
}

mkdirSync(OUTPUT_DIR, { recursive: true });
const target = join(OUTPUT_DIR, 'entry.txt');
writeFileSync(target, PLAN, 'utf8');

// Read it back and refuse to exit 0 unless the bytes on disk are exactly
// the plan: a run that writes the wrong bytes must fail loudly, never pass.
const written = readFileSync(target, 'utf8');
if (written !== PLAN) {
  throw new Error('entry.txt on disk does not match the plan');
}
