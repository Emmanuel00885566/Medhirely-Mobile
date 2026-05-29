const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'application_accepted',
    title: 'You\'re In! 🎉',
    message: 'Your application for Night Shift Nurse at Lagos University Teaching Hospital has been accepted. Tap to view details.',
    read: false,
    createdAt: '2025-06-10T10:00:00Z',
  },
  {
    id: '2',
    type: 'verification_approved',
    title: 'Account Verified! ✅',
    message: 'Welcome to MedHirely! Your account is now verified. Start discovering shifts near you.',
    read: false,
    createdAt: '2025-06-09T08:00:00Z',
  },
  {
    id: '3',
    type: 'shift_reminder',
    title: 'Shift Tomorrow ⏰',
    message: 'Reminder: You have a shift at Eko Hospital tomorrow at 7:00 AM. Be prepared!',
    read: false,
    createdAt: '2025-06-08T12:00:00Z',
  },
  {
    id: '4',
    type: 'payment_released',
    title: 'Payment Sent! 💰',
    message: '₦35,000 for your shift at National Hospital Abuja has been released. Check your earnings.',
    read: true,
    createdAt: '2025-06-07T09:00:00Z',
  },
  {
    id: '5',
    type: 'application_rejected',
    title: 'Application Update 📋',
    message: 'Unfortunately, your application for ICU Nurse was not accepted this time. Keep applying!',
    read: true,
    createdAt: '2025-06-06T14:00:00Z',
  },
  {
    id: '6',
    type: 'new_shift_available',
    title: 'New Shift Alert 🏥',
    message: 'A new Registered Nurse shift at St. Nicholas Hospital pays ₦40,000. Tap to view and apply.',
    read: true,
    createdAt: '2025-06-05T11:00:00Z',
  },
  {
    id: '7',
    type: 'document_rejected',
    title: 'Action Required ⚠️',
    message: 'One or more of your documents were rejected. Tap to re-upload and complete verification.',
    read: true,
    createdAt: '2025-06-04T10:00:00Z',
  },
];

export const notificationsService = {
  getNotifications: async () => {
    await new Promise((res) => setTimeout(res, 600));
    return MOCK_NOTIFICATIONS;
  },

  markAsRead: async (id: string) => {
    await new Promise((res) => setTimeout(res, 300));
    const notification = MOCK_NOTIFICATIONS.find((n) => n.id === id);
    if (notification) notification.read = true;
    return { success: true };
  },

  markAllAsRead: async () => {
    await new Promise((res) => setTimeout(res, 300));
    MOCK_NOTIFICATIONS.forEach((n) => (n.read = true));
    return { success: true };
  },

  getUnreadCount: async () => {
    return MOCK_NOTIFICATIONS.filter((n) => !n.read).length;
  },
};