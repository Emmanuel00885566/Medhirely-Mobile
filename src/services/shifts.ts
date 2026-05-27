// 👇 Mocked shifts data
const MOCK_SHIFTS = [
  {
    id: '1',
    title: 'Night Shift Nurse',
    facility: 'Lagos University Teaching Hospital',
    location: 'Lagos, Nigeria',
    specialty: 'Registered Nurse',
    date: '2025-06-10',
    startTime: '8:00 PM',
    endTime: '6:00 AM',
    pay: 25000,
    requirements: ['Valid nursing license', 'Minimum 2 years experience'],
    status: 'open',
  },
  {
    id: '2',
    title: 'Emergency Room Doctor',
    facility: 'Eko Hospital',
    location: 'Lagos, Nigeria',
    specialty: 'Emergency Medicine',
    date: '2025-06-11',
    startTime: '7:00 AM',
    endTime: '7:00 PM',
    pay: 60000,
    requirements: ['MBBS', 'Emergency medicine certification'],
    status: 'open',
  },
  {
    id: '3',
    title: 'Pharmacist',
    facility: 'National Hospital Abuja',
    location: 'Abuja, Nigeria',
    specialty: 'Pharmacy',
    date: '2025-06-12',
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    pay: 35000,
    requirements: ['Pharmacy degree', 'PCN registration'],
    status: 'open',
  },
  {
    id: '4',
    title: 'ICU Nurse',
    facility: 'St. Nicholas Hospital',
    location: 'Lagos, Nigeria',
    specialty: 'Critical Care',
    date: '2025-06-13',
    startTime: '6:00 AM',
    endTime: '6:00 PM',
    pay: 40000,
    requirements: ['ICU experience', 'BLS/ACLS certification'],
    status: 'open',
  },
];

export const shiftsService = {
  // ✅ Get all shifts
  getShifts: async () => {
    await new Promise((res) => setTimeout(res, 800));
    return MOCK_SHIFTS;
  },

  // ✅ Get single shift
  getShiftById: async (id: string) => {
    await new Promise((res) => setTimeout(res, 500));
    return MOCK_SHIFTS.find((s) => s.id === id) || null;
  },

  // ✅ Filter shifts
  filterShifts: async (filters: {
    specialty?: string;
    location?: string;
    minPay?: number;
  }) => {
    await new Promise((res) => setTimeout(res, 600));
    return MOCK_SHIFTS.filter((shift) => {
      if (filters.specialty && shift.specialty !== filters.specialty)
        return false;
      if (filters.location && !shift.location.includes(filters.location))
        return false;
      if (filters.minPay && shift.pay < filters.minPay) return false;
      return true;
    });
  },
};