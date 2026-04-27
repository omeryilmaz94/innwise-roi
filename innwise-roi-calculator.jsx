import { useState, useEffect } from "react";

const formatCurrency = (n, currency = "TL") =>
  `${Math.round(n).toLocaleString("tr-TR")} ${currency}`;
const formatPercent = (n) => `%${n.toFixed(1)}`;

const DEFAULTS = {
  roomCount: 250,
  avgRoomPrice: 4500,
  occupancyRate: 68,
  seasonMonths: 8,
  reviewScore: 7.8,
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

export default function InnwiseROI() {
  const [inputs, setInputs] = useState(DEFAULTS);
  const [activeTab, setActiveTab] = useState("revenue");
  const [animKey, setAnimKey] = useState(0);

  const update = (key, val) => {
    setInputs((p) => ({ ...p, [key]: Number(val) }));
    setAnimKey((k) => k + 1);
  };

  // ── Calculations ──────────────────────────────────────────────
  const totalRooms = inputs.roomCount;
  const daysPerSeason = inputs.seasonMonths * 30;
  const currentRevPAR = (inputs.avgRoomPrice * inputs.occupancyRate) / 100;
  const currentAnnualRev = currentRevPAR * totalRooms * daysPerSeason;

  // Revenue lift
  const revParLiftAmount = currentRevPAR * BENCHMARKS.revparLift;
  const newRevPAR = currentRevPAR + revParLiftAmount;
  const revenueGain = revParLiftAmount * totalRooms * daysPerSeason;

  // Reputation lift
  const reputationGain = currentAnnualRev * BENCHMARKS.reputationRevLift;

  // Occupancy lift
  const occupancyGain =
    inputs.avgRoomPrice *
    BENCHMARKS.occupancyLift *
    totalRooms *
    daysPerSeason;

  // Staff efficiency
  const managerMonthlyCost = inputs.revenueManagerSalary;
  const staffSaving =
    managerMonthlyCost * BENCHMARKS.staffCostReduction * inputs.seasonMonths;

  // Total gains
  const totalAnnualGain = revenueGain + reputationGain + occupancyGain + staffSaving;

  // Innwise cost
  const monthlyCost = INNWISE_PRICING.base + INNWISE_PRICING.perRoom * totalRooms;
  const annualCost = monthlyCost * 12 + INNWISE_PRICING.setup;
  const firstYearCost = annualCost;
  const recurringCost = monthlyCost * 12;

  // ROI
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

  return (
    <div style={{
      fontFamily: "'DM Mono', 'Courier New', monospace",
      background: "#080C14",
      minHeight: "100vh",
      color: "#E8EDF5",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0D1420 0%, #111827 100%)",
        borderBottom: "1px solid #1E2A3A",
        padding: "32px 40px 24px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: "400px", height: "200px",
          background: "radial-gradient(ellipse at top right, rgba(0,212,255,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", marginBottom: "8px" }}>
          <span style={{ fontSize: "11px", letterSpacing: "4px", color: "#00D4FF", textTransform: "uppercase" }}>
            ROI ANALİZİ
          </span>
          <span style={{ fontSize: "11px", color: "#3A4A5C", letterSpacing: "2px" }}>v2.6 · 2026</span>
        </div>
        <h1 style={{
          fontSize: "36px", fontWeight: "700", margin: "0 0 4px",
          fontFamily: "'DM Mono', monospace",
          background: "linear-gradient(90deg, #E8EDF5 0%, #7B9BB5 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: "-1px",
        }}>
          INNWISE
        </h1>
        <p style={{ margin: 0, color: "#4A6070", fontSize: "13px", letterSpacing: "1px" }}>
          Büyük Resort Yatırım Getirisi Hesaplayıcı · Türkiye Pazarı
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", minHeight: "calc(100vh - 120px)" }}>

        {/* ── LEFT PANEL: Inputs ── */}
        <div style={{
          background: "#0B1018",
          borderRight: "1px solid #1E2A3A",
          padding: "32px 24px",
        }}>
          <div style={{ marginBottom: "24px" }}>
            <span style={{ fontSize: "10px", letterSpacing: "3px", color: "#3A4A5C", display: "block", marginBottom: "16px" }}>
              OTEL PARAMETRELERİ
            </span>

            {[
              { key: "roomCount", label: "Oda Sayısı", min: 150, max: 800, step: 10, unit: "oda" },
              { key: "avgRoomPrice", label: "Ortalama Oda Fiyatı (TL/gece)", min: 2000, max: 15000, step: 500, unit: "₺" },
              { key: "occupancyRate", label: "Mevcut Doluluk Oranı", min: 40, max: 95, step: 1, unit: "%" },
              { key: "seasonMonths", label: "Aktif Sezon Süresi", min: 4, max: 12, step: 1, unit: "ay" },
              { key: "revenueManagerSalary", label: "Rev. Müd. Aylık Maliyet (TL)", min: 20000, max: 150000, step: 5000, unit: "₺" },
            ].map(({ key, label, min, max, step, unit }) => (
              <div key={key} style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "11px", color: "#6B8090", letterSpacing: "0.5px" }}>{label}</span>
                  <span style={{
                    fontSize: "12px", fontWeight: "600", color: "#00D4FF",
                    background: "rgba(0,212,255,0.08)",
                    padding: "2px 8px", borderRadius: "4px",
                  }}>
                    {inputs[key].toLocaleString("tr-TR")} {unit}
                  </span>
                </div>
                <input
                  type="range" min={min} max={max} step={step}
                  value={inputs[key]}
                  onChange={(e) => update(key, e.target.value)}
                  style={{
                    width: "100%", appearance: "none",
                    height: "3px", background: `linear-gradient(to right, #00D4FF ${((inputs[key] - min) / (max - min)) * 100}%, #1E2A3A ${((inputs[key] - min) / (max - min)) * 100}%)`,
                    outline: "none", border: "none", cursor: "pointer",
                    borderRadius: "2px",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Innwise Pricing */}
          <div style={{
            background: "rgba(0,212,255,0.04)",
            border: "1px solid rgba(0,212,255,0.15)",
            borderRadius: "8px",
            padding: "16px",
            marginTop: "8px",
          }}>
            <span style={{ fontSize: "10px", letterSpacing: "3px", color: "#00D4FF", display: "block", marginBottom: "12px" }}>
              INNWISE MALİYETİ
            </span>
            {[
              { label: "Aylık Abonelik", value: formatCurrency(monthlyCost) },
              { label: "Kurulum (Tek Seferlik)", value: formatCurrency(INNWISE_PRICING.setup) },
              { label: "1. Yıl Toplam", value: formatCurrency(firstYearCost) },
              { label: "Sonraki Yıllar", value: formatCurrency(recurringCost) + "/yıl" },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "11px", color: "#4A6070" }}>{label}</span>
                <span style={{ fontSize: "11px", color: "#E8EDF5", fontWeight: "600" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL: Results ── */}
        <div style={{ padding: "32px 40px", overflowY: "auto" }}>

          {/* KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "32px" }}>
            {[
              { label: "Yıllık Kazanım", value: formatCurrency(totalAnnualGain), sub: "toplam fayda", color: "#00FF94", glow: "rgba(0,255,148,0.15)" },
              { label: "Net Getiri (1.Yıl)", value: formatCurrency(netGain), sub: "kazanım - maliyet", color: netGain > 0 ? "#00D4FF" : "#FF4757", glow: "rgba(0,212,255,0.15)" },
              { label: "ROI", value: `${roiPercent > 0 ? "+" : ""}${Math.round(roiPercent)}%`, sub: "1. yıl yatırım getirisi", color: "#7B61FF", glow: "rgba(123,97,255,0.15)" },
              { label: "Geri Ödeme", value: `${paybackMonths} ay`, sub: "başabaş noktası", color: "#FFB800", glow: "rgba(255,184,0,0.15)" },
            ].map(({ label, value, sub, color, glow }) => (
              <div key={label} style={{
                background: `linear-gradient(135deg, ${glow} 0%, #0D1420 100%)`,
                border: `1px solid ${color}33`,
                borderRadius: "10px",
                padding: "20px 16px",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: 0, right: 0,
                  width: "60px", height: "60px",
                  background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
                }} />
                <div style={{ fontSize: "10px", color: "#4A6070", letterSpacing: "2px", marginBottom: "8px" }}>{label.toUpperCase()}</div>
                <div style={{ fontSize: "22px", fontWeight: "700", color, lineHeight: 1, marginBottom: "4px" }}>{value}</div>
                <div style={{ fontSize: "10px", color: "#3A4A5C" }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "24px", borderBottom: "1px solid #1E2A3A", paddingBottom: "0" }}>
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "10px 20px",
                fontSize: "11px", letterSpacing: "2px",
                color: activeTab === t.id ? "#00D4FF" : "#4A6070",
                borderBottom: activeTab === t.id ? "2px solid #00D4FF" : "2px solid transparent",
                marginBottom: "-1px",
                transition: "all 0.2s",
              }}>
                {t.label.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "revenue" && (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#3A4A5C", marginBottom: "16px" }}>GELİR ETKİSİ DAĞILIMI</div>
                {bars.map(({ label, value, color }) => (
                  <div key={label} style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "12px", color: "#7B9BB5" }}>{label}</span>
                      <span style={{ fontSize: "12px", fontWeight: "700", color }}>{formatCurrency(value)}</span>
                    </div>
                    <div style={{ height: "6px", background: "#1E2A3A", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: `${(value / maxBar) * 100}%`,
                        background: color,
                        borderRadius: "3px",
                        transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
                        boxShadow: `0 0 8px ${color}66`,
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                background: "#0D1420", border: "1px solid #1E2A3A", borderRadius: "8px", padding: "20px",
              }}>
                <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#3A4A5C", marginBottom: "16px" }}>REVPAR ANALİZİ</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                  {[
                    { label: "Mevcut RevPAR", value: formatCurrency(currentRevPAR), note: "gece/oda" },
                    { label: "Hedef RevPAR", value: formatCurrency(newRevPAR), note: `+${formatPercent(BENCHMARKS.revparLift * 100)} artış`, color: "#00D4FF" },
                    { label: "Yıllık Oda Geliri", value: formatCurrency(currentAnnualRev), note: "mevcut" },
                  ].map(({ label, value, note, color }) => (
                    <div key={label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "10px", color: "#3A4A5C", marginBottom: "6px" }}>{label}</div>
                      <div style={{ fontSize: "18px", fontWeight: "700", color: color || "#E8EDF5" }}>{value}</div>
                      <div style={{ fontSize: "10px", color: "#4A6070" }}>{note}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                marginTop: "16px", background: "rgba(0,212,255,0.04)",
                border: "1px solid rgba(0,212,255,0.1)", borderRadius: "8px", padding: "16px",
              }}>
                <div style={{ fontSize: "10px", color: "#4A6070", lineHeight: 1.6 }}>
                  📊 <strong style={{ color: "#7B9BB5" }}>Kaynak:</strong> Sektör araştırmaları, AI destekli gelir yönetimi sistemlerinin büyük resort'larda ortalama %12–20 RevPAR artışı sağladığını göstermektedir. Bu hesaplama %12 (muhafazakâr) esas alınmıştır.
                  Jannah Hotels &amp; Resorts (UAE) Duetto ile %22 RevPAR artışı elde etmiştir.
                </div>
              </div>
            </div>
          )}

          {activeTab === "reputation" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                {[
                  { label: "Mevcut Puan", value: inputs.reviewScore.toFixed(1), unit: "/10", color: "#FFB800" },
                  { label: "Hedef Puan", value: (inputs.reviewScore + 0.4).toFixed(1), unit: "/10", color: "#00FF94" },
                  { label: "İtibar Gelir Artışı", value: formatCurrency(reputationGain), unit: "yıllık", color: "#7B61FF" },
                  { label: "Aylık Kazanım", value: formatCurrency(reputationGain / 12), unit: "/ay", color: "#00D4FF" },
                ].map(({ label, value, unit, color }) => (
                  <div key={label} style={{
                    background: "#0D1420", border: "1px solid #1E2A3A",
                    borderRadius: "8px", padding: "20px",
                  }}>
                    <div style={{ fontSize: "10px", color: "#3A4A5C", marginBottom: "8px" }}>{label}</div>
                    <div style={{ fontSize: "28px", fontWeight: "700", color }}>
                      {value} <span style={{ fontSize: "14px", color: "#4A6070" }}>{unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#0D1420", border: "1px solid #1E2A3A", borderRadius: "8px", padding: "20px" }}>
                <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#3A4A5C", marginBottom: "16px" }}>İNNWISE İTİBAR MODÜLLERİ</div>
                {[
                  { feature: "Review Otomatik Yanıt", impact: "Yanıt oranı %100'e çıkar, puan +0.2–0.5 artar" },
                  { feature: "Çok Dilli Sentiment Analizi", impact: "Rusça/Almanca/Arapça review izleme" },
                  { feature: "Gerçek Zamanlı Alert", impact: "Negatif yorum anında tespit" },
                  { feature: "Rekabet Benchmarking", impact: "CompSet karşısında konum takibi" },
                  { feature: "AI Yanıt Önerileri", impact: "Kişiselleştirilmiş, marka uyumlu yanıtlar" },
                ].map(({ feature, impact }) => (
                  <div key={feature} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "10px 0", borderBottom: "1px solid #1E2A3A",
                    alignItems: "center",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#7B61FF" }} />
                      <span style={{ fontSize: "12px", color: "#7B9BB5" }}>{feature}</span>
                    </div>
                    <span style={{ fontSize: "11px", color: "#4A6070", maxWidth: "220px", textAlign: "right" }}>{impact}</span>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: "16px", background: "rgba(123,97,255,0.04)",
                border: "1px solid rgba(123,97,255,0.1)", borderRadius: "8px", padding: "16px",
              }}>
                <div style={{ fontSize: "10px", color: "#4A6070", lineHeight: 1.6 }}>
                  💬 Booking.com çalışmaları, puan ortalamasındaki 0.5 puanlık artışın %3–4 ek gelir dönüşümüne yol açtığını göstermektedir. Bu hesaplama %3.5 (muhafazakâr) esas alınmıştır.
                </div>
              </div>
            </div>
          )}

          {activeTab === "efficiency" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                {[
                  { label: "Haftada Kazanılan Saat", value: `${BENCHMARKS.timeSavedHours}`, unit: "saat/hafta", color: "#00FF94" },
                  { label: "Personel Maliyet Tasarrufu", value: formatCurrency(staffSaving), unit: "sezon/yıl", color: "#FFB800" },
                  { label: "Doluluk Artışından Kazanım", value: formatCurrency(occupancyGain), unit: "yıllık", color: "#00D4FF" },
                  { label: "Yeni Doluluk Oranı", value: `%${(inputs.occupancyRate + BENCHMARKS.occupancyLift * 100).toFixed(0)}`, unit: "hedef", color: "#7B61FF" },
                ].map(({ label, value, unit, color }) => (
                  <div key={label} style={{
                    background: "#0D1420", border: "1px solid #1E2A3A",
                    borderRadius: "8px", padding: "20px",
                  }}>
                    <div style={{ fontSize: "10px", color: "#3A4A5C", marginBottom: "8px" }}>{label}</div>
                    <div style={{ fontSize: "26px", fontWeight: "700", color }}>
                      {value} <span style={{ fontSize: "12px", color: "#4A6070" }}>{unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#0D1420", border: "1px solid #1E2A3A", borderRadius: "8px", padding: "20px" }}>
                <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#3A4A5C", marginBottom: "16px" }}>VERİMLİLİK KAZANIMLARI</div>
                {[
                  { task: "Manuel rapor hazırlama", before: "12–15 saat/hafta", after: "Otomatik", saving: "60 saat/ay" },
                  { task: "Rakip fiyat takibi", before: "4–6 saat/hafta", after: "Gerçek zamanlı", saving: "20 saat/ay" },
                  { task: "Review yanıtlama", before: "5–8 saat/hafta", after: "AI destekli", saving: "25 saat/ay" },
                  { task: "Fiyatlama kararları", before: "Reaktif", after: "Proaktif AI", saving: "Gelir riski azalır" },
                ].map(({ task, before, after, saving }) => (
                  <div key={task} style={{
                    display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
                    padding: "10px 0", borderBottom: "1px solid #1E2A3A",
                    fontSize: "11px", gap: "8px", alignItems: "center",
                  }}>
                    <span style={{ color: "#7B9BB5" }}>{task}</span>
                    <span style={{ color: "#FF4757" }}>{before}</span>
                    <span style={{ color: "#00FF94" }}>{after}</span>
                    <span style={{ color: "#FFB800" }}>{saving}</span>
                  </div>
                ))}
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", padding: "8px 0 0", fontSize: "10px", color: "#3A4A5C", gap: "8px" }}>
                  <span>GÖREV</span>
                  <span>ÖNCE</span>
                  <span>SONRA</span>
                  <span>KAZANIM</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "summary" && (
            <div>
              {/* 3-Year Projection */}
              <div style={{ background: "#0D1420", border: "1px solid #1E2A3A", borderRadius: "8px", padding: "20px", marginBottom: "16px" }}>
                <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#3A4A5C", marginBottom: "20px" }}>3 YILLIK PROJEKSİYON</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                  {[
                    { year: "1. Yıl", gain: totalAnnualGain, cost: firstYearCost, net: netGain },
                    { year: "2. Yıl", gain: totalAnnualGain * 1.1, cost: recurringCost, net: totalAnnualGain * 1.1 - recurringCost },
                    { year: "3. Yıl", gain: totalAnnualGain * 1.22, cost: recurringCost, net: totalAnnualGain * 1.22 - recurringCost },
                  ].map(({ year, gain, cost, net }, i) => (
                    <div key={year} style={{
                      background: i === 0 ? "rgba(0,212,255,0.04)" : "transparent",
                      border: `1px solid ${i === 0 ? "rgba(0,212,255,0.2)" : "#1E2A3A"}`,
                      borderRadius: "8px", padding: "16px", textAlign: "center",
                    }}>
                      <div style={{ fontSize: "10px", color: "#3A4A5C", marginBottom: "12px" }}>{year}</div>
                      <div style={{ marginBottom: "8px" }}>
                        <div style={{ fontSize: "10px", color: "#4A6070" }}>Kazanım</div>
                        <div style={{ fontSize: "14px", fontWeight: "700", color: "#00FF94" }}>{formatCurrency(gain)}</div>
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <div style={{ fontSize: "10px", color: "#4A6070" }}>Maliyet</div>
                        <div style={{ fontSize: "14px", fontWeight: "700", color: "#FF4757" }}>{formatCurrency(cost)}</div>
                      </div>
                      <div style={{ borderTop: "1px solid #1E2A3A", paddingTop: "8px" }}>
                        <div style={{ fontSize: "10px", color: "#4A6070" }}>Net</div>
                        <div style={{ fontSize: "16px", fontWeight: "700", color: "#00D4FF" }}>{formatCurrency(net)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: "center", marginTop: "16px", padding: "12px", background: "rgba(0,255,148,0.04)", borderRadius: "6px", border: "1px solid rgba(0,255,148,0.1)" }}>
                  <span style={{ fontSize: "11px", color: "#4A6070" }}>3 Yıllık Kümülatif Net Kazanım: </span>
                  <span style={{ fontSize: "16px", fontWeight: "700", color: "#00FF94" }}>
                    {formatCurrency(netGain + (totalAnnualGain * 1.1 - recurringCost) + (totalAnnualGain * 1.22 - recurringCost))}
                  </span>
                </div>
              </div>

              {/* Risk & Assumptions */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ background: "#0D1420", border: "1px solid #1E2A3A", borderRadius: "8px", padding: "16px" }}>
                  <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#3A4A5C", marginBottom: "12px" }}>VARSAYIMLAR</div>
                  {[
                    "RevPAR artışı: %12 (muhafazakâr)",
                    "Reputation gelir etkisi: %3.5",
                    "Doluluk artışı: +4 puan",
                    "Personel verimliliği: %15",
                    "Sezon büyümesi: yıllık %10",
                  ].map((item) => (
                    <div key={item} style={{ fontSize: "11px", color: "#4A6070", marginBottom: "6px", paddingLeft: "12px", borderLeft: "2px solid #1E2A3A" }}>
                      {item}
                    </div>
                  ))}
                </div>
                <div style={{ background: "#0D1420", border: "1px solid #1E2A3A", borderRadius: "8px", padding: "16px" }}>
                  <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#3A4A5C", marginBottom: "12px" }}>KAYNAKLAR</div>
                  {[
                    "HotelTechReport 2026 RMS Analizi",
                    "Duetto: Jannah Hotels %22 RevPAR",
                    "Cloudbeds Revenue Intelligence %18",
                    "Booking.com puan/gelir korelasyonu",
                    "Türkiye OteliniSat 2025 Raporu",
                  ].map((item) => (
                    <div key={item} style={{ fontSize: "11px", color: "#4A6070", marginBottom: "6px", paddingLeft: "12px", borderLeft: "2px solid #7B61FF33" }}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div style={{
                marginTop: "16px",
                background: "linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(123,97,255,0.08) 100%)",
                border: "1px solid rgba(0,212,255,0.2)",
                borderRadius: "10px", padding: "20px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "14px", color: "#E8EDF5", fontWeight: "600", marginBottom: "4px" }}>
                  {totalRooms} odalı tesisiniz {paybackMonths} ayda başabaş noktasına ulaşır
                </div>
                <div style={{ fontSize: "11px", color: "#4A6070" }}>
                  3. yılda kümülatif {formatCurrency((netGain + (totalAnnualGain * 1.1 - recurringCost) + (totalAnnualGain * 1.22 - recurringCost)))} net kazanım
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          appearance: none; width: 14px; height: 14px;
          border-radius: 50%; background: #00D4FF;
          cursor: pointer; border: 2px solid #080C14;
          box-shadow: 0 0 8px rgba(0,212,255,0.5);
        }
        input[type=range]::-moz-range-thumb {
          width: 14px; height: 14px; border-radius: 50%;
          background: #00D4FF; cursor: pointer;
          border: 2px solid #080C14;
        }
      `}</style>
    </div>
  );
}
