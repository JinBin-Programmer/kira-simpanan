"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";
import { calculateFutureValue, calculateMonthlyNeeded, getYearlyBreakdown } from "@/lib/savings";

const RM = (n: number) =>
  `RM ${n.toLocaleString("en-MY", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const RMfmt = (v: number) => {
  if (v >= 1_000_000) return `RM ${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `RM ${(v / 1_000).toFixed(0)}K`;
  return `RM ${v}`;
};

type Mode = "future" | "target";

const RATE_PRESETS = [
  { label: "FD", rate: 2.5 },
  { label: "ASB", rate: 4.5 },
  { label: "TH", rate: 4.25 },
  { label: "EPF", rate: 5.5 },
];

const MONTHLY_PRESETS = [100, 200, 500, 1000, 2000];
const TARGET_PRESETS = [50000, 100000, 200000, 500000, 1000000];
const YEAR_OPTIONS = [1, 3, 5, 10, 15, 20, 30];

export default function SavingsCalculator() {
  const [mode, setMode] = useState<Mode>("future");
  const [monthly, setMonthly] = useState(500);
  const [initial, setInitial] = useState(0);
  const [target, setTarget] = useState(100000);
  const [rate, setRate] = useState(4.5);
  const [rateInput, setRateInput] = useState("4.5");
  const [years, setYears] = useState(10);
  const { lang } = useLanguage();

  const futureResult = useMemo(
    () => calculateFutureValue(monthly, rate, years, initial),
    [monthly, rate, years, initial],
  );
  const targetResult = useMemo(
    () => calculateMonthlyNeeded(target, rate, years),
    [target, rate, years],
  );

  const chartMonthly = mode === "future" ? monthly : targetResult.monthlyNeeded;
  const chartInitial = mode === "future" ? initial : 0;
  const yearlyData = useMemo(
    () => getYearlyBreakdown(chartMonthly, rate, years, chartInitial),
    [chartMonthly, rate, years, chartInitial],
  );

  const handleRateInput = (val: string) => {
    setRateInput(val);
    const n = parseFloat(val);
    if (!isNaN(n) && n >= 0 && n <= 20) setRate(n);
  };

  const handleRateSlider = (val: number) => {
    setRate(val);
    setRateInput(val.toString());
  };

  const t = {
    bm: {
      title: "💵 Kalkulator Simpanan Malaysia",
      subtitle: "Kira pertumbuhan simpanan atau sasaran kewangan anda",
      futureTab: "Berapa akan dapat?", targetTab: "Berapa perlu simpan?",
      monthlyLabel: "Simpanan Bulanan (RM)",
      initialLabel: "Simpanan Awal (RM)",
      targetLabel: "Sasaran Jumlah (RM)",
      rateLabel: "Kadar Pulangan (%/tahun)",
      yearsLabel: "Tempoh Simpanan",
      years: "tahun",
      futureValue: "Jumlah Akhir",
      monthlyNeeded: "Simpanan Bulanan Diperlukan",
      totalContrib: "Jumlah Caruman",
      totalInterest: "Jumlah Keuntungan",
      interestPct: "Nisbah Keuntungan",
      chartTitle: "Pertumbuhan Tahun demi Tahun",
      contributions: "Caruman",
      interest: "Keuntungan",
      totalBalance: "Jumlah Baki",
      yearLabel: "Tahun",
      note: "* Anggaran berdasarkan faedah kompaun. Kadar sebenar bergantung pada instrumen pelaburan anda.",
    },
    en: {
      title: "💵 Malaysia Savings Calculator",
      subtitle: "Calculate your savings growth or financial goal",
      futureTab: "How much will I have?", targetTab: "How much to save?",
      monthlyLabel: "Monthly Savings (RM)",
      initialLabel: "Initial Savings (RM)",
      targetLabel: "Target Amount (RM)",
      rateLabel: "Annual Return Rate (%)",
      yearsLabel: "Savings Period",
      years: "years",
      futureValue: "Final Amount",
      monthlyNeeded: "Monthly Savings Needed",
      totalContrib: "Total Contributions",
      totalInterest: "Total Returns",
      interestPct: "Returns Ratio",
      chartTitle: "Year-by-Year Growth",
      contributions: "Contributions",
      interest: "Returns",
      totalBalance: "Total Balance",
      yearLabel: "Year",
      note: "* Estimates based on compound interest. Actual returns depend on your investment instrument.",
    },
  };
  const s = t[lang];

  return (
    <div className="min-h-screen">
      <div className="hero-bg">
        <div className="max-w-2xl mx-auto px-4 pt-10 pb-12 space-y-6">

          {/* Header */}
          <div className="animate-in text-center space-y-2 pt-4">
            <h1 className="text-3xl font-black text-white drop-shadow-lg">{s.title}</h1>
            <p className="text-white/60 text-sm">{s.subtitle}</p>
          </div>

          {/* Mode tabs */}
          <div className="animate-in delay-1 flex gap-2">
            {(["future", "target"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-colors ${mode === m ? "bg-yellow-500 border-yellow-400 text-black" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"}`}>
                {m === "future" ? s.futureTab : s.targetTab}
              </button>
            ))}
          </div>

          {/* Inputs */}
          <div className="animate-in delay-1 card-glass rounded-2xl p-5 space-y-5">
            {mode === "future" ? (
              <>
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">{s.monthlyLabel}</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {MONTHLY_PRESETS.map(p => (
                      <button key={p} onClick={() => setMonthly(p)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${monthly === p ? "bg-yellow-500 border-yellow-400 text-black font-bold" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"}`}>
                        RM {p.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <input type="number" placeholder="500" value={monthly || ""}
                    onChange={e => setMonthly(parseFloat(e.target.value) || 0)}
                    className="w-36 bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-yellow-400 placeholder:text-white/30" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">{s.initialLabel}</label>
                  <input type="number" placeholder="0" value={initial || ""}
                    onChange={e => setInitial(parseFloat(e.target.value) || 0)}
                    className="w-36 bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-yellow-400 placeholder:text-white/30" />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">{s.targetLabel}</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {TARGET_PRESETS.map(p => (
                    <button key={p} onClick={() => setTarget(p)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${target === p ? "bg-yellow-500 border-yellow-400 text-black font-bold" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"}`}>
                      RM {p.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input type="number" placeholder="100000" value={target || ""}
                  onChange={e => setTarget(parseFloat(e.target.value) || 0)}
                  className="w-36 bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-yellow-400 placeholder:text-white/30" />
              </div>
            )}

            {/* Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-white/50 uppercase tracking-wider">{s.rateLabel}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={rateInput}
                    onChange={e => handleRateInput(e.target.value)}
                    min={0} max={20} step={0.25}
                    className="w-20 bg-white/10 border border-white/20 text-yellow-400 font-black text-right rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-yellow-400"
                  />
                  <span className="text-yellow-400 font-black">%</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {RATE_PRESETS.map(r => (
                  <button key={r.label} onClick={() => { setRate(r.rate); setRateInput(r.rate.toString()); }}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${rate === r.rate ? "bg-yellow-500 border-yellow-400 text-black font-bold" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"}`}>
                    {r.label} {r.rate}%
                  </button>
                ))}
              </div>
              <input type="range" min={0.5} max={20} step={0.25} value={rate}
                onChange={e => handleRateSlider(parseFloat(e.target.value))}
                className="w-full accent-yellow-400" />
              <div className="flex justify-between text-xs text-white/30 mt-1"><span>0.5%</span><span>20%</span></div>
            </div>

            {/* Years */}
            <div>
              <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">{s.yearsLabel}</label>
              <div className="flex flex-wrap gap-2">
                {YEAR_OPTIONS.map(y => (
                  <button key={y} onClick={() => setYears(y)}
                    className={`px-3 py-2 rounded-xl border text-sm font-bold transition-colors ${years === y ? "bg-yellow-500 border-yellow-400 text-black" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"}`}>
                    {y} {s.years}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="animate-in delay-2 bg-gradient-to-br from-emerald-600/30 to-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6 text-center">
            <div className="text-xs text-emerald-300/70 uppercase tracking-wider mb-1">
              {mode === "future" ? s.futureValue : s.monthlyNeeded}
            </div>
            <div className="text-5xl font-black text-white">
              {mode === "future" ? RM(futureResult.finalAmount) : RM(targetResult.monthlyNeeded)}
            </div>
            <div className="text-sm text-white/40 mt-1">
              {years} {s.years} · {rate}% {lang === "bm" ? "setahun" : "p.a."}
            </div>
          </div>
        </div>
      </div>

      {/* Below-fold: chart + breakdown */}
      <div className="max-w-2xl mx-auto px-4 pb-10 space-y-5 bg-[#0a0a0a]">

        {/* Year-by-year chart */}
        <div className="card-glass rounded-2xl p-5">
          <div className="font-bold text-white text-sm mb-4">{s.chartTitle}</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={yearlyData} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="year"
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                label={{ value: s.yearLabel, position: "insideBottom", offset: -2, fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
              />
              <YAxis
                tickFormatter={RMfmt}
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={72}
              />
              <Tooltip
                contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, fontSize: 12 }}
                labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                labelFormatter={(v) => `${s.yearLabel} ${v}`}
                formatter={(value, name) => [typeof value === "number" ? RM(value) : value, name]}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                formatter={(value) => <span style={{ color: "rgba(255,255,255,0.6)" }}>{value}</span>}
              />
              <Line type="monotone" dataKey="total" name={s.totalBalance}
                stroke="#facc15" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="contributions" name={s.contributions}
                stroke="#60a5fa" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="interest" name={s.interest}
                stroke="#34d399" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown table */}
        <div className="card-glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-white/5">
              {(mode === "future" ? [
                { label: s.totalContrib,  val: RM(futureResult.totalContributed),  cls: "text-blue-300 font-bold" },
                { label: s.totalInterest, val: RM(futureResult.totalInterest),     cls: "text-emerald-300" },
                { label: s.futureValue,   val: RM(futureResult.finalAmount),       cls: "text-yellow-300 font-black text-lg" },
                { label: s.interestPct,   val: `${futureResult.interestPercent}%`, cls: "text-emerald-300" },
              ] : [
                { label: s.monthlyNeeded, val: RM(targetResult.monthlyNeeded),    cls: "text-yellow-300 font-black text-lg" },
                { label: s.totalContrib,  val: RM(targetResult.totalContributed), cls: "text-blue-300 font-bold" },
                { label: s.totalInterest, val: RM(targetResult.totalInterest),    cls: "text-emerald-300" },
                { label: lang === "bm" ? "Sasaran" : "Target", val: RM(target),   cls: "text-white" },
              ]).map(row => (
                <tr key={row.label} className="hover:bg-white/5">
                  <td className="px-5 py-3 text-white/60">{row.label}</td>
                  <td className={`px-5 py-3 text-right font-mono font-semibold ${row.cls}`}>{row.val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Contribution vs interest bar */}
        {mode === "future" && (
          <div className="card-glass rounded-2xl p-5">
            <div className="flex text-xs text-white/50 justify-between mb-2">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />{s.contributions}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />{s.interest}</span>
            </div>
            <div className="h-4 rounded-full bg-white/10 overflow-hidden flex">
              <div className="bg-blue-500 h-full transition-all duration-500"
                style={{ width: `${Math.min(100, (futureResult.totalContributed / futureResult.finalAmount) * 100)}%` }} />
              <div className="bg-emerald-400 h-full flex-1" />
            </div>
            <div className="flex text-xs text-white/40 justify-between mt-1">
              <span>{((futureResult.totalContributed / futureResult.finalAmount) * 100).toFixed(1)}%</span>
              <span>{futureResult.interestPercent}%</span>
            </div>
          </div>
        )}

        <p className="text-xs text-white/20 text-center px-4">{s.note}</p>
      </div>
    </div>
  );
}
