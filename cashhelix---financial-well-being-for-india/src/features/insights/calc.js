/**
 * Pure calculation functions for CashHelix
 * Shared across HealthScore, HiddenCharges, InsuranceGaps, FestivalPlanner, and VoiceAssistant
 */

/**
 * Formats a number according to the Indian Rupee numbering system (e.g., Rs 1,20,000)
 */
export function formatRupee(amount, prefix = '₹') {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `${prefix}0`;
  }
  const isNegative = amount < 0;
  const absVal = Math.round(Math.abs(amount));
  const valStr = absVal.toString();

  let result = '';
  if (valStr.length <= 3) {
    result = valStr;
  } else {
    // Last 3 digits
    const lastThree = valStr.substring(valStr.length - 3);
    const otherDigits = valStr.substring(0, valStr.length - 3);
    // Group remaining by 2 digits from right to left
    const formattedOther = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    result = `${formattedOther},${lastThree}`;
  }

  return isNegative ? `-${prefix}${result}` : `${prefix}${result}`;
}

/**
 * Returns clean date range for current period (last 30 days) and previous period (prior 30 days)
 */
export function getDateWindows(transactions = []) {
  // Use latest transaction date or default to 2026-10-22
  let anchorTime = new Date('2026-10-22').getTime();
  if (transactions && transactions.length > 0) {
    const dates = transactions
      .map(t => new Date(t.date).getTime())
      .filter(t => !isNaN(t));
    if (dates.length > 0) {
      anchorTime = Math.max(...dates);
    }
  }

  const DAY_MS = 24 * 60 * 60 * 1000;
  const currentStart = anchorTime - 30 * DAY_MS;
  const previousStart = anchorTime - 60 * DAY_MS;

  return {
    anchorTime,
    currentStart,
    previousStart,
  };
}

/**
 * Computes monthly average spend, income, and cashflow metrics
 */
export function getMonthlyFinancials(persona) {
  if (!persona) {
    return {
      monthlyIncome: 0,
      monthlyExpenses: 0,
      monthlyDebtPayments: 0,
      liquidAssets: 0,
      totalDebt: 0,
      savingsRate: 0,
      dti: 0,
      emergencyMonths: 0,
    };
  }

  const monthlyIncome = persona.income?.monthlyAvg || 0;
  const transactions = persona.transactions || [];
  const accounts = persona.accounts || [];

  // Liquid assets: bank accounts, wallets, liquid FDs
  const liquidAssets = accounts
    .filter(a => ['bank', 'wallet', 'fd'].includes(a.type))
    .reduce((sum, a) => sum + Math.max(0, a.balance || 0), 0);

  // Total debt liability from loan/card accounts
  const totalDebt = accounts
    .filter(a => ['loan', 'card'].includes(a.type))
    .reduce((sum, a) => sum + Math.abs(Math.min(0, a.balance || 0)), 0);

  // Monthly debt EMI obligations
  const emiAccounts = accounts.filter(a => a.type === 'loan' && a.meta?.emi);
  let monthlyDebtPayments = emiAccounts.reduce((sum, a) => sum + (a.meta.emi || 0), 0);

  // If no loan meta emi found, sum recurring debt transactions
  if (monthlyDebtPayments === 0) {
    const debtTxs = transactions.filter(t => t.category === 'emi' && t.amount < 0);
    if (debtTxs.length > 0) {
      // average over last 2 months
      const totalDebtPaid = debtTxs.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      monthlyDebtPayments = Math.round(totalDebtPaid / 2);
    }
  }

  // Calculate regular monthly living expenses (excluding large one-off capital purchases)
  const debitTxs = transactions.filter(t => t.amount < 0 && t.category !== 'emi');
  const totalDebits = debitTxs.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Estimate monthly living expenses
  let monthlyExpenses = Math.round(totalDebits / 2); // 2 months dataset
  if (monthlyExpenses < 3000 && monthlyIncome > 10000) {
    // sensible floor if mock txs were sparse
    monthlyExpenses = Math.round(monthlyIncome * 0.55);
  }

  const totalMonthlyOutflow = monthlyExpenses + monthlyDebtPayments;
  const monthlySurplus = monthlyIncome - totalMonthlyOutflow;
  const savingsRate = monthlyIncome > 0 ? Math.max(-50, Math.min(100, Math.round((monthlySurplus / monthlyIncome) * 100))) : 0;
  const dti = monthlyIncome > 0 ? Math.min(100, Math.round((monthlyDebtPayments / monthlyIncome) * 100)) : 0;
  
  // Emergency buffer: months of essential expenses covered
  const monthlyEssential = monthlyExpenses + monthlyDebtPayments;
  const emergencyMonths = monthlyEssential > 0 ? parseFloat((liquidAssets / monthlyEssential).toFixed(1)) : 0;

  return {
    monthlyIncome,
    monthlyExpenses,
    monthlyDebtPayments,
    totalMonthlyOutflow,
    monthlySurplus,
    liquidAssets,
    totalDebt,
    savingsRate,
    dti,
    emergencyMonths,
  };
}

/**
 * Computes 0-100 Financial Health Score with factor breakdown & month-over-month movement
 */
