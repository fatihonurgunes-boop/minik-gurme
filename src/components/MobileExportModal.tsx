import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Smartphone,
  QrCode,
  Copy,
  Check,
  X,
  Share2,
  Download,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Apple,
} from 'lucide-react';

interface MobileExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileExportModal: React.FC<MobileExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [activePlatform, setActivePlatform] = useState<'qr' | 'android' | 'ios'>(
    isIOS ? 'ios' : 'qr'
  );
  const [installSuccess, setInstallSuccess] = useState<boolean>(false);

  // App URL for mobile access
  const appUrl =
    typeof window !== 'undefined'
      ? (window.location.origin.includes('europe-west3.run.app')
          ? window.location.origin
          : 'https://ais-pre-3hb2wtx4c6cpyyoaflj7ui-632517013484.europe-west3.run.app')
      : 'https://ais-pre-3hb2wtx4c6cpyyoaflj7ui-632517013484.europe-west3.run.app';

  // Generate QR Code
  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(appUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#292524',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error('QR code generation error', err));
    }
  }, [isOpen, appUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTriggerInstall = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        setInstallSuccess(false);
        onClose();
      }, 1500);
    }
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Minik Gurme - Bebek Ek Gıda & Menü Takip Uygulaması:\n${appUrl}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-100 max-h-[92vh] overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl shadow-xs">
              <Smartphone className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading text-stone-900 flex items-center gap-2">
                <span>Telefonda Test Et & Yükle</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  PWA Mobil
                </span>
              </h3>
              <p className="text-xs text-stone-500">
                Uygulamayı telefonunuzun ana ekranına ekleyerek tam ekran ve internetsiz kullanın.
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

        {/* Platform Selector Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-stone-100 text-xs font-semibold">
          <button
            onClick={() => setActivePlatform('qr')}
            className={`flex-1 py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activePlatform === 'qr'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <QrCode className="w-4 h-4 text-amber-600" />
            <span>Kamera ile Tara (QR)</span>
          </button>

          <button
            onClick={() => setActivePlatform('android')}
            className={`flex-1 py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activePlatform === 'android'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🤖 Android</span>
          </button>

          <button
            onClick={() => setActivePlatform('ios')}
            className={`flex-1 py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activePlatform === 'ios'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>iPhone / iOS</span>
          </button>
        </div>

        {/* Tab 1: QR Code Scanner & Direct Links */}
        {activePlatform === 'qr' && (
          <div className="space-y-4 text-center">
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 max-w-xs mx-auto space-y-2">
              <div className="bg-white p-3 rounded-xl shadow-xs inline-block border border-amber-100">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="Telefonda Açmak İçin QR Kod"
                    className="w-52 h-52 mx-auto rounded-lg"
                  />
                ) : (
                  <div className="w-52 h-52 flex items-center justify-center text-xs text-stone-400">
                    QR Kod yükleniyor...
                  </div>
                )}
              </div>
              <p className="text-xs text-amber-900 font-medium">
                📱 Telefonunuzun kamerasını bu koda tutun ve açılan bildirime dokunun.
              </p>
            </div>

            {/* Copyable Link */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold text-stone-600 block text-left">
                Veya bağlantıyı telefonunuza gönderin:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={appUrl}
                  className="w-full text-xs py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-700 truncate select-all focus:outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="px-3 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-xl transition cursor-pointer shrink-0 flex items-center gap-1.5 shadow-xs active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Kopyalandı!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Kopyala</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp ile Kendine Gönder</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Android Instructions & Direct Native Install */}
        {activePlatform === 'android' && (
          <div className="space-y-4">
            {/* Direct 1-click install button if browser triggers beforeinstallprompt */}
            {isInstallable && (
              <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-center space-y-2">
                <span className="text-emerald-800 font-bold text-sm block">
                  🎉 Cihazınız Doğrudan Yüklemeyi Destekliyor!
                </span>
                <button
                  onClick={handleTriggerInstall}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>Minik Gurme'yi Telefona Yükle</span>
                </button>
                {installSuccess && (
                  <p className="text-xs text-emerald-700 font-bold">
                    ✓ Yükleme başlatıldı! Ana ekranınızı kontrol edin.
                  </p>
                )}
              </div>
            )}

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3 text-xs text-stone-700">
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <span>🤖 Android (Google Chrome) ile Ana Ekrana Ekleme:</span>
              </h4>
              <ol className="space-y-2.5 list-decimal list-inside leading-relaxed">
                <li>
                  Bağlantıyı <strong>Google Chrome</strong> tarayıcısında açın.
                </li>
                <li>
                  Sağ üst köşedeki <strong>üç nokta (⋮)</strong> menüsüne dokunun.
                </li>
                <li>
                  Menüden <strong>"Uygulamayı Yükle"</strong> veya{' '}
                  <strong>"Ana Ekrana Ekle"</strong> seçeneğini seçin.
                </li>
                <li>
                  Açılan onay penceresinde <strong>"Yükle"</strong> butonuna basın.
                </li>
              </ol>
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                ✨ Artık uygulama ana ekranınızda bir mobil uygulama simgesi olarak görünecek ve tarayıcı çubuğu olmadan tam ekran açılacaktır.
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: iOS (iPhone / iPad) Safari Instructions */}
        {activePlatform === 'ios' && (
          <div className="space-y-4">
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3 text-xs text-stone-700">
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <Apple className="w-4 h-4 text-stone-900" />
                <span>iPhone / iPad (Safari) ile Ana Ekrana Ekleme:</span>
              </h4>
              <ol className="space-y-2.5 list-decimal list-inside leading-relaxed">
                <li>
                  Bağlantıyı mutlaka varsayılan <strong>Safari</strong> tarayıcısında açın (Chrome veya Instagram içi tarayıcı değil).
                </li>
                <li>
                  Ekranın altındaki <strong>Paylaş</strong> simgesine (kare içinden çıkan yukarı ok ⎋) dokunun.
                </li>
                <li>
                  Açılan menüyü biraz aşağı kaydırıp <strong>"Ana Ekrana Ekle"</strong> (+ işaretli seçenek) seçeneğine basın.
                </li>
                <li>
                  Sağ üst köşedeki <strong>"Ekle"</strong> butonuna dokunarak tamamlayın.
                </li>
              </ol>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px] space-y-1">
                <strong>💡 Neden Safari?</strong>
                <p>
                  Apple, iOS sisteminde PWA uygulamalarının tam ekran çalışması ve bildirim alması için Safari üzerinden eklenmesini şart koşmaktadır.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PWA Advantages Footer */}
        <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Tam Ekran
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Çevrimdışı Çalışır
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ücretsiz
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-xl transition cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
