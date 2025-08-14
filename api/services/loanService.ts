import { post } from '../config/axiosConfig';

type CalcEmiInput = {
  principal: number; // loan amount
  annualInterestRatePct: number; // in percent, e.g., 12.5
  tenureMonths: number; // months
};

type CalcEmiResponse = {
  emi: number;
  totalInterest: number;
  totalPayment: number;
};

export async function calcEmi(input: CalcEmiInput): Promise<CalcEmiResponse> {
  try {
    const res = await post<CalcEmiResponse>('/api/v1/loan/calc/emi', input);
    if (res && typeof res === 'object' && 'emi' in res) return res as CalcEmiResponse;
  } catch (_) {}
  // Fallback to local calculation if backend not available
  const monthlyRate = input.annualInterestRatePct / 12 / 100;
  const n = input.tenureMonths;
  const p = input.principal;
  const emi = monthlyRate === 0
    ? p / n
    : (p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - p;
  return { emi, totalInterest, totalPayment };
}

export async function createLoanApplication(payload: any): Promise<any> {
  return post('/api/v1/loan/applications', payload);
}


