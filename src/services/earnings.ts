const MOCK_TRANSACTIONS = [
  {
    id: '1',
    transactionId: 'TXN-20250610-001',
    shiftTitle: 'Night Shift Nurse',
    facility: 'Lagos University Teaching Hospital',
    date: '2025-06-10',
    startTime: '8:00 PM',
    endTime: '6:00 AM',
    scheduledHours: 10,
    hoursWorked: 10,
    hourlyRate: 2500,
    grossPay: 25000,
    status: 'paid',
    paidAt: '2025-06-12T10:00:00Z',
  },
  {
    id: '2',
    transactionId: 'TXN-20250611-002',
    shiftTitle: 'Emergency Room Doctor',
    facility: 'Eko Hospital',
    date: '2025-06-11',
    startTime: '7:00 AM',
    endTime: '7:00 PM',
    scheduledHours: 12,
    hoursWorked: 12,
    hourlyRate: 5000,
    grossPay: 60000,
    status: 'paid',
    paidAt: '2025-06-13T10:00:00Z',
  },
  {
    id: '3',
    transactionId: 'TXN-20250612-003',
    shiftTitle: 'Pharmacist',
    facility: 'National Hospital Abuja',
    date: '2025-06-12',
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    scheduledHours: 8,
    hoursWorked: 8,
    hourlyRate: 4375,
    grossPay: 35000,
    status: 'pending',
    paidAt: null,
  },
  {
    id: '4',
    transactionId: 'TXN-20250613-004',
    shiftTitle: 'ICU Nurse',
    facility: 'St. Nicholas Hospital',
    date: '2025-06-13',
    startTime: '6:00 AM',
    endTime: '6:00 PM',
    scheduledHours: 12,
    hoursWorked: 12,
    hourlyRate: 3333,
    grossPay: 40000,
    status: 'pending',
    paidAt: null,
  },
];

export const earningsService = {
  getSummary: async () => {
    await new Promise((res) => setTimeout(res, 600));
    const totalEarnings = MOCK_TRANSACTIONS.reduce((sum, t) => sum + t.grossPay, 0);
    const paidEarnings = MOCK_TRANSACTIONS
      .filter((t) => t.status === 'paid')
      .reduce((sum, t) => sum + t.grossPay, 0);
    const pendingEarnings = MOCK_TRANSACTIONS
      .filter((t) => t.status === 'pending')
      .reduce((sum, t) => sum + t.grossPay, 0);
    return {
      totalEarnings,
      paidEarnings,
      pendingEarnings,
      totalShiftsCompleted: MOCK_TRANSACTIONS.length,
    };
  },

  getTransactions: async (status?: string) => {
    await new Promise((res) => setTimeout(res, 600));
    if (status && status !== 'all') {
      return MOCK_TRANSACTIONS.filter((t) => t.status === status);
    }
    return MOCK_TRANSACTIONS;
  },

  getTransactionById: async (id: string) => {
    await new Promise((res) => setTimeout(res, 400));
    return MOCK_TRANSACTIONS.find((t) => t.id === id) || null;
  },
};