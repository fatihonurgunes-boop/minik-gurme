import React, { useState } from 'react';
import { BabyProfile, DailyMealPlan, FoodTrial } from '../types';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  Trash2,
  Download,
  CheckCircle2,
  AlertTriangle,
  X,
  FileCheck2,
  Smartphone,
  Info,
} from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BabyProfile;
  trials: FoodTrial[];
  meals: Record<string, DailyMealPlan>;
  onClearAllData: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  profile,
  trials,
  meals,
  onClearAllData,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  // Export JSON backup
  const handleExportData = () => {
    const fullBackup = {
      app: 'Minik Gurme - Bebek Ek Gıda & Menü Takibi',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      privacyNotice: 'Bu dosya yalnızca kullanıcının kendi cihazında oluşturulmuş yerel verileri içerir.',
      profile,
      trials,
      meals,
    };

    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `minik-gurme-gizlilik-yedek-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleExecuteClear = () => {
    onClearAllData();
    setConfirmClear(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-100 dark:border-stone-800 max-h-[92vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xl shadow-xs">
              <ShieldCheck className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-heading text-stone-900 dark:text-stone-100">
                  Gizlilik ve Veri Güvenliği Politikası
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                  %100 Cihaz İçi
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Bebeğinizin sağlığı ve mahremiyeti bizim için en yüksek önceliktir.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlights Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 p-4 rounded-2xl border border-emerald-200/80 flex items-start gap-3">
          <Lock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs text-stone-700 space-y-1">
            <span className="font-bold text-stone-900 block text-sm">
              Sıfır Bulut İletimi • Tamamen Yerel ve Gizli
            </span>
            <p className="leading-relaxed">
              Minik Gurme uygulamasına girdiğiniz bebeğinizin adı, doğum tarihi, alerji belirtileri, tadım notları ve günlük öğün kayıtları <strong>kesinlikle hiçbir uzak sunucuya veya üçüncü taraf şirketlere gönderilmez</strong>.
            </p>
          </div>
        </div>

        {/* Core Privacy Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Pillar 1 */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                1. Yerel Depolama (LocalStorage)
              </h4>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Tüm veriler yalnızca kullandığınız telefonun veya tarayıcının güvenli yerel hafızasında saklanır. Cihazınızı değiştirdiğinizde veriler kendiliğinden taşınmaz, yedek almanız gerekir.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                2. Sıfır Reklam ve Sıfır İzleyici
              </h4>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Uygulamada hiçbir reklam kütüphanesi, izleme çerezi (tracking cookie), Google Analytics veya kullanıcı profilleme aracı yer almaz. Davranışlarınız izlenmez.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                3. Veri Taşınabilirliği (Yedek Alma)
              </h4>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Girdiğiniz tüm besin ve alerji verileri size aittir. Dilediğiniz an tek tıkla standart ve şifresiz JSON dosyası olarak indirip bilgisayarınıza aktarabilirsiniz.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                4. Unutulma Hakkı (Tam Silme)
              </h4>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Cihazınızda saklanan tüm bebek profili, gıda deneme kayıtları ve günlük menüleri tek bir tuşla anında ve kalıcı olarak temizleyebilirsiniz.
            </p>
          </div>
        </div>

        {/* Medical & Health Disclaimer */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>Tıbbi ve Sağlık Sorumluluk Reddi Beyanı</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Minik Gurme uygulaması, ebeveynlerin bebeklerinin ek gıda sürecini düzenli takip edebilmeleri amacıyla tasarlanmış bir bilgilendirme ve kayıt aracıdır. Bir hekim, çocuk sağlığı ve hastalıkları uzmanı veya klinik diyetisyen tavsiyesi niteliği taşımaz. Bebeğinizde solunum güçlüğü, yüzde/dudakta şişlik veya yaygın kurdeşen gibi akut alerjik reaksiyonlar görüldüğünde derhal 112 Acil Çağrı Merkezine veya en yakın sağlık kuruluşuna başvurunuz.
          </p>
        </div>

        {/* Current Stored Data Summary */}
        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs space-y-2">
          <h4 className="font-bold text-stone-800 flex items-center justify-between">
            <span>Cihazınızda Kayıtlı Olan Veriler:</span>
            <span className="text-[11px] font-normal text-stone-500">
              {trials.length} Besin Kaydı • {Object.keys(meals).length} Günlük Menü
            </span>
          </h4>
          <div className="flex flex-wrap gap-2 text-[11px] text-stone-600">
            <span className="bg-white px-2 py-1 rounded-lg border border-stone-200">
              Bebek: <strong>{profile.name}</strong>
            </span>
            <span className="bg-white px-2 py-1 rounded-lg border border-stone-200">
              Doğum Tarihi: <strong>{profile.birthDate}</strong>
            </span>
            <span className="bg-white px-2 py-1 rounded-lg border border-stone-200">
              Güvenli Besinler: <strong>{trials.filter((t) => t.approvedSafe).length} adet</strong>
            </span>
            <span className="bg-white px-2 py-1 rounded-lg border border-stone-200">
              Alerji/Reaksiyon: <strong>{trials.filter((t) => t.reaction !== 'none').length} adet</strong>
            </span>
          </div>
        </div>

        {/* Direct Privacy Link Share Box */}
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
          <label className="font-bold text-stone-700 flex items-center gap-1.5">
            <span>🔗 Doğrudan Gizlilik Politikası Bağlantısı:</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={typeof window !== 'undefined' ? `${window.location.origin}/#privacy` : 'https://ais-pre-3hb2wtx4c6cpyyoaflj7ui-632517013484.europe-west3.run.app/#privacy'}
              className="w-full text-xs py-2 px-3 bg-white border border-stone-200 rounded-xl text-stone-700 select-all focus:outline-none"
            />
            <button
              onClick={() => {
                const privacyUrl = typeof window !== 'undefined' ? `${window.location.origin}/#privacy` : 'https://ais-pre-3hb2wtx4c6cpyyoaflj7ui-632517013484.europe-west3.run.app/#privacy';
                navigator.clipboard.writeText(privacyUrl);
                setDownloadSuccess(true);
                setTimeout(() => setDownloadSuccess(false), 2500);
              }}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition cursor-pointer shrink-0 active:scale-95 shadow-xs"
            >
              Bağlantıyı Kopyala
            </button>
          </div>
        </div>

        {/* Action Controls: Export & Delete */}
        <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Export JSON */}
            <button
              onClick={handleExportData}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2 active:scale-95 shadow-xs"
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Yedek İndirildi!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-stone-600" />
                  <span>Verilerimi İndir (JSON)</span>
                </>
              )}
            </button>

            {/* Clear All Data */}
            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                className="flex-1 sm:flex-none px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Tüm Verileri Temizle</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleExecuteClear}
                  className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
                >
                  Evet, Kalıcı Olarak Sil
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-2.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 font-semibold text-xs rounded-xl transition cursor-pointer"
                >
                  İptal
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs"
          >
            Anladım & Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
