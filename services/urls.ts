const buildURL = (basePath: string) => (endpoint: string) => `${basePath}${endpoint}`;

const buildVerseURL = buildURL('/buildverse');
const makeMyPassURL = buildURL('/makemypass');

export const makeMyPass = {
  //Event Management
  onboardUser: makeMyPassURL('/onboard-user/'),

  listEvents: makeMyPassURL('/list-events/'),
  listPublicEvents: makeMyPassURL('/manage-event/list-events/'), //unused

  createEvent: makeMyPassURL(`/manage-event/create-event/`),
  deleteEvent: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/delete-event/`),

  getEventId: (eventName: string) => makeMyPassURL(`/manage-event/get-event-info/${eventName}/`),
  getEventInfo: (eventName: string) => makeMyPassURL(`/public-form/${eventName}/info/`),
  getEvent: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/get-event/`),
  editEvent: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/edit-event/`),
  duplicateEvent: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/duplicate-event/`),
  getAnalyticsVisibility: (eventId: string) =>
    makeMyPassURL(`/analytics/${eventId}/get-analytics-visibility/`),

  // Guest and Ticket Management
  ///scan-guest/eventId/checkin
  checkInUser: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/checkin`),
  checkOutUser: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/checkout`),
  checkInUserVenue: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/venue-checkin/`),
  listVenues: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/list-venue/`),
  listVisitedVenues: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest-info/${eventRegisterId}/visited-venues/`),
  resentTicket: (eventId: string) => makeMyPassURL(`/manage-guest/${eventId}/resent-ticket/`),
  editSubmission: (eventId: string, submissionId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/edit-submission/${submissionId}`),
  deleteSubmission: (eventId: string, submissionId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/delete-submission/${submissionId}`),
  downloadTicket: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/download-ticket/${ticketCode}`),
  userInfo: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/scan-guest/${eventId}/user-info/${ticketCode}`),
  preview: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/scan-guest/${eventId}/preview/${ticketCode}`),
  getTicketInfo: (eventId: string) => makeMyPassURL(`/manage-ticket/${eventId}/list-tickets/`),
  sentInvite: (eventId: string) => makeMyPassURL(`/manage-guest/${eventId}/sent-invite/`),
  shortListUser: (eventId: string, userId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/short-list-user/${userId}`),
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
  hostWithUs: makeMyPassURL(`/host-with-us/`),

  //Games and Gifts
  listSpinWheelItems: (eventId: string) =>
    makeMyPassURL(`/games/${eventId}/list-spin-wheel-items/`),
  spin: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/games/${eventId}/spin/${ticketCode}`),
  listUserGift: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/games/${eventId}/list-user-gift/${ticketCode}`),
  claimGift: (eventId: string, ticketCode: string, date: string) =>
    makeMyPassURL(`/games/${eventId}/claim-gift/${ticketCode}/${date}`),

  //Analytics and Reporting
  // checkInCount: (eventId: string) => makeMyPassURL(`/analytics/${eventId}/checkin-count/`),
  CSVdata: (event_id: string) => makeMyPassURL(`/manage-event/${event_id}/csv/`),

  downloadFormSubmission: (eventId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/download-form-submission-csv/`),
  downloadCSV: (eventId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/download-form-submission-csv/`),
  getFeedback: (eventId: string) => makeMyPassURL(`/feedback/list-feedback/${eventId}/`),

  //Bulk Import
  uploadFile: (eventId: string) => makeMyPassURL(`/bulk/${eventId}/import-guest/`),
  downloadCSVTemplate: (event_id: string) =>
    makeMyPassURL(`/bulk/${event_id}/import-guest-template/`),
  getFileStatus: (eventId: string) => makeMyPassURL(`/bulk/${eventId}/list-file-import-guest/`),

  //Forms and Submissions
  getFormFields: (evenid: string) => makeMyPassURL(`/manage-event/get-form-fields/${evenid}/`),
  validateRsvp: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/validate-rsvp/`),
  submitForm: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/submit/`),
  downloadBulkUploadCSV: (eventId: string, fileId: string, file_type: string) =>
    makeMyPassURL(`/manage-event/${eventId}/download-file/${fileId}/?file_type=${file_type}`),

  getCategories: (eventId: string) =>
    makeMyPassURL(`/manage-event/get-form-categories/${eventId}/`),
  parseFromAudio: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/parse-from-audio/`),
  listGuests: (eventId: string) => makeMyPassURL(`/manage-guest/${eventId}/list-guests/`),
  initateRefund: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/initiate-refund/${eventRegisterId}/`),
  getGuestInfo: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest-info/${eventRegisterId}/`),
  addGuestInfo: (eventId: string) => makeMyPassURL(`/manage-guest/${eventId}/form-info/`),
  sendVerfication: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/send-verification/`),
  verifyParticipant: (verificationCode: string) =>
    makeMyPassURL(`/public-form/verify-participant/${verificationCode}/`),

  //Payment and Coupons
  validatePayment: makeMyPassURL(`/public-form/validate-payment/`),

  createPayment: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/create-order/`),
  validateCoupon: (eventId: string, couponCode: string) =>
    makeMyPassURL(`/public-form/apply-coupon-code/${eventId}/?coupon_code=${couponCode}`),

  //Perks
  getPerksInfo: (eventId: string) => makeMyPassURL(`/scan-guest/get-perks-info/${eventId}/`),
  updatePerk: (ticketCode: string) => makeMyPassURL(`/checkin/update-perk/${ticketCode}/`),

  //Post Event Communication
  sentPostMail: (eventId: string) =>
    makeMyPassURL(`/event/${eventId}/communication/send-post-event-mail/`),
  getPostEventFields: (eventId: string) =>
    makeMyPassURL(`/feedback/get-post-event-fields/${eventId}/`),
  submitFeedback: (eventId: string) => makeMyPassURL(`/feedback/submit-feedback/${eventId}/`),
  getPostEventCategories: (eventId: string) =>
    makeMyPassURL(`/feedback/get-post-event-categories/${eventId}/`),

  //FormBuilder
  formBuilderGetForm: (eventId: string) => makeMyPassURL(`/form-builder/${eventId}/get-form/`),
  formBuilderUpdateForm: (eventId: string) =>
    makeMyPassURL(`/form-builder/${eventId}/update-form/`),

  //Mail URLS
  listMails: (eventId: string) => makeMyPassURL(`/event/${eventId}/communication/list-event-mail/`),
  sentTestMail: (eventId: string, mailId: string) =>
    makeMyPassURL(`/event/${eventId}/communication/send-test-mail/${mailId}`),
  getMail: (eventId: string, mailId: string) =>
    makeMyPassURL(`/event/${eventId}/communication/get-event-mail/${mailId}/`),
  updateMail: (eventId: string, mailId: string) =>
    makeMyPassURL(`/event/${eventId}/communication/update-event-mail/${mailId}/`),

  //Custom Mail
  getMailService: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/get-email-service/`),
  updateMailService: (eventId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/update-email-service/`),

  //CouponCRUD
  listCoupons: (eventId: string) => makeMyPassURL(`/manage-coupon/${eventId}/list-coupons/`),
  createCoupon: (eventId: string) => makeMyPassURL(`/manage-coupon/${eventId}/create-coupon/`),
};

export const makeMyPassSocket = {
  recentRegistrations: (eventId: string) => `manage-guest/${eventId}/recent-registrations/`,
  analytics: (eventId: string) => `analytics/${eventId}/insights/`,
  registerCounts: (eventId: string) => `analytics/${eventId}/register-count/`,
  checkInCounts: (eventId: string) => `analytics/${eventId}/checkin-count/`,
  listCheckinGuests: (eventId: string) => `manage-guest/${eventId}/checkin-list-guests/`,
  checkInAnalytics: (eventId: string) => `analytics/${eventId}/checkin-analytics/`,
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
};
