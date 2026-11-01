import React, { useState } from 'react';
import { FoodCategory, FoodTrial, GuideFood } from '../types';
import { FOOD_CATEGORIES, FOOD_GUIDE_ITEMS, MONTH_TABS } from '../data/foodGuideData';
import { getTodayDateString } from '../utils/storage';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Plus,
  Info,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Check,
  X,
} from 'lucide-react';

interface FoodGuideProps {
  trials: FoodTrial[];
  onAddTrialFromGuide: (newTrial: FoodTrial) => void;
  onNavigateToTracker: () => void;
  babyCurrentMonths: number;
}

export const FoodGuide: React.FC<FoodGuideProps> = ({
  trials,
  onAddTrialFromGuide,
  onNavigateToTracker,
  babyCurrentMonths,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFoodDetail, setActiveFoodDetail] = useState<GuideFood | null>(null);

  // Helper to determine trial status for a food item
  const getTrialStatusForFood = (foodName: string) => {
    const existing = trials.find(
      (t) => t.foodName.toLowerCase().trim() === foodName.toLowerCase().trim()
    );
    if (!existing) return null;
    return existing;
  };

  // Filter items
  const filteredFoods = FOOD_GUIDE_ITEMS.filter((food) => {
    // Month filter
    if (selectedMonth !== 'all') {
      const monthNum = parseInt(selectedMonth, 10);
      if (monthNum === 6 && food.minMonth !== 6) return false;
      if (monthNum === 7 && food.minMonth !== 7) return false;
      if (monthNum === 8 && food.minMonth !== 8) return false;
      if (monthNum === 9 && food.minMonth !== 9) return false;
      if (monthNum === 12 && food.minMonth !== 12) return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && food.category !== selectedCategory) {
      return false;
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = food.name.toLowerCase().includes(q);
      const matchBen = food.benefits.toLowerCase().includes(q);
      const matchPrep = food.preparationTip ? food.preparationTip.toLowerCase().includes(q) : false;
      if (!matchName && !matchBen && !matchPrep) return false;
    }

    return true;
  });

  // Handle direct addition to 3-day trial
  const handleQuickAddToTrial = (food: GuideFood) => {
    const newTrial: FoodTrial = {
      id: 'trial-' + Date.now(),
      foodName: food.name,
      category: food.category,
      startDate: getTodayDateString(),
      day1: { completed: false, date: getTodayDateString(), amountNote: '1 çay kaşığı tadım' },
      day2: { completed: false, date: '', amountNote: '1 tatlı kaşığı' },
      day3: { completed: false, date: '', amountNote: '1 yemek kaşığı' },
      reaction: 'none',
      enjoyment: 3,
      approvedSafe: false,
      notes: food.preparationTip ? `Hazırlık: ${food.preparationTip.slice(0, 70)}...` : '',
      createdAt: Date.now(),
    };

    onAddTrialFromGuide(newTrial);
    onNavigateToTracker();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 text-stone-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">🥗</span>
              <h2 className="text-lg font-bold font-heading text-stone-900">
                Ay Ay Güvenli Gıda Rehberi
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300/60">
                Pediatri Uyumlu
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              Bebeğinizin ayına uygun sebze, meyve, yoğurt/peynir ve proteinleri keşfedin.
              Tek tıkla <strong>"3 Gün Kuralına Ekle"</strong> butonunu kullanarak tadım takvimini başlatın.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 bg-white/80 backdrop-blur-xs px-3 py-2 rounded-xl border border-emerald-200 text-xs">
            <span className="text-emerald-700 font-semibold">Bebeğinizin Ayı:</span>
            <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold rounded-lg">
              {babyCurrentMonths}. Ay
            </span>
            <button
              onClick={() => setSelectedMonth(String(Math.min(12, Math.max(6, babyCurrentMonths))))}
              className="text-stone-600 hover:text-emerald-800 underline underline-offset-2 ml-1 cursor-pointer font-medium"
            >
              Filtrele
            </button>
          </div>
        </div>
      </div>

      {/* Month Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {MONTH_TABS.map((tab) => {
          const isActive = selectedMonth === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedMonth(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white hover:bg-stone-50 text-stone-600 border-stone-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search and Category Filter */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {FOOD_CATEGORIES.map((cat) => {
            const isCatActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                  isCatActive
                    ? 'bg-stone-800 text-white border-stone-800'
                    : 'bg-white hover:bg-stone-50 text-stone-600 border-stone-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Besin veya fayda ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Food Cards Grid */}
      {filteredFoods.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-2">
          <p className="text-stone-600 text-sm">Arama kriterlerinize uygun besin bulunamadı.</p>
          <button
            onClick={() => {
              setSelectedMonth('all');
              setSelectedCategory('all');
              setSearchTerm('');
            }}
            className="text-xs text-emerald-700 underline font-semibold cursor-pointer"
          >
            Filtreleri Temizle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFoods.map((food) => {
            const existingTrial = getTrialStatusForFood(food.name);
            const isSafe = existingTrial?.approvedSafe;
            const hasReaction = existingTrial && existingTrial.reaction !== 'none';
            const inProgress = existingTrial && !isSafe && !hasReaction;

            return (
              <div
                key={food.id}
                className="bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Age & Allergy Header */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl p-1.5 bg-stone-50 rounded-2xl group-hover:scale-110 transition-transform">
                        {food.icon}
                      </span>
                      <div>
                        <h3 className="font-bold text-stone-900 text-base flex items-center gap-1.5">
                          <span>{food.name}</span>
                          {food.minMonth === 12 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">
                              12+ Ay
                            </span>
                          )}
                        </h3>
                        <span className="text-xs text-stone-500 font-medium">
                          {food.minMonth}. Aydan itibaren
                        </span>
                      </div>
                    </div>

                    {/* Allergy Risk Badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        food.allergyRisk === 'high'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : food.allergyRisk === 'medium'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {food.allergyRisk === 'high'
                        ? 'Yüksek Alerjen'
                        : food.allergyRisk === 'medium'
                        ? 'Orta Risk'
                        : 'Düşük Risk'}
                    </span>
                  </div>

                  {/* Warning if any */}
                  {food.warningNote && (
                    <div className="mb-2.5 p-2 rounded-xl bg-rose-50 border border-rose-200/80 text-[11px] text-rose-700 flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600" />
                      <span className="leading-tight">{food.warningNote}</span>
                    </div>
                  )}

                  {/* Benefits */}
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
                    {food.benefits}
                  </p>

                  {/* Preparation snippet */}
                  <div className="bg-stone-50 rounded-xl p-2.5 text-xs text-stone-700 space-y-1 mb-3">
                    <div className="font-semibold text-stone-800 flex items-center gap-1 text-[11px]">
                      <span>🥄 Sunum / Hazırlama:</span>
                    </div>
                    <p className="text-stone-600 text-[11px] line-clamp-2">
                      {food.preparationTip}
                    </p>
                  </div>
                </div>

                {/* Bottom actions & Status */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                  {/* Status Indicator */}
                  {isSafe ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Güvenli ✅</span>
                    </span>
                  ) : hasReaction ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                      <span>Reaksiyon ⚠️</span>
                    </span>
                  ) : inProgress ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Deneniyor ⏳</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-stone-400 font-medium">
                      Henüz denenmedi
                    </span>
                  )}

                  <div className="flex items-center gap-1.5">
                    {/* View Details button */}
                    <button
                      onClick={() => setActiveFoodDetail(food)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-xl transition cursor-pointer"
                    >
                      Detay
                    </button>

                    {/* Add to 3-day trial button if not added yet */}
                    {!existingTrial && (
                      <button
                        onClick={() => handleQuickAddToTrial(food)}
                        title="3 Gün Kuralı Denemesine Ekle"
                        className="px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition cursor-pointer shadow-xs flex items-center gap-1 active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Dene</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Food Modal */}
      {activeFoodDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-stone-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl p-1 bg-stone-100 rounded-2xl">{activeFoodDetail.icon}</span>
                <div>
                  <h3 className="text-xl font-bold font-heading text-stone-900">
                    {activeFoodDetail.name}
                  </h3>
                  <span className="text-xs text-stone-500 font-medium">
                    {activeFoodDetail.minMonth}. Aydan İtibaren Uygun
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveFoodDetail(null)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning Note */}
            {activeFoodDetail.warningNote && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-semibold">{activeFoodDetail.warningNote}</p>
              </div>
            )}

            {/* Benefits */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Faydaları & Besin Değeri
              </h4>
              <p className="text-sm text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-2xl border border-stone-100">
                {activeFoodDetail.benefits}
              </p>
            </div>

            {/* Preparation Tip */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Geleneksel Püre / Çatalla Ezme Yöntemi
              </h4>
              <p className="text-sm text-stone-700 leading-relaxed bg-amber-50/50 p-3 rounded-2xl border border-amber-100">
                {activeFoodDetail.preparationTip}
              </p>
            </div>

            {/* BLW Tip */}
            {activeFoodDetail.blwTip && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                  <span>👶 BLW (Parmak Gıda) Önerisi</span>
                </h4>
                <p className="text-sm text-stone-700 leading-relaxed bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100">
                  {activeFoodDetail.blwTip}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                onClick={() => setActiveFoodDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition cursor-pointer"
              >
                Kapat
              </button>

              <button
                onClick={() => {
                  handleQuickAddToTrial(activeFoodDetail);
                  setActiveFoodDetail(null);
                }}
                className="px-5 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>3 Gün Kuralı Tablosuna Ekle</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
