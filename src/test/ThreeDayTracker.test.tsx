import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThreeDayTracker } from '../components/ThreeDayTracker';
import { FoodTrial } from '../types';

const mockTrials: FoodTrial[] = [
  {
    id: 'trial-havuc',
    foodName: 'Havuç',
    category: 'sebze',
    startDate: '2026-05-01',
    day1: { completed: true, date: '2026-05-01', amountNote: '1 çay kaşığı' },
    day2: { completed: true, date: '2026-05-02', amountNote: '1 tatlı kaşığı' },
    day3: { completed: false, date: '', amountNote: '1 yemek kaşığı' },
    reaction: 'none',
    enjoyment: 4,
    approvedSafe: false,
    notes: 'İlk deneme başarılı',
    createdAt: 1000,
  },
];

describe('ThreeDayTracker Component', () => {
  it('renders trial items and search bar', () => {
    const onSaveTrials = vi.fn();
    const onOpenSafetyGuide = vi.fn();

    render(
      <ThreeDayTracker
        trials={mockTrials}
        onSaveTrials={onSaveTrials}
        onOpenSafetyGuide={onOpenSafetyGuide}
      />
    );

    expect(screen.getAllByText('Havuç').length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText(/Besin adı veya not ara/i)).toBeInTheDocument();
  });

  it('triggers onSaveTrials when Day 3 is clicked', () => {
    const onSaveTrials = vi.fn();
    const onOpenSafetyGuide = vi.fn();

    render(
      <ThreeDayTracker
        trials={mockTrials}
        onSaveTrials={onSaveTrials}
        onOpenSafetyGuide={onOpenSafetyGuide}
      />
    );

    // Find the 3. Gün button
    const day3Buttons = screen.getAllByTitle(/3\. Gün: Bebeğe verildi ve yendi mi\?/i);
    expect(day3Buttons.length).toBeGreaterThan(0);

    fireEvent.click(day3Buttons[0]);

    expect(onSaveTrials).toHaveBeenCalledTimes(1);
    const updatedTrials = onSaveTrials.mock.calls[0][0] as FoodTrial[];
    expect(updatedTrials[0].day3.completed).toBe(true);
    // Since day 1, 2, and 3 are all completed with reaction 'none', approvedSafe should be true
    expect(updatedTrials[0].approvedSafe).toBe(true);
  });

  it('filters trials based on search input', () => {
    const onSaveTrials = vi.fn();
    const onOpenSafetyGuide = vi.fn();

    render(
      <ThreeDayTracker
        trials={mockTrials}
        onSaveTrials={onSaveTrials}
        onOpenSafetyGuide={onOpenSafetyGuide}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Besin adı veya not ara/i);
    fireEvent.change(searchInput, { target: { value: 'Balkabağı' } });

    // Havuç should be filtered out
    expect(screen.queryByText('Havuç')).not.toBeInTheDocument();
    expect(screen.getByText(/Kayıtlı Besin Bulunamadı/i)).toBeInTheDocument();
  });

  it('opens new food modal when "Yeni Besin Ekle" is clicked', () => {
    const onSaveTrials = vi.fn();
    const onOpenSafetyGuide = vi.fn();

    render(
      <ThreeDayTracker
        trials={mockTrials}
        onSaveTrials={onSaveTrials}
        onOpenSafetyGuide={onOpenSafetyGuide}
      />
    );

    const addButton = screen.getByRole('button', { name: /Yeni Besin Ekle/i });
    fireEvent.click(addButton);

    expect(screen.getByText('Yeni Besin Denemesi Başlat')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Örn: Havuç, Avokado, Yumurta Sarısı...')).toBeInTheDocument();
  });
});
