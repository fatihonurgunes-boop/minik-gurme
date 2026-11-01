import React from 'react';
import { BabyProfile, FoodTrial } from '../types';
import { calculateAge } from '../utils/storage';
import { Calendar, ShieldAlert, Sparkles, User, FileText, CheckCircle2, Clock, Smartphone } from 'lucide-react';

interface HeaderProps {
  profile: BabyProfile;
  trials: FoodTrial[];
  onOpenProfile: () => void;
  onOpenDoctorSummary: () => void;
  onOpenMobileExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  trials,
  onOpenProfile,
  onOpenDoctorSummary,
  onOpenMobileExport,
}) => {
  const age = calculateAge(profile.birthDate);

  const approvedSafeCount = trials.filter((t) => t.approvedSafe).length;
  const inProgressCount = trials.filter((t) => !t.approvedSafe && t.reaction === 'none').length;
  const reactionCount = trials.filter((t) => t.reaction !== 'none').length;

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-amber-100/70 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Baby Info & Branding */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenProfile}
              title="Bebeğin Profilini Düzenle"
              className="w-12 h-12 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-200/80 flex items-center justify-center text-2xl transition shadow-xs hover:scale-105 cursor-pointer"
            >
              <span>{profile.avatar || '👶'}</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-heading text-stone-800 tracking-tight flex items-center gap-1.5">
                  <span>{profile.name || 'Minik Gurme'}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                    Ek Gıda Günlüğü
                  </span>
                </h1>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
                <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50/80 px-2 py-0.5 rounded-md font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  {age.months} Ay {age.days} Günlük
                </span>
                <span className="text-stone-400 hidden sm:inline">•</span>
                <button
                  onClick={onOpenProfile}
                  className="text-stone-500 hover:text-stone-700 underline underline-offset-2 hover:decoration-amber-400 cursor-pointer text-xs"
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
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/70"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{approvedSafeCount}</span>
                <span className="hidden md:inline font-normal">Güvenli</span>
              </span>

              <span
                title="Şu an devam eden 3 gün denemeleri"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 font-semibold border border-amber-200/70"
              >
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>{inProgressCount}</span>
                <span className="hidden md:inline font-normal">Deneniyor</span>
              </span>

              {reactionCount > 0 && (
                <span
                  title="Alerji veya sindirim reaksiyonu görülenler"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 font-semibold border border-rose-200/70 animate-pulse"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  <span>{reactionCount}</span>
                  <span className="hidden md:inline font-normal">Reaksiyon</span>
                </span>
              )}
            </div>

            <button
              onClick={onOpenMobileExport}
              title="Uygulamayı telefonunuzda test edin veya yükleyin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer active:scale-95 animate-pulse hover:animate-none"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Telefona Yükle</span>
            </button>

            <button
              onClick={onOpenDoctorSummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold transition border border-stone-200 cursor-pointer shadow-xs active:scale-95"
            >
              <FileText className="w-3.5 h-3.5 text-stone-600" />
              <span>Doktor Raporu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
