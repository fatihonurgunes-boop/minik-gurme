import { describe, it, expect } from 'vitest';
import { FOOD_GUIDE_ITEMS, FOOD_CATEGORIES, MONTH_TABS } from '../data/foodGuideData';

describe('Food Guide Catalog & Pediatric Guidelines', () => {
  it('has comprehensive list of pediatric starter foods', () => {
    expect(FOOD_GUIDE_ITEMS.length).toBeGreaterThan(15);
  });

  it('categorizes foods with valid minimum months (6, 7, 8, 9, 12)', () => {
    const validMonths = [6, 7, 8, 9, 12];
    FOOD_GUIDE_ITEMS.forEach((food) => {
      expect(validMonths).toContain(food.minMonth);
      expect(food.name).toBeTruthy();
      expect(food.benefits).toBeTruthy();
      expect(food.allergyRisk).toMatch(/low|medium|high/);
    });
  });

  it('strictly marks 1-year prohibited foods with clear warning notes', () => {
    // Honey (Bal)
    const honey = FOOD_GUIDE_ITEMS.find((f) => f.id === 'bal');
    expect(honey).toBeDefined();
    expect(honey?.minMonth).toBe(12);
    expect(honey?.warningNote).toContain('1 YAŞ');
    expect(honey?.warningNote?.toLowerCase()).toContain('botulizm');

    // Cow milk (İnek Sütü)
    const cowMilk = FOOD_GUIDE_ITEMS.find((f) => f.id === 'inek-sutu');
    expect(cowMilk).toBeDefined();
    expect(cowMilk?.minMonth).toBe(12);
    expect(cowMilk?.warningNote).toContain('1 yaş');

    // Eggplant (Patlıcan)
    const eggplant = FOOD_GUIDE_ITEMS.find((f) => f.id === 'patlican-yasak');
    expect(eggplant).toBeDefined();
    expect(eggplant?.warningNote?.toLowerCase()).toContain('nikotin');
  });

  it('marks high allergy risk foods properly', () => {
    const eggYolk = FOOD_GUIDE_ITEMS.find((f) => f.id === 'yumurta-sarisi');
    expect(eggYolk?.allergyRisk).toBe('high');

    const nuts = FOOD_GUIDE_ITEMS.find((f) => f.id === 'ceviz-badem-tozu');
    expect(nuts?.allergyRisk).toBe('high');

    const fish = FOOD_GUIDE_ITEMS.find((f) => f.id === 'somon-baligi');
    expect(fish?.allergyRisk).toBe('high');
  });

  it('provides preparation and BLW tips for finger foods', () => {
    const carrot = FOOD_GUIDE_ITEMS.find((f) => f.id === 'havuc');
    expect(carrot?.preparationTip).toBeDefined();
    expect(carrot?.blwTip).toBeDefined();
  });
});