export function calculateHealthScore(persona) {
  const fin = getMonthlyFinancials(persona);
  const accounts = persona?.accounts || [];
  const transactions = persona?.transactions || [];

  // Factor 1: Savings Rate (0-25)
  let savingsScore = 0;
  if (fin.savingsRate >= 30) savingsScore = 25;
  else if (fin.savingsRate >= 20) savingsScore = 21;
  else if (fin.savingsRate >= 10) savingsScore = 16;
  else if (fin.savingsRate >= 0) savingsScore = 9;
  else savingsScore = 3;

  // Factor 2: Debt-to-Income (0-25)
  let dtiScore = 0;
  if (fin.dti === 0) dtiScore = 25;
  else if (fin.dti <= 20) dtiScore = 22;
  else if (fin.dti <= 35) dtiScore = 17;
  else if (fin.dti <= 50) dtiScore = 11;
  else dtiScore = 4;

  // Factor 3: Insurance Cushion (0-25)
  const insuranceAccounts = accounts.filter(a => a.type === 'insurance');
  const hasHealth = insuranceAccounts.some(a => a.meta?.type === 'health' || a.name?.toLowerCase().includes('health') || a.name?.toLowerCase().includes('mediclaim'));
  const hasTerm = insuranceAccounts.some(a => a.meta?.type === 'term' || a.name?.toLowerCase().includes('term') || a.name?.toLowerCase().includes('life'));
  const hasAccident = insuranceAccounts.some(a => a.meta?.type === 'accident' || a.name?.toLowerCase().includes('accident'));

  let insuranceScore = 0;
  if (hasHealth && hasTerm) insuranceScore = 25;
  else if (hasHealth || (hasTerm && fin.totalDebt > 0)) insuranceScore = 18;
  else if (hasAccident) insuranceScore = 10;
  else insuranceScore = 2;

  // Factor 4: Emergency Buffer (0-25)
  let emergencyScore = 0;
  if (fin.emergencyMonths >= 6) emergencyScore = 25;
  else if (fin.emergencyMonths >= 3) emergencyScore = 20;
  else if (fin.emergencyMonths >= 1.5) emergencyScore = 14;
  else if (fin.emergencyMonths >= 0.5) emergencyScore = 8;
  else emergencyScore = 3;

  const totalScore = Math.min(100, Math.max(8, savingsScore + dtiScore + insuranceScore + emergencyScore));

  // Determine Tier
  let tier = 'vulnerable';
  let tierColor = 'text-amber-700 bg-amber-50 border-amber-200';
  if (totalScore >= 75) {
    tier = 'healthy';
    tierColor = 'text-emerald-800 bg-emerald-50 border-emerald-200';
  } else if (totalScore >= 50) {
    tier = 'moderate';
    tierColor = 'text-sky-800 bg-sky-50 border-sky-200';
  }

  // Calculate What Moved Your Score This Month (last 30 days vs 30 days prior)
  const { currentStart, previousStart } = getDateWindows(transactions);

  const currentTxs = transactions.filter(t => {
    const time = new Date(t.date).getTime();
    return time >= currentStart;
  });

  const previousTxs = transactions.filter(t => {
    const time = new Date(t.date).getTime();
    return time >= previousStart && time < currentStart;
  });

  const currentSpends = currentTxs
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const previousSpends = previousTxs
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const currentInflows = currentTxs
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const previousInflows = previousTxs
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const currentFees = currentTxs
    .filter(t => t.category === 'fees' || t.merchant?.toLowerCase().includes('fee') || t.merchant?.toLowerCase().includes('charge'))
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const spendDiff = previousSpends - currentSpends; // positive means spent less
  const inflowDiff = currentInflows - previousInflows;

  const scoreDrivers = [];
  let scoreDelta = 0;

  if (spendDiff > 500) {
    scoreDelta += 3;
    scoreDrivers.push({
      type: 'positive',
      title: 'Discretionary Outflow Controlled',
      desc: `Total expenses trimmed by ${formatRupee(spendDiff)} compared to last month.`,
      points: '+3'
    });
  } else if (spendDiff < -1000) {
    scoreDelta -= 4;
    scoreDrivers.push({
      type: 'negative',
      title: 'Spike in Outflows',
      desc: `Monthly spend expanded by ${formatRupee(Math.abs(spendDiff))} due to seasonal or festival purchases.`,
      points: '-4'
    });
  }

  if (inflowDiff > 1000) {
    scoreDelta += 2;
    scoreDrivers.push({
      type: 'positive',
      title: 'Income Inflow Boost',
      desc: `Earned ${formatRupee(inflowDiff)} more in incentives and earnings this cycle.`,
      points: '+2'
    });
  } else if (inflowDiff < -2000) {
    scoreDelta -= 2;
    scoreDrivers.push({
      type: 'negative',
      title: 'Variable Income Dip',
      desc: `Inflows were lower by ${formatRupee(Math.abs(inflowDiff))} compared to prior 30 days.`,
      points: '-2'
    });
  }

  if (currentFees > 0) {
    scoreDelta -= 1;
    scoreDrivers.push({
      type: 'negative',
      title: 'Banking & Service Fee Leaks',
      desc: `${formatRupee(currentFees)} lost in preventable maintenance, SMS, or minimum balance fees.`,
      points: '-1'
    });
  }

  // Consistent EMI payment positive driver
  if (fin.monthlyDebtPayments > 0) {
    scoreDelta += 2;
    scoreDrivers.push({
      type: 'positive',
      title: 'Punctual EMI Servicing',
      desc: `All scheduled loan installments cleared on schedule with zero default penalties.`,
      points: '+2'
    });
  }

  // Default driver if list is empty
  if (scoreDrivers.length === 0) {
    scoreDrivers.push({
      type: 'neutral',
      title: 'Stable Cash Flow Cadence',
      desc: 'Spending and savings trends mirror the previous month with minimal variance.',
      points: '0'
    });
  }

  return {
    totalScore,
    tier,
    tierColor,
    scoreDelta,
    scoreDrivers,
    financials: fin,
    factors: [
      {
        id: 'savings',
        label: 'Savings Rate',
        score: savingsScore,
        maxScore: 25,
        value: `${fin.savingsRate}%`,
        status: fin.savingsRate >= 20 ? 'optimal' : fin.savingsRate >= 10 ? 'fair' : 'attention',
        benchmark: 'Ideal: >= 20% of net income',
      },
      {
        id: 'dti',
        label: 'Debt-to-Income (DTI)',
        score: dtiScore,
        maxScore: 25,
        value: `${fin.dti}%`,
        status: fin.dti <= 30 ? 'optimal' : fin.dti <= 45 ? 'fair' : 'critical',
        benchmark: 'Safe zone: Under 35%',
      },
      {
        id: 'insurance',
        label: 'Insurance Cushion',
        score: insuranceScore,
        maxScore: 25,
        value: hasHealth && hasTerm ? 'Comprehensive' : hasHealth ? 'Partial' : hasAccident ? 'Basic' : 'None',
        status: insuranceScore >= 20 ? 'optimal' : insuranceScore >= 12 ? 'fair' : 'critical',
        benchmark: 'Health + Term life if debt',
      },
      {
        id: 'emergency',
        label: 'Emergency Buffer',
        score: emergencyScore,
        maxScore: 25,
        value: `${fin.emergencyMonths} mos`,
        status: fin.emergencyMonths >= 3 ? 'optimal' : fin.emergencyMonths >= 1 ? 'fair' : 'attention',
        benchmark: 'Target: 3 to 6 months',
      }
    ]
  };
}

