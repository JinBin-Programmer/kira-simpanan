import type { Metadata } from "next";
import SavingsCalculator from "@/components/SavingsCalculator";

export const metadata: Metadata = {
  title: "Kalkulator Simpanan Malaysia — FD, ASB, Tabung Haji, EPF",
  description: "Kira pertumbuhan simpanan atau sasaran kewangan anda. Sokongan FD, ASB, Tabung Haji dan EPF. Mudah, percuma dan tepat.",
};

export default function HomePage() {
  return <SavingsCalculator />;
}
