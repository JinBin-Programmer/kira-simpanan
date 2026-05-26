"use client";

import { useState, useMemo } from "react";
import { calculateFutureValue, calculateMonthlyNeeded } from "@/lib/savings";

const RM = (n: number) =>
  `RM ${n.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type Mode = "future" | "target";

const RATE_PRESETS = [
  { label: "FD Bank", rate: 2.5 },
  { label: "ASB", rate: 4.5 },
  { label: "Tabung Haji", rate: 4.25 },
  { label: "EPF", rate: 5.5 },
];

export default function SavingsCalculator() {
  const [mode, setMode] = useState<Mode>("future");
  const [monthly, setMonthly] = useState(500);
  const [initial, setInitial] = useState(0);
  const [target, setTarget] = useState(100000);
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(10);
  const [lang, setLang] = useState<"bm" | "en">("bm");

  const futureResult = useMemo(
    () => calculateFutureValue(monthly, rate, years, initial),
    [monthly, rate, years, initial],
  );
  const targetResult = useMemo(
    () => calculateMonthlyNeeded(target, rate, years),
    [target, rate, years],
  );

  const MONTHLY_PRESETS = [100, 200, 500, 1000, 2000];
  const TARGET_PRESETS = [50000, 100000, 200000, 500000, 1000000];
  const YEAR_OPTIONS = [1, 3, 5, 10, 15, 20, 30];

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
      totalContrib: "Jumlah Caruman", totalInterest: "Jumlah Keuntungan",
      interestPct: "Nisbah Keuntungan",
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
      totalContrib: "Total Contributions", totalInterest: "Total Returns",
      interestPct: "Returns Ratio",
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
            <div className="flex justify-center mt-3">
              <div className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5">
                {(["bm","en"] as const).map(l => (
                  <button key={l} onClick={() => setLang(l)}
                    className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-colors ${lang === l ? "bg-yellow-500 text-black" : "text-white/60 hover:text-white"}`}>
                    {l === "bm" ? "BM" : "EN"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mode tabs */}
          <div className="animate-in delay-1 flex gap-2">
            {(["future","target"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-colors ${mode === m ? "bg-yellow-500 border-yellow-400 text-black" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"}`}>
                {m === "future" ? s.futureTab : s.targetTab}
              </button>
            ))}
          </div>

          {/* Inputs */}
          <div className="animate-in delay-1 card-glass rounded-2xl p-5 space-y-5">
            {/* Amount */}
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
                </div>
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">{s.initialLabel}</label>
                  <input type="number" placeholder="0" value={initial || ""}
                    onChange={e => setInitial(parseFloat(e.target.value) || 0)}
                    className="w-48 bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-yellow-400 placeholder:text-white/30" />
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
              </div>
            )}

            {/* Rate presets */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-white/50 uppercase tracking-wider">{s.rateLabel}</label>
                <span className="text-yellow-400 font-black text-lg">{rate.toFixed(1)}%</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {RATE_PRESETS.map(r => (
                  <button key={r.label} onClick={() => setRate(r.rate)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${rate === r.rate ? "bg-yellow-500 border-yellow-400 text-black font-bold" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"}`}>
                    {r.label} {r.rate}%
                  </button>
                ))}
              </div>
              <input type="range" min={0.5} max={15} step={0.25} value={rate}
                onChange={e => setRate(parseFloat(e.target.value))}
                className="w-full accent-yellow-400" />
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

      {/* Breakdown */}
      <div className="max-w-2xl mx-auto px-4 pb-10 space-y-5 bg-[#0a0a0a]">
        <div className="card-glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-white/5">
              {mode === "future" ? [
                { label: s.totalContrib,   val: RM(futureResult.totalContributed), cls: "text-white font-bold" },
                { label: s.totalInterest,  val: RM(futureResult.totalInterest),    cls: "text-emerald-300" },
                { label: s.futureValue,    val: RM(futureResult.finalAmount),      cls: "text-yellow-300 font-black text-lg" },
                { label: s.interestPct,    val: `${futureResult.interestPercent}%`, cls: "text-emerald-300" },
              ] : [
                { label: s.monthlyNeeded,  val: RM(targetResult.monthlyNeeded),    cls: "text-yellow-300 font-black text-lg" },
                { label: s.totalContrib,   val: RM(targetResult.totalContributed), cls: "text-white font-bold" },
                { label: lang === "bm" ? "Keuntungan" : "Returns", val: RM(targetResult.totalInterest), cls: "text-emerald-300" },
                { label: lang === "bm" ? "Sasaran" : "Target",     val: RM(target),                     cls: "text-white" },
              ].map(row => (
                <tr key={row.label} className="hover:bg-white/5">
                  <td className="px-5 py-3 text-white/60">{row.label}</td>
                  <td className={`px-5 py-3 text-right font-mono font-semibold ${row.cls}`}>{row.val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Growth bar */}
        {mode === "future" && (
          <div className="card-glass rounded-2xl p-5">
            <div className="flex text-xs text-white/50 justify-between mb-2">
              <span>{s.totalContrib}</span>
              <span>{s.totalInterest}</span>
            </div>
            <div className="h-4 rounded-full bg-white/10 overflow-hidden flex">
              <div className="bg-blue-500 h-full transition-all duration-300"
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
