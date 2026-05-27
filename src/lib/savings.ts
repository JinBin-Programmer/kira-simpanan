export interface SavingsResult {
  finalAmount: number;
  totalContributed: number;
  totalInterest: number;
  interestPercent: number;
}

export interface TargetResult {
  monthlyNeeded: number;
  totalContributed: number;
  totalInterest: number;
}

export interface YearlyPoint {
  year: number;
  contributions: number;
  interest: number;
  total: number;
}

export function calculateFutureValue(
  monthlyContribution: number,
  annualRate: number,
  years: number,
  initialAmount = 0,
): SavingsResult {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  const fvContrib = r === 0
    ? monthlyContribution * n
    : monthlyContribution * (Math.pow(1 + r, n) - 1) / r;
  const fvInitial = initialAmount * Math.pow(1 + r, n);
  const finalAmount = fvContrib + fvInitial;
  const totalContributed = monthlyContribution * n + initialAmount;
  const totalInterest = finalAmount - totalContributed;
  return {
    finalAmount: Math.round(finalAmount * 100) / 100,
    totalContributed: Math.round(totalContributed * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    interestPercent: Math.round((totalInterest / totalContributed) * 1000) / 10,
  };
}

export function calculateMonthlyNeeded(
  targetAmount: number,
  annualRate: number,
  years: number,
): TargetResult {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  const monthlyNeeded = r === 0
    ? targetAmount / n
    : targetAmount * r / (Math.pow(1 + r, n) - 1);
  const totalContributed = monthlyNeeded * n;
  return {
    monthlyNeeded: Math.round(monthlyNeeded * 100) / 100,
    totalContributed: Math.round(totalContributed * 100) / 100,
    totalInterest: Math.round((targetAmount - totalContributed) * 100) / 100,
  };
}

export function getYearlyBreakdown(
  monthlyContribution: number,
  annualRate: number,
  years: number,
  initialAmount = 0,
): YearlyPoint[] {
  const r = annualRate / 100 / 12;
  return Array.from({ length: years }, (_, i) => {
    const n = (i + 1) * 12;
    const fvContrib = r === 0
      ? monthlyContribution * n
      : monthlyContribution * (Math.pow(1 + r, n) - 1) / r;
    const fvInitial = initialAmount * Math.pow(1 + r, n);
    const total = fvContrib + fvInitial;
    const contributions = monthlyContribution * n + initialAmount;
    return {
      year: i + 1,
      contributions: Math.round(contributions),
      interest: Math.round(total - contributions),
      total: Math.round(total),
    };
  });
}
