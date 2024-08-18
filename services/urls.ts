const buildURL = (basePath: string) => (endpoint: string) => `${basePath}${endpoint}`;

const buildVerseURL = buildURL('/buildverse');
const makeMyPassURL = buildURL('/makemypass');

export const makeMyPass = {
  //Common
  onboardUser: makeMyPassURL('/common/onboard-user/'),
  listEvents: makeMyPassURL('/common/user/events/'),

  //Scan Guest
  checkInUser: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/checkin`),
  checkInButtons: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/buttons/`),
  checkOutUser: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/checkout`),
  checkInUserVenue: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/venue/checkin/`),
  listUserVenues: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/venue/list`),
  listUserGifts: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/gift/list`),
  claimUserGift: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/gift/claim`), //Scratch Card

  //Manage Guests
  createEvent: makeMyPassURL(`/manage-event/create/`),
  listVisitedVenues: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest/${eventRegisterId}/visited-venues/`),
  getMailLog: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest/${eventRegisterId}/mail-log/`),
  resentTicket: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest/${eventRegisterId}/resend-ticket/`),
  editSubmission: (eventId: string, submissionId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest/${submissionId}/edit/`),
  downloadTicket: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest/${eventRegisterId}/download-ticket`),
  sentInvite: (eventId: string) => makeMyPassURL(`/manage-guest/${eventId}/send-invite/`),
  shortListUser: (eventId: string, userId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest/${userId}/shortlist`),
  listGuests: (eventId: string) => makeMyPassURL(`/manage-guest/${eventId}/register-list/`),
  initateRefund: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest/${eventRegisterId}/initiate-refund/`),
  guestInfo: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest/${eventRegisterId}/`),
  addGuestInfo: (eventId: string) => makeMyPassURL(`/manage-guest/${eventId}/form-info/`),
  downloadCSV: (eventId: string) => makeMyPassURL(`/manage-guest/${eventId}/download-csv/`),
  getCategories: (eventId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/list-form-categories/`),

  //Manage Logs
  getAllMailLog: (eventId: string) => makeMyPassURL(`/manage-log/${eventId}/mail-log/`),
  getPaymentAnalytics: (eventId: string) => makeMyPassURL(`/manage-log/${eventId}/payment-log/`),
  getPaymentAnalyticsCSV: (eventId: string) =>
    makeMyPassURL(`/manage-log/${eventId}/payment-log/csv/`),

  //Manage Ticket
  getTicketInfo: (eventId: string) => makeMyPassURL(`/manage-ticket/${eventId}/list/`),
  createTicket: (eventId: string) => makeMyPassURL(`/manage-ticket/${eventId}/create/`),
  ticket: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/manage-ticket/${eventId}/ticket/${ticketCode}`),
  getShortListTicket: (eventId: string) => makeMyPassURL(`/manage-ticket/${eventId}/list/short`),

  // Manage Event
  event: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/event/`),
  getEventId: (eventName: string) => makeMyPassURL(`/manage-event/get-event-info/${eventName}/`),
  listHosts: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/host/list`),
  addHost: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/host/create`),
  host: (eventId: string, hostId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/host/${hostId}`),
  duplicateEvent: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/duplicate/`),
  listVenues: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/venue/list`),
  updateVenueList: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/venue/update`),
  listSpeakers: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/speaker/list`),
  updateSpeakerList: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/speaker/update`),
  listPublicEvents: makeMyPassURL('/manage-event/list-events/'), //unused

  //Feedback
  getFeedback: (eventId: string) => makeMyPassURL(`/feedback/${eventId}/list/`),
  getPostEventFields: (eventId: string) => makeMyPassURL(`/feedback/${eventId}/form-info/`),
  submitFeedback: (eventId: string) => makeMyPassURL(`/feedback/${eventId}/submit/`),
  getPostEventCategories: (eventId: string) => makeMyPassURL(`/feedback/${eventId}/categories/`),

  //Bulk Import
  uploadFile: (eventId: string) => makeMyPassURL(`/bulk/${eventId}/import-guest/upload`),
  downloadCSVTemplate: (event_id: string) =>
    makeMyPassURL(`/bulk/${event_id}/import-guest/download-template/`),
  getFileStatus: (eventId: string) => makeMyPassURL(`/bulk/${eventId}import-guest/list`),

  //Public Form
  validatePayment: makeMyPassURL(`/public-form/validate-payment/`),
  verifyParticipant: (verificationCode: string) =>
    makeMyPassURL(`/public-form/verify-participant/${verificationCode}/`),
  getEventInfo: (eventName: string) => makeMyPassURL(`/public-form/${eventName}/info/`),
  createPayment: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/create-order/`),
  validateCoupon: (eventId: string, couponCode: string) =>
    makeMyPassURL(`/public-form/${eventId}/apply-coupon-code/?coupon_code=${couponCode}`),
  validateRsvp: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/validate-rsvp/`),
  submitForm: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/submit/`),
  parseFromAudio: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/parse-from-audio/`),
  sendVerfication: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/send-verification/`),

  //FormBuilder
  formBuilderGetForm: (eventId: string) => makeMyPassURL(`/form-builder/${eventId}/register-form/`),
  formBuilderUpdateForm: (eventId: string) =>
    makeMyPassURL(`/form-builder/${eventId}/register-form/`),

  //Communication
  listMails: (eventId: string) => makeMyPassURL(`/communication/${eventId}/mail/list/`),
  sentTestMail: (eventId: string, mailId: string) =>
    makeMyPassURL(`/communication/${eventId}/mail/${mailId}/send-test`),
  getMail: (eventId: string, mailId: string) =>
    makeMyPassURL(`/communication/${eventId}/mail/${mailId}/`),
  updateMail: (eventId: string, mailId: string) =>
    makeMyPassURL(`/communication/${eventId}/mail/${mailId}/`),
  sentPostMail: (eventId: string) =>
    makeMyPassURL(`/communication/${eventId}/post-event/send-mail/`),
  getPostEventStatus: (eventId: string) =>
    makeMyPassURL(`/communication/${eventId}/post-event/status/`),
  mailService: (eventId: string) => makeMyPassURL(`/communication/${eventId}/service/mail`),
  deleteAttachment: (eventId: string, mailId: string) =>
    makeMyPassURL(`/communication/${eventId}/mail/${mailId}/delete-attachment/`),

  //manage-coupon
  listCoupons: (eventId: string) => makeMyPassURL(`/manage-coupon/${eventId}/list/`),
  createCoupon: (eventId: string) => makeMyPassURL(`/manage-coupon/${eventId}/create/`),
  coupon: (eventId: string, couponId: string) =>
    makeMyPassURL(`/manage-coupon/${eventId}/coupon/${couponId}/`),
  updateCouponStatus: (eventId: string) => makeMyPassURL(`/manage-coupon/${eventId}/status`),

  //Analytics API
  getAnalyticsVisibility: (eventId: string) =>
    makeMyPassURL(`/analytics/${eventId}/analytics-visibility/`),

  //Manage Games
  claimRegisterGift: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/games/${eventId}/scratch-card/${eventRegisterId}/claim`),
};

