import api from './api';

const MOCK_SHIFTS = [
  {
    id: '1',
    title: 'Staff Nurse',
    facility: 'Eko Hospital - VI, Lagos',
    facilityRating: 4.5,
    facilityReviews: 21,
    facilityVerified: true,
    location: 'Victoria Island, Lagos',
    address: 'Opp. City boys Boulevard, MG Road, Ikorodu, Lagos',
    specialty: 'Registered Nurse',
    date: '20th May, 2026 (Sun)',
    startTime: '7:00 PM',
    endTime: '12:00 AM',
    duration: '5 hrs',
    hourlyRate: 8500,
    payPerShift: 45000,
    requirements: ['No Exp Required'],
    shiftType: 'Night Shift',
    distance: '2.4 km away',
    applied: 4,
    status: 'open',
    responseTime: '4-6 hours',
    contactPhone: '+234 804 333 32',
    notes: 'Please carry your ID card and arrive on time. Thank you!',
  },
  {
    id: '2',
    title: 'Interim Doctor',
    facility: 'St Luke Hospital - Lekki, Lagos',
    facilityRating: 4.5,
    facilityReviews: 12,
    facilityVerified: true,
    location: 'Lekki, Lagos',
    address: 'Opp. City boys Boulevard, MG Road, Ikorodu, Lagos',
    specialty: 'Emergency Medicine',
    date: '20th May, 2026 (Sun)',
    startTime: '7:00 AM',
    endTime: '7:00 PM',
    duration: '12 hrs',
    hourlyRate: 8500,
    payPerShift: 45000,
    requirements: ['2-3 Years Exp'],
    shiftType: 'Day Shift',
    distance: '2.4 km away',
    applied: 2,
    status: 'open',
    responseTime: '4-6 hours',
    contactPhone: '+234 804 333 32',
    notes: 'Please carry your ID card and arrive on time.',
  },
  {
    id: '3',
    title: 'Resident Nurse',
    facility: 'KiriKiri Hospital - Otta, Ogun',
    facilityRating: 4.5,
    facilityReviews: 21,
    facilityVerified: true,
    location: 'Otta, Ogun',
    address: 'Opp. City boys Boulevard, MG Road, Ikorodu, Lagos',
    specialty: 'Registered Nurse',
    date: '25th May, 2026 (Sat)',
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    duration: '8 hrs',
    hourlyRate: 8500,
    payPerShift: 35000,
    requirements: ['No Exp Required'],
    shiftType: 'Night Shift',
    distance: '2.4 km away',
    applied: 4,
    status: 'open',
    responseTime: '4-6 hours',
    contactPhone: '+234 804 333 32',
    notes: 'Please carry your ID card and arrive on time.',
  },
  {
    id: '4',
    title: 'Pediatrician',
    facility: 'St Luke\'s Hospital',
    facilityRating: 4.5,
    facilityReviews: 21,
    facilityVerified: true,
    location: 'Ikorodu, Lagos',
    address: 'Opp. City boys Boulevard, MG Road, Ikorodu, Lagos',
    specialty: 'Pediatrics',
    date: '20th May, 2026 (Sun)',
    startTime: '7:00 PM',
    endTime: '12:00 AM',
    duration: '5 hrs',
    hourlyRate: 3750,
    payPerShift: 45000,
    requirements: ['2-3 Years Exp'],
    shiftType: 'Day Shift',
    distance: '3.8 km away',
    applied: 1,
    status: 'open',
    responseTime: '4-6 hours',
    contactPhone: '+234 804 333 32',
    notes: 'Please carry your ID card and arrive on time.',
  },
  {
    id: '5',
    title: 'Optician',
    facility: 'Dele Momodu HP',
    facilityRating: 4.2,
    facilityReviews: 8,
    facilityVerified: true,
    location: 'Lagos Island, Lagos',
    address: 'Opp. City boys Boulevard, MG Road, Ikorodu, Lagos',
    specialty: 'Optometry',
    date: '27th May, 2026 (Wed)',
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    duration: '8 hrs',
    hourlyRate: 25000,
    payPerShift: 200000,
    requirements: ['2-3 Years Exp'],
    shiftType: 'Day Shift',
    distance: '4.1 km away',
    applied: 0,
    status: 'open',
    responseTime: '4-6 hours',
    contactPhone: '+234 804 333 32',
    notes: 'Please carry your ID card and arrive on time.',
  },
];

const USE_MOCK = false;

export const shiftsService = {
  // ✅ GET all shifts
  getShifts: async () => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 800));
    return MOCK_SHIFTS;
  }
  console.log('Fetching shifts from:', '/shifts/discover/all');
  const response = await api.get('/shifts/discover/all');
  console.log('Shifts response:', JSON.stringify(response.data, null, 2));

  // Map backend fields to what the UI expects
  return response.data.shifts.map((shift: any) => ({
    id: shift._id,
    title: shift.title,
    facility: shift.location, // no facility name yet, using location
    facilityId: shift.facilityId,
    facilityRating: 4.5, // not in backend yet
    facilityReviews: 0,  // not in backend yet
    facilityVerified: true,
    location: shift.location,
    address: shift.location,
    specialty: shift.specialty,
    date: new Date(shift.shiftDate).toDateString(),
    startTime: shift.startTime,
    endTime: shift.endTime,
    duration: `${parseInt(shift.endTime) - parseInt(shift.startTime)} hrs`,
    hourlyRate: shift.salary,
    payPerShift: shift.salary,
    requirements: ['No Exp Required'],
    shiftType: shift.shiftType === 'night' ? 'Night Shift' : 'Day Shift',
    distance: 'N/A',
    applied: shift.applicants?.length || 0,
    status: shift.status,
    responseTime: '4-6 hours',
    contactPhone: 'N/A',
    notes: shift.notes,
    urgent: shift.urgent,
  }));
},
  // ✅ GET shift by ID
  getShiftById: async (id: string) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 500));
    return MOCK_SHIFTS.find((s) => s.id === id) || null;
  }
  const response = await api.get(`/shifts/discover/${id}`);
  console.log('Shift by ID response:', JSON.stringify(response.data, null, 2));

  const shift = response.data.shift || response.data;
  return {
    id: shift._id,
    title: shift.title,
    facility: shift.location,
    facilityId: shift.facilityId,
    facilityRating: 4.5,
    facilityReviews: 0,
    facilityVerified: true,
    location: shift.location,
    address: shift.location,
    specialty: shift.specialty,
    date: new Date(shift.shiftDate).toDateString(),
    startTime: shift.startTime,
    endTime: shift.endTime,
    duration: `${parseInt(shift.endTime) - parseInt(shift.startTime)} hrs`,
    hourlyRate: shift.salary,
    payPerShift: shift.salary,
    requirements: ['No Exp Required'],
    shiftType: shift.shiftType === 'night' ? 'Night Shift' : 'Day Shift',
    distance: 'N/A',
    applied: shift.applicants?.length || 0,
    status: shift.status,
    responseTime: '4-6 hours',
    contactPhone: 'N/A',
    notes: shift.notes,
    urgent: shift.urgent,
  };
},

  // Frontend filtering — works with both mock and real data
  filterShifts: async (filters: {
    specialty?: string;
    location?: string;
    minPay?: number;
    shiftType?: string;
  }) => {
    const shifts = await shiftsService.getShifts();
    return shifts.filter((shift: any) => {
      if (filters.specialty && shift.specialty !== filters.specialty)
        return false;
      if (filters.location && !shift.location.includes(filters.location))
        return false;
      if (filters.minPay && shift.payPerShift < filters.minPay)
        return false;
      if (filters.shiftType && shift.shiftType !== filters.shiftType)
        return false;
      return true;
    });
  },
};