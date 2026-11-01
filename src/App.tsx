import React, { useState, useEffect } from 'react';
import { ActiveTab, BabyProfile, DailyMealPlan, FoodTrial } from './types';
import {
  loadBabyProfile,
  saveBabyProfile,
  loadFoodTrials,
  saveFoodTrials,
  loadDailyMeals,
  saveDailyMeals,
  calculateAge,
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
import {
  CalendarCheck2,
  BookOpen,
  CalendarDays,
  ShieldAlert,
  Sparkles,
  Heart,
  Baby,
  Smartphone,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('tracker');
  const [profile, setProfile] = useState<BabyProfile>(() => loadBabyProfile());
  const [trials, setTrials] = useState<FoodTrial[]>(() => loadFoodTrials());
  const [meals, setMeals] = useState<Record<string, DailyMealPlan>>(() => loadDailyMeals());

  // Modals
  const [isDoctorSummaryOpen, setIsDoctorSummaryOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileExportOpen, setIsMobileExportOpen] = useState(false);

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
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 flex flex-col pb-20 md:pb-8 selection:bg-amber-200">
      {/* Top Header */}
      <Header
        profile={profile}
        trials={trials}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenDoctorSummary={() => setIsDoctorSummaryOpen(true)}
        onOpenMobileExport={() => setIsMobileExportOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-5 flex-1 w-full space-y-6">
        {/* Mobile Quick Install Prompt Banner */}
        <div className="md:hidden flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs">
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
        <div className="hidden md:flex items-center justify-between bg-stone-100/80 p-1.5 rounded-2xl border border-stone-200/80 shadow-2xs">
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
                      ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-amber-600' : 'text-stone-400'
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
      </main>

      {/* Mobile Bottom Navigation Bar (Fixed for thumb-friendly one-handed tapping) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 px-2 py-1.5 shadow-lg">
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
                    ? 'text-amber-700 font-bold bg-amber-50/70'
                    : 'text-stone-500 hover:text-stone-800'
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

      {/* PWA Offline Connectivity Indicator */}
      <OfflineIndicator />
    </div>
  );
}