/**
 * Detects hidden charges, recurring debits, fee leaks, and overlapping policies
 */
export function detectHiddenCharges(persona) {
  const transactions = persona?.transactions || [];
  const accounts = persona?.accounts || [];
  const items = [];

  // 1. Bank fees and penalties (category 'fees' or merchant regex)
  const feeTxs = transactions.filter(t => {
    const isFeeCat = t.category === 'fees';
    const hasFeeWord = t.merchant && /(fee|charge|maintenance|penalty|fine|ledger|sms)/i.test(t.merchant);
    return (isFeeCat || hasFeeWord) && t.amount < 0;
  });

  // Group fee transactions by merchant
  const feeGroups = {};
  feeTxs.forEach(tx => {
    const key = tx.merchant || 'Bank Fee';
    if (!feeGroups[key]) {
      feeGroups[key] = { merchant: key, count: 0, total: 0, sampleAmount: Math.abs(tx.amount) };
    }
    feeGroups[key].count += 1;
    feeGroups[key].total += Math.abs(tx.amount);
  });

  Object.values(feeGroups).forEach((grp, idx) => {
    // Annualize based on frequency (if monthly, *12; if quarterly, *4; if one-off, *1 or *2)
    const isMonthly = grp.count >= 2;
    const monthlyAmt = isMonthly ? Math.round(grp.total / grp.count) : grp.sampleAmount;
    const yearlyLeak = isMonthly ? monthlyAmt * 12 : grp.total * 2;

    items.push({
      id: `fee_${idx}`,
      type: 'fee',
      title: grp.merchant,
      category: 'Bank & Platform Fees',
      monthlyAmount: isMonthly ? monthlyAmt : Math.round(yearlyLeak / 12),
      yearlyLeak,
      frequency: isMonthly ? 'Monthly recurring' : 'Periodic deduction',
      impact: yearlyLeak > 2000 ? 'High' : yearlyLeak > 600 ? 'Medium' : 'Low',
      reason: 'Preventable account non-maintenance, SMS alert surcharge, or minimum balance fine.',
      actionAdvice: 'Convert to zero-balance digital salary account or disable non-essential SMS alerts.',
      cancelled: false,
    });
  });

  // 2. Recurring auto-debits (recurring === true, or repeated exact merchant and amount)
  // Exclude EMIs from leaks, but check subscriptions and entertainment
  const subscriptionTxs = transactions.filter(t => {
    const isRecurring = t.recurring === true;
    const isDebit = t.amount < 0;
    const notEmi = t.category !== 'emi' && !t.merchant?.toLowerCase().includes('emi') && !t.merchant?.toLowerCase().includes('loan');
    const isSubCategory = ['subscription', 'entertainment', 'music', 'cloud'].includes(t.category);
    return isDebit && notEmi && (isRecurring || isSubCategory);
  });

  // Unique recurring services
  const seenSubs = new Map();
  subscriptionTxs.forEach(t => {
    const key = t.merchant;
    if (!seenSubs.has(key)) {
      const amt = Math.abs(t.amount);
      seenSubs.set(key, amt);
      items.push({
        id: `sub_${t.id}`,
        type: 'recurring',
        title: t.merchant,
        category: 'Subscriptions & Memberships',
        monthlyAmount: amt,
        yearlyLeak: amt * 12,
        frequency: 'Monthly auto-debit',
        impact: amt * 12 > 5000 ? 'High' : amt * 12 > 2000 ? 'Medium' : 'Low',
        reason: 'Automated card/UPI subscription renewing every 30 days.',
        actionAdvice: 'Audit active usage. Cancel if rarely accessed or downgrade to free tier.',
        cancelled: false,
      });
    }
  });

  // 3. Overlapping insurance premiums
  const insuranceAccounts = accounts.filter(a => a.type === 'insurance');
  const healthPolicies = insuranceAccounts.filter(a => a.meta?.type === 'health' || a.name?.toLowerCase().includes('mediclaim') || a.name?.toLowerCase().includes('health'));

  if (healthPolicies.length > 1) {
    // Duplicate health policies!
    const duplicate = healthPolicies[1];
    const annualPrem = duplicate.meta?.annualPremium || 9800;
    items.push({
      id: `ins_dup_${duplicate.id}`,
      type: 'insurance',
      title: `${duplicate.name} (Duplicate Cover)`,
      category: 'Overlapping Insurance',
      monthlyAmount: Math.round(annualPrem / 12),
      yearlyLeak: annualPrem,
      frequency: 'Annual premium deduction',
      impact: 'High',
      reason: `You hold multiple standalone health covers (${healthPolicies.map(p => p.name).join(' & ')}). Claims cannot be doubly reimbursed.`,
      actionAdvice: 'Port or merge into a single super top-up policy to save up to 40% on premiums.',
      cancelled: false,
    });
  }

  // Check for costly endowment / ULIP if persona already has term plan
  const endowment = insuranceAccounts.find(a => a.meta?.type === 'endowment');
  const termPlan = insuranceAccounts.find(a => a.meta?.type === 'term');
  if (endowment && termPlan) {
    const annualCost = endowment.meta?.annualPremium || 36000;
    items.push({
      id: `ins_ulip_${endowment.id}`,
      type: 'insurance',
      title: `${endowment.name} (Low Yield)`,
      category: 'Sub-optimal Policy',
      monthlyAmount: Math.round(annualCost / 12),
      yearlyLeak: Math.round(annualCost * 0.4), // 40% fee drag
      frequency: 'Annual recurring drag',
      impact: 'High',
      reason: 'ULIP/Endowment plans mix investment with insurance, yielding sub-par returns (4-5%) with high management fees.',
      actionAdvice: 'Surrender or make policy paid-up; redirect savings to pure term insurance + index funds.',
      cancelled: false,
    });
  }

  // Aggregate totals
  const totalYearlyLeak = items.reduce((sum, it) => sum + it.yearlyLeak, 0);
  const totalMonthlyLeak = items.reduce((sum, it) => sum + it.monthlyAmount, 0);

  return {
    items,
    totalYearlyLeak,
    totalMonthlyLeak,
    itemCount: items.length,
  };
}

