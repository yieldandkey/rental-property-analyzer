import React, { useState } from "react";

const formatCurrency = (val) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val || 0);

const formatPercent = (val) => `${(val || 0).toFixed(2)}%`;

export default function App() {
  const [inputs, setInputs] = useState({
    purchasePrice: 550000,
    downPaymentPct: 25,
    interestRate: 7.25,
    loanTermYears: 30,
    monthlyRent: 3200,
    vacancyRate: 5,
    propertyTax: 1.1,
    insurance: 1800,
    hoaMonthly: 0,
    maintenancePct: 1,
    propertyMgmtPct: 8,
    appreciationRate: 4,
    rentGrowthRate: 3,
  });

  const set = (key) => (e) => setInputs((prev) => ({ ...prev, [key]: Number(e.target.value) }));

  const downPayment = inputs.purchasePrice * (inputs.downPaymentPct / 100);
  const loanAmount = inputs.purchasePrice - downPayment;
  const monthlyRate = inputs.interestRate / 100 / 12;
  const numPayments = inputs.loanTermYears * 12;
  const mortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  const effectiveRent = inputs.monthlyRent * (1 - inputs.vacancyRate / 100);
  const annualRent = effectiveRent * 12;
  const propTaxMonthly = (inputs.purchasePrice * (inputs.propertyTax / 100)) / 12;
  const insuranceMonthly = inputs.insurance / 12;
  const maintenanceMonthly = (inputs.purchasePrice * (inputs.maintenancePct / 100)) / 12;
  const mgmtMonthly = effectiveRent * (inputs.propertyMgmtPct / 100);
  const totalExpensesMonthly = propTaxMonthly + insuranceMonthly + inputs.hoaMonthly + maintenanceMonthly + mgmtMonthly;
  const totalExpensesAnnual = totalExpensesMonthly * 12;
  const noi = annualRent - totalExpensesAnnual;
  const capRate = (noi / inputs.purchasePrice) * 100;
  const cashFlowMonthly = (noi - mortgage * 12) / 12;
  const cashOnCash = ((cashFlowMonthly * 12) / (downPayment + inputs.purchasePrice * 0.025)) * 100;
  const dscr = noi / (mortgage * 12);

  const s = {
    app: { fontFamily: "Georgia, serif", background: "#0d0f14", minHeight: "100vh", color: "#e8e8e0", padding: "32px 20px" },
    header: { textAlign: "center", marginBottom: 40 },
    title: { fontSize: 36, color: "#c8a96e", marginBottom: 8 },
    sub: { color: "#7a8299", fontSize: 15 },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto 40px" },
    card: { background: "#161a23", border: "1px solid #2a3040", borderRadius: 12, padding: 24 },
    cardTitle: { color: "#c8a96e", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 },
    label: { fontSize: 12, color: "#7a8299", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 4 },
    input: { width: "100%", background: "#0d0f14", border: "1px solid #2a3040", borderRadius: 8, padding: "10px 12px", color: "#e8e8e0", fontSize: 14, marginBottom: 14, boxSizing: "border-box" },
    results: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, maxWidth: 1100, margin: "0 auto 32px" },
    metric: { background: "#161a23", border: "1px solid #2a3040", borderRadius: 12, padding: 20, textAlign: "center" },
    metricVal: { fontSize: 26, fontWeight: "bold", color: "#c8a96e", marginBottom: 6 },
    metricLabel: { fontSize: 12, color: "#7a8299", textTransform: "uppercase", letterSpacing: "0.05em" },
    note: { maxWidth: 1100, margin: "0 auto", background: "rgba(200,169,110,0.06)", border: "1px solid rgba(200,169,110,0.2)", borderRadius: 12, padding: "16px 20px", fontSize: 13, color: "#7a8299", lineHeight: 1.6 },
    footer: { textAlign: "center", marginTop: 32, fontSize: 12, color: "#7a8299" }
  };

  return (
    <div style={s.app}>
      <div style={s.header}>
        <h1 style={s.title}>⌂ Yield & Key</h1>
        <p style={s.sub}>California Rental Property Investment Analyzer</p>
      </div>

      <div style={s.grid}>
        <div style={s.card}>
          <div style={s.cardTitle}>Purchase Details</div>
          <label style={s.label}>Purchase Price ($)</label>
          <input style={s.input} type="number" value={inputs.purchasePrice} onChange={set("purchasePrice")} />
          <label style={s.label}>Down Payment (%)</label>
          <input style={s.input} type="number" value={inputs.downPaymentPct} onChange={set("downPaymentPct")} />
          <label style={s.label}>Interest Rate (%)</label>
          <input style={s.input} type="number" value={inputs.interestRate} onChange={set("interestRate")} />
          <label style={s.label}>Loan Term (years)</label>
          <input style={s.input} type="number" value={inputs.loanTermYears} onChange={set("loanTermYears")} />
        </div>

        <div style={s.card}>
          <div style={s.cardTitle}>Income</div>
          <label style={s.label}>Monthly Rent ($)</label>
          <input style={s.input} type="number" value={inputs.monthlyRent} onChange={set("monthlyRent")} />
          <label style={s.label}>Vacancy Rate (%)</label>
          <input style={s.input} type="number" value={inputs.vacancyRate} onChange={set("vacancyRate")} />
          <div style={s.cardTitle}>Growth</div>
          <label style={s.label}>Appreciation Rate (%)</label>
          <input style={s.input} type="number" value={inputs.appreciationRate} onChange={set("appreciationRate")} />
          <label style={s.label}>Rent Growth Rate (%)</label>
          <input style={s.input} type="number" value={inputs.rentGrowthRate} onChange={set("rentGrowthRate")} />
        </div>

        <div style={s.card}>
          <div style={s.cardTitle}>Expenses</div>
          <label style={s.label}>Property Tax (%)</label>
          <input style={s.input} type="number" value={inputs.propertyTax} onChange={set("propertyTax")} />
          <label style={s.label}>Insurance ($/yr)</label>
          <input style={s.input} type="number" value={inputs.insurance} onChange={set("insurance")} />
          <label style={s.label}>HOA ($/mo)</label>
          <input style={s.input} type="number" value={inputs.hoaMonthly} onChange={set("hoaMonthly")} />
          <label style={s.label}>Maintenance (%)</label>
          <input style={s.input} type="number" value={inputs.maintenancePct} onChange={set("maintenancePct")} />
          <label style={s.label}>Property Mgmt (%)</label>
          <input style={s.input} type="number" value={inputs.propertyMgmtPct} onChange={set("propertyMgmtPct")} />
        </div>
      </div>

      <div style={s.results}>
        <div style={s.metric}><div style={s.metricVal}>{formatCurrency(cashFlowMonthly)}</div><div style={s.metricLabel}>Monthly Cash Flow</div></div>
        <div style={s.metric}><div style={s.metricVal}>{formatPercent(capRate)}</div><div style={s.metricLabel}>Cap Rate</div></div>
        <div style={s.metric}><div style={s.metricVal}>{formatPercent(cashOnCash)}</div><div style={s.metricLabel}>Cash-on-Cash Return</div></div>
        <div style={s.metric}><div style={s.metricVal}>{dscr.toFixed(2)}</div><div style={s.metricLabel}>DSCR</div></div>
        <div style={s.metric}><div style={s.metricVal}>{formatCurrency(mortgage)}</div><div style={s.metricLabel}>Monthly Mortgage</div></div>
        <div style={s.metric}><div style={s.metricVal}>{formatCurrency(noi)}</div><div style={s.metricLabel}>Annual NOI</div></div>
      </div>

      <div style={s.note}>
        <strong style={{color: "#c8a96e"}}>California Investor Note:</strong> Prop 13 resets your assessed value to purchase price at close. Factor in CA income tax on rental income (up to 13.3%) and consult a CPA about depreciation deductions which can significantly improve after-tax returns.
      </div>

      <div style={s.footer}>
        Yield & Key · For informational purposes only · Consult a licensed agent and CPA before investing
      </div>
    </div>
  );
}
