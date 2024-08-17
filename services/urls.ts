const buildURL = (basePath: string) => (endpoint: string) => `${basePath}${endpoint}`;

const buildVerseURL = buildURL('/buildverse');
const makeMyPassURL = buildURL('/makemypass');

export const makeMyPass = {
  //Event Management
  onboardUser: makeMyPassURL('/common/onboard-user/'),
  listEvents: makeMyPassURL('/common/user/list-events/'),

  listPublicEvents: makeMyPassURL('/manage-event/list-events/'), //unused

  createEvent: makeMyPassURL(`/manage-event/create-event/`),
  deleteEvent: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/delete-event/`),

  getEventId: (eventName: string) => makeMyPassURL(`/manage-event/get-event-info/${eventName}/`),
  getEvent: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/get-event/`),
  editEvent: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/edit-event/`),
  duplicateEvent: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/duplicate-event/`),

  //Scan Guest
  checkInUser: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/checkin`),
  checkInButtons: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/checkin-buttons/`),
  checkOutUser: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/checkout`),
  checkInUserVenue: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/venue-checkin/`),
  listUserVenues: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/list-venue/`),
  listUserGifts: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/list-user-gifts/`),
  claimUserGift: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/claim-gift/`), //Scratch Card

  listVisitedVenues: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest-info/${eventRegisterId}/visited-venues/`),
  getMailLog: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest-info/${eventRegisterId}/mail-log/`),

  //Manage Logs
  getAllMailLog: (eventId: string) => makeMyPassURL(`/manage-log/${eventId}/mail-log/`),
  getPaymentAnalytics: (eventId: string) => makeMyPassURL(`/manage-log/${eventId}/payment-log/`),
  getPaymentAnalyticsCSV: (eventId: string) =>
    makeMyPassURL(`/manage-log/${eventId}/payment-log/csv/`),

  resentTicket: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest-info/${eventRegisterId}/resend-ticket/`),
  editSubmission: (eventId: string, submissionId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest-info/${submissionId}/edit/`),
  deleteSubmission: (eventId: string, submissionId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest-info/${submissionId}/delete/`),
  downloadTicket: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest-info/${eventRegisterId}/download-ticket`),
  userInfo: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/scan-guest/${eventId}/user-info/${ticketCode}`),
  preview: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/scan-guest/${eventId}/preview/${ticketCode}`),
  getTicketInfo: (eventId: string) => makeMyPassURL(`/manage-ticket/${eventId}/list-tickets/`),
  sentInvite: (eventId: string) => makeMyPassURL(`/manage-guest/${eventId}/send-invite/`),
  shortListUser: (eventId: string, userId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest-info/${userId}/shortlist`),
  validateSentInvitePayment: (eventId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/validate-sent-invite-payment/`),
  getUserPerksInfo: (ticketCode: string) =>
    makeMyPassURL(`/manage-guest/get-user-perks-info/${ticketCode}`),
  //Ticket APIs for creation,fetching and manipulation
  getTicket: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/manage-ticket/${eventId}/get-ticket/${ticketCode}`),
  createTicket: (eventId: string) => makeMyPassURL(`/manage-ticket/${eventId}/create-ticket/`),
  editTicket: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/manage-ticket/${eventId}/edit-ticket/${ticketCode}`),
  deleteTicket: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/manage-ticket/${eventId}/delete-ticket/${ticketCode}`),

  // Host Management
  listHosts: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/list-hosts/`),
  addHost: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/add-host/`),
  editHost: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/edit-host/`),
  removeHost: (eventId: string, hostId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/remove-host/${hostId}`),

  //Analytics and Reporting
  CSVdata: (event_id: string) => makeMyPassURL(`/manage-event/${event_id}/csv/`),
  downloadFormSubmission: (eventId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/download-form-submission-csv/`),
  downloadCSV: (eventId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/download-form-submission-csv/`),

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

  //Forms and Submissions
  downloadBulkUploadCSV: (eventId: string, fileId: string, file_type: string) =>
    makeMyPassURL(`/manage-event/${eventId}/download-file/${fileId}/?file_type=${file_type}`),
  claimRegisterGift: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/games/${eventId}/claim-gift/${eventRegisterId}/`),

  getCategories: (eventId: string) =>
    makeMyPassURL(`/manage-event/get-form-categories/${eventId}/`),
  listGuests: (eventId: string) => makeMyPassURL(`/manage-guest/${eventId}/list-guests/`),
  initateRefund: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest-info/${eventRegisterId}/initiate-refund/`),
  getGuestInfo: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest-info/${eventRegisterId}/`),
  addGuestInfo: (eventId: string) => makeMyPassURL(`/manage-guest/${eventId}/form-info/`),

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

  //Perks
  getPerksInfo: (eventId: string) => makeMyPassURL(`/scan-guest/get-perks-info/${eventId}/`),
  updatePerk: (ticketCode: string) => makeMyPassURL(`/checkin/update-perk/${ticketCode}/`),

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

  //Custom Mail
  getMailService: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/get-email-service/`),
  updateMailService: (eventId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/update-email-service/`),

  //manage-coupon
  listCoupons: (eventId: string) => makeMyPassURL(`/manage-coupon/${eventId}/list/`),
  createCoupon: (eventId: string) => makeMyPassURL(`/manage-coupon/${eventId}/create/`),
  coupon: (eventId: string, couponId: string) =>
    makeMyPassURL(`/manage-coupon/${eventId}/coupon/${couponId}/`),

  getShortListTicket: (eventId: string) =>
    makeMyPassURL(`/manage-ticket/${eventId}/short-list-ticket/`),
  updateCouponStatus: (eventId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/update-coupon-status`),

  //Manage Venues
  listVenues: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/list-venues/`),
  updateVenueList: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/update-venues/`),

  //Manage Speakers
  listSpeakers: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/list-speakers/`),
  updateSpeakerList: (eventId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/update-speakers/`),

  //Analytics API
  getAnalyticsVisibility: (eventId: string) =>
    makeMyPassURL(`/analytics/${eventId}/analytics-visibility/`),
};

export const makeMyPassSocket = {
  analytics: (eventId: string) => `analytics/${eventId}/register-insights/`,
  registerCounts: (eventId: string) => `analytics/${eventId}/register-glance-count/`,
  checkInCounts: (eventId: string) => `analytics/${eventId}/checkin-glance-count/`,
  checkInAnalytics: (eventId: string) => `analytics/${eventId}/checkin-insights/`,

  listCheckinGuests: (eventId: string) => `manage-guest/${eventId}/checkin-list-guests/`,
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
