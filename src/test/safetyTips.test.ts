import { describe, it, expect } from 'vitest';
import { SAFETY_CARDS } from '../data/safetyTips';

describe('Safety Tips & Critical Knowledge Cards', () => {
  it('includes all critical safety areas required by pediatric guidelines', () => {
    const cardIds = SAFETY_CARDS.map((c) => c.id);
    expect(cardIds).toContain('prohibited-foods');
    expect(cardIds).toContain('trunk-support-sitting');
    expect(cardIds).toContain('choking-vs-gagging');
    expect(cardIds).toContain('main-food-milk');
    expect(cardIds).toContain('allergy-action-plan');
    expect(cardIds).toContain('three-day-rule-guide');
    expect(cardIds).toContain('privacy-and-data-security');
  });

  it('prohibits honey, salt, cow milk and raw eggs in prohibited-foods card', () => {
    const prohibitedCard = SAFETY_CARDS.find((c) => c.id === 'prohibited-foods');
    expect(prohibitedCard).toBeDefined();

    const text = prohibitedCard?.keyPoints.join(' ') || '';
    expect(text).toContain('Bal');
    expect(text).toContain('İnek Sütü');
    expect(text).toContain('Tuz');
    expect(text).toContain('Çiğ');
  });

  it('clearly explains choking versus gagging difference', () => {
    const chokingCard = SAFETY_CARDS.find((c) => c.id === 'choking-vs-gagging');
    expect(chokingCard).toBeDefined();

    const text = chokingCard?.keyPoints.join(' ') || '';
    expect(text).toContain('Öğürme');
    expect(text).toContain('Boğulma');
  });

  it('contains emergency instructions for severe allergy reactions', () => {
    const allergyCard = SAFETY_CARDS.find((c) => c.id === 'allergy-action-plan');
    expect(allergyCard?.emergencyNote).toContain('112');
  });
});
