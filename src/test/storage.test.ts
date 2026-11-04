import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateAge,
  formatTurkishDate,
  getTodayDateString,
  loadBabyProfile,
  saveBabyProfile,
  loadFoodTrials,
  saveFoodTrials,
  loadDailyMeals,
  saveDailyMeals,
  INITIAL_PROFILE,
  INITIAL_TRIALS,
} from '../utils/storage';
import { BabyProfile, FoodTrial, DailyMealPlan } from '../types';

describe('Storage & Age Calculation Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('calculateAge', () => {
    it('calculates age in months and days for valid birthdate', () => {
      // 6 months ago
      const d = new Date();
      d.setMonth(d.getMonth() - 6);
      d.setDate(d.getDate() - 10);
      const birthDateStr = d.toISOString().split('T')[0];

      const age = calculateAge(birthDateStr);
      expect(age.months).toBe(6);
      expect(age.days).toBeGreaterThanOrEqual(9);
      expect(age.days).toBeLessThanOrEqual(11);
      expect(age.totalDays).toBeGreaterThan(180);
    });

    it('handles empty or invalid date gracefully without throwing', () => {
      const defaultAge = calculateAge('');
      expect(defaultAge.months).toBe(6);
      expect(defaultAge.days).toBe(0);

      const invalidAge = calculateAge('invalid-date');
      expect(invalidAge.months).toBe(6);
      expect(invalidAge.days).toBe(0);
    });

    it('returns today date in YYYY-MM-DD format', () => {
      const today = getTodayDateString();
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('formatTurkishDate', () => {
    it('formats date strings in Turkish format', () => {
      const formatted = formatTurkishDate('2026-05-15');
      expect(formatted).toContain('2026');
      expect(formatted).toContain('15');
      // Turkish month for May is Mayıs
      expect(formatted).toContain('Mayıs');
    });

    it('handles empty input gracefully', () => {
      expect(formatTurkishDate('')).toBe('');
    });
  });

  describe('Baby Profile LocalStorage', () => {
    it('loads default INITIAL_PROFILE when storage is empty', () => {
      const profile = loadBabyProfile();
      expect(profile.name).toBe(INITIAL_PROFILE.name);
      expect(profile.avatar).toBe(INITIAL_PROFILE.avatar);
    });

    it('saves and retrieves updated baby profile', () => {
      const customProfile: BabyProfile = {
        name: 'Zeynep Bebek',
        birthDate: '2026-01-10',
        avatar: '👧',
        allergiesNote: 'Hafif süt hassasiyeti',
      };

      saveBabyProfile(customProfile);
      const retrieved = loadBabyProfile();
      expect(retrieved.name).toBe('Zeynep Bebek');
      expect(retrieved.avatar).toBe('👧');
      expect(retrieved.allergiesNote).toBe('Hafif süt hassasiyeti');
    });
  });

  describe('Food Trials LocalStorage', () => {
    it('loads initial trials when localStorage is empty', () => {
      const trials = loadFoodTrials();
      expect(trials.length).toBeGreaterThan(0);
      expect(trials[0].foodName).toBeDefined();
    });

    it('saves and loads custom food trials', () => {
      const customTrials: FoodTrial[] = [
        {
          id: 'test-havuc',
          foodName: 'Organik Havuç',
          category: 'sebze',
          startDate: '2026-04-01',
          day1: { completed: true, date: '2026-04-01' },
          day2: { completed: true, date: '2026-04-02' },
          day3: { completed: true, date: '2026-04-03' },
          reaction: 'none',
          enjoyment: 5,
          approvedSafe: true,
          createdAt: Date.now(),
        },
      ];

      saveFoodTrials(customTrials);
      const loaded = loadFoodTrials();
      expect(loaded.length).toBe(1);
      expect(loaded[0].foodName).toBe('Organik Havuç');
      expect(loaded[0].approvedSafe).toBe(true);
    });
  });

  describe('Daily Meals LocalStorage', () => {
    it('saves and retrieves daily meal logs including water and milk counters', () => {
      const sampleMeals: Record<string, DailyMealPlan> = {
        '2026-04-15': {
          date: '2026-04-15',
          breakfast: {
            menu: 'Yumurta sarısı ve lor peyniri',
            eaten: true,
            consumptionRate: 'full',
            notes: 'İştahla bitirdi',
          },
          lunch: {
            menu: 'Kabak püresi',
            eaten: true,
            consumptionRate: 'half',
            notes: '',
          },
          dinner: {
            menu: 'İrmik lapası',
            eaten: false,
            consumptionRate: 'none',
            notes: '',
          },
          snack: {
            menu: 'Muz ezmesi',
            eaten: true,
            consumptionRate: 'full',
            notes: '',
          },
          waterIntakeMl: 90,
          breastmilkOrFormulaCount: 5,
        },
      };

      saveDailyMeals(sampleMeals);
      const retrieved = loadDailyMeals();
      expect(retrieved['2026-04-15']).toBeDefined();
      expect(retrieved['2026-04-15'].breakfast.eaten).toBe(true);
      expect(retrieved['2026-04-15'].waterIntakeMl).toBe(90);
      expect(retrieved['2026-04-15'].breastmilkOrFormulaCount).toBe(5);
    });
  });
});
