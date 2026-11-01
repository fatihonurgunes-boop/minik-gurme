import React, { useState } from 'react';
import { SAFETY_CARDS, SafetyCardItem } from '../data/safetyTips';
import {
  AlertTriangle,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2,
} from 'lucide-react';

export const SafetyCards: React.FC = () => {
  const [expandedCardId, setExpandedCardId] = useState<string | null>('prohibited-foods');

  const toggleExpand = (id: string) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="bg-rose-50/90 border border-rose-200/90 rounded-2xl p-4 sm:p-6 text-stone-800 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              <h2 className="text-lg sm:text-xl font-bold font-heading text-rose-950">
                Kritik Uyarılar & Bebek Güvenlik Rehberi
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-700 max-w-2xl leading-relaxed">
              Bebeğinizin sağlığı ve güvenliği için her ebeveynin mutlaka bilmesi gereken hayati kurallar.
              1 yaş altı yasakları, boğulma önleme, oturma kriterleri ve acil alerji müdahale protokolü aşağıdadır.
            </p>
          </div>

          {/* Emergency Call Box */}
          <div className="bg-white/90 border border-rose-300 rounded-2xl p-3 shrink-0 flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-lg">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                Acil Durum (Solunum / Şişlik)
              </div>
              <div className="text-base font-extrabold text-stone-900 tracking-tight">
                112 Acil Çağrı
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Cards Accordion / Grid */}
      <div className="space-y-4">
        {SAFETY_CARDS.map((card) => {
          const isExpanded = expandedCardId === card.id;

          return (
            <div
              key={card.id}
              className={`bg-white rounded-2xl border transition-all shadow-xs ${
                isExpanded ? 'border-amber-300 ring-2 ring-amber-500/10' : 'border-stone-200/80 hover:border-stone-300'
              }`}
            >
              {/* Card Header (Clickable) */}
              <button
                type="button"
                onClick={() => toggleExpand(card.id)}
                className="w-full text-left p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="text-3xl p-2 bg-stone-50 rounded-2xl shrink-0">
                    {card.icon}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-base sm:text-lg text-stone-900 font-heading">
                        {card.title}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${card.badgeColor}`}>
                        {card.badge}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-500 mt-0.5 line-clamp-1 sm:line-clamp-none">
                      {card.shortSummary}
                    </p>
                  </div>
                </div>

                <div className="p-1.5 rounded-xl bg-stone-100 text-stone-600 shrink-0">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-1 border-t border-stone-100 space-y-4">
                  {/* Emergency Alert if applicable */}
                  {card.emergencyNote && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="font-bold block">Önemli Güvenlik Notu:</span>
                        <p className="leading-relaxed">{card.emergencyNote}</p>
                      </div>
                    </div>
                  )}

                  {/* Key Points Bullet List */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                      Temel Kurallar & Tıbbi Nedenleri:
                    </h4>
                    <div className="space-y-2">
                      {card.keyPoints.map((point, idx) => {
                        const parts = point.split(':');
                        const hasColon = parts.length > 1;
                        return (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-stone-50/70 border border-stone-100 flex items-start gap-2 text-xs sm:text-sm text-stone-700"
                          >
                            <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            <div className="leading-relaxed">
                              {hasColon ? (
                                <>
                                  <strong className="text-stone-900 font-semibold">{parts[0]}:</strong>
                                  <span>{parts.slice(1).join(':')}</span>
                                </>
                              ) : (
                                <span>{point}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Do's and Don'ts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {/* Do's */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Yapılması Gerekenler</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-stone-700">
                        {card.doAndDonts.dos.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Don'ts */}
                    <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 uppercase tracking-wider">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Uzak Durulması Gerekenler</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-stone-700">
                        {card.doAndDonts.donts.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-rose-600 font-bold">✕</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Summary Pill Cheat Sheet */}
      <div className="bg-amber-50/60 rounded-2xl border border-amber-200/70 p-4 sm:p-5 space-y-3">
        <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
          <span>💡</span>
          <span>Bebek Beslenmesinde Altın Özet</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          <div className="bg-white p-3 rounded-xl border border-stone-200 text-stone-700 space-y-1">
            <span className="font-bold text-stone-900 block">🍯 1 Yaş Öncesi Sıfır Bal</span>
            Botulizm zehirlenmesine karşı 1 yaşına kadar tek bir damla dahi verilmez.
          </div>
          <div className="bg-white p-3 rounded-xl border border-stone-200 text-stone-700 space-y-1">
            <span className="font-bold text-stone-900 block">🍇 Üzüm ve Çeri 4'e Bölünür</span>
            Boğulmayı önlemek için nefes borusunu tıkayabilecek yuvarlak gıdalar boyuna kesilir.
          </div>
          <div className="bg-white p-3 rounded-xl border border-stone-200 text-stone-700 space-y-1">
            <span className="font-bold text-stone-900 block">🍼 Anne Sütü/Mama Ana Gıdadır</span>
            1 yaşına kadar ek gıda tadım ve damak zevki içindir; doymak için değil.
          </div>
        </div>
      </div>
    </div>
  );
};
