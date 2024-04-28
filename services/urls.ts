const buildURL = (basePath: string) => (endpoint: string) => `${basePath}${endpoint}`;

const buildVerseURL = buildURL('/buildverse');
const makeMyPassURL = buildURL('/makemypass');

export const makeMyPass = {
  //Event Management
  onboardUser: makeMyPassURL('/onboard-user/'),

  listEvents: makeMyPassURL('/list-events/'),
  listPublicEvents: makeMyPassURL('/manage-event/list-events/'), //unused

  createEvent: makeMyPassURL(`/manage-event/create-event/`),

  getEventId: (eventName: string) => makeMyPassURL(`/manage-event/get-event-id/${eventName}/`),
  getEventInfo: (eventId: string) => makeMyPassURL(`/event/${eventId}/info/`),
  getPublicFormInfo: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/info/`),
  getEvent: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/get-event/`),
  editEvent: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/edit-event/`),

  // Guest and TicketManagement
  checkInUser: (ticketCode: string, eventId: string) =>
    makeMyPassURL(`/scan-guest/${eventId}/register/${ticketCode}/`),
  resentTicket: makeMyPassURL('/manage-guest/resent-ticket/'),
  editSubmission: (eventId: string, submissionId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/edit-submission/${submissionId}`),
  downloadTicket: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/download-ticket/${ticketCode}`),
  userInfo: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/scan-guest/${eventId}/user-info/${ticketCode}`),
  getTicketInfo: (eventId: string) => makeMyPassURL(`/manage-ticket/${eventId}/list-tickets/`),
  sentInvite: (eventId: string) => makeMyPassURL(`/manage-guest/${eventId}/sent-invite/`),
  shortListUser: (eventId: string, userId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/short-list-user/${userId}`),
  validateSentInvitePayment: (eventId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/validate-sent-invite-payment/`),
  getUserPerksInfo: (ticketCode: string) =>
    makeMyPassURL(`/manage-guest/get-user-perks-info/${ticketCode}`),

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
  checkInCount: (eventId: string) => makeMyPassURL(`/analytics/${eventId}/checkin-count/`),
  CSVdata: (event_id: string) => makeMyPassURL(`/manage-event/${event_id}/csv/`),
  downloadCSVTemplate: (event_id: string) =>
    makeMyPassURL(`/manage-event/${event_id}/download-csv-template/`),
  getFileStatus: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/list-file-status/`),
  downloadFormSubmission: (eventId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/download-form-submission-csv/`),
  downloadCSV: (eventId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/download-form-submission-csv/`),
  getFeedback: (eventId: string) => makeMyPassURL(`/feedback/list-feedback/${eventId}/`),

  //Forms and Submissions
  getFormFields: (evenid: string) => makeMyPassURL(`/manage-event/get-form-fields/${evenid}/`),
  validateRsvp: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/validate-rsvp/`),
  submitForm: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/submit/`),
  uploadFile: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/csv/`),
  getCategories: (eventId: string) =>
    makeMyPassURL(`/manage-event/get-form-categories/${eventId}/`),
  parseFromAudio: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/parse-from-audio/`),
  downloadBulkUploadCSV: (eventId: string, fileId: string, fileType: string) =>
    makeMyPassURL(`/manage-event/${eventId}/download_file/${fileId}/?file_type=${fileType}/`),

  //Payment and Coupons
  validatePayment: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/validate-payment/`),
  createPayment: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/create-order/`),
  validateCoupon: (eventId: string, couponCode: string) =>
    makeMyPassURL(`/public-form/apply-coupon-code/${eventId}/?coupon_code=${couponCode}`),

  //Perks
  getPerksInfo: (eventId: string) => makeMyPassURL(`/scan-guest/get-perks-info/${eventId}/`),
  updatePerk: (ticketCode: string) => makeMyPassURL(`/checkin/update-perk/${ticketCode}/`),

  //Post Event Communication
  sentPostMail: (eventId: string) => makeMyPassURL(`/communication/${eventId}/manage-post-event/`),
  getPostEventFields: (eventId: string) =>
    makeMyPassURL(`/feedback/get-post-event-fields/${eventId}/`),
  submitFeedback: (eventId: string) => makeMyPassURL(`/feedback/submit-feedback/${eventId}/`),
  getPostEventCategories: (eventId: string) =>
    makeMyPassURL(`/feedback/get-post-event-categories/${eventId}/`),
};

export const makeMyPassSocket = {
  recentRegistrations: (eventId: string) => `manage-guest/${eventId}/recent-registrations/`,
  analytics: (eventId: string) => `analytics/${eventId}/insights/`,
  registerCounts: (eventId: string) => `analytics/${eventId}/register-count/`,
  checkInCounts: (eventId: string) => `checkin/${eventId}/count/`,
  listGuests: (eventId: string) => `manage-guest/${eventId}/list-guests/`,
  listCheckinGuests: (eventId: string) => `manage-guests/${eventId}/checkin-list-guests/`,
  checkInAnalytics: (eventId: string) => `analytics/${eventId}/checkin-analytics/`,
};

export const buildVerse = {
  login: buildVerseURL('/login/'),
  getAccessToken: buildVerseURL('/get-access-token/'),
  generateOTP: buildVerseURL('/generate-otp/'),
  preRegister: buildVerseURL('/pre-register/'),
  register: buildVerseURL('/register/'),
  updateProfile: buildVerseURL('/update-profile/'),
  setUserData: (token: string) => buildVerseURL(`/set-user-data/${token}`),
};
