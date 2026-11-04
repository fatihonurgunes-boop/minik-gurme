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
  Package,
  Play,
  FileCode2,
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
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState<'qr' | 'android' | 'ios' | 'playstore'>(
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-100 dark:border-stone-800 max-h-[92vh] overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xl shadow-xs">
              <Smartphone className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>Telefonda Test Et & Yükle</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
                  PWA Mobil
                </span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Uygulamayı telefonunuzun ana ekranına ekleyerek tam ekran ve internetsiz kullanın.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
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
            className={`flex-1 py-2 px-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activePlatform === 'ios'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>iOS</span>
          </button>

          <button
            onClick={() => setActivePlatform('playstore')}
            className={`flex-1 py-2 px-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activePlatform === 'playstore'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-emerald-600" />
            <span>Play Store</span>
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

        {/* Tab 4: Google Play Store Publication Package & Guide */}
        {activePlatform === 'playstore' && (
          <div className="space-y-4 text-xs">
            {/* Top Info Banner */}
            <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-2xl flex items-start gap-2.5 text-stone-800">
              <Play className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-stone-900 block text-sm">
                  Google Play Store Yayınlama Paketi Hazır!
                </span>
                <p className="text-[11px] text-stone-600 leading-relaxed mt-0.5">
                  Güvenlik gereği Google Play Console şifrenizi vermenize gerek yoktur. Google'ın resmi <strong>Trusted Web Activity (TWA)</strong> standardı sayesinde mağaza için gerekli tüm görseller, metinler ve imzalı <code>.aab</code> paketi oluşturma altyapısı hazırlandı.
                </p>
              </div>
            </div>

            {/* Store Listing Copyable Fields */}
            <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <FileCode2 className="w-4 h-4 text-amber-600" />
                <span>Play Console İçin Hazır Mağaza Metinleri</span>
              </h4>

              {/* Title */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-stone-500 font-semibold">
                  <span>Uygulama Adı (Maks. 30 Karakter):</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('Minik Gurme - Bebek Ek Gıda');
                      setCopiedField('title');
                      setTimeout(() => setCopiedField(null), 2000);
                    }}
                    className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer font-bold"
                  >
                    {copiedField === 'title' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedField === 'title' ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  readOnly
                  value="Minik Gurme - Bebek Ek Gıda"
                  className="w-full py-1.5 px-2.5 bg-white border border-stone-200 rounded-xl text-stone-800 font-semibold text-xs"
                />
              </div>

              {/* Short Description */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-stone-500 font-semibold">
                  <span>Kısa Açıklama (Maks. 80 Karakter):</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('3 gün kuralı alerji takibi, ay ay gıda rehberi ve günlük bebek menü planlayıcı.');
                      setCopiedField('shortDesc');
                      setTimeout(() => setCopiedField(null), 2000);
                    }}
                    className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer font-bold"
                  >
                    {copiedField === 'shortDesc' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedField === 'shortDesc' ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  readOnly
                  value="3 gün kuralı alerji takibi, ay ay gıda rehberi ve günlük bebek menü planlayıcı."
                  className="w-full py-1.5 px-2.5 bg-white border border-stone-200 rounded-xl text-stone-800 text-xs"
                />
              </div>

              {/* Privacy Policy URL */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-stone-500 font-semibold">
                  <span>Gizlilik Politikası URL'si (Play Store Zorunlu):</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${appUrl}/#privacy`);
                      setCopiedField('privacy');
                      setTimeout(() => setCopiedField(null), 2000);
                    }}
                    className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer font-bold"
                  >
                    {copiedField === 'privacy' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedField === 'privacy' ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  readOnly
                  value={`${appUrl}/#privacy`}
                  className="w-full py-1.5 px-2.5 bg-white border border-stone-200 rounded-xl text-stone-800 text-xs font-mono"
                />
              </div>

              {/* Package ID */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-stone-500 font-semibold">
                  <span>Paket Adı (Package Name / Application ID):</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('com.minikgurme.ekgida');
                      setCopiedField('package');
                      setTimeout(() => setCopiedField(null), 2000);
                    }}
                    className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer font-bold"
                  >
                    {copiedField === 'package' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedField === 'package' ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  readOnly
                  value="com.minikgurme.ekgida"
                  className="w-full py-1.5 px-2.5 bg-white border border-stone-200 rounded-xl text-stone-800 text-xs font-mono"
                />
              </div>
            </div>

            {/* Required Play Store Graphic Assets (Download buttons) */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Google Play İçin Hazırlanan Zorunlu Görseller</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href="/play-store-icon-512.png"
                  download="play-store-icon-512.png"
                  className="p-3 bg-white hover:bg-stone-100 rounded-xl border border-stone-200 flex items-center justify-between transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <img src="/play-store-icon-512.png" alt="512 Icon" className="w-8 h-8 rounded-lg" />
                    <div>
                      <span className="font-bold block text-xs">Uygulama Simgesi</span>
                      <span className="text-[10px] text-stone-500">512x512 PNG (32-bit)</span>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-stone-400" />
                </a>

                <a
                  href="/play-store-feature-graphic.png"
                  download="play-store-feature-graphic.png"
                  className="p-3 bg-white hover:bg-stone-100 rounded-xl border border-stone-200 flex items-center justify-between transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <img src="/play-store-feature-graphic.png" alt="Feature Graphic" className="w-12 h-6 object-cover rounded" />
                    <div>
                      <span className="font-bold block text-xs">Tanıtım Görseli</span>
                      <span className="text-[10px] text-stone-500">1024x500 PNG</span>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-stone-400" />
                </a>
              </div>
            </div>

            {/* 3-Step Play Store Submission Guide */}
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 text-stone-800 space-y-2.5">
              <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                🚀 3 Kolay Adımda Play Store'a Yükleyin:
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-[11px] text-stone-700 leading-relaxed">
                <li>
                  <strong>İmzalı .aab Dosyasını Alın:</strong> Google &amp; Microsoft destekli resmi{' '}
                  <a
                    href={`https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(appUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-amber-900 underline"
                  >
                    PWABuilder.com
                  </a>{' '}
                  sayfasına gidin ve "Package for Android" butonuna basarak Play Store için imzalı <code>.aab</code> dosyasını tek tıkla indirin.
                </li>
                <li>
                  <strong>Google Play Console'a Girin:</strong> "Uygulama Oluştur" deyin, yukarıdaki hazır başlık, açıklama ve indirdiğiniz 512x512 ikon ile 1024x500 tanıtım görselini yükleyin.
                </li>
                <li>
                  <strong>Paketi Yükleyin &amp; Yayınlayın:</strong> İndirdiğiniz <code>.aab</code> dosyasını Play Console'da "Üretim (Production)" sekmesine sürükleyin ve "İncelemeye Gönder"e basın!
                </li>
              </ol>
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
