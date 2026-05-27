// 👇 Mocked applications
let MOCK_APPLICATIONS: any[] = [];

export const applicationsService = {
  // ✅ Apply for a shift
  applyForShift: async (shiftId: string, workerId: string) => {
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
    };

    MOCK_APPLICATIONS.push(newApplication);
    return newApplication;
  },

  // ✅ Get my applications
  getMyApplications: async (workerId: string) => {
    await new Promise((res) => setTimeout(res, 600));
    return MOCK_APPLICATIONS.filter((a) => a.workerId === workerId);
  },
};