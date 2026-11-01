import React, { useState } from 'react';
import { FoodTrial, FoodCategory, ReactionStatus, EnjoymentLevel } from '../types';
import { formatTurkishDate, getTodayDateString } from '../utils/storage';
import confetti from 'canvas-confetti';
import {
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Smile,
  Frown,
  Meh,
  Calendar,
  Sparkles,
  Trash2,
  HelpCircle,
  Clock,
  Filter,
  Check,
  X,
  FileCheck2,
} from 'lucide-react';

interface ThreeDayTrackerProps {
  trials: FoodTrial[];
  onSaveTrials: (trials: FoodTrial[]) => void;
  onOpenSafetyGuide: () => void;
}

export const REACTION_LABELS: Record<ReactionStatus, { label: string; color: string; badge: string; icon: string }> = {
  none: {
    label: 'Reaksiyon Yok (Güvenli)',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    badge: 'bg-emerald-500',
    icon: '✅',
  },
  rash: {
    label: 'Kızarıklık / Döküntü',
    color: 'text-rose-700 bg-rose-50 border-rose-200',
    badge: 'bg-rose-500',
    icon: '🔴',
  },
  digestive: {
    label: 'Sindirim / Gaz Sorunu',
    color: 'text-amber-800 bg-amber-50 border-amber-200',
    badge: 'bg-amber-500',
    icon: '🟡',
  },
  rejected: {
    label: 'Israrla Reddetti',
    color: 'text-purple-700 bg-purple-50 border-purple-200',
    badge: 'bg-purple-500',
    icon: '🟣',
  },
  vomiting: {
    label: 'Kusma',
    color: 'text-orange-700 bg-orange-50 border-orange-200',
    badge: 'bg-orange-500',
    icon: '🟠',
  },
  swelling: {
    label: 'Şişlik (Doktora Başvurun!)',
    color: 'text-red-800 bg-red-100 border-red-300 font-bold',
    badge: 'bg-red-600',
    icon: '🚨',
  },
};

export const ENJOYMENT_CONFIG: Record<EnjoymentLevel, { emoji: string; label: string }> = {
  1: { emoji: '🤢', label: '1 - Hiç Sevmedi' },
  2: { emoji: '😣', label: '2 - Zorlandı' },
  3: { emoji: '😐', label: '3 - Alışıyor / Nötr' },
  4: { emoji: '😊', label: '4 - Sevdi' },
  5: { emoji: '😍', label: '5 - Bayıldı!' },
};

const CATEGORY_NAMES: Record<FoodCategory, { name: string; icon: string }> = {
  sebze: { name: 'Sebze', icon: '🥕' },
  meyve: { name: 'Meyve', icon: '🍎' },
  sut_urunleri: { name: 'Yoğurt & Peynir', icon: '🥣' },
  protein: { name: 'Protein', icon: '🍳' },
  tahil: { name: 'Tahıl & Baklagil', icon: '🌾' },
  yag_tohum: { name: 'Sağlıklı Yağ', icon: '🥑' },
};

export const ThreeDayTracker: React.FC<ThreeDayTrackerProps> = ({
  trials,
  onSaveTrials,
  onOpenSafetyGuide,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'approved' | 'reaction'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New trial form state
  const [newFoodName, setNewFoodName] = useState('');
  const [newCategory, setNewCategory] = useState<FoodCategory>('sebze');
  const [newStartDate, setNewStartDate] = useState(getTodayDateString());
  const [newNotes, setNewNotes] = useState('');

  // Handle day checkbox toggle
  const handleToggleDay = (trialId: string, dayNum: 1 | 2 | 3) => {
    const updated = trials.map((t) => {
      if (t.id !== trialId) return t;

      const dayKey = `day${dayNum}` as 'day1' | 'day2' | 'day3';
      const currentDay = t[dayKey];
      const nextCompleted = !currentDay.completed;

      const updatedTrial = {
        ...t,
        [dayKey]: {
          ...currentDay,
          completed: nextCompleted,
          date: nextCompleted ? (currentDay.date || getTodayDateString()) : currentDay.date,
        },
      };

      // Check if all 3 days are now completed with no reaction
      const isDay1Done = dayNum === 1 ? nextCompleted : t.day1.completed;
      const isDay2Done = dayNum === 2 ? nextCompleted : t.day2.completed;
      const isDay3Done = dayNum === 3 ? nextCompleted : t.day3.completed;

      if (isDay1Done && isDay2Done && isDay3Done && t.reaction === 'none') {
        updatedTrial.approvedSafe = true;
        // Trigger celebratory confetti!
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.65 },
            colors: ['#10b981', '#34d399', '#f59e0b', '#fbbf24', '#f472b6'],
          });
        } catch {
          // ignore
        }
      } else {
        updatedTrial.approvedSafe = false;
      }

      return updatedTrial;
    });

    onSaveTrials(updated);
  };

  // Update reaction status
  const handleReactionChange = (trialId: string, reaction: ReactionStatus) => {
    const updated = trials.map((t) => {
      if (t.id !== trialId) return t;
      const isAllDone = t.day1.completed && t.day2.completed && t.day3.completed;
      return {
        ...t,
        reaction,
        approvedSafe: isAllDone && reaction === 'none',
      };
    });
    onSaveTrials(updated);
  };

  // Update enjoyment rating
  const handleEnjoymentChange = (trialId: string, enjoyment: EnjoymentLevel) => {
    const updated = trials.map((t) => (t.id === trialId ? { ...t, enjoyment } : t));
    onSaveTrials(updated);
  };

  // Update notes
  const handleUpdateNotes = (trialId: string, notes: string) => {
    const updated = trials.map((t) => (t.id === trialId ? { ...t, notes } : t));
    onSaveTrials(updated);
  };

  // Delete trial
  const handleDeleteTrial = (trialId: string) => {
    if (window.confirm('Bu besin deneme kaydını silmek istediğinize emin misiniz?')) {
      onSaveTrials(trials.filter((t) => t.id !== trialId));
    }
  };

  // Add new food trial
  const handleAddTrialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoodName.trim()) return;

    const newTrial: FoodTrial = {
      id: 'trial-' + Date.now(),
      foodName: newFoodName.trim(),
      category: newCategory,
      startDate: newStartDate || getTodayDateString(),
      day1: { completed: false, date: newStartDate || getTodayDateString(), amountNote: '1 çay kaşığı tadım' },
      day2: { completed: false, date: '', amountNote: '1 tatlı kaşığı' },
      day3: { completed: false, date: '', amountNote: '1 yemek kaşığı' },
      reaction: 'none',
      enjoyment: 3,
      approvedSafe: false,
      notes: newNotes.trim(),
      createdAt: Date.now(),
    };

    onSaveTrials([newTrial, ...trials]);
    setNewFoodName('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  // Quick starter food presets
  const STARTER_PRESETS = [
    { name: 'Havuç', cat: 'sebze' },
    { name: 'Balkabağı', cat: 'sebze' },
    { name: 'Yeşil Kabak', cat: 'sebze' },
    { name: 'Tatlı Patates', cat: 'sebze' },
    { name: 'Avokado', cat: 'yag_tohum' },
    { name: 'Yumurta Sarısı', cat: 'protein' },
    { name: 'Ev Yoğurdu', cat: 'sut_urunleri' },
    { name: 'Elma Püresi', cat: 'meyve' },
    { name: 'Armut', cat: 'meyve' },
    { name: 'Yulaf Lapası', cat: 'tahil' },
  ];

  // Filtering
  const filteredTrials = trials.filter((t) => {
    const matchesSearch = t.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'in_progress') {
      return !t.approvedSafe && t.reaction === 'none';
    }
    if (statusFilter === 'approved') {
      return t.approvedSafe;
    }
    if (statusFilter === 'reaction') {
      return t.reaction !== 'none';
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Explanation of 3 Day Rule */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 text-stone-800 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <h2 className="text-lg font-bold font-heading text-stone-900">
                3 Gün Kuralı Nasıl Çalışır?
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900 font-medium">
                Altın Kural
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              Bebeğinizi yeni bir besinle tanıştırırken <strong>3 gün üst üste</strong> sadece o besini tek başına verin.
              Bebek yedikçe <strong>1. Gün</strong>, <strong>2. Gün</strong> ve <strong>3. Gün</strong> kutucuklarını işaretleyin.
              Alerjik döküntü veya sindirim reaksiyonu olmadığını gözlemledikten sonra besin güvenle onaylanır.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenSafetyGuide}
              className="px-3.5 py-2 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200/80 rounded-xl transition cursor-pointer border border-amber-300/60 flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Alerji Rehberi</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Besin Ekle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Besin adı veya not ara (örn: Havuç, Avokado)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-stone-800 placeholder-stone-400"
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

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer shrink-0 ${
              statusFilter === 'all'
                ? 'bg-stone-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            Tümü ({trials.length})
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer shrink-0 flex items-center gap-1 ${
              statusFilter === 'in_progress'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Clock className="w-3 h-3" />
            Deneniyor ({trials.filter((t) => !t.approvedSafe && t.reaction === 'none').length})
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer shrink-0 flex items-center gap-1 ${
              statusFilter === 'approved'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            Güvenli ({trials.filter((t) => t.approvedSafe).length})
          </button>
          <button
            onClick={() => setStatusFilter('reaction')}
            className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer shrink-0 flex items-center gap-1 ${
              statusFilter === 'reaction'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            Reaksiyon ({trials.filter((t) => t.reaction !== 'none').length})
          </button>
        </div>
      </div>

      {/* Main Table / Card List */}
      {filteredTrials.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
            🥣
          </div>
          <h3 className="text-base font-bold text-stone-800">Kayıtlı Besin Bulunamadı</h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
            {searchTerm
              ? `"${searchTerm}" aramasına uygun besin bulunamadı.`
              : 'Henüz deneme tablonuzda besin yok. Bebeğinizin ilk tadımı için yeni bir besin ekleyin!'}
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold rounded-xl cursor-pointer"
          >
            Yeni Besin Ekle
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50/80 border-b border-stone-200 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Besin Adı</th>
                  <th className="py-3.5 px-3">Denenme Tarihi</th>
                  <th className="py-3.5 px-4 text-center">3 Gün Kuralı İlerlemesi</th>
                  <th className="py-3.5 px-4">Reaksiyon / Alerji Durumu</th>
                  <th className="py-3.5 px-4">Beğenme Durumu</th>
                  <th className="py-3.5 px-4">Not & Durum</th>
                  <th className="py-3.5 px-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredTrials.map((trial) => {
                  const catInfo = CATEGORY_NAMES[trial.category] || { name: 'Gıda', icon: '🍽️' };
                  const reactionInfo = REACTION_LABELS[trial.reaction];
                  const enjoymentInfo = ENJOYMENT_CONFIG[trial.enjoyment];

                  return (
                    <tr
                      key={trial.id}
                      className={`hover:bg-amber-50/30 transition-colors ${
                        trial.approvedSafe ? 'bg-emerald-50/20' : trial.reaction !== 'none' ? 'bg-rose-50/20' : ''
                      }`}
                    >
                      {/* Besin Adı */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl p-1 bg-stone-100/80 rounded-xl">{catInfo.icon}</span>
                          <div>
                            <div className="font-bold text-stone-900 flex items-center gap-1.5">
                              <span>{trial.foodName}</span>
                              {trial.approvedSafe && (
                                <span title="3 gün sorunsuz onaylandı" className="text-emerald-600">
                                  <CheckCircle2 className="w-4 h-4 inline" />
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-stone-400 font-medium">{catInfo.name}</span>
                          </div>
                        </div>
                      </td>

                      {/* Denenme Tarihi */}
                      <td className="py-4 px-3 text-xs text-stone-600">
                        <div className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>{formatTurkishDate(trial.startDate)}</span>
                        </div>
                      </td>

                      {/* 3 Gün Tik Kutuları */}
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* 1. Gün */}
                          <button
                            type="button"
                            onClick={() => handleToggleDay(trial.id, 1)}
                            className={`flex flex-col items-center justify-center w-12 h-13 rounded-xl border transition cursor-pointer select-none ${
                              trial.day1.completed
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-xs'
                                : 'bg-stone-50 hover:bg-amber-50 border-stone-200 text-stone-500'
                            }`}
                            title="1. Gün: Bebeğe verildi ve yendi mi?"
                          >
                            <span className="text-[10px] font-bold uppercase tracking-wider">1. Gün</span>
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center mt-1 transition ${
                                trial.day1.completed
                                  ? 'bg-emerald-600 text-white'
                                  : 'border-2 border-stone-300 bg-white'
                              }`}
                            >
                              {trial.day1.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </button>

                          {/* 2. Gün */}
                          <button
                            type="button"
                            onClick={() => handleToggleDay(trial.id, 2)}
                            className={`flex flex-col items-center justify-center w-12 h-13 rounded-xl border transition cursor-pointer select-none ${
                              trial.day2.completed
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-xs'
                                : 'bg-stone-50 hover:bg-amber-50 border-stone-200 text-stone-500'
                            }`}
                            title="2. Gün: Bebeğe verildi ve yendi mi?"
                          >
                            <span className="text-[10px] font-bold uppercase tracking-wider">2. Gün</span>
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center mt-1 transition ${
                                trial.day2.completed
                                  ? 'bg-emerald-600 text-white'
                                  : 'border-2 border-stone-300 bg-white'
                              }`}
                            >
                              {trial.day2.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </button>

                          {/* 3. Gün */}
                          <button
                            type="button"
                            onClick={() => handleToggleDay(trial.id, 3)}
                            className={`flex flex-col items-center justify-center w-12 h-13 rounded-xl border transition cursor-pointer select-none ${
                              trial.day3.completed
                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs font-bold'
                                : 'bg-stone-50 hover:bg-amber-50 border-stone-200 text-stone-500'
                            }`}
                            title="3. Gün: Bebeğe verildi ve yendi mi?"
                          >
                            <span className="text-[10px] uppercase tracking-wider">3. Gün</span>
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center mt-1 transition ${
                                trial.day3.completed
                                  ? 'bg-white text-emerald-600'
                                  : 'border-2 border-stone-300 bg-white'
                              }`}
                            >
                              {trial.day3.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </button>
                        </div>
                      </td>

                      {/* Reaksiyon / Alerji Durumu */}
                      <td className="py-4 px-4">
                        <select
                          value={trial.reaction}
                          onChange={(e) => handleReactionChange(trial.id, e.target.value as ReactionStatus)}
                          className={`text-xs font-semibold py-1.5 px-2.5 rounded-xl border cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${reactionInfo.color}`}
                        >
                          <option value="none">🟢 Reaksiyon Yok (Güvenli)</option>
                          <option value="rash">🔴 Kızarıklık / Döküntü</option>
                          <option value="digestive">🟡 Sindirim / Gaz Sorunu</option>
                          <option value="rejected">🟣 Israrla Reddetti</option>
                          <option value="vomiting">🟠 Kusma</option>
                          <option value="swelling">🚨 Şişlik / Acil Durum</option>
                        </select>
                      </td>

                      {/* Bebeğin Beğenme Durumu (1-5 Emoji) */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          {([1, 2, 3, 4, 5] as EnjoymentLevel[]).map((level) => {
                            const conf = ENJOYMENT_CONFIG[level];
                            const isSelected = trial.enjoyment === level;
                            return (
                              <button
                                key={level}
                                type="button"
                                onClick={() => handleEnjoymentChange(trial.id, level)}
                                title={conf.label}
                                className={`text-xl p-1 rounded-lg transition-transform cursor-pointer ${
                                  isSelected
                                    ? 'scale-125 bg-amber-100 shadow-xs border border-amber-300'
                                    : 'opacity-40 hover:opacity-100 hover:scale-110'
                                }`}
                              >
                                {conf.emoji}
                              </button>
                            );
                          })}
                        </div>
                        <span className="text-[11px] text-stone-500 font-medium block mt-1">
                          {enjoymentInfo.label}
                        </span>
                      </td>

                      {/* Not ve Durum */}
                      <td className="py-4 px-4 max-w-xs">
                        <input
                          type="text"
                          defaultValue={trial.notes || ''}
                          placeholder="Kısa not (miktar, tepki vb.)..."
                          onBlur={(e) => handleUpdateNotes(trial.id, e.target.value)}
                          className="w-full text-xs py-1 px-2 border border-stone-200 rounded-lg text-stone-700 bg-stone-50/50 hover:bg-white focus:bg-white focus:outline-none focus:border-amber-400"
                        />
                        {trial.approvedSafe && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 mt-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Onaylı Güvenli Gıda
                          </span>
                        )}
                      </td>

                      {/* Silme */}
                      <td className="py-4 px-3 text-right">
                        <button
                          onClick={() => handleDeleteTrial(trial.id)}
                          title="Sil"
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (optimized for high touch-friendliness) */}
          <div className="lg:hidden divide-y divide-stone-100">
            {filteredTrials.map((trial) => {
              const catInfo = CATEGORY_NAMES[trial.category] || { name: 'Gıda', icon: '🍽️' };
              const reactionInfo = REACTION_LABELS[trial.reaction];
              const enjoymentInfo = ENJOYMENT_CONFIG[trial.enjoyment];

              return (
                <div
                  key={trial.id}
                  className={`p-4 space-y-3.5 transition-colors ${
                    trial.approvedSafe ? 'bg-emerald-50/20' : trial.reaction !== 'none' ? 'bg-rose-50/20' : ''
                  }`}
                >
                  {/* Top: Name, Date, Delete */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-1 bg-stone-100 rounded-xl">{catInfo.icon}</span>
                      <div>
                        <div className="font-bold text-stone-900 text-base flex items-center gap-1.5">
                          <span>{trial.foodName}</span>
                          {trial.approvedSafe && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                              Güvenli ✅
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                          <span>{catInfo.name}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatTurkishDate(trial.startDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteTrial(trial.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 3-Day Rule Checkboxes (Large, mobile touch-friendly) */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5 block">
                      3 Gün Kuralı İlerlemesi (Yedikçe İşaretleyin):
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Day 1 */}
                      <button
                        type="button"
                        onClick={() => handleToggleDay(trial.id, 1)}
                        className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition cursor-pointer ${
                          trial.day1.completed
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-xs'
                            : 'bg-stone-50 border-stone-200 text-stone-600'
                        }`}
                      >
                        <span className="text-xs font-bold">1. Gün</span>
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center mt-1 ${
                            trial.day1.completed
                              ? 'bg-emerald-600 text-white'
                              : 'border-2 border-stone-300 bg-white'
                          }`}
                        >
                          {trial.day1.completed && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>
                      </button>

                      {/* Day 2 */}
                      <button
                        type="button"
                        onClick={() => handleToggleDay(trial.id, 2)}
                        className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition cursor-pointer ${
                          trial.day2.completed
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-xs'
                            : 'bg-stone-50 border-stone-200 text-stone-600'
                        }`}
                      >
                        <span className="text-xs font-bold">2. Gün</span>
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center mt-1 ${
                            trial.day2.completed
                              ? 'bg-emerald-600 text-white'
                              : 'border-2 border-stone-300 bg-white'
                          }`}
                        >
                          {trial.day2.completed && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>
                      </button>

                      {/* Day 3 */}
                      <button
                        type="button"
                        onClick={() => handleToggleDay(trial.id, 3)}
                        className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition cursor-pointer ${
                          trial.day3.completed
                            ? 'bg-emerald-500 border-emerald-600 text-white shadow-xs'
                            : 'bg-stone-50 border-stone-200 text-stone-600'
                        }`}
                      >
                        <span className="text-xs font-bold">3. Gün</span>
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center mt-1 ${
                            trial.day3.completed
                              ? 'bg-white text-emerald-600'
                              : 'border-2 border-stone-300 bg-white'
                          }`}
                        >
                          {trial.day3.completed && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Reaction Selector */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 block">
                      Reaksiyon / Alerji Durumu:
                    </label>
                    <select
                      value={trial.reaction}
                      onChange={(e) => handleReactionChange(trial.id, e.target.value as ReactionStatus)}
                      className={`w-full text-xs font-semibold py-2 px-3 rounded-xl border cursor-pointer focus:outline-none ${reactionInfo.color}`}
                    >
                      <option value="none">🟢 Reaksiyon Yok (Güvenli)</option>
                      <option value="rash">🔴 Kızarıklık / Döküntü</option>
                      <option value="digestive">🟡 Sindirim / Gaz Sorunu</option>
                      <option value="rejected">🟣 Israrla Reddetti</option>
                      <option value="vomiting">🟠 Kusma</option>
                      <option value="swelling">🚨 Şişlik / Acil Durum</option>
                    </select>
                  </div>

                  {/* Enjoyment (Bebeğin Beğenme Durumu) */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                        Bebeğin Beğenme Durumu:
                      </label>
                      <span className="text-xs text-stone-600 font-medium">{enjoymentInfo.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {([1, 2, 3, 4, 5] as EnjoymentLevel[]).map((level) => {
                        const conf = ENJOYMENT_CONFIG[level];
                        const isSelected = trial.enjoyment === level;
                        return (
                          <button
                            key={level}
                            type="button"
                            onClick={() => handleEnjoymentChange(trial.id, level)}
                            className={`text-2xl p-1 rounded-lg transition-transform ${
                              isSelected
                                ? 'scale-120 bg-amber-100 border border-amber-300'
                                : 'opacity-40 hover:opacity-100'
                            }`}
                          >
                            {conf.emoji}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Note input */}
                  <div>
                    <input
                      type="text"
                      defaultValue={trial.notes || ''}
                      placeholder="Kısa not (miktar, dışkı veya tepki)..."
                      onBlur={(e) => handleUpdateNotes(trial.id, e.target.value)}
                      className="w-full text-xs py-1.5 px-3 border border-stone-200 rounded-xl text-stone-700 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add New Food Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-stone-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🥣</span>
                <div>
                  <h3 className="text-lg font-bold font-heading text-stone-900">
                    Yeni Besin Denemesi Başlat
                  </h3>
                  <p className="text-xs text-stone-500">
                    3 gün boyunca takip edilecek yeni gıdayı ekleyin.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTrialSubmit} className="space-y-4 pt-4">
              {/* Quick Preset Selector */}
              <div>
                <label className="text-xs font-semibold text-stone-600 block mb-1.5">
                  Popüler Başlangıç Besinlerinden Hızlıca Seçin:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {STARTER_PRESETS.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        setNewFoodName(item.name);
                        setNewCategory(item.cat as FoodCategory);
                      }}
                      className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 hover:text-amber-900 border border-stone-200/70 transition cursor-pointer"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Food Name */}
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Besin Adı <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Havuç, Avokado, Yumurta Sarısı..."
                  value={newFoodName}
                  onChange={(e) => setNewFoodName(e.target.value)}
                  className="w-full text-sm py-2 px-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Kategori
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as FoodCategory)}
                  className="w-full text-sm py-2 px-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  <option value="sebze">🥕 Sebzeler</option>
                  <option value="meyve">🍎 Meyveler</option>
                  <option value="sut_urunleri">🥣 Yoğurt & Peynir</option>
                  <option value="protein">🍳 Protein & Et / Yumurta</option>
                  <option value="tahil">🌾 Tahıllar & Baklagiller</option>
                  <option value="yag_tohum">🥑 Sağlıklı Yağlar</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  className="w-full text-sm py-2 px-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Başlangıç Notu (İsteğe bağlı)
                </label>
                <textarea
                  rows={2}
                  placeholder="Örn: Sabah 10:00'da buharda çatalla ezilerek 1 çay kaşığı verildi..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full text-sm py-2 px-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition cursor-pointer shadow-sm active:scale-95"
                >
                  Listeye Ekle ve Başlat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
