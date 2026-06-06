import api from './api';

const MOCK_APPLICATIONS = [
  {
    id: '1',
    shiftId: '1',
    workerId: '1',
    status: 'pending',
    appliedAt: '2025-06-01T10:00:00Z',
    shift: {
      id: '1',
      title: 'Night Shift Nurse',
      facility: 'Lagos University Teaching Hospital',
      location: 'Lagos, Nigeria',
      address: '1 University Road, Surulere, Lagos',
      date: '2025-06-10',
      startTime: '8:00 PM',
      endTime: '6:00 AM',
      pay: 25000,
      contactName: 'Dr. Adeyemi',
      contactPhone: '08011111111',
      checkInPin: '4521',
    },
  },
  {
    id: '2',
    shiftId: '2',
    workerId: '1',
    status: 'accepted',
    appliedAt: '2025-06-02T10:00:00Z',
    shift: {
      id: '2',
      title: 'Emergency Room Doctor',
      facility: 'Eko Hospital',
      location: 'Lagos, Nigeria',
      address: '31 Mobolaji Bank Anthony Way, Lagos',
      date: '2025-06-11',
      startTime: '7:00 AM',
      endTime: '7:00 PM',
      pay: 60000,
      contactName: 'Dr. Okafor',
      contactPhone: '08022222222',
      checkInPin: '7823',
    },
  },
  {
    id: '3',
    shiftId: '3',
    workerId: '1',
    status: 'completed',
    appliedAt: '2025-05-20T10:00:00Z',
    shift: {
      id: '3',
      title: 'Pharmacist',
      facility: 'National Hospital Abuja',
      location: 'Abuja, Nigeria',
      address: 'Central Business District, Abuja',
      date: '2025-05-25',
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      pay: 35000,
      contactName: 'Dr. Bello',
      contactPhone: '08033333333',
      checkInPin: '1234',
    },
  },
  {
    id: '4',
    shiftId: '4',
    workerId: '1',
    status: 'rejected',
    appliedAt: '2025-05-15T10:00:00Z',
    shift: {
      id: '4',
      title: 'ICU Nurse',
      facility: 'St. Nicholas Hospital',
      location: 'Lagos, Nigeria',
      address: '57 Campbell Street, Lagos Island',
      date: '2025-05-20',
      startTime: '6:00 AM',
      endTime: '6:00 PM',
      pay: 40000,
      contactName: 'Dr. Williams',
      contactPhone: '08044444444',
      checkInPin: '',
    },
  },
];

const USE_MOCK = true; // ← flip to false when backend is ready

export const applicationsService = {
  // ✅ GET all applications
  getMyApplications: async (workerId?: string, status?: string) => {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 600));
      let results = MOCK_APPLICATIONS.filter((a) => a.workerId === (workerId || '1'));
      if (status) results = results.filter((a) => a.status === status);
      return results;
    }
    const response = await api.get('/applications/getAllApplications');
    console.log('Applications response:', response.data);
    return response.data;
  },

  // ✅ POST apply for shift
  applyForShift: async (
    shiftId: string,
    workerId: string,
    facilityId: string,
    coverMessage?: string
  ) => {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 800));
      const existing = MOCK_APPLICATIONS.find(
        (a) => a.shiftId === shiftId && a.workerId === workerId
      );
      if (existing) throw new Error('Already applied for this shift');
      const newApplication = {
        id: Date.now().toString(),
        shiftId,
        workerId,
        status: 'pending',
        appliedAt: new Date().toISOString(),
        shift: {
          id: shiftId,
          title: 'New Shift',
          facility: 'General Hospital',
          location: 'Lagos, Nigeria',
          address: 'Lagos',
          date: '2025-06-15',
          startTime: '8:00 AM',
          endTime: '4:00 PM',
          pay: 20000,
          contactName: 'Dr. Smith',
          contactPhone: '08055555555',
          checkInPin: '',
        },
      };
      MOCK_APPLICATIONS.push(newApplication);
      return newApplication;
    }
    const response = await api.post(
      `/applications/applyForShift/${shiftId}`,
      {
        workerId,
        facilityId,
        coverMessage: coverMessage || '',
      }
    );
    console.log('Apply response:', response.data);
    return response.data;
  },

  // ✅ PATCH review application (admin/facility side)
  reviewApplication: async (
    applicationId: string,
    status: 'approved' | 'rejected',
    reviewedBy: string
  ) => {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 600));
      const app = MOCK_APPLICATIONS.find((a) => a.id === applicationId);
      if (app) app.status = status;
      return { success: true };
    }
    const response = await api.patch(
      `/applications/reviewApplication/${applicationId}`,
      { status, reviewedBy }
    );
    console.log('Review response:', response.data);
    return response.data;
  },

  // ✅ GET application by ID (frontend only, from mock)
  getApplicationById: async (applicationId: string) => {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 500));
      return MOCK_APPLICATIONS.find((a) => a.id === applicationId) || null;
    }
    const response = await api.get(`/applications/${applicationId}`);
    return response.data;
  },

  // ✅ Withdraw application (frontend only for now)
  withdrawApplication: async (applicationId: string) => {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 600));
      const app = MOCK_APPLICATIONS.find((a) => a.id === applicationId);
      if (app) app.status = 'withdrawn';
      return { success: true };
    }
    const response = await api.patch(`/applications/withdraw/${applicationId}`);
    return response.data;
  },
};