export const makeMyPassSocket = {
  analytics: (eventId: string) => `analytics/${eventId}/register-insights/`,
  registerCounts: (eventId: string) => `analytics/${eventId}/register-glance-count/`,
  checkInCounts: (eventId: string) => `analytics/${eventId}/checkin-glance-count/`,
  checkInAnalytics: (eventId: string) => `analytics/${eventId}/checkin-insights/`,
  listCheckinGuests: (eventId: string) => `manage-guest/${eventId}/checkin-list/`,
  recentRegistrations: (eventId: string) => `manage-guest/${eventId}/recent-registrations/`,
};

export const buildVerse = {
  login: buildVerseURL('/login/'),
  getAccessToken: buildVerseURL('/get-access-token/'),
  generateOTP: buildVerseURL('/generate-otp/'),
  preRegister: buildVerseURL('/pre-register/'),
  register: buildVerseURL('/register/'),
  updateProfile: buildVerseURL('/update-profile/'),
  profileInfo: buildVerseURL('/profile-info/'),
  setUserData: (token: string) => buildVerseURL(`/set-user-data/${token}`),
  googleLogin: buildVerseURL('/google-login/'),
  resetPassword: buildVerseURL('/reset-password/'),
  updateProfilePassword: buildVerseURL('/change-password/'),
};