/**
 * Evaluates rule-based insurance and safety net gaps
 */
export function evaluateInsuranceGaps(persona) {
  const fin = getMonthlyFinancials(persona);
  const accounts = persona?.accounts || [];
  const gaps = [];

  const loans = accounts.filter(a => a.type === 'loan');
  const totalLoanBalance = loans.reduce((sum, a) => sum + Math.abs(a.balance || 0), 0);

  const insuranceAccounts = accounts.filter(a => a.type === 'insurance');
  const termPolicy = insuranceAccounts.find(a => a.meta?.type === 'term' || a.name?.toLowerCase().includes('term'));
  const healthPolicy = insuranceAccounts.find(a => a.meta?.type === 'health' || a.name?.toLowerCase().includes('health') || a.name?.toLowerCase().includes('mediclaim'));
  const accidentPolicy = insuranceAccounts.find(a => a.meta?.type === 'accident' || a.name?.toLowerCase().includes('accident'));

  // Rule 1: Outstanding loan liabilities without adequate term life cover
  if (totalLoanBalance > 0 && !termPolicy) {
    const recommendedTerm = Math.max(totalLoanBalance * 1.5, fin.monthlyIncome * 12 * 8);
    gaps.push({
      id: 'gap_loan_term',
      type: 'loanWithoutTerm',
      title: 'Active Loans Without Term Life Cover',
      severity: 'critical',
      severityLabel: 'Critical Priority',
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
      reason: `You have ${formatRupee(totalLoanBalance)} in active debt liability (${loans.map(l => l.name).join(', ')}). Without term life coverage, legal heirs face repossession or burden in any untoward event.`,
      recommendedCover: recommendedTerm,
      startingPremiumEst: Math.round((recommendedTerm / 1000000) * 45), // approx Rs 45/mo per 10 lakh
      actionTitle: 'Secure Pure Term Life Policy',
      actionSteps: [
        `Select a pure term cover of at least ${formatRupee(recommendedTerm)}.`,
        'Choose cover until loan payoff or age 65.',
        'Opt for annual premium mode to reduce administrative fees by 8%.'
      ]
    });
  }

  // Rule 2: Zero health / hospitalization cover
  if (!healthPolicy) {
    const isSenior = persona?.id === 'senior' || persona?.label?.toLowerCase().includes('senior');
    const recommendedHealth = isSenior ? 750000 : 1000000;
    
    gaps.push({
      id: 'gap_no_health',
      type: isSenior ? 'seniorNoMedical' : 'noHealthCover',
      title: isSenior ? 'Senior Citizen Lacks Inpatient Medical Cover' : 'Zero Medical & Hospitalization Cover',
      severity: 'critical',
      severityLabel: 'Critical Priority',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      reason: isSenior
        ? 'A single cardiac or orthopedic hospitalization in urban hospitals averages Rs 3.5 Lakh - 6 Lakh. Without insurance, retirement corpus evaporates quickly.'
        : 'Out-of-pocket medical emergencies cause 60% of personal debt in India. Your accounts have zero hospitalization cushion.',
      recommendedCover: recommendedHealth,
      startingPremiumEst: isSenior ? 2400 : 650,
      actionTitle: isSenior ? 'Enroll in Senior Citizen Health or State Scheme' : 'Obtain Comprehensive Health Floater',
      actionSteps: [
        `Enroll in a baseline individual/family health policy of ${formatRupee(recommendedHealth)}.`,
        'Ensure coverage includes day-care procedures and cashless network in your city.',
        'Check eligibility for government sponsored schemes (Ayushman Bharat / PM-JAY).'
      ]
    });
  }

  // Rule 3: Gig worker or self-employed with only minimal accidental cover
  if (persona?.id === 'gig' && accidentPolicy && !healthPolicy) {
    gaps.push({
      id: 'gap_gig_vulnerable',
      type: 'gigVulnerable',
      title: 'Platform Accident Cover Leaves Illnesses Unprotected',
      severity: 'moderate',
      severityLabel: 'Moderate Priority',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      reason: `Platform group accidental cover (${formatRupee(accidentPolicy.meta?.sumAssured || 100000)}) only pays out in roadway accidents, leaving dengue, typhoid, viral admissions, and surgery unpaid.`,
      recommendedCover: 300000,
      startingPremiumEst: 290,
      actionTitle: 'Add Micro-Health or Daily Hospital Cash Rider',
      actionSteps: [
        'Avail a Rs 3 Lakh micro-health cover tailored for gig workers with daily room rent allowances.',
        'Keep emergency helpline saved on two-wheeler and delivery partner app.'
      ]
    });
  }

  // Rule 4: High debt burden relative to term cover (underinsured)
  if (termPolicy && totalLoanBalance > (termPolicy.meta?.sumAssured || 0) * 0.75) {
    const shortfall = Math.round(totalLoanBalance * 1.5 - (termPolicy.meta?.sumAssured || 0));
    if (shortfall > 500000) {
      gaps.push({
        id: 'gap_underinsured',
        type: 'underinsured',
        title: 'Outstanding Debt Exceeds Protection Cushion',
        severity: 'advisory',
        severityLabel: 'Advisory',
        badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
        reason: `Your existing term cover of ${formatRupee(termPolicy.meta?.sumAssured || 0)} is largely absorbed by outstanding mortgages of ${formatRupee(totalLoanBalance)}.`,
        recommendedCover: shortfall,
        startingPremiumEst: 420,
        actionTitle: 'Top-up Existing Term Cover',
        actionSteps: [
          `Add an incremental term top-up of ${formatRupee(shortfall)}.`,
          'Verify if existing insurer allows life-stage increase without fresh medical exams.'
        ]
      });
    }
  }

  return {
    gaps,
    gapCount: gaps.length,
    activePoliciesCount: insuranceAccounts.length,
    totalLoanLiability: totalLoanBalance,
    isFullyProtected: gaps.length === 0,
  };
}

/**
 * Builds upcoming Indian festival & seasonal milestone budget
 */
export function buildFestivalPlan(persona) {
  const fin = getMonthlyFinancials(persona);
  const monthlySurplus = fin.monthlySurplus;

  // Milestone catalog tailored to persona context
  const milestones = [
    {
      id: 'm_diwali',
      nameKey: 'diwali',
      defaultName: 'Diwali & New Year Festivities',
      month: 'November 2026',
      monthsLeft: 1,
      targetBudget: persona.id === 'family' ? 65000 : persona.id === 'shopkeeper' ? 120000 : persona.id === 'senior' ? 25000 : 15000,
      currentSaved: persona.id === 'family' ? 42000 : persona.id === 'shopkeeper' ? 85000 : persona.id === 'senior' ? 18000 : 7500,
      category: 'Celebration',
      personaRelevant: true,
    },
    {
      id: 'm_school',
      nameKey: 'schoolFees',
      defaultName: 'School / College Term Fees',
      month: 'December 2026',
      monthsLeft: 2,
      targetBudget: persona.id === 'family' ? 62000 : persona.id === 'student' ? 18000 : 0,
      currentSaved: persona.id === 'family' ? 35000 : persona.id === 'student' ? 6000 : 0,
      category: 'Education',
      personaRelevant: ['family', 'student'].includes(persona.id),
    },
    {
      id: 'm_pongal',
      nameKey: 'pongal',
      defaultName: 'Pongal & Makar Sankranti',
      month: 'January 2027',
      monthsLeft: 3,
      targetBudget: persona.id === 'senior' || persona.id === 'family' ? 30000 : 10000,
      currentSaved: persona.id === 'senior' || persona.id === 'family' ? 12000 : 3000,
      category: 'Harvest Festival',
      personaRelevant: ['senior', 'family', 'gig'].includes(persona.id),
    },
    {
      id: 'm_chhath',
      nameKey: 'chhathPuja',
      defaultName: 'Chhath Puja Mahaparv',
      month: 'November 2026',
      monthsLeft: 1,
      targetBudget: 12000,
      currentSaved: 8500,
      category: 'Community & Faith',
      personaRelevant: persona.id === 'shg',
    },
    {
      id: 'm_renewal',
      nameKey: 'insuranceRenewal',
      defaultName: 'Annual Insurance & Tax Renewal',
      month: 'March 2027',
      monthsLeft: 5,
      targetBudget: persona.id === 'family' ? 50000 : persona.id === 'shopkeeper' ? 35000 : 15000,
      currentSaved: persona.id === 'family' ? 20000 : persona.id === 'shopkeeper' ? 12000 : 4000,
      category: 'Compliance',
      personaRelevant: ['family', 'shopkeeper', 'senior'].includes(persona.id),
    }
  ];

  const activeMilestones = milestones
    .filter(m => m.personaRelevant && m.targetBudget > 0)
    .map(m => {
      const remainingAmount = Math.max(0, m.targetBudget - m.currentSaved);
      const suggestedMonthlySaving = Math.ceil(remainingAmount / Math.max(1, m.monthsLeft));
      const progressPercent = Math.min(100, Math.round((m.currentSaved / m.targetBudget) * 100));
      return {
        ...m,
        remainingAmount,
        suggestedMonthlySaving,
        progressPercent,
      };
    });

  const totalRequiredMonthly = activeMilestones.reduce((sum, m) => sum + m.suggestedMonthlySaving, 0);

  // Month-by-month mini budget projection for next 4 months
  const monthNames = ['Nov 2026', 'Dec 2026', 'Jan 2027', 'Feb 2027'];
  const monthBudgets = monthNames.map((monthStr, index) => {
    const targetSurplus = Math.max(0, monthlySurplus);
    const allocatedFestivals = Math.min(targetSurplus, totalRequiredMonthly);
    const retainedEmergencyBuffer = targetSurplus - allocatedFestivals;

    return {
      month: monthStr,
      surplus: monthlySurplus,
      allocatedFestivals,
      retainedEmergencyBuffer,
      status: monthlySurplus >= totalRequiredMonthly ? 'Fundable' : 'Tight',
    };
  });

  return {
    monthlySurplus,
    activeMilestones,
    totalRequiredMonthly,
    monthBudgets,
    isSurplusHealthy: monthlySurplus >= totalRequiredMonthly,
  };
}

/**
 * Natural language voice assistant response matcher
 * Understands English, Hindi, and Tamil queries
 */
export function answerVoiceQuery(rawQuery = '', persona, lang = 'en') {
  if (!rawQuery || !persona) {
    return {
      text: "Please tell me what you would like to know about your finances.",
      category: 'prompt',
    };
  }

  const query = rawQuery.toLowerCase().trim();
  const fin = getMonthlyFinancials(persona);
  const health = calculateHealthScore(persona);
  const leaks = detectHiddenCharges(persona);
  const gaps = evaluateInsuranceGaps(persona);
  const festival = buildFestivalPlan(persona);
  const bills = persona.bills || [];

  // Keywords matcher
  const isSpendQuery = /(spend|kharcha|selavu|expense|spent|kharach|செலவு|खर्चा|खर्च)/i.test(query);
  const isBillQuery = /(bill|due|upcoming|pending|payment|raseed|tarikh|பில்|ரசீது|கட்டணம்|বিল)/i.test(query);
  const isScoreQuery = /(score|health|swasthya|arokkiyam|rating|condition|ஆரோக்கியம்|மதிப்பெண்|स्कोर|स्वास्थ्य)/i.test(query);
  const isGoalQuery = /(goal|saving|bachat|target|lakshya|ilakku|சேமிப்பு|இலக்கு|लक्ष्य|बचत)/i.test(query);
  const isLeakQuery = /(hidden|leak|charge|fee|fine|cut|katukal|shulk|திரும்ப|மறைமுக|शुल्क|चार्ज)/i.test(query);
  const isFestivalQuery = /(festival|diwali|pongal|eid|christmas|chhath|tyohar|pandigai|பண்டிகை|திருவிழா|त्योहार|दिवाली|पोंगल)/i.test(query);
  const isBalanceQuery = /(balance|account|money|cash|fund|iruppu|baaki|khata|கணக்கு|இருப்பு|बैलेंस|खाता)/i.test(query);

  if (isSpendQuery) {
    if (lang === 'hi') {
      return {
        text: `इस महीने आपका अनुमानित खर्च ${formatRupee(fin.monthlyExpenses, '₹')} है। इसके अतिरिक्त ${formatRupee(fin.monthlyDebtPayments, '₹')} ईएमआई में जा रहे हैं।`,
        category: 'spend',
      };
    }
    if (lang === 'ta') {
      return {
        text: `இந்த மாதம் உங்கள் சராசரி செலவு ${formatRupee(fin.monthlyExpenses, 'ரூ. ')}. கூடுதலாக கடன்களுக்கு ${formatRupee(fin.monthlyDebtPayments, 'ரூ. ')} EMI செலுத்தப்படுகிறது.`,
        category: 'spend',
      };
    }
    return {
      text: `Your average monthly living expense is ${formatRupee(fin.monthlyExpenses)}, with an additional ${formatRupee(fin.monthlyDebtPayments)} allocated to loan EMIs.`,
      category: 'spend',
    };
  }

  if (isBillQuery) {
    if (bills.length === 0) {
      if (lang === 'hi') return { text: "फिलहाल कोई आगामी बिल लंबित नहीं है।", category: 'bill' };
      if (lang === 'ta') return { text: "தற்போது நிலுவையில் உள்ள பில்கள் எதுவும் இல்லை.", category: 'bill' };
      return { text: "You have no upcoming bills due right now.", category: 'bill' };
    }
    const nextBill = bills[0];
    const totalBills = bills.reduce((s, b) => s + b.amount, 0);

    if (lang === 'hi') {
      return {
        text: `आपके पास ${bills.length} आगामी बिल हैं, जिनका कुल योग ${formatRupee(totalBills, '₹')} है। अगला बिल ${nextBill.name} का ${formatRupee(nextBill.amount, '₹')} है, जो ${nextBill.dueDate} को देय है।`,
        category: 'bill',
      };
    }
    if (lang === 'ta') {
      return {
        text: `உங்களுக்கு ${bills.length} வரவிருக்கும் பில்கள் உள்ளன, மொத்த தொகை ${formatRupee(totalBills, 'ரூ. ')}. அடுத்த பில்: ${nextBill.name} (${formatRupee(nextBill.amount, 'ரூ. ')}), இறுதி நாள்: ${nextBill.dueDate}.`,
        category: 'bill',
      };
    }
    return {
      text: `You have ${bills.length} upcoming bills totaling ${formatRupee(totalBills)}. Next due is ${nextBill.name} of ${formatRupee(nextBill.amount)} on ${nextBill.dueDate}.`,
      category: 'bill',
    };
  }

  if (isScoreQuery) {
    if (lang === 'hi') {
      return {
        text: `आपका वित्तीय स्वास्थ्य स्कोर 100 में से ${health.totalScore} है। आपकी बचत दर ${fin.savingsRate}% है और आपातकालीन फंड ${fin.emergencyMonths} महीने के खर्च को कवर करता है।`,
        category: 'score',
      };
    }
    if (lang === 'ta') {
      return {
        text: `உங்கள் நிதி ஆரோக்கிய மதிப்பீடு 100 க்கு ${health.totalScore}. உங்கள் சேமிப்பு விகிதம் ${fin.savingsRate}% மற்றும் அவசரகால நிதி ${fin.emergencyMonths} மாதங்களுக்கு போதுமானது.`,
        category: 'score',
      };
    }
    return {
      text: `Your Financial Health Score is ${health.totalScore} out of 100. Your savings rate is ${fin.savingsRate}%, and your emergency cushion covers ${fin.emergencyMonths} months of essentials.`,
      category: 'score',
    };
  }

  if (isLeakQuery) {
    if (lang === 'hi') {
      return {
        text: `हमने ${leaks.itemCount} छिपे हुए शुल्क पहचाने हैं, जिससे सालाना ${formatRupee(leaks.totalYearlyLeak, '₹')} का नुकसान हो रहा है। आप इन्हें 'हिडन चार्जेस' टैब में जाकर तुरंत रद्द कर सकते हैं।`,
        category: 'leak',
      };
    }
    if (lang === 'ta') {
      return {
        text: `நாங்கள் ${leaks.itemCount} தேவையற்ற மறைமுக கட்டணங்களை கண்டறிந்துள்ளோம். ஆண்டு இழப்பு: ${formatRupee(leaks.totalYearlyLeak, 'ரூ. ')}. 'மறைமுக கட்டணங்கள்' பகுதியில் இவற்றை ரத்து செய்யலாம்.`,
        category: 'leak',
      };
    }
    return {
      text: `We identified ${leaks.itemCount} hidden charges and recurring leaks causing an annual drain of ${formatRupee(leaks.totalYearlyLeak)}. You can review and cancel them in the Hidden Charges tab.`,
      category: 'leak',
    };
  }

  if (isFestivalQuery) {
    const topFestival = festival.activeMilestones[0];
    if (lang === 'hi') {
      return {
        text: topFestival
          ? `आगामी आयोजन के लिए आपको प्रतिमाह ${formatRupee(topFestival.suggestedMonthlySaving, '₹')} की बचत करनी चाहिए। आपका मासिक अधिशेष ${formatRupee(fin.monthlySurplus, '₹')} है।`
          : `त्योहारों के लिए आपका मासिक अधिशेष ${formatRupee(fin.monthlySurplus, '₹')} है।`,
        category: 'festival',
      };
    }
    if (lang === 'ta') {
      return {
        text: topFestival
          ? `பண்டிகை செலவுகளுக்கு மாதம் ${formatRupee(topFestival.suggestedMonthlySaving, 'ரூ. ')} சேமிப்பது சிறந்தது. உங்கள் மாதாந்திர உபரி நிதி ${formatRupee(fin.monthlySurplus, 'ரூ. ')}. `
          : `உங்கள் மாதாந்திர சேமிப்பு உபரி ${formatRupee(fin.monthlySurplus, 'ரூ. ')}.`,
        category: 'festival',
      };
    }
    return {
      text: topFestival
        ? `To fund upcoming celebrations without debt, we recommend saving ${formatRupee(topFestival.suggestedMonthlySaving)} per month. Your estimated monthly surplus is ${formatRupee(fin.monthlySurplus)}.`
        : `Your monthly surplus is ${formatRupee(fin.monthlySurplus)}, which can be budgeted for upcoming milestones.`,
      category: 'festival',
    };
  }

  if (isBalanceQuery) {
    if (lang === 'hi') {
      return {
        text: `आपके बैंक खातों और वॉलेट में कुल लिक्विड राशि ${formatRupee(fin.liquidAssets, '₹')} है। कुल बकाया ऋण देनदारी ${formatRupee(fin.totalDebt, '₹')} है।`,
        category: 'balance',
      };
    }
    if (lang === 'ta') {
      return {
        text: `உங்கள் வங்கி மற்றும் வாலட்டில் உள்ள மொத்த இருப்பு ${formatRupee(fin.liquidAssets, 'ரூ. ')}. மொத்த கடன் தொகை ${formatRupee(fin.totalDebt, 'ரூ. ')}.`,
        category: 'balance',
      };
    }
    return {
      text: `Your total liquid funds across bank accounts and wallets stand at ${formatRupee(fin.liquidAssets)}. Total outstanding debt obligations are ${formatRupee(fin.totalDebt)}.`,
      category: 'balance',
    };
  }

  if (isGoalQuery) {
    const goals = persona.goals || [];
    if (goals.length === 0) {
      if (lang === 'hi') return { text: "वर्तमान में कोई वित्तीय लक्ष्य निर्धारित नहीं है।", category: 'goal' };
      if (lang === 'ta') return { text: "தற்போது குறிப்பிட்ட இலக்குகள் எதுவும் பதிவு செய்யப்படவில்லை.", category: 'goal' };
      return { text: "No active savings goals found right now.", category: 'goal' };
    }
    const topGoal = goals[0];
    const pct = Math.round((topGoal.saved / topGoal.target) * 100);
    if (lang === 'hi') {
      return {
        text: `आपका मुख्य लक्ष्य '${topGoal.name}' है। इसमें ${formatRupee(topGoal.saved, '₹')} जमा हो चुके हैं जो कि कुल लक्ष्य ${formatRupee(topGoal.target, '₹')} का ${pct}% है।`,
        category: 'goal',
      };
    }
    if (lang === 'ta') {
      return {
        text: `உங்கள் முதன்மை இலக்கு '${topGoal.name}'. இதுவரை ${formatRupee(topGoal.saved, 'ரூ. ')} சேமிக்கப்பட்டுள்ளது (${pct}%). இலக்கு தொகை: ${formatRupee(topGoal.target, 'ரூ. ')}.`,
        category: 'goal',
      };
    }
    return {
      text: `Your top goal is '${topGoal.name}'. You have saved ${formatRupee(topGoal.saved)} out of ${formatRupee(topGoal.target)} (${pct}%).`,
      category: 'goal',
    };
  }

  // Fallback
  if (lang === 'hi') {
    return {
      text: "मुझे इस प्रश्न का सटीक उत्तर नहीं मिला। कृपया 'खर्च', 'आगामी बिल', 'हेल्थ स्कोर' या 'त्योहार बचत' के बारे में पूछें।",
      category: 'fallback',
    };
  }
  if (lang === 'ta') {
    return {
      text: "மன்னிக்கவும், நேரடி பதில் கிடைக்கவில்லை. 'செலவு', 'அடுத்த பில்கள்', 'ஆரோக்கிய மதிப்பீடு' அல்லது 'பண்டிகை சேமிப்பு' பற்றி கேட்கலாம்.",
      category: 'fallback',
    };
  }
  return {
    text: "I couldn't match that exact request. You can ask about: 'How much did I spend?', 'Upcoming bills', 'My health score', 'Hidden charges', or 'Festival budget'.",
    category: 'fallback',
  };
}
