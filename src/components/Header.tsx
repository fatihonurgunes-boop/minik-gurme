import React from 'react';
import { BabyProfile, FoodTrial, ThemeMode } from '../types';
import { calculateAge } from '../utils/storage';
import {
  Calendar,
  ShieldAlert,
  Sparkles,
  User,
  FileText,
  CheckCircle2,
  Clock,
  Smartphone,
  Lock,
  Sun,
  Moon,
} from 'lucide-react';

interface HeaderProps {
  profile: BabyProfile;
  trials: FoodTrial[];
  theme: ThemeMode;
  onToggleTheme: (newTheme: ThemeMode) => void;
  onOpenProfile: () => void;
  onOpenDoctorSummary: () => void;
  onOpenMobileExport: () => void;
  onOpenPrivacy: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  trials,
  theme,
  onToggleTheme,
  onOpenProfile,
  onOpenDoctorSummary,
  onOpenMobileExport,
  onOpenPrivacy,
}) => {
  const age = calculateAge(profile.birthDate);

  const approvedSafeCount = trials.filter((t) => t.approvedSafe).length;
  const inProgressCount = trials.filter((t) => !t.approvedSafe && t.reaction === 'none').length;
  const reactionCount = trials.filter((t) => t.reaction !== 'none').length;

  return (
    <header className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-amber-100/70 dark:border-stone-800 sticky top-0 z-30 shadow-xs transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Baby Info & Branding */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenProfile}
              title="Bebeğin Profilini Düzenle"
              className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 border-2 border-amber-200/80 dark:border-stone-700 flex items-center justify-center text-2xl transition shadow-xs hover:scale-105 cursor-pointer"
            >
              <span>{profile.avatar || '👶'}</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-heading text-stone-800 dark:text-stone-100 tracking-tight flex items-center gap-1.5">
                  <span>{profile.name || 'Minik Gurme'}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                    Ek Gıda Günlüğü
                  </span>
                </h1>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-300 bg-amber-50/80 dark:bg-stone-800 px-2 py-0.5 rounded-md font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  {age.months} Ay {age.days} Günlük
                </span>
                <span className="text-stone-400 hidden sm:inline">•</span>
                <button
                  onClick={onOpenProfile}
                  className="text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 underline underline-offset-2 hover:decoration-amber-400 cursor-pointer text-xs"
                >
                  Profili Düzenle
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats & Action Buttons */}
          <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1.5 text-xs">
              <span
                title="Sorunsuz tamamlanan besinler"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200/70 dark:border-emerald-800"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{approvedSafeCount}</span>
                <span className="hidden md:inline font-normal">Güvenli</span>
              </span>

              <span
                title="Şu an devam eden 3 gün denemeleri"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold border border-amber-200/70 dark:border-amber-800"
              >
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{inProgressCount}</span>
                <span className="hidden md:inline font-normal">Deneniyor</span>
              </span>

              {reactionCount > 0 && (
                <span
                  title="Alerji veya sindirim reaksiyonu görülenler"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold border border-rose-200/70 dark:border-rose-800 animate-pulse"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span>{reactionCount}</span>
                  <span className="hidden md:inline font-normal">Reaksiyon</span>
                </span>
              )}
            </div>

            {/* Tema Seçici: Açık (Güneş ☀️) ve Koyu (Hilal 🌙) */}
            <div
              className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl border border-stone-200/80 dark:border-stone-700 shadow-2xs"
              role="group"
              aria-label="Arka Plan Tema Seçimi"
            >
              <button
                type="button"
                onClick={() => onToggleTheme('light')}
                title="Açık Renk Arka Plan (Güneş)"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white text-amber-600 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-100" />
                <span className="hidden md:inline text-[11px]">Açık</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleTheme('dark')}
                title="Koyu Renk Arka Plan (Hilal / Gece Modu)"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-stone-900 text-amber-300 shadow-xs border border-stone-700/60'
                    : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-amber-300 fill-amber-300/30" />
                <span className="hidden md:inline text-[11px]">Koyu</span>
              </button>
            </div>

            <button
              onClick={onOpenMobileExport}
              title="Uygulamayı telefonunuzda test edin veya yükleyin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer active:scale-95 animate-pulse hover:animate-none"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Telefona</span> Yükle
            </button>

            <button
              onClick={onOpenDoctorSummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs sm:text-sm font-semibold transition border border-stone-200 dark:border-stone-700 cursor-pointer shadow-xs active:scale-95"
            >
              <FileText className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
              <span className="hidden sm:inline">Doktor</span> Raporu
            </button>

            <button
              onClick={onOpenPrivacy}
              title="Gizlilik ve Veri Güvenliği Politikası"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold transition border border-emerald-200 dark:border-emerald-800 cursor-pointer shadow-xs active:scale-95"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span className="hidden sm:inline">Gizlilik</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
