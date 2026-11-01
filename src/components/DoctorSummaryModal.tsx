import React, { useState } from 'react';
import { BabyProfile, FoodTrial } from '../types';
import { calculateAge, formatTurkishDate } from '../utils/storage';
import { REACTION_LABELS, ENJOYMENT_CONFIG } from './ThreeDayTracker';
import {
  FileText,
  Printer,
  Copy,
  Check,
  X,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Share2,
} from 'lucide-react';

interface DoctorSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BabyProfile;
  trials: FoodTrial[];
}

export const DoctorSummaryModal: React.FC<DoctorSummaryModalProps> = ({
  isOpen,
  onClose,
  profile,
  trials,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const age = calculateAge(profile.birthDate);
  const safeFoods = trials.filter((t) => t.approvedSafe);
  const reactionFoods = trials.filter((t) => t.reaction !== 'none');
  const inProgressFoods = trials.filter((t) => !t.approvedSafe && t.reaction === 'none');

  // Text report generator for copy / WhatsApp
  const generatePlainTextReport = () => {
    let text = `📋 EK GIDA VE ALERJİ TAKİP RAPORU\n`;
    text += `Bebek: ${profile.name}\n`;
    text += `Yaş: ${age.months} Ay ${age.days} Günlük (Doğum: ${formatTurkishDate(profile.birthDate)})\n`;
    if (profile.allergiesNote) {
      text += `Aile Alerji Notu: ${profile.allergiesNote}\n`;
    }
    text += `Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}\n\n`;

    text += `✅ 3 GÜN KURALINI TAMAMLAYAN GÜVENLİ BESİNLER (${safeFoods.length}):\n`;
    if (safeFoods.length === 0) {
      text += `- Henüz tamamlanan yok\n`;
    } else {
      safeFoods.forEach((f) => {
        text += `- ${f.foodName} (${formatTurkishDate(f.startDate)}) | Beğenme: ${ENJOYMENT_CONFIG[f.enjoyment].emoji}\n`;
      });
    }

    text += `\n⚠️ REAKSİYON / ALERJİ GÖRÜLEN BESİNLER (${reactionFoods.length}):\n`;
    if (reactionFoods.length === 0) {
      text += `- Kayıtlı alerjik reaksiyon yok.\n`;
    } else {
      reactionFoods.forEach((f) => {
        text += `- ${f.foodName} | Reaksiyon: ${REACTION_LABELS[f.reaction].label} | Tarih: ${formatTurkishDate(f.startDate)}\n  Not: ${f.notes || 'Detay girilmedi'}\n`;
      });
    }

    text += `\n⏳ ŞU AN DENENMEKTE OLANLAR (${inProgressFoods.length}):\n`;
    inProgressFoods.forEach((f) => {
      const d1 = f.day1.completed ? '1.G:✓' : '1.G:✗';
      const d2 = f.day2.completed ? '2.G:✓' : '2.G:✗';
      const d3 = f.day3.completed ? '3.G:✓' : '3.G:✗';
      text += `- ${f.foodName} [${d1} ${d2} ${d3}] (Başlangıç: ${formatTurkishDate(f.startDate)})\n`;
    });

    return text;
  };

  const handleCopy = () => {
    const report = generatePlainTextReport();
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-100 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading text-stone-900">
                Pediatrist / Doktor Ek Gıda Özeti
              </h3>
              <p className="text-xs text-stone-500">
                Aylık doktor kontrolünde paylaşabileceğiniz düzenli besin ve alerji geçmişi.
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

        {/* Printable Card Area */}
        <div className="space-y-5 bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80">
          {/* Baby meta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
            <div>
              <div className="font-extrabold text-stone-900 text-lg flex items-center gap-2">
                <span>{profile.avatar}</span>
                <span>{profile.name}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {age.months} Ay {age.days} Günlük
                </span>
              </div>
              <div className="text-xs text-stone-500 mt-0.5">
                Doğum Tarihi: {formatTurkishDate(profile.birthDate)}
              </div>
            </div>
            <div className="text-xs text-stone-500 text-left sm:text-right">
              Rapor Tarihi: {new Date().toLocaleDateString('tr-TR')}
            </div>
          </div>

          {profile.allergiesNote && (
            <div className="text-xs p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
              <strong>Aile Alerji Özgeçmişi:</strong> {profile.allergiesNote}
            </div>
          )}

          {/* Section 1: Alerji / Reaksiyon */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Gözlenen Reaksiyon ve Alerjiler ({reactionFoods.length})</span>
            </h4>
            {reactionFoods.length === 0 ? (
              <p className="text-xs text-stone-500 italic bg-white p-3 rounded-xl border border-stone-200">
                Hiçbir besinde döküntü veya sindirim reaksiyonu gözlenmedi.
              </p>
            ) : (
              <div className="space-y-2">
                {reactionFoods.map((f) => (
                  <div
                    key={f.id}
                    className="p-3 bg-white rounded-xl border border-rose-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-stone-900">
                      <span>{f.foodName}</span>
                      <span className="text-rose-600 font-semibold">
                        {REACTION_LABELS[f.reaction].label}
                      </span>
                    </div>
                    <div className="text-stone-500 text-[11px]">
                      Tarih: {formatTurkishDate(f.startDate)}
                    </div>
                    {f.notes && (
                      <p className="text-stone-700 bg-rose-50/50 p-1.5 rounded-lg border border-rose-100">
                        {f.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Güvenli Tamamlananlar */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>3 Gün Kuralını Tamamlayan Güvenli Besinler ({safeFoods.length})</span>
            </h4>
            {safeFoods.length === 0 ? (
              <p className="text-xs text-stone-500 italic bg-white p-3 rounded-xl border border-stone-200">
                Henüz 3 günü tamamlanan besin yok.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {safeFoods.map((f) => (
                  <span
                    key={f.id}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-white border border-emerald-200 text-emerald-900 rounded-xl"
                  >
                    <span>{f.foodName}</span>
                    <span title="Beğenme">{ENJOYMENT_CONFIG[f.enjoyment].emoji}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Denenmekte Olanlar */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
              Denenmekte Olan Besinler ({inProgressFoods.length})
            </h4>
            <div className="space-y-1 text-xs text-stone-700">
              {inProgressFoods.map((f) => (
                <div
                  key={f.id}
                  className="p-2 bg-white rounded-xl border border-stone-200 flex items-center justify-between"
                >
                  <span className="font-semibold">{f.foodName}</span>
                  <span className="text-[11px] text-stone-500">
                    {f.day3.completed
                      ? '3. gün tamamlandı'
                      : f.day2.completed
                      ? '2. gün tamamlandı'
                      : f.day1.completed
                      ? '1. gün tamamlandı'
                      : 'Başlatıldı'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-stone-500">
            *Doktorunuza muayene esnasında telefonunuzdan gösterebilir veya yazdırabilirsiniz.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Metin Kopyala</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Yazdır / PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
