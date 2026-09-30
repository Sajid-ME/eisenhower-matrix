// suggest.ts — rule-based quadrant suggestion.
// Reads a task title and returns the best-guess quadrant, or null if unsure.
import type { QuadrantCode } from '../App';

// The suggestion result.
export type Suggestion = {
  quadrant: QuadrantCode;
  score: number;
  matched: string[]; // which keywords triggered the match
};

// Weighted keyword lists per quadrant.
// A Q1 keyword is worth 3 points, Q2/Q3 are worth 2, Q4 is worth 1.
// Higher weight = stronger signal. The quadrant with the highest total wins.
const KEYWORDS: Record<QuadrantCode, { weight: number; words: string[] }> = {
  Q1: {
    weight: 3,
    words: [
      'urgent', 'asap', 'deadline', 'today', 'now', 'immediately',
      'email', 'call', 'meeting', 'interview', 'exam', 'submit',
      'fix', 'bug', 'error', 'broken', 'crash',
      'reply', 'respond',
      'pay', 'bill', 'tax',
      'doctor', 'appointment', 'medicine',
      'boss', 'professor', 'manager', 'client',
    ],
  },
  Q2: {
    weight: 2,
    words: [
      'plan', 'planning', 'strategy', 'goal', 'roadmap',
      'study', 'learn', 'practice', 'read', 'research',
      'exercise', 'gym', 'workout', 'run', 'walk', 'yoga',
      'save', 'invest', 'budget', 'finance',
      'write', 'draft', 'design', 'build',
      'habit', 'routine', 'meditate', 'journal',
      'project', 'thesis', 'dissertation',
    ],
  },
  Q3: {
    weight: 2,
    words: [
      'invite', 'rsvp', 'coordinate',
      'forward', 'share', 'cc', 'bcc',
      'order', 'purchase', 'buy',
      'book', 'reserve', 'ticket',
      'remind', 'follow up', 'followup', 'follow-up',
      'delegate',
    ],
  },
  Q4: {
    weight: 1,
    words: [
      'scroll', 'browse', 'instagram', 'tiktok', 'facebook', 'twitter',
      'netflix', 'youtube', 'series', 'movie',
      'game', 'gaming',
      'snack',
      'procrastinate', 'waste',
    ],
  },
};

// The order we check quadrants when scores tie. Higher priority = earlier.
const PRIORITY: QuadrantCode[] = ['Q1', 'Q2', 'Q3', 'Q4'];

// Main entry point. Takes a task title, returns a suggestion or null.
export function suggestQuadrant(title: string): Suggestion | null {
  const text = title.toLowerCase().trim();
  if (!text) return null;

  // Tally scores per quadrant.
  const scores: Record<QuadrantCode, { score: number; matched: string[] }> = {
    Q1: { score: 0, matched: [] },
    Q2: { score: 0, matched: [] },
    Q3: { score: 0, matched: [] },
    Q4: { score: 0, matched: [] },
  };

  for (const code of PRIORITY) {
    const { weight, words } = KEYWORDS[code];
    for (const word of words) {
      if (text.includes(word)) {
        scores[code].score += weight;
        scores[code].matched.push(word);
      }
    }
  }

  // Find the quadrant with the highest score. Ties go to the higher-priority quadrant.
  let best: QuadrantCode | null = null;
  let bestScore = 0;
  for (const code of PRIORITY) {
    if (scores[code].score > bestScore) {
      bestScore = scores[code].score;
      best = code;
    }
  }

  if (!best || bestScore === 0) return null;

  return {
    quadrant: best,
    score: bestScore,
    matched: scores[best].matched,
  };
}

// Human-readable quadrant names, used by the UI.
export const QUADRANT_LABELS: Record<QuadrantCode, string> = {
  Q1: 'Do First',
  Q2: 'Schedule',
  Q3: 'Delegate',
  Q4: 'Avoid',
};