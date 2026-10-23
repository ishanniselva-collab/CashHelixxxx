/**
 * Mock data for CashHelix personas
 * Read-only contract consumed by usePersona()
 */

export const PERSONAS = {
  gig: {
    id: 'gig',
    name: 'Ramesh Kumar',
    label: 'Gig Delivery Partner',
    tagline: 'Hyperlocal delivery across Bengaluru, managing fuel and fluctuating daily payouts',
    city: 'Bengaluru',
    income: {
      type: 'irregular',
      monthlyAvg: 24500,
    },
    accounts: [
      { id: 'acc_g1', type: 'bank', name: 'Canara Savings A/C', balance: 6400, meta: { ifsc: 'CNRB0001024', primary: true } },
      { id: 'acc_g2', type: 'wallet', name: 'Paytm Wallet', balance: 1120, meta: { linkedUPI: 'ramesh.delivery@paytm' } },
      { id: 'acc_g3', type: 'loan', name: 'Two-Wheeler Loan (EV Scooter)', balance: -38500, meta: { emi: 3200, tenureLeftMonths: 13, lender: 'Bajaj Finance' } },
      { id: 'acc_g4', type: 'insurance', name: 'Accidental Group Cover (Platform)', balance: 0, meta: { sumAssured: 100000, premiumAnnual: 720, type: 'accident' } }
    ],
    transactions: [
      { id: 'tx_g1', date: '2026-10-21', amount: -180, category: 'fuel', merchant: 'Indian Oil Petrol Pump', recurring: false },
      { id: 'tx_g2', date: '2026-10-20', amount: 3200, category: 'income', merchant: 'Zomato Payout', recurring: false },
      { id: 'tx_g3', date: '2026-10-18', amount: -3200, category: 'emi', merchant: 'Bajaj Finance Two Wheeler EMI', recurring: true },
      { id: 'tx_g4', date: '2026-10-16', amount: -65, category: 'fees', merchant: 'Canara Bank SMS Charges', recurring: true },
      { id: 'tx_g5', date: '2026-10-15', amount: -299, category: 'subscription', merchant: 'Jio Mobile Recharge Plan', recurring: true },
      { id: 'tx_g6', date: '2026-10-13', amount: 2850, category: 'income', merchant: 'Swiggy Weekly Payout', recurring: false },
      { id: 'tx_g7', date: '2026-10-10', amount: -24, category: 'fees', merchant: 'Canara Bank ATM Non-Home Fee', recurring: false },
      { id: 'tx_g8', date: '2026-10-08', amount: -220, category: 'food', merchant: 'Udupi Upahar Daily Meal', recurring: false },
      { id: 'tx_g9', date: '2026-10-05', amount: -199, category: 'entertainment', merchant: 'Gaana Music Plus Auto-Renewal', recurring: true },
      { id: 'tx_g10', date: '2026-10-02', amount: 6400, category: 'income', merchant: 'Platform Incentive & Bonus', recurring: false },
      { id: 'tx_g11', date: '2026-09-28', amount: -180, category: 'fuel', merchant: 'Indian Oil Petrol Pump', recurring: false },
      { id: 'tx_g12', date: '2026-09-22', amount: -3200, category: 'emi', merchant: 'Bajaj Finance Two Wheeler EMI', recurring: true },
      { id: 'tx_g13', date: '2026-09-19', amount: -65, category: 'fees', merchant: 'Canara Bank SMS Charges', recurring: true },
      { id: 'tx_g14', date: '2026-09-15', amount: -299, category: 'subscription', merchant: 'Jio Mobile Recharge Plan', recurring: true },
      { id: 'tx_g15', date: '2026-09-10', amount: -199, category: 'entertainment', merchant: 'Gaana Music Plus Auto-Renewal', recurring: true },
      { id: 'tx_g16', date: '2026-09-05', amount: 21500, category: 'income', merchant: 'Zomato & Swiggy Combined payouts', recurring: false },
      { id: 'tx_g17', date: '2026-08-25', amount: -3200, category: 'emi', merchant: 'Bajaj Finance Two Wheeler EMI', recurring: true },
      { id: 'tx_g18', date: '2026-08-20', amount: -199, category: 'entertainment', merchant: 'Gaana Music Plus Auto-Renewal', recurring: true },
      { id: 'tx_g19', date: '2026-08-16', amount: -65, category: 'fees', merchant: 'Canara Bank SMS Charges', recurring: true }
    ],
    bills: [
      { id: 'b_g1', name: 'Two Wheeler EMI', amount: 3200, dueDate: '2026-11-05' },
      { id: 'b_g2', name: 'Mobile Prepaid Booster', amount: 299, dueDate: '2026-11-12' },
      { id: 'b_g3', name: 'Room Shared Rent', amount: 4500, dueDate: '2026-11-01' }
    ],
    goals: [
      { id: 'gl_g1', name: 'Emergency Rain Day Reserve', target: 30000, saved: 7520, deadline: '2027-03-31' },
      { id: 'gl_g2', name: 'Electric Scooter Battery Upgrade', target: 18000, saved: 2200, deadline: '2027-06-30' }
    ]
  },

  student: {
    id: 'student',
    name: 'Ananya Sharma',
    label: 'College Student & Freelancer',
    tagline: 'Engineering final year in Pune, juggling freelance UI gigs, stipend and hostel expenses',
    city: 'Pune',
    income: {
      type: 'irregular',
      monthlyAvg: 16500,
    },
    accounts: [
      { id: 'acc_s1', type: 'bank', name: 'HDFC Digiyouth Savings', balance: 14200, meta: { primary: true } },
      { id: 'acc_s2', type: 'wallet', name: 'Google Pay balance', balance: 840, meta: {} },
      { id: 'acc_s3', type: 'card', name: 'OneCard Student Credit Card', balance: -4500, meta: { limit: 15000, due: 4500 } }
    ],
    transactions: [
      { id: 'tx_s1', date: '2026-10-21', amount: -499, category: 'entertainment', merchant: 'Netflix Standard Sub', recurring: true },
      { id: 'tx_s2', date: '2026-10-19', amount: -179, category: 'music', merchant: 'Spotify Premium Duo', recurring: true },
      { id: 'tx_s3', date: '2026-10-18', amount: -89, category: 'cloud', merchant: 'iCloud 50GB Storage', recurring: true },
      { id: 'tx_s4', date: '2026-10-15', amount: 12000, category: 'income', merchant: 'Freelance Design Client - Mumbai', recurring: false },
      { id: 'tx_s5', date: '2026-10-12', amount: -150, category: 'fees', merchant: 'HDFC Minimum Balance Fine', recurring: true },
      { id: 'tx_s6', date: '2026-10-10', amount: -1250, category: 'shopping', merchant: 'Myntra Fashion', recurring: false },
      { id: 'tx_s7', date: '2026-10-04', amount: 5000, category: 'income', merchant: 'Home Allowance Transfer', recurring: true },
      { id: 'tx_s8', date: '2026-10-02', amount: -119, category: 'fees', merchant: 'HDFC Annual Debit Card Fee', recurring: false },
      { id: 'tx_s9', date: '2026-09-22', amount: -499, category: 'entertainment', merchant: 'Netflix Standard Sub', recurring: true },
      { id: 'tx_s10', date: '2026-09-19', amount: -179, category: 'music', merchant: 'Spotify Premium Duo', recurring: true },
      { id: 'tx_s11', date: '2026-09-18', amount: -89, category: 'cloud', merchant: 'iCloud 50GB Storage', recurring: true },
      { id: 'tx_s12', date: '2026-09-14', amount: -150, category: 'fees', merchant: 'HDFC Minimum Balance Fine', recurring: true },
      { id: 'tx_s13', date: '2026-09-04', amount: 5000, category: 'income', merchant: 'Home Allowance Transfer', recurring: true },
      { id: 'tx_s14', date: '2026-08-22', amount: -499, category: 'entertainment', merchant: 'Netflix Standard Sub', recurring: true },
      { id: 'tx_s15', date: '2026-08-19', amount: -179, category: 'music', merchant: 'Spotify Premium Duo', recurring: true }
    ],
    bills: [
      { id: 'b_s1', name: 'OneCard Bill', amount: 4500, dueDate: '2026-11-04' },
      { id: 'b_s2', name: 'Hostel Mess Fee', amount: 3500, dueDate: '2026-11-05' },
      { id: 'b_s3', name: 'Exam Certification Fee', amount: 1800, dueDate: '2026-11-15' }
    ],
    goals: [
      { id: 'gl_s1', name: 'MacBook Air M3 for Final Project', target: 85000, saved: 32000, deadline: '2027-04-15' },
      { id: 'gl_s2', name: 'Goa Graduation Trip', target: 15000, saved: 4500, deadline: '2027-01-20' }
    ]
  },

  shopkeeper: {
    id: 'shopkeeper',
    name: 'Rajesh Gupta',
    label: 'Kirana & Retail Merchant',
    tagline: 'Runs Shree Balaji Provisions in Jaipur, high turnover with seasonal inventory build-up',
    city: 'Jaipur',
    income: {
      type: 'irregular',
      monthlyAvg: 72000,
    },
    accounts: [
      { id: 'acc_sk1', type: 'bank', name: 'SBI Current Account', balance: 145000, meta: { business: true } },
      { id: 'acc_sk2', type: 'bank', name: 'Bank of Baroda Savings', balance: 82000, meta: { personal: true } },
      { id: 'acc_sk3', type: 'loan', name: 'Mudra Shishu & Working Capital Loan', balance: -220000, meta: { emi: 14500, lender: 'SBI MSME' } },
      { id: 'acc_sk4', type: 'insurance', name: 'National Insurance Shopkeeper Policy', balance: 0, meta: { sumAssured: 1500000, annualPremium: 8400, type: 'property' } },
      { id: 'acc_sk5', type: 'insurance', name: 'SBI General Health Insurance', balance: 0, meta: { sumAssured: 300000, annualPremium: 11200, type: 'health' } },
      { id: 'acc_sk6', type: 'insurance', name: 'New India Assurance Mediclaim (Duplicate)', balance: 0, meta: { sumAssured: 200000, annualPremium: 9800, type: 'health' } }
    ],
    transactions: [
      { id: 'tx_sk1', date: '2026-10-21', amount: 18500, category: 'income', merchant: 'Paytm Soundbox Daily Collections', recurring: false },
      { id: 'tx_sk2', date: '2026-10-20', amount: -14500, category: 'emi', merchant: 'SBI MSME Mudra Loan EMI', recurring: true },
      { id: 'tx_sk3', date: '2026-10-18', amount: -28000, category: 'inventory', merchant: 'Hindustan Unilever Wholesale Supplier', recurring: false },
      { id: 'tx_sk4', date: '2026-10-15', amount: -420, category: 'fees', merchant: 'SBI Current A/C Ledger Folio & Maintenance', recurring: true },
      { id: 'tx_sk5', date: '2026-10-14', amount: -125, category: 'fees', merchant: 'Paytm Soundbox Device Monthly Rental', recurring: true },
      { id: 'tx_sk6', date: '2026-10-12', amount: -933, category: 'insurance', merchant: 'SBI General Health Monthly Premium', recurring: true },
      { id: 'tx_sk7', date: '2026-10-11', amount: -816, category: 'insurance', merchant: 'New India Mediclaim Monthly Debit', recurring: true },
      { id: 'tx_sk8', date: '2026-10-05', amount: 24000, category: 'income', merchant: 'Festival Ghee & Dry Fruit Advance', recurring: false },
      { id: 'tx_sk9', date: '2026-10-02', amount: -350, category: 'fees', merchant: 'SBI Cash Deposit Processing Surcharge', recurring: false },
      { id: 'tx_sk10', date: '2026-09-20', amount: -14500, category: 'emi', merchant: 'SBI MSME Mudra Loan EMI', recurring: true },
      { id: 'tx_sk11', date: '2026-09-15', amount: -420, category: 'fees', merchant: 'SBI Current A/C Ledger Folio & Maintenance', recurring: true },
      { id: 'tx_sk12', date: '2026-09-14', amount: -125, category: 'fees', merchant: 'Paytm Soundbox Device Monthly Rental', recurring: true },
      { id: 'tx_sk13', date: '2026-09-12', amount: -933, category: 'insurance', merchant: 'SBI General Health Monthly Premium', recurring: true },
      { id: 'tx_sk14', date: '2026-09-11', amount: -816, category: 'insurance', merchant: 'New India Mediclaim Monthly Debit', recurring: true },
      { id: 'tx_sk15', date: '2026-08-20', amount: -14500, category: 'emi', merchant: 'SBI MSME Mudra Loan EMI', recurring: true },
      { id: 'tx_sk16', date: '2026-08-15', amount: -420, category: 'fees', merchant: 'SBI Current A/C Ledger Folio & Maintenance', recurring: true }
    ],
    bills: [
      { id: 'b_sk1', name: 'Mudra Loan EMI', amount: 14500, dueDate: '2026-11-05' },
      { id: 'b_sk2', name: 'Jaipur Vidyut Commercial Electricity', amount: 4850, dueDate: '2026-11-10' },
      { id: 'b_sk3', name: 'Shop Godown Rent', amount: 16000, dueDate: '2026-11-01' }
    ],
    goals: [
      { id: 'gl_sk1', name: 'Diwali Wholesale Stock Buildup', target: 200000, saved: 135000, deadline: '2026-11-01' },
      { id: 'gl_sk2', name: 'Shop Cold Storage Freezer', target: 75000, saved: 28000, deadline: '2027-05-15' }
    ]
  },

  family: {
    id: 'family',
    name: 'Priya & Karthik Iyer',
    label: 'Salaried Urban Household',
    tagline: 'Dual income IT couple in Chennai with two school-going children and home mortgage',
    city: 'Chennai',
    income: {
      type: 'regular',
      monthlyAvg: 168000,
    },
    accounts: [
      { id: 'acc_f1', type: 'bank', name: 'ICICI Salary Account (Karthik)', balance: 118000, meta: { salary: true } },
      { id: 'acc_f2', type: 'bank', name: 'Kotak 811 Savings (Priya)', balance: 74000, meta: { emergency: true } },
      { id: 'acc_f3', type: 'loan', name: 'HDFC Home Loan (4BHK Velachery)', balance: -4850000, meta: { emi: 46200, tenureLeftMonths: 168 } },
      { id: 'acc_f4', type: 'loan', name: 'Hyundai Creta Car Loan', balance: -320000, meta: { emi: 12800, tenureLeftMonths: 28 } },
      { id: 'acc_f5', type: 'card', name: 'ICICI Sapphiro Credit Card', balance: -34200, meta: { limit: 300000 } },
      { id: 'acc_f6', type: 'card', name: 'Amex Membership Rewards Card', balance: -18500, meta: { limit: 250000 } },
      { id: 'acc_f7', type: 'insurance', name: 'HDFC Life Click 2 Protect Term Plan', balance: 0, meta: { sumAssured: 15000000, annualPremium: 22000, type: 'term' } },
      { id: 'acc_f8', type: 'insurance', name: 'Star Health Family Optima Floater', balance: 0, meta: { sumAssured: 1500000, annualPremium: 28500, type: 'health' } },
      { id: 'acc_f9', type: 'insurance', name: 'ICICI Pru Life Endowment Savings (ULIP)', balance: 180000, meta: { sumAssured: 500000, annualPremium: 36000, type: 'endowment' } },
      { id: 'acc_f10', type: 'fd', name: 'Emergency Liquid Fixed Deposit', balance: 350000, meta: { interestRate: 7.1 } }
    ],
    transactions: [
      { id: 'tx_f1', date: '2026-10-21', amount: -46200, category: 'emi', merchant: 'HDFC Home Loan EMI Auto Debit', recurring: true },
      { id: 'tx_f2', date: '2026-10-20', amount: -12800, category: 'emi', merchant: 'ICICI Auto Loan EMI', recurring: true },
      { id: 'tx_f3', date: '2026-10-18', amount: -4500, category: 'fees', merchant: 'Amex Credit Card Annual Renewal Fee', recurring: true },
      { id: 'tx_f4', date: '2026-10-16', amount: -3500, category: 'fees', merchant: 'ICICI Sapphiro Card Annual Maintenance', recurring: true },
      { id: 'tx_f5', date: '2026-10-15', amount: 168000, category: 'income', merchant: 'Infosys & Cognizant Monthly Salaries', recurring: true },
      { id: 'tx_f6', date: '2026-10-12', amount: -1499, category: 'subscription', merchant: 'Cult.fit Fitness Annual Pack Monthly', recurring: true },
      { id: 'tx_f7', date: '2026-10-10', amount: -999, category: 'subscription', merchant: 'Amazon Prime + OTT Bundle', recurring: true },
      { id: 'tx_f8', date: '2026-10-08', amount: -1850, category: 'insurance', merchant: 'HDFC Life Term Insurance Monthly', recurring: true },
      { id: 'tx_f9', date: '2026-10-06', amount: -3000, category: 'insurance', merchant: 'ICICI Pru ULIP Monthly Debit', recurring: true },
      { id: 'tx_f10', date: '2026-10-05', amount: -14500, category: 'groceries', merchant: 'Nature Basket & BigBasket Monthly', recurring: false },
      { id: 'tx_f11', date: '2026-09-21', amount: -46200, category: 'emi', merchant: 'HDFC Home Loan EMI Auto Debit', recurring: true },
      { id: 'tx_f12', date: '2026-09-20', amount: -12800, category: 'emi', merchant: 'ICICI Auto Loan EMI', recurring: true },
      { id: 'tx_f13', date: '2026-09-15', amount: 168000, category: 'income', merchant: 'Infosys & Cognizant Monthly Salaries', recurring: true },
      { id: 'tx_f14', date: '2026-09-12', amount: -1499, category: 'subscription', merchant: 'Cult.fit Fitness Annual Pack Monthly', recurring: true },
      { id: 'tx_f15', date: '2026-09-10', amount: -999, category: 'subscription', merchant: 'Amazon Prime + OTT Bundle', recurring: true },
      { id: 'tx_f16', date: '2026-09-08', amount: -1850, category: 'insurance', merchant: 'HDFC Life Term Insurance Monthly', recurring: true },
      { id: 'tx_f17', date: '2026-09-06', amount: -3000, category: 'insurance', merchant: 'ICICI Pru ULIP Monthly Debit', recurring: true }
    ],
    bills: [
      { id: 'b_f1', name: 'Children Term-2 School Fees', amount: 62000, dueDate: '2026-11-10' },
      { id: 'b_f2', name: 'Home Loan EMI (HDFC)', amount: 46200, dueDate: '2026-11-05' },
      { id: 'b_f3', name: 'Car Loan EMI', amount: 12800, dueDate: '2026-11-05' },
      { id: 'b_f4', name: 'TANGEDCO Electricity Bill', amount: 5600, dueDate: '2026-11-14' }
    ],
    goals: [
      { id: 'gl_f1', name: 'Kids Higher Education Corpus', target: 2500000, saved: 820000, deadline: '2032-06-30' },
      { id: 'gl_f2', name: 'Diwali Gold & Family Vacation', target: 120000, saved: 78000, deadline: '2026-11-08' }
    ]
  },

  senior: {
    id: 'senior',
    name: 'K. Murugan',
    label: 'Senior Citizen & Pensioner',
    tagline: 'Retired state department superintendent in Madurai, living on fixed pension and post office deposits',
    city: 'Madurai',
    income: {
      type: 'regular',
      monthlyAvg: 41000,
    },
    accounts: [
      { id: 'acc_sr1', type: 'bank', name: 'Indian Bank Pension Account', balance: 52000, meta: { pensionAccount: true } },
      { id: 'acc_sr2', type: 'fd', name: 'Senior Citizen Savings Scheme (SCSS)', balance: 800000, meta: { quarterlyPayout: 16400 } },
      { id: 'acc_sr3', type: 'fd', name: 'Post Office Time Deposit', balance: 350000, meta: { interestRate: 7.5 } }
      // NOTE: Murugan has NO health insurance or active medical cover! Retired PSU cover lapsed.
    ],
    transactions: [
      { id: 'tx_sr1', date: '2026-10-21', amount: -3200, category: 'medical', merchant: 'Apollo Pharmacy Chronic Medications', recurring: true },
      { id: 'tx_sr2', date: '2026-10-18', amount: -88, category: 'fees', merchant: 'Indian Bank Inactivity & Ledger Fine', recurring: true },
      { id: 'tx_sr3', date: '2026-10-15', amount: -59, category: 'fees', merchant: 'SMS Alert Notification Quarterly Charge', recurring: true },
      { id: 'tx_sr4', date: '2026-10-01', amount: 41000, category: 'income', merchant: 'Tamil Nadu Treasury Pension Deposit', recurring: true },
      { id: 'tx_sr5', date: '2026-10-02', amount: -6500, category: 'groceries', merchant: 'Local Department Store Ration', recurring: false },
      { id: 'tx_sr6', date: '2026-10-05', amount: -400, category: 'utilities', merchant: 'Madurai Corporation Water Tax', recurring: false },
      { id: 'tx_sr7', date: '2026-09-21', amount: -3200, category: 'medical', merchant: 'Apollo Pharmacy Chronic Medications', recurring: true },
      { id: 'tx_sr8', date: '2026-09-18', amount: -88, category: 'fees', merchant: 'Indian Bank Inactivity & Ledger Fine', recurring: true },
      { id: 'tx_sr9', date: '2026-09-01', amount: 41000, category: 'income', merchant: 'Tamil Nadu Treasury Pension Deposit', recurring: true },
      { id: 'tx_sr10', date: '2026-08-21', amount: -3200, category: 'medical', merchant: 'Apollo Pharmacy Chronic Medications', recurring: true },
      { id: 'tx_sr11', date: '2026-08-18', amount: -88, category: 'fees', merchant: 'Indian Bank Inactivity & Ledger Fine', recurring: true }
    ],
    bills: [
      { id: 'b_sr1', name: 'Monthly Chronic Medicines', amount: 3200, dueDate: '2026-11-03' },
      { id: 'b_sr2', name: 'TNEB Domestic Power Bill', amount: 840, dueDate: '2026-11-12' },
      { id: 'b_sr3', name: 'BSNL Landline & Broadband', amount: 699, dueDate: '2026-11-18' }
    ],
    goals: [
      { id: 'gl_sr1', name: 'Kashi Rameswaram Pilgrimage Yatra', target: 50000, saved: 34000, deadline: '2027-02-15' },
      { id: 'gl_sr2', name: 'Granddaughter Wedding Blessing Gift', target: 100000, saved: 72000, deadline: '2027-08-30' }
    ]
  },

  shg: {
    id: 'shg',
    name: 'Sunita Devi',
    label: 'SHG Member & Dairy Micro-entrepreneur',
    tagline: 'Runs village milk collection center with 4 buffaloes in rural Bihar, active in Jeevika SHG',
    city: 'Muzaffarpur',
    income: {
      type: 'irregular',
      monthlyAvg: 19500,
    },
    accounts: [
      { id: 'acc_sh1', type: 'bank', name: 'Prathama UP Gramin Bank (Jan Dhan)', balance: 8450, meta: { janDhan: true } },
      { id: 'acc_sh2', type: 'loan', name: 'Jeevika SHG Group Revolving Fund Loan', balance: -24000, meta: { weeklyEmi: 650, monthlyEmi: 2600, peerGroup: 'Ujala SHG' } },
      { id: 'acc_sh3', type: 'insurance', name: 'Pradhan Mantri Suraksha Bima (PMSBY)', balance: 0, meta: { sumAssured: 200000, annualPremium: 20, type: 'accident' } }
      // NOTE: No health insurance or term life cover for micro-loan obligations
    ],
    transactions: [
      { id: 'tx_sh1', date: '2026-10-21', amount: 2400, category: 'income', merchant: 'Sudha Dairy 10-Day Milk Payment', recurring: false },
      { id: 'tx_sh2', date: '2026-10-19', amount: -650, category: 'emi', merchant: 'SHG Weekly Group Loan Repayment', recurring: true },
      { id: 'tx_sh3', date: '2026-10-15', amount: -35, category: 'fees', merchant: 'Jan Dhan Bank SMS Surcharge', recurring: true },
      { id: 'tx_sh4', date: '2026-10-12', amount: -650, category: 'emi', merchant: 'SHG Weekly Group Loan Repayment', recurring: true },
      { id: 'tx_sh5', date: '2026-10-09', amount: -1800, category: 'cattle_feed', merchant: 'Kisan Cattle Fodder Store', recurring: false },
      { id: 'tx_sh6', date: '2026-10-05', amount: -650, category: 'emi', merchant: 'SHG Weekly Group Loan Repayment', recurring: true },
      { id: 'tx_sh7', date: '2026-10-01', amount: 5600, category: 'income', merchant: 'Sudha Dairy Milk Cycle Settlement', recurring: false },
      { id: 'tx_sh8', date: '2026-09-28', amount: -650, category: 'emi', merchant: 'SHG Weekly Group Loan Repayment', recurring: true },
      { id: 'tx_sh9', date: '2026-09-21', amount: -650, category: 'emi', merchant: 'SHG Weekly Group Loan Repayment', recurring: true },
      { id: 'tx_sh10', date: '2026-09-15', amount: -35, category: 'fees', merchant: 'Jan Dhan Bank SMS Surcharge', recurring: true },
      { id: 'tx_sh11', date: '2026-09-14', amount: -650, category: 'emi', merchant: 'SHG Weekly Group Loan Repayment', recurring: true },
      { id: 'tx_sh12', date: '2026-08-28', amount: -650, category: 'emi', merchant: 'SHG Weekly Group Loan Repayment', recurring: true },
      { id: 'tx_sh13', date: '2026-08-21', amount: -650, category: 'emi', merchant: 'SHG Weekly Group Loan Repayment', recurring: true },
      { id: 'tx_sh14', date: '2026-08-15', amount: -35, category: 'fees', merchant: 'Jan Dhan Bank SMS Surcharge', recurring: true }
    ],
    bills: [
      { id: 'b_sh1', name: 'SHG Weekly Group Loan EMI', amount: 2600, dueDate: '2026-11-02' },
      { id: 'b_sh2', name: 'Dairy Cattle Feed Supply', amount: 3500, dueDate: '2026-11-08' },
      { id: 'b_sh3', name: 'Rural Electricity Pump Connection', amount: 420, dueDate: '2026-11-15' }
    ],
    goals: [
      { id: 'gl_sh1', name: 'Murrah Buffalo Purchase (2nd Unit)', target: 65000, saved: 21500, deadline: '2027-05-30' },
      { id: 'gl_sh2', name: 'Chhath Puja Family Celebration', target: 12000, saved: 8500, deadline: '2026-11-15' }
    ]
  }
};
