import api from './api';

export const availabilityService = {
  // ✅ Set Availability
  setAvailability: async (data: {
    dayOfWeek: string;
    timeBlocks: { start: string; end: string }[];
  }) => {
    const response = await api.post('/workers/availability', data);
    return response.data;
  },

  // ✅ Get Availability
  getAvailability: async () => {
    const response = await api.get('/workers/availability');
    return response.data;
  },

  // ✅ Update Availability by day
  updateAvailability: async (
    day: string,
    data: { timeBlocks: { start: string; end: string }[] }
  ) => {
    const response = await api.put(`/workers/availability/${day}`, data);
    return response.data;
  },
};