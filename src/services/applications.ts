import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const applicationsService = {
  // ✅ Apply for a shift
 applyForShift: async (shiftId: string, workerId: string, facilityId?: string) => {
  try {
    const storedUser = await AsyncStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    const body = {
      workerId: user?._id || workerId,
      facilityId: facilityId,
      coverMessage: 'I am interested in this shift, I can deliver.',
    };

    console.log('Applying with body:', JSON.stringify(body));

    const response = await api.post(
      `/applications/applyForShift/${shiftId}`,
      body
    );
    return response.data;
  } catch (error: any) {
    console.log('APPLY FOR SHIFT ERROR:', error?.response?.data);
    throw error;
  }
},

  // ✅ Get all applications for logged in worker
 getMyApplications: async (workerId?: string, status?: string) => {
  try {
    const response = await api.get('/applications/getAllApplications');

    const applications = response.data?.applications || [];

    const mapped = applications.map((app: any) => ({
      id: app._id,
      status: app.status?.toLowerCase() || 'pending',
      appliedAt: app.createdAt || new Date().toISOString(),
      shift: {
        id: app.shiftId?._id,
        title: app.shiftId?.title || 'Healthcare Shift',
        facility: app.facilityId?.facilityName || 'Healthcare Facility',
        location: app.shiftId?.location || 'Lagos, Nigeria',
        address: app.facilityId?.address || 'Lagos, Nigeria',
        date: app.shiftId?.shiftDate
          ? new Date(app.shiftId.shiftDate).toLocaleDateString('en-NG', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : 'TBD',
        startTime: app.shiftId?.startTime || '8:00 AM',
        endTime: app.shiftId?.endTime || '4:00 PM',
        pay: app.shiftId?.salary || 0,
        contactPhone: app.facilityId?.phoneNumber || '',
        checkInPin: '',
        notes: app.shiftId?.notes || '',
      },
    }));

    if (status && status !== 'all') {
      return mapped.filter(
        (app: any) => app.status === status.toLowerCase()
      );
    }

    return mapped;
  } catch (error: any) {
    console.log('GET APPLICATIONS ERROR:', error?.response?.data);
    throw error;
  }
},

  // ✅ Withdraw application (still mocked — no endpoint yet)
  withdrawApplication: async (applicationId: string) => {
    await new Promise((res) => setTimeout(res, 600));
    return { success: true };
  },

  // ✅ Get application by ID (still mocked — no endpoint yet)
  getApplicationById: async (applicationId: string) => {
    await new Promise((res) => setTimeout(res, 500));
    return null;
  },
};