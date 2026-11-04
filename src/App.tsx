import React, { useState, useEffect } from 'react';
import { ActiveTab, BabyProfile, DailyMealPlan, FoodTrial, ThemeMode } from './types';
import {
  loadBabyProfile,
  saveBabyProfile,
  loadFoodTrials,
  saveFoodTrials,
  loadDailyMeals,
  saveDailyMeals,
  calculateAge,
  loadThemeMode,
  saveThemeMode,
} from './utils/storage';
import { Header } from './components/Header';
import { ThreeDayTracker } from './components/ThreeDayTracker';
import { FoodGuide } from './components/FoodGuide';
import { MealPlanner } from './components/MealPlanner';
import { SafetyCards } from './components/SafetyCards';
import { DoctorSummaryModal } from './components/DoctorSummaryModal';
import { BabyProfileModal } from './components/BabyProfileModal';
import { MobileExportModal } from './components/MobileExportModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PrivacyModal } from './components/PrivacyModal';
import {
  CalendarCheck2,
  BookOpen,
  CalendarDays,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Heart,
  Baby,
  Smartphone,
  Lock,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('tracker');
  const [theme, setTheme] = useState<ThemeMode>(() => loadThemeMode());
  const [profile, setProfile] = useState<BabyProfile>(() => loadBabyProfile());
  const [trials, setTrials] = useState<FoodTrial[]>(() => loadFoodTrials());
  const [meals, setMeals] = useState<Record<string, DailyMealPlan>>(() => loadDailyMeals());

  // Modals
  const [isDoctorSummaryOpen, setIsDoctorSummaryOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileExportOpen, setIsMobileExportOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Sync theme with document element class (.dark)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    saveThemeMode(newTheme);
  };

  // URL Hash & Deep Linking for Privacy (#privacy or ?privacy=true)
  useEffect(() => {
    const handleUrlState = () => {
      if (typeof window === 'undefined') return;
      const urlParams = new URLSearchParams(window.location.search);
      const hash = (window.location.hash || '').toLowerCase();
      if (urlParams.get('privacy') === 'true' || hash === '#privacy' || window.location.pathname === '/privacy') {
        setIsPrivacyOpen(true);
      }
    };

    handleUrlState();
    window.addEventListener('hashchange', handleUrlState);
    window.addEventListener('popstate', handleUrlState);
    return () => {
      window.removeEventListener('hashchange', handleUrlState);
      window.removeEventListener('popstate', handleUrlState);
    };
  }, []);

  const openPrivacyModal = () => {
    setIsPrivacyOpen(true);
    try {
      window.history.replaceState(null, '', '#privacy');
    } catch {
      // ignore
    }
  };

  const closePrivacyModal = () => {
    setIsPrivacyOpen(false);
    try {
      if (window.location.hash === '#privacy') {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } catch {
      // ignore
    }
  };

  // Sync state changes with localStorage
  const handleUpdateProfile = (newProfile: BabyProfile) => {
    setProfile(newProfile);
    saveBabyProfile(newProfile);
  };

  const handleUpdateTrials = (newTrials: FoodTrial[]) => {
    setTrials(newTrials);
    saveFoodTrials(newTrials);
  };

  const handleUpdateMeals = (newMeals: Record<string, DailyMealPlan>) => {
    setMeals(newMeals);
    saveDailyMeals(newMeals);
  };

  const handleResetAllData = (
    p: BabyProfile,
    t: FoodTrial[],
    m: Record<string, DailyMealPlan>
  ) => {
    setProfile(p);
    setTrials(t);
    setMeals(m);
    saveBabyProfile(p);
    saveFoodTrials(t);
    saveDailyMeals(m);
  };

  const handleClearAllData = () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    const blankProfile: BabyProfile = {
      name: 'Bebeğim',
      birthDate: new Date().toISOString().split('T')[0],
      avatar: '👶',
      allergiesNote: '',
    };
    setProfile(blankProfile);
    setTrials([]);
    setMeals({});
    saveBabyProfile(blankProfile);
    saveFoodTrials([]);
    saveDailyMeals({});
  };

  const handleAddTrialFromGuide = (newTrial: FoodTrial) => {
    // Avoid duplicates by name
    const exists = trials.some(
      (t) => t.foodName.toLowerCase().trim() === newTrial.foodName.toLowerCase().trim()
    );
    if (!exists) {
      handleUpdateTrials([newTrial, ...trials]);
    }
  };

  const age = calculateAge(profile.birthDate);

  const TABS = [
    {
      id: 'tracker' as ActiveTab,
      label: '3 Gün Kuralı & Takip',
      shortLabel: '3 Gün Takibi',
      icon: CalendarCheck2,
      badge: trials.filter((t) => !t.approvedSafe && t.reaction === 'none').length,
    },
    {
      id: 'guide' as ActiveTab,
      label: 'Ay Ay Gıda Rehberi',
      shortLabel: 'Gıda Rehberi',
      icon: BookOpen,
    },
    {
      id: 'planner' as ActiveTab,
      label: 'Günlük Menü Planlayıcı',
      shortLabel: 'Menü Planı',
      icon: CalendarDays,
    },
    {
      id: 'safety' as ActiveTab,
      label: 'Kritik Uyarılar & Bilgi',
      shortLabel: 'Güvenlik',
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#171513] text-stone-800 dark:text-stone-100 flex flex-col pb-20 md:pb-8 selection:bg-amber-200 dark:selection:bg-amber-900/40 transition-colors">
      {/* Top Header */}
      <Header
        profile={profile}
        trials={trials}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenDoctorSummary={() => setIsDoctorSummaryOpen(true)}
        onOpenMobileExport={() => setIsMobileExportOpen(true)}
        onOpenPrivacy={openPrivacyModal}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-5 flex-1 w-full space-y-6">
        {/* Mobile Quick Install Prompt Banner */}
        <div className="md:hidden flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 text-white shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-xs font-bold leading-tight">Telefonda Uygulama Olarak Aç</div>
              <div className="text-[11px] text-amber-100 leading-tight">Ana ekrana ekleyip internetsiz kullanın</div>
            </div>
          </div>
          <button
            onClick={() => setIsMobileExportOpen(true)}
            className="px-3 py-1.5 bg-white text-stone-900 rounded-xl text-xs font-bold shadow-xs active:scale-95 cursor-pointer shrink-0"
          >
            Yükle / QR
          </button>
        </div>

        {/* Desktop Tab Navigation Bar */}
        <div className="hidden md:flex items-center justify-between bg-stone-100/80 dark:bg-stone-900/80 p-1.5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center gap-1.5 w-full">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs border border-stone-200/80 dark:border-stone-700'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-white/60 dark:hover:bg-stone-800/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-amber-600 dark:text-amber-400' : 'text-stone-400 dark:text-stone-500'
                    }`}
                  />
                  <span>{tab.label}</span>
                  {typeof tab.badge === 'number' && tab.badge > 0 && (
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'tracker' && (
          <ThreeDayTracker
            trials={trials}
            onSaveTrials={handleUpdateTrials}
            onOpenSafetyGuide={() => setActiveTab('safety')}
          />
        )}

        {activeTab === 'guide' && (
          <FoodGuide
            trials={trials}
            onAddTrialFromGuide={handleAddTrialFromGuide}
            onNavigateToTracker={() => setActiveTab('tracker')}
            babyCurrentMonths={age.months}
          />
        )}

        {activeTab === 'planner' && (
          <MealPlanner meals={meals} onSaveMeals={handleUpdateMeals} />
        )}

        {activeTab === 'safety' && <SafetyCards />}

        {/* Footer with Privacy & KVKK commitment */}
        <footer className="pt-8 pb-4 border-t border-stone-200/60 dark:border-stone-800 text-center space-y-2.5 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-medium">
            <button
              onClick={openPrivacyModal}
              className="inline-flex items-center gap-1.5 text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 font-bold transition cursor-pointer underline underline-offset-2 hover:decoration-emerald-500"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Gizlilik & Veri Güvenliği (%100 Cihaz İçi)</span>
            </button>
            <span className="text-stone-300 dark:text-stone-700 hidden sm:inline">•</span>
            <button
              onClick={() => setIsDoctorSummaryOpen(true)}
              className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition cursor-pointer"
            >
              Doktor Raporu
            </button>
            <span className="text-stone-300 dark:text-stone-700 hidden sm:inline">•</span>
            <button
              onClick={() => setIsMobileExportOpen(true)}
              className="text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 transition cursor-pointer"
            >
              Telefona Yükle
            </button>
          </div>
          <p className="text-[11px] text-stone-400 dark:text-stone-500 max-w-lg mx-auto leading-relaxed">
            Minik Gurme — Bebeğinize ait tüm sağlık ve beslenme kayıtları yalnızca kendi telefonunuzda/tarayıcınızda saklanır, uzak sunuculara veya üçüncü taraflara aktarılmaz.
          </p>
        </footer>
      </main>

      {/* Mobile Bottom Navigation Bar (Fixed for thumb-friendly one-handed tapping) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200/80 dark:border-stone-800 px-2 py-1.5 shadow-lg">
        <div className="grid grid-cols-4 gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition cursor-pointer relative ${
                  isActive
                    ? 'text-amber-700 dark:text-amber-300 font-bold bg-amber-50/70 dark:bg-amber-950/50'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {typeof tab.badge === 'number' && tab.badge > 0 && (
                    <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-full">
                  {tab.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Doctor Summary Modal */}
      <DoctorSummaryModal
        isOpen={isDoctorSummaryOpen}
        onClose={() => setIsDoctorSummaryOpen(false)}
        profile={profile}
        trials={trials}
      />

      {/* Baby Profile Modal */}
      <BabyProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        trials={trials}
        meals={meals}
        onResetAllData={handleResetAllData}
      />

      {/* Mobile Export / Install Modal */}
      <MobileExportModal
        isOpen={isMobileExportOpen}
        onClose={() => setIsMobileExportOpen(false)}
      />

      {/* Privacy and Data Protection Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={closePrivacyModal}
        profile={profile}
        trials={trials}
        meals={meals}
        onClearAllData={handleClearAllData}
      />

      {/* PWA Offline Connectivity Indicator */}
      <OfflineIndicator />
    </div>
  );
}
