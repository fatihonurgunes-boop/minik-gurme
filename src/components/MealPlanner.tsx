import React, { useState } from 'react';
import { DailyMealPlan, MealConsumptionRate, MealItem } from '../types';
import { formatTurkishDate, getTodayDateString } from '../utils/storage';
import { RECIPE_SUGGESTIONS, RecipeTemplate } from '../data/recipeSuggestions';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  Utensils,
  SunMedium,
  Sun,
  Moon,
  Apple,
  Droplet,
  Heart,
  BookOpen,
  Plus,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

interface MealPlannerProps {
  meals: Record<string, DailyMealPlan>;
  onSaveMeals: (meals: Record<string, DailyMealPlan>) => void;
}

const DEFAULT_EMPTY_MEAL: MealItem = {
  menu: '',
  eaten: false,
  consumptionRate: 'none',
  notes: '',
};

export const MealPlanner: React.FC<MealPlannerProps> = ({ meals, onSaveMeals }) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [activeRecipeModalMeal, setActiveRecipeModalMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack' | null>(null);

  // Get or initialize meal plan for selectedDate
  const currentPlan: DailyMealPlan = meals[selectedDate] || {
    date: selectedDate,
    breakfast: { ...DEFAULT_EMPTY_MEAL },
    lunch: { ...DEFAULT_EMPTY_MEAL },
    dinner: { ...DEFAULT_EMPTY_MEAL },
    snack: { ...DEFAULT_EMPTY_MEAL },
    waterIntakeMl: 0,
    breastmilkOrFormulaCount: 0,
    generalNotes: '',
  };

  // Date navigation helpers
  const handleShiftDate = (days: number) => {
    const parts = selectedDate.split('-');
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleUpdateMealItem = (
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    field: keyof MealItem,
    value: any
  ) => {
    const updatedPlan: DailyMealPlan = {
      ...currentPlan,
      [mealType]: {
        ...currentPlan[mealType],
        [field]: value,
      },
    };

    // If eaten is toggled to true and consumptionRate was 'none', set to 'full'
    if (field === 'eaten' && value === true && currentPlan[mealType].consumptionRate === 'none') {
      updatedPlan[mealType].consumptionRate = 'full';
    } else if (field === 'eaten' && value === false) {
      updatedPlan[mealType].consumptionRate = 'none';
    }

    onSaveMeals({
      ...meals,
      [selectedDate]: updatedPlan,
    });
  };

  const handleUpdateCounter = (field: 'waterIntakeMl' | 'breastmilkOrFormulaCount', delta: number) => {
    const updatedPlan: DailyMealPlan = {
      ...currentPlan,
      [field]: Math.max(0, (currentPlan[field] || 0) + delta),
    };
    onSaveMeals({
      ...meals,
      [selectedDate]: updatedPlan,
    });
  };

  const handleUpdateGeneralNotes = (notes: string) => {
    const updatedPlan: DailyMealPlan = {
      ...currentPlan,
      generalNotes: notes,
    };
    onSaveMeals({
      ...meals,
      [selectedDate]: updatedPlan,
    });
  };

  // Insert recipe suggestion into current meal
  const handleApplyRecipe = (recipe: RecipeTemplate) => {
    if (!activeRecipeModalMeal) return;

    const formattedMenu = `${recipe.title}\nMalzemeler: ${recipe.ingredients.join(', ')}\nHazırlık: ${recipe.instructions}`;

    handleUpdateMealItem(activeRecipeModalMeal, 'menu', formattedMenu);
    setActiveRecipeModalMeal(null);
  };

  const isToday = selectedDate === getTodayDateString();

  return (
    <div className="space-y-6">
      {/* Date Header & Quick Selector */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Date arrows & Title */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleShiftDate(-1)}
              className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 border border-stone-200 transition cursor-pointer"
              title="Önceki Gün"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-center sm:text-left min-w-[200px]">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <CalendarIcon className="w-4 h-4 text-amber-600" />
                <h2 className="text-base sm:text-lg font-bold font-heading text-stone-900">
                  {formatTurkishDate(selectedDate)}
                </h2>
                {isToday && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Bugün
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => handleShiftDate(1)}
              className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 border border-stone-200 transition cursor-pointer"
              title="Sonraki Gün"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Date Shortcuts & Datepicker */}
          <div className="flex items-center gap-2">
            {!isToday && (
              <button
                onClick={() => setSelectedDate(getTodayDateString())}
                className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition cursor-pointer"
              >
                Bugüne Git
              </button>
            )}

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              className="text-xs font-semibold py-1.5 px-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Meals Grid (Sabah, Öğle, Akşam, Ara Öğün) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* SABAH / KAHVALTI */}
        <div className="bg-white rounded-2xl border border-amber-200/80 shadow-xs p-4 sm:p-5 flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <SunMedium className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-base">Sabah</h3>
                  <span className="text-[11px] text-stone-400 font-medium">Kahvaltı / İlk Öğün</span>
                </div>
              </div>

              {/* Yendi mi? Tiki */}
              <button
                type="button"
                onClick={() => handleUpdateMealItem('breakfast', 'eaten', !currentPlan.breakfast.eaten)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  currentPlan.breakfast.eaten
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
                title="Bebeğe verildi ve yendi mi?"
              >
                {currentPlan.breakfast.eaten ? (
                  <>
                    <CheckSquare className="w-4 h-4" />
                    <span>Yendi ☑</span>
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4 text-stone-400" />
                    <span>Yendi mi? ☐</span>
                  </>
                )}
              </button>
            </div>

            {/* Menü / Tarif Alanı */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-700">
                  Hazırlanacak Menü & Tarif:
                </label>
                <button
                  type="button"
                  onClick={() => setActiveRecipeModalMeal('breakfast')}
                  className="text-[11px] text-amber-700 hover:text-amber-800 font-bold flex items-center gap-0.5 cursor-pointer underline underline-offset-2"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Tarif Önerisi</span>
                </button>
              </div>
              <textarea
                rows={3}
                placeholder="Örn: 1/4 tam haşlanmış yumurta sarısı + 1 tatlı kaşığı bebek loru + zeytinyağı ezmesi..."
                value={currentPlan.breakfast.menu}
                onChange={(e) => handleUpdateMealItem('breakfast', 'menu', e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-stone-50/40 hover:bg-white focus:bg-white resize-none"
              />
            </div>

            {/* Tüketim Miktarı / Durumu */}
            {currentPlan.breakfast.eaten && (
              <div>
                <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Ne Kadarını Tüketti?
                </label>
                <div className="grid grid-cols-3 gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleUpdateMealItem('breakfast', 'consumptionRate', 'full')}
                    className={`py-1 rounded-lg font-semibold border transition cursor-pointer ${
                      currentPlan.breakfast.consumptionRate === 'full'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    🟢 Tümü Bitti
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateMealItem('breakfast', 'consumptionRate', 'half')}
                    className={`py-1 rounded-lg font-semibold border transition cursor-pointer ${
                      currentPlan.breakfast.consumptionRate === 'half'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    🟡 Yarısı Yendi
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateMealItem('breakfast', 'consumptionRate', 'few_bites')}
                    className={`py-1 rounded-lg font-semibold border transition cursor-pointer ${
                      currentPlan.breakfast.consumptionRate === 'few_bites'
                        ? 'bg-orange-100 text-orange-800 border-orange-300'
                        : 'bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    🟠 2-3 Kaşık
                  </button>
                </div>
              </div>
            )}

            {/* Yenilmeyen / Kalan Miktar Notu */}
            <div>
              <label className="text-xs font-semibold text-stone-600 block mb-1">
                Yenilmeyen / Kalan Miktar veya Tepki Notu:
              </label>
              <input
                type="text"
                placeholder="Örn: 2 kaşık bıraktı, biraz yere döktü..."
                value={currentPlan.breakfast.notes}
                onChange={(e) => handleUpdateMealItem('breakfast', 'notes', e.target.value)}
                className="w-full text-xs py-1.5 px-2.5 border border-stone-200 rounded-xl text-stone-700 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* ÖĞLE */}
        <div className="bg-white rounded-2xl border border-teal-200/80 shadow-xs p-4 sm:p-5 flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-teal-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-base">Öğle</h3>
                  <span className="text-[11px] text-stone-400 font-medium">Sebze & Püre / Çorba</span>
                </div>
              </div>

              {/* Yendi mi? Tiki */}
              <button
                type="button"
                onClick={() => handleUpdateMealItem('lunch', 'eaten', !currentPlan.lunch.eaten)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  currentPlan.lunch.eaten
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
                title="Bebeğe verildi ve yendi mi?"
              >
                {currentPlan.lunch.eaten ? (
                  <>
                    <CheckSquare className="w-4 h-4" />
                    <span>Yendi ☑</span>
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4 text-stone-400" />
                    <span>Yendi mi? ☐</span>
                  </>
                )}
              </button>
            </div>

            {/* Menü / Tarif Alanı */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-700">
                  Hazırlanacak Menü & Tarif:
                </label>
                <button
                  type="button"
                  onClick={() => setActiveRecipeModalMeal('lunch')}
                  className="text-[11px] text-teal-700 hover:text-teal-800 font-bold flex items-center gap-0.5 cursor-pointer underline underline-offset-2"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Tarif Önerisi</span>
                </button>
              </div>
              <textarea
                rows={3}
                placeholder="Örn: Buharda pişmiş tatlı patates ve kabak püresi + 1 ceviz kuzu kıyma..."
                value={currentPlan.lunch.menu}
                onChange={(e) => handleUpdateMealItem('lunch', 'menu', e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-stone-50/40 hover:bg-white focus:bg-white resize-none"
              />
            </div>

            {/* Tüketim Miktarı / Durumu */}
            {currentPlan.lunch.eaten && (
              <div>
                <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Ne Kadarını Tüketti?
                </label>
                <div className="grid grid-cols-3 gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleUpdateMealItem('lunch', 'consumptionRate', 'full')}
                    className={`py-1 rounded-lg font-semibold border transition cursor-pointer ${
                      currentPlan.lunch.consumptionRate === 'full'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    🟢 Tümü Bitti
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateMealItem('lunch', 'consumptionRate', 'half')}
                    className={`py-1 rounded-lg font-semibold border transition cursor-pointer ${
                      currentPlan.lunch.consumptionRate === 'half'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    🟡 Yarısı Yendi
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateMealItem('lunch', 'consumptionRate', 'few_bites')}
                    className={`py-1 rounded-lg font-semibold border transition cursor-pointer ${
                      currentPlan.lunch.consumptionRate === 'few_bites'
                        ? 'bg-orange-100 text-orange-800 border-orange-300'
                        : 'bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    🟠 2-3 Kaşık
                  </button>
                </div>
              </div>
            )}

            {/* Yenilmeyen / Kalan Miktar Notu */}
            <div>
              <label className="text-xs font-semibold text-stone-600 block mb-1">
                Yenilmeyen / Kalan Miktar veya Tepki Notu:
              </label>
              <input
                type="text"
                placeholder="Örn: Kıymayı başta istemedi, püreyle karıştırınca yedi..."
                value={currentPlan.lunch.notes}
                onChange={(e) => handleUpdateMealItem('lunch', 'notes', e.target.value)}
                className="w-full text-xs py-1.5 px-2.5 border border-stone-200 rounded-xl text-stone-700 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>
        </div>

        {/* AKŞAM */}
        <div className="bg-white rounded-2xl border border-indigo-200/80 shadow-xs p-4 sm:p-5 flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-base">Akşam</h3>
                  <span className="text-[11px] text-stone-400 font-medium">Hafif / Tok Tutan Öğün</span>
                </div>
              </div>

              {/* Yendi mi? Tiki */}
              <button
                type="button"
                onClick={() => handleUpdateMealItem('dinner', 'eaten', !currentPlan.dinner.eaten)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  currentPlan.dinner.eaten
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
                title="Bebeğe verildi ve yendi mi?"
              >
                {currentPlan.dinner.eaten ? (
                  <>
                    <CheckSquare className="w-4 h-4" />
                    <span>Yendi ☑</span>
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4 text-stone-400" />
                    <span>Yendi mi? ☐</span>
                  </>
                )}
              </button>
            </div>

            {/* Menü / Tarif Alanı */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-700">
                  Hazırlanacak Menü & Tarif:
                </label>
                <button
                  type="button"
                  onClick={() => setActiveRecipeModalMeal('dinner')}
                  className="text-[11px] text-indigo-700 hover:text-indigo-800 font-bold flex items-center gap-0.5 cursor-pointer underline underline-offset-2"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Tarif Önerisi</span>
                </button>
              </div>
              <textarea
                rows={3}
                placeholder="Örn: Anne sütlü irmik lapası veya buharda havuç-brokoli püresi..."
                value={currentPlan.dinner.menu}
                onChange={(e) => handleUpdateMealItem('dinner', 'menu', e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-stone-50/40 hover:bg-white focus:bg-white resize-none"
              />
            </div>

            {/* Tüketim Miktarı / Durumu */}
            {currentPlan.dinner.eaten && (
              <div>
                <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Ne Kadarını Tüketti?
                </label>
                <div className="grid grid-cols-3 gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleUpdateMealItem('dinner', 'consumptionRate', 'full')}
                    className={`py-1 rounded-lg font-semibold border transition cursor-pointer ${
                      currentPlan.dinner.consumptionRate === 'full'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    🟢 Tümü Bitti
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateMealItem('dinner', 'consumptionRate', 'half')}
                    className={`py-1 rounded-lg font-semibold border transition cursor-pointer ${
                      currentPlan.dinner.consumptionRate === 'half'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    🟡 Yarısı Yendi
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateMealItem('dinner', 'consumptionRate', 'few_bites')}
                    className={`py-1 rounded-lg font-semibold border transition cursor-pointer ${
                      currentPlan.dinner.consumptionRate === 'few_bites'
                        ? 'bg-orange-100 text-orange-800 border-orange-300'
                        : 'bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    🟠 2-3 Kaşık
                  </button>
                </div>
              </div>
            )}

            {/* Yenilmeyen / Kalan Miktar Notu */}
            <div>
              <label className="text-xs font-semibold text-stone-600 block mb-1">
                Yenilmeyen / Kalan Miktar veya Tepki Notu:
              </label>
              <input
                type="text"
                placeholder="Örn: Uykusu geldiği için yarım bıraktı..."
                value={currentPlan.dinner.notes}
                onChange={(e) => handleUpdateMealItem('dinner', 'notes', e.target.value)}
                className="w-full text-xs py-1.5 px-2.5 border border-stone-200 rounded-xl text-stone-700 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Helper Trackers: Ara Öğün, Su Tüketimi & Anne Sütü / Mama */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Ara Öğün (Meyve / Yoğurt) */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-2">
            <div className="flex items-center gap-2">
              <Apple className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-stone-900 text-sm">Ara Öğün (İsteğe Bağlı)</h4>
            </div>
            <button
              type="button"
              onClick={() => handleUpdateMealItem('snack', 'eaten', !currentPlan.snack.eaten)}
              className={`text-xs px-2 py-0.5 rounded-lg font-bold border transition cursor-pointer ${
                currentPlan.snack.eaten
                  ? 'bg-emerald-500 text-white border-emerald-600'
                  : 'bg-stone-100 text-stone-600 border-stone-200'
              }`}
            >
              {currentPlan.snack.eaten ? 'Yendi ☑' : 'Yendi mi? ☐'}
            </button>
          </div>
          <input
            type="text"
            placeholder="Örn: Cam rende elma + 2 kaşık ev yoğurdu..."
            value={currentPlan.snack.menu}
            onChange={(e) => handleUpdateMealItem('snack', 'menu', e.target.value)}
            className="w-full text-xs py-2 px-3 border border-stone-200 rounded-xl mb-2 focus:outline-none focus:border-amber-400"
          />
          <input
            type="text"
            placeholder="Tüketim notu..."
            value={currentPlan.snack.notes}
            onChange={(e) => handleUpdateMealItem('snack', 'notes', e.target.value)}
            className="w-full text-xs py-1 px-2.5 border border-stone-100 rounded-lg text-stone-500 bg-stone-50/40"
          />
        </div>

        {/* Su Tüketimi Sayacı */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-3">
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-sky-500" />
                <h4 className="font-bold text-stone-900 text-sm">Günlük Su Tüketimi</h4>
              </div>
              <span className="text-sm font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">
                {currentPlan.waterIntakeMl || 0} ml
              </span>
            </div>
            <p className="text-[11px] text-stone-500 leading-tight mb-3">
              Ek gıdayla birlikte böbreklerin rahatlaması için her öğün sonrası birkaç yudum kaynatılıp ılıtılmış su teklif edin.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleUpdateCounter('waterIntakeMl', -30)}
              className="flex-1 py-1.5 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition cursor-pointer"
            >
              -30 ml
            </button>
            <button
              onClick={() => handleUpdateCounter('waterIntakeMl', 30)}
              className="flex-1 py-1.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition cursor-pointer"
            >
              +30 ml
            </button>
            <button
              onClick={() => handleUpdateCounter('waterIntakeMl', 60)}
              className="flex-1 py-1.5 text-xs font-bold text-sky-700 bg-sky-100 hover:bg-sky-200 border border-sky-300 rounded-xl transition cursor-pointer"
            >
              +60 ml
            </button>
          </div>
        </div>

        {/* Anne Sütü / Formül Mama Sayacı */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <h4 className="font-bold text-stone-900 text-sm">Anne Sütü / Mama Seansı</h4>
              </div>
              <span className="text-sm font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                {currentPlan.breastmilkOrFormulaCount || 0} Kez
              </span>
            </div>
            <p className="text-[11px] text-stone-500 leading-tight mb-3">
              1 yaşına kadar ana besin anne sütü / formül mamadır. Ek gıda seanslarını emzirmeden 45-60 dk sonra yapın.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleUpdateCounter('breastmilkOrFormulaCount', -1)}
              className="flex-1 py-1.5 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition cursor-pointer"
            >
              -1 Seans
            </button>
            <button
              onClick={() => handleUpdateCounter('breastmilkOrFormulaCount', 1)}
              className="flex-1 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition cursor-pointer"
            >
              +1 Seans Emzirme
            </button>
          </div>
        </div>
      </div>

      {/* Günün Genel Notu */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-xs">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1.5">
          Günün Genel Notu (Bebeğin İştahı, Keyfi, Uykusu veya Kaka Durumu):
        </label>
        <textarea
          rows={2}
          value={currentPlan.generalNotes || ''}
          placeholder="Örn: Bugün diş çıkardığı için biraz iştahsızdı ama suyunu güzel içti..."
          onChange={(e) => handleUpdateGeneralNotes(e.target.value)}
          className="w-full text-xs sm:text-sm p-2.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
        />
      </div>

      {/* Recipe Suggestion Modal */}
      {activeRecipeModalMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-xl border border-stone-100 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👩‍🍳</span>
                <div>
                  <h3 className="text-lg font-bold font-heading text-stone-900">
                    Örnek Bebek Menüsü & Tarif Seçin
                  </h3>
                  <p className="text-xs text-stone-500">
                    Seçtiğiniz tarif doğrudan günün planına aktarılacaktır.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveRecipeModalMeal(null)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {RECIPE_SUGGESTIONS.filter(
                (r) => r.mealType === activeRecipeModalMeal || activeRecipeModalMeal === 'snack'
              ).map((recipe) => (
                <div
                  key={recipe.id}
                  className="p-4 rounded-2xl border border-stone-200 hover:border-amber-400 bg-stone-50/50 hover:bg-amber-50/20 transition flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-bold text-stone-900 text-sm">{recipe.title}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {recipe.monthRange} • {recipe.prepTime}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 font-medium mb-1">
                      Malzemeler: {recipe.ingredients.join(', ')}
                    </p>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Hazırlık: {recipe.instructions}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleApplyRecipe(recipe)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition cursor-pointer shadow-xs active:scale-95"
                    >
                      Bu Menüyü Ekle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
