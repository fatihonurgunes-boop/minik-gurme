import React, { useState } from 'react';
import { BabyProfile, DailyMealPlan, FoodTrial } from '../types';
import {
  INITIAL_PROFILE,
  INITIAL_TRIALS,
  INITIAL_MEALS,
  saveBabyProfile,
  saveFoodTrials,
  saveDailyMeals,
} from '../utils/storage';
import { X, User, Calendar, RefreshCw, Download, Upload, Check } from 'lucide-react';

interface BabyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BabyProfile;
  onUpdateProfile: (newProfile: BabyProfile) => void;
  trials: FoodTrial[];
  meals: Record<string, DailyMealPlan>;
  onResetAllData: (p: BabyProfile, t: FoodTrial[], m: Record<string, DailyMealPlan>) => void;
}

const AVATAR_OPTIONS = ['👶', '👧', '🧒', '🐥', '🐻', '🍓', '🥑', '🍼', '🍎', '🥕'];

export const BabyProfileModal: React.FC<BabyProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  trials,
  meals,
  onResetAllData,
}) => {
  const [name, setName] = useState(profile.name);
  const [birthDate, setBirthDate] = useState(profile.birthDate);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [allergiesNote, setAllergiesNote] = useState(profile.allergiesNote || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BabyProfile = {
      name: name.trim() || 'Minik Gurme',
      birthDate,
      avatar,
      allergiesNote: allergiesNote.trim(),
    };
    onUpdateProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Tüm veriler sıfırlanıp başlangıç örnek verilerine dönecektir. Devam etmek istiyor musunuz?'
      )
    ) {
      onResetAllData(INITIAL_PROFILE, INITIAL_TRIALS, INITIAL_MEALS);
      setName(INITIAL_PROFILE.name);
      setBirthDate(INITIAL_PROFILE.birthDate);
      setAvatar(INITIAL_PROFILE.avatar);
      setAllergiesNote(INITIAL_PROFILE.allergiesNote || '');
      onClose();
    }
  };

  // Export JSON backup
  const handleExportBackup = () => {
    const backupData = {
      profile,
      trials,
      meals,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ek-gida-yedek-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-100 dark:border-stone-800 max-h-[90vh] overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧸</span>
            <div>
              <h3 className="text-lg font-bold font-heading text-stone-900 dark:text-stone-100">
                Bebeğin Profilini Düzenle
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                İsim, doğum tarihi ve avatarı kişiselleştirin.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Picker */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1.5">
              Avatar Seçimi:
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {AVATAR_OPTIONS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setAvatar(em)}
                  className={`text-2xl p-2 rounded-2xl transition cursor-pointer border ${
                    avatar === em
                      ? 'bg-amber-100 border-amber-400 scale-110 shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Baby Name */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Bebeğin Adı:
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Can, Zeynep..."
              className="w-full text-sm py-2 px-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Birth Date */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Doğum Tarihi (Ay hesaplaması için):
            </label>
            <input
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full text-sm py-2 px-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Allergies note */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Aile Alerji Özgeçmişi & Özel Notlar:
            </label>
            <textarea
              rows={2}
              value={allergiesNote}
              onChange={(e) => setAllergiesNote(e.target.value)}
              placeholder="Örn: Anne süt alerjisi, polen hassasiyeti..."
              className="w-full text-xs sm:text-sm py-2 px-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition cursor-pointer"
            >
              Kapat
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Kaydedildi!</span>
                </>
              ) : (
                <span>Değişiklikleri Kaydet</span>
              )}
            </button>
          </div>
        </form>

        {/* Data Management Section */}
        <div className="pt-4 border-t border-stone-100 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Veri Yedekleme & Sıfırlama
          </h4>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleExportBackup}
              className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Yedek İndir (JSON)</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Örnek Verilere Sıfırla</span>
            </button>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-[11px] text-emerald-900 flex items-center gap-2">
            <span>🔒</span>
            <span className="leading-tight">
              <strong>Gizlilik Güvencesi:</strong> Bebeğinize ait veriler %100 telefonunuzun/cihazınızın yerel hafızasında saklanır, asla buluta gönderilmez.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
