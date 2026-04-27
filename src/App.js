import { useState } from "react";

const formatCurrency = (n) =>
  `${Math.round(n).toLocaleString("tr-TR")} TL`;
const formatPercent = (n) => `%${n.toFixed(1)}`;

const DEFAULTS = {
  roomCount: 250,
  avgRoomPrice: 4500,
  occupancyRate: 68,
  seasonMonths: 8,
  revenueManagerSalary: 45000,
};

const INNWISE_PRICING = {
  base: 12000,
  perRoom: 25,
  setup: 15000,
};

const BENCHMARKS = {
  revparLift: 0.12,
  occupancyLift: 0.04,
  reputationRevLift: 0.035,
  timeSavedHours: 18,
  staffCostReduction: 0.15,
};

export default function App() {
  const [inputs, setInputs] = useState(DEFAULTS);
  const [activeTab, setActiveTab] = useState("revenue");

  const update = (key, val) =>
    setInputs((p) => ({ ...p, [key]: Number(val) }));

  const totalRooms = inputs.roomCount;
  const daysPerSeason = inputs.seasonMonths * 30;
  const currentRevPAR = (inputs.avgRoomPrice * inputs.occupancyRate) / 100;
  const currentAnnualRev = currentRevPAR * totalRooms * daysPerSeason;

  const revParLiftAmount = currentRevPAR * BENCHMARKS.revparLift;
  const newRevPAR = currentRevPAR + revParLiftAmount;
  const revenueGain = revParLiftAmount * totalRooms * daysPerSeason;
  const reputationGain = currentAnnualRev * BENCHMARKS.reputationRevLift;
  const occupancyGain =
    inputs.avgRoomPrice * BENCHMARKS.occupancyLift * totalRooms * daysPerSeason;
  const staffSaving =
    inputs.revenueManagerSalary *
    BENCHMARKS.staffCostReduction *
    inputs.seasonMonths;

  const totalAnnualGain = revenueGain + reputationGain + occupancyGain + staffSaving;
  const monthlyCost = INNWISE_PRICING.base + INNWISE_PRICING.perRoom * totalRooms;
  const firstYearCost = monthlyCost * 12 + INNWISE_PRICING.setup;
  const recurringCost = monthlyCost * 12;
  const netGain = totalAnnualGain - firstYearCost;
  const roiPercent = (netGain / firstYearCost) * 100;
  const paybackMonths = Math.ceil(firstYearCost / (totalAnnualGain / 12));

  const bars = [
    { label: "RevPAR Artışı", value: revenueGain, color: "#00D4FF" },
    { label: "Reputation Geliri", value: reputationGain, color: "#7B61FF" },
    { label: "Doluluk Artışı", value: occupancyGain, color: "#00FF94" },
    { label: "Personel Tasarrufu", value: staffSaving, color: "#FFB800" },
  ];
  const maxBar = Math.max(...bars.map((b) => b.value));

  const tabs = [
    { id: "revenue", label: "Gelir" },
    { id: "reputation", label: "İtibar" },
    { id: "efficiency", label: "Verimlilik" },
    { id: "summary", label: "Özet" },
  ];

  const sliders = [
    { key: "roomCount", label: "Oda Sayısı", min: 150, max: 800, step: 10, unit: "oda" },
    { key: "avgRoomPrice", label: "Ort. Oda Fiyatı (TL/gece)", min: 2000, max: 15000, step: 500, unit: "₺" },
    { key: "occupancyRate", label: "Doluluk Oranı", min: 40, max: 95, step: 1, unit: "%" },
    { key: "seasonMonths", label: "Aktif Sezon", min: 4, max: 12, step: 1, unit: "ay" },
    { key: "revenueManagerSalary", label: "Rev. Müd. Maliyet (TL/ay)", min: 20000, max: 150000, step: 5000, unit: "₺" },
  ];

  const s = {
    wrap: { fontFamily: "'Courier New', monospace", background: "#080C14", minHeight: "100vh", color: "#E8EDF5" },
    header: { background: "#0D1420", borderBottom: "1px solid #1E2A3A", padding: "24px 32px" },
    badge: { fontSize: "10px", letterSpacing: "4px", color: "#00D4FF", textTransform: "uppercase", marginBottom: "6px" },
    h1: { fontSize: "32px", fontWeight: "700", margin: "0 0 2px", color: "#E8EDF5", letterSpacing: "-1px" },
    sub: { margin: 0, color: "#4A6070", fontSize: "12px", letterSpacing: "1px" },
    grid: { display: "grid", gridTemplateColumns: "320px 1fr", minHeight: "calc(100vh - 100px)" },
    left: { background: "#0B1018", borderRight: "1px solid #1E2A3A", padding: "24px 20px" },
    right: { padding: "24px 32px", overflowY: "auto" },
    sectionLabel: { fontSize: "10px", letterSpacing: "3px", color: "#3A4A5C", display: "block", marginBottom: "14px" },
    kpiGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px", marginBottom: "24px" },
    kpiCard: (color) => ({
      background: "#0D1420", border: `1px solid ${color}33`,
      borderRadius: "8px", padding: "16px 14px",
    }),
    kpiLabel: { fontSize: "9px", color: "#4A6070", letterSpacing: "2px", marginBottom: "6px" },
    kpiVal: (color) => ({ fontSize: "20px", fontWeight: "700", color, lineHeight: 1, marginBottom: "2px" }),
    kpiSub: { fontSize: "9px", color: "#3A4A5C" },
    tabRow: { display: "flex", gap: "2px", marginBottom: "20px", borderBottom: "1px solid #1E2A3A" },
    tab: (active) => ({
      background: "none", border: "none", cursor: "pointer",
      padding: "8px 16px", fontSize: "10px", letterSpacing: "2px",
      color: active ? "#00D4FF" : "#4A6070",
      borderBottom: active ? "2px solid #00D4FF" : "2px solid transparent",
      marginBottom: "-1px",
    }),
    card: { background: "#0D1420", border: "1px solid #1E2A3A", borderRadius: "8px", padding: "18px", marginBottom: "12px" },
    pricingBox: {
      background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.15)",
      borderRadius: "8px", padding: "14px", marginTop: "8px",
    },
    row: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" },
  };

  return (
    <div style={s.wrap}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.badge}>ROI ANALİZİ · BÜYÜK RESORT · TÜRKİYE 2026</div>
        <h1 style={s.h1}>INNWISE</h1>
        <p style={s.sub}>Yatırım Getirisi Hesaplayıcı</p>
      </div>

      <div style={s.grid}>
        {/* LEFT */}
        <div style={s.left}>
          <span style={s.sectionLabel}>OTEL PARAMETRELERİ</span>

          {sliders.map(({ key, label, min, max, step, unit }) => {
            const pct = ((inputs[key] - min) / (max - min)) * 100;
            return (
              <div key={key} style={{ marginBottom: "18px" }}>
                <div style={s.row}>
                  <span style={{ fontSize: "11px", color: "#6B8090" }}>{label}</span>
                  <span style={{
                    fontSize: "11px", fontWeight: "600", color: "#00D4FF",
                    background: "rgba(0,212,255,0.08)", padding: "2px 7px", borderRadius: "4px",
                  }}>
                    {inputs[key].toLocaleString("tr-TR")} {unit}
                  </span>
                </div>
                <input
                  type="range" min={min} max={max} step={step}
                  value={inputs[key]}
                  onChange={(e) => update(key, e.target.value)}
                  style={{
                    width: "100%", appearance: "none", height: "3px", outline: "none",
                    border: "none", cursor: "pointer", borderRadius: "2px",
                    background: `linear-gradient(to right, #00D4FF ${pct}%, #1E2A3A ${pct}%)`,
                  }}
                />
              </div>
            );
          })}

          <div style={s.pricingBox}>
            <span style={{ ...s.sectionLabel, color: "#00D4FF" }}>INNWISE MALİYETİ</span>
            {[
              ["Aylık Abonelik", formatCurrency(monthlyCost)],
              ["Kurulum (Tek Seferlik)", formatCurrency(INNWISE_PRICING.setup)],
              ["1. Yıl Toplam", formatCurrency(firstYearCost)],
              ["Sonraki Yıllar", formatCurrency(recurringCost) + "/yıl"],
            ].map(([label, value]) => (
              <div key={label} style={s.row}>
                <span style={{ fontSize: "11px", color: "#4A6070" }}>{label}</span>
                <span style={{ fontSize: "11px", color: "#E8EDF5", fontWeight: "600" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div style={s.right}>
          {/* KPIs */}
          <div style={s.kpiGrid}>
            {[
              { label: "YILLIK KAZANIM", value: formatCurrency(totalAnnualGain), sub: "toplam fayda", color: "#00FF94" },
              { label: "NET GETİRİ (1.YIL)", value: formatCurrency(netGain), sub: "kazanım - maliyet", color: netGain > 0 ? "#00D4FF" : "#FF4757" },
              { label: "ROI", value: `${roiPercent > 0 ? "+" : ""}${Math.round(roiPercent)}%`, sub: "yatırım getirisi", color: "#7B61FF" },
              { label: "GERİ ÖDEME", value: `${paybackMonths} ay`, sub: "başabaş noktası", color: "#FFB800" },
            ].map(({ label, value, sub, color }) => (
              <div key={label} style={s.kpiCard(color)}>
                <div style={s.kpiLabel}>{label}</div>
                <div style={s.kpiVal(color)}>{value}</div>
                <div style={s.kpiSub}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={s.tabRow}>
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={s.tab(activeTab === t.id)}>
                {t.label.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Tab: Gelir */}
          {activeTab === "revenue" && (
            <div>
              <div style={s.card}>
                <span style={s.sectionLabel}>GELİR ETKİSİ DAĞILIMI</span>
                {bars.map(({ label, value, color }) => (
                  <div key={label} style={{ marginBottom: "14px" }}>
                    <div style={s.row}>
                      <span style={{ fontSize: "12px", color: "#7B9BB5" }}>{label}</span>
                      <span style={{ fontSize: "12px", fontWeight: "700", color }}>{formatCurrency(value)}</span>
                    </div>
                    <div style={{ height: "5px", background: "#1E2A3A", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${(value / maxBar) * 100}%`,
                        background: color, borderRadius: "3px",
                        transition: "width 0.5s ease",
                        boxShadow: `0 0 6px ${color}66`,
                      }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={s.card}>
                <span style={s.sectionLabel}>REVPAR ANALİZİ</span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", textAlign: "center" }}>
                  {[
                    { label: "Mevcut RevPAR", value: formatCurrency(currentRevPAR), note: "gece/oda", color: "#E8EDF5" },
                    { label: "Hedef RevPAR", value: formatCurrency(newRevPAR), note: `+${formatPercent(BENCHMARKS.revparLift * 100)} artış`, color: "#00D4FF" },
                    { label: "Mevcut Yıllık Gelir", value: formatCurrency(currentAnnualRev), note: "oda geliri", color: "#E8EDF5" },
                  ].map(({ label, value, note, color }) => (
                    <div key={label}>
                      <div style={{ fontSize: "10px", color: "#3A4A5C", marginBottom: "6px" }}>{label}</div>
                      <div style={{ fontSize: "16px", fontWeight: "700", color }}>{value}</div>
                      <div style={{ fontSize: "10px", color: "#4A6070" }}>{note}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.1)", borderRadius: "8px", padding: "14px" }}>
                <div style={{ fontSize: "11px", color: "#4A6070", lineHeight: 1.7 }}>
                  📊 <strong style={{ color: "#7B9BB5" }}>Kaynak:</strong> Sektör araştırmaları AI destekli gelir yönetiminin büyük resort'larda %12–20 RevPAR artışı sağladığını göstermektedir. Bu hesaplama %12 (muhafazakâr) esas alınmıştır. Jannah Hotels & Resorts, UAE portföyünde %22 RevPAR artışı elde etmiştir.
                </div>
              </div>
            </div>
          )}

          {/* Tab: İtibar */}
          {activeTab === "reputation" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                {[
                  { label: "Reputation Gelir Artışı", value: formatCurrency(reputationGain), unit: "yıllık", color: "#7B61FF" },
                  { label: "Aylık Kazanım", value: formatCurrency(reputationGain / 12), unit: "/ay", color: "#00D4FF" },
                ].map(({ label, value, unit, color }) => (
                  <div key={label} style={s.card}>
                    <div style={{ fontSize: "10px", color: "#3A4A5C", marginBottom: "8px" }}>{label}</div>
                    <div style={{ fontSize: "22px", fontWeight: "700", color }}>
                      {value} <span style={{ fontSize: "11px", color: "#4A6070" }}>{unit}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={s.card}>
                <span style={s.sectionLabel}>İNNWISE İTİBAR MODÜLLERİ</span>
                {[
                  ["Review Otomatik Yanıt", "Yanıt oranı %100, puan +0.2–0.5"],
                  ["Çok Dilli Sentiment Analizi", "Rusça/Almanca/Arapça izleme"],
                  ["Gerçek Zamanlı Alert", "Negatif yorum anında tespit"],
                  ["Rekabet Benchmarking", "CompSet karşısında konum takibi"],
                  ["AI Yanıt Önerileri", "Marka uyumlu kişiselleştirilmiş yanıtlar"],
                ].map(([feat, impact]) => (
                  <div key={feat} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #1E2A3A", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#7B61FF", flexShrink: 0 }} />
                      <span style={{ fontSize: "12px", color: "#7B9BB5" }}>{feat}</span>
                    </div>
                    <span style={{ fontSize: "10px", color: "#4A6070", maxWidth: "200px", textAlign: "right" }}>{impact}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(123,97,255,0.04)", border: "1px solid rgba(123,97,255,0.1)", borderRadius: "8px", padding: "14px" }}>
                <div style={{ fontSize: "11px", color: "#4A6070", lineHeight: 1.7 }}>
                  💬 Booking.com araştırmaları puan ortalamasındaki 0.5 puanlık artışın %3–4 ek gelir dönüşümüne yol açtığını göstermektedir. Bu hesaplama %3.5 (muhafazakâr) esas alınmıştır.
                </div>
              </div>
            </div>
          )}

          {/* Tab: Verimlilik */}
          {activeTab === "efficiency" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                {[
                  { label: "Haftada Kazanılan Saat", value: `${BENCHMARKS.timeSavedHours} saat`, color: "#00FF94" },
                  { label: "Personel Maliyet Tasarrufu", value: formatCurrency(staffSaving), color: "#FFB800" },
                  { label: "Doluluk Artışından Kazanım", value: formatCurrency(occupancyGain), color: "#00D4FF" },
                  { label: "Yeni Doluluk Oranı", value: `%${(inputs.occupancyRate + BENCHMARKS.occupancyLift * 100).toFixed(0)}`, color: "#7B61FF" },
                ].map(({ label, value, color }) => (
                  <div key={label} style={s.card}>
                    <div style={{ fontSize: "10px", color: "#3A4A5C", marginBottom: "8px" }}>{label}</div>
                    <div style={{ fontSize: "20px", fontWeight: "700", color }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={s.card}>
                <span style={s.sectionLabel}>VERİMLİLİK KAZANIMLARI</span>
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", marginBottom: "8px" }}>
                  {["GÖREV", "ÖNCE", "SONRA", "KAZANIM"].map((h) => (
                    <span key={h} style={{ fontSize: "9px", color: "#3A4A5C", letterSpacing: "1px" }}>{h}</span>
                  ))}
                </div>
                {[
                  ["Manuel raporlama", "12–15 saat/hafta", "Otomatik", "60 saat/ay"],
                  ["Rakip fiyat takibi", "4–6 saat/hafta", "Gerçek zamanlı", "20 saat/ay"],
                  ["Review yanıtlama", "5–8 saat/hafta", "AI destekli", "25 saat/ay"],
                  ["Fiyatlama kararları", "Reaktif", "Proaktif AI", "Gelir riski azalır"],
                ].map(([task, before, after, saving]) => (
                  <div key={task} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", padding: "9px 0", borderBottom: "1px solid #1E2A3A", fontSize: "11px", gap: "8px" }}>
                    <span style={{ color: "#7B9BB5" }}>{task}</span>
                    <span style={{ color: "#FF4757" }}>{before}</span>
                    <span style={{ color: "#00FF94" }}>{after}</span>
                    <span style={{ color: "#FFB800" }}>{saving}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Özet */}
          {activeTab === "summary" && (
            <div>
              <div style={s.card}>
                <span style={s.sectionLabel}>3 YILLIK PROJEKSİYON</span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px" }}>
                  {[
                    { year: "1. Yıl", gain: totalAnnualGain, cost: firstYearCost, net: netGain },
                    { year: "2. Yıl", gain: totalAnnualGain * 1.1, cost: recurringCost, net: totalAnnualGain * 1.1 - recurringCost },
                    { year: "3. Yıl", gain: totalAnnualGain * 1.22, cost: recurringCost, net: totalAnnualGain * 1.22 - recurringCost },
                  ].map(({ year, gain, cost, net }, i) => (
                    <div key={year} style={{
                      border: `1px solid ${i === 0 ? "rgba(0,212,255,0.3)" : "#1E2A3A"}`,
                      borderRadius: "8px", padding: "14px", textAlign: "center",
                      background: i === 0 ? "rgba(0,212,255,0.04)" : "transparent",
                    }}>
                      <div style={{ fontSize: "10px", color: "#3A4A5C", marginBottom: "10px" }}>{year}</div>
                      <div style={{ marginBottom: "6px" }}>
                        <div style={{ fontSize: "9px", color: "#4A6070" }}>Kazanım</div>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: "#00FF94" }}>{formatCurrency(gain)}</div>
                      </div>
                      <div style={{ marginBottom: "6px" }}>
                        <div style={{ fontSize: "9px", color: "#4A6070" }}>Maliyet</div>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: "#FF4757" }}>{formatCurrency(cost)}</div>
                      </div>
                      <div style={{ borderTop: "1px solid #1E2A3A", paddingTop: "6px" }}>
                        <div style={{ fontSize: "9px", color: "#4A6070" }}>Net</div>
                        <div style={{ fontSize: "15px", fontWeight: "700", color: "#00D4FF" }}>{formatCurrency(net)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: "center", marginTop: "12px", padding: "10px", background: "rgba(0,255,148,0.04)", borderRadius: "6px", border: "1px solid rgba(0,255,148,0.1)" }}>
                  <span style={{ fontSize: "11px", color: "#4A6070" }}>3 Yıllık Kümülatif Net: </span>
                  <span style={{ fontSize: "15px", fontWeight: "700", color: "#00FF94" }}>
                    {formatCurrency(netGain + (totalAnnualGain * 1.1 - recurringCost) + (totalAnnualGain * 1.22 - recurringCost))}
                  </span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div style={s.card}>
                  <span style={s.sectionLabel}>VARSAYIMLAR</span>
                  {[
                    "RevPAR artışı: %12 (muhafazakâr)",
                    "Reputation gelir etkisi: %3.5",
                    "Doluluk artışı: +4 puan",
                    "Personel verimliliği: %15",
                    "Sezon büyümesi: yıllık %10",
                  ].map((item) => (
                    <div key={item} style={{ fontSize: "11px", color: "#4A6070", marginBottom: "5px", paddingLeft: "10px", borderLeft: "2px solid #1E2A3A" }}>{item}</div>
                  ))}
                </div>
                <div style={s.card}>
                  <span style={s.sectionLabel}>KAYNAKLAR</span>
                  {[
                    "HotelTechReport 2026 RMS Analizi",
                    "Duetto: Jannah Hotels %22 RevPAR",
                    "Cloudbeds Revenue Intelligence %18",
                    "Booking.com puan/gelir korelasyonu",
                    "OteliniSat Türkiye 2025 Raporu",
                  ].map((item) => (
                    <div key={item} style={{ fontSize: "11px", color: "#4A6070", marginBottom: "5px", paddingLeft: "10px", borderLeft: "2px solid #7B61FF44" }}>{item}</div>
                  ))}
                </div>
              </div>

              <div style={{
                background: "linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(123,97,255,0.06) 100%)",
                border: "1px solid rgba(0,212,255,0.2)", borderRadius: "10px", padding: "18px", textAlign: "center",
              }}>
                <div style={{ fontSize: "14px", color: "#E8EDF5", fontWeight: "600", marginBottom: "4px" }}>
                  {totalRooms} odalı tesisiniz {paybackMonths} ayda başabaş noktasına ulaşır
                </div>
                <div style={{ fontSize: "11px", color: "#4A6070" }}>
                  3. yılda kümülatif {formatCurrency(netGain + (totalAnnualGain * 1.1 - recurringCost) + (totalAnnualGain * 1.22 - recurringCost))} net kazanım
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        input[type=range] { -webkit-appearance: none; }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 13px; height: 13px;
          border-radius: 50%; background: #00D4FF; cursor: pointer;
          border: 2px solid #080C14; box-shadow: 0 0 6px rgba(0,212,255,0.5);
        }
        input[type=range]::-moz-range-thumb {
          width: 13px; height: 13px; border-radius: 50%;
          background: #00D4FF; cursor: pointer; border: 2px solid #080C14;
        }
      `}</style>
    </div>
  );
}
