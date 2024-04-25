const buildURL = (basePath: string) => (endpoint: string) => `${basePath}${endpoint}`;

const buildVerseURL = buildURL('/buildverse');
const makeMyPassURL = buildURL('/makemypass');

export const buildVerse = {
  login: buildVerseURL('/login/'),
  getAccessToken: buildVerseURL('/get-access-token/'),
  generateOTP: buildVerseURL('/generate-otp/'),
  preRegister: buildVerseURL('/pre-register/'),
  register: buildVerseURL('/register/'),
  updateProfile: buildVerseURL('/update-profile/'),
  setUserData: (token: string) => buildVerseURL(`/set-user-data/${token}`),
};

export const makeMyPass = {
  onboardUser: makeMyPassURL('/onboard-user/'),
  listEvents: makeMyPassURL('/list-events/'),
  listHosts: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/list-hosts/`),
  getEventId: (eventName: string) => makeMyPassURL(`/manage-event/get-event-id/${eventName}/`),
  checkInUser: (ticketCode: string, eventId: string) =>
    makeMyPassURL(`/scan-guest/${eventId}/register/${ticketCode}/`),
  resentTicket: makeMyPassURL('/manage-guest/resent-ticket/'),
  checkInCount: (eventId: string) => makeMyPassURL(`/analytics/${eventId}/checkin-count/`),
  editSubmission: (eventId: string, submissionId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/edit-submission/${submissionId}`),

  listSpinWheelItems: (eventId: string) =>
    makeMyPassURL(`/games/${eventId}/list-spin-wheel-items/`),
  spin: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/games/${eventId}/spin/${ticketCode}`),
  listUserGift: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/games/${eventId}/list-user-gift/${ticketCode}`),
  claimGift: (eventId: string, ticketCode: string, date: string) =>
    makeMyPassURL(`/games/${eventId}/claim-gift/${ticketCode}/${date}`),
  downloadTicket: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/download-ticket/${ticketCode}`),

  addHost: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/add-host/`),
  updateHostRole: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/edit-host/`),
  removeHost: (eventId: string, hostId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/remove-host/${hostId}`),
  hostWithUs: makeMyPassURL(`/host-with-us/`),

  userInfo: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/scan-guest/${eventId}/user-info/${ticketCode}`),

  getEventDatas: (eventId: string) => makeMyPassURL(`/event/${eventId}/info/`),
  getTicketInfo: (eventId: string) => makeMyPassURL(`/manage-ticket/get-tickets-info/${eventId}/`),
  getFormFields: (evenid: string) => makeMyPassURL(`/manage-event/get-form-fields/${evenid}/`),
  getEventInfo: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/info/`),
  validatePayment: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/validate-payment/`),
  submitForm: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/submit/`),

  createPayment: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/create-order/`),
  validateCoupon: (eventId: string, couponCode: string) =>
    makeMyPassURL(`/public-form/apply-coupon-code/${eventId}/?coupon_code=${couponCode}`),
  validateRsvp: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/validate-rsvp/`),
  CSVdata: (event_id: string) => makeMyPassURL(`/manage-event/${event_id}/csv/`),
  downloadCSVTemplate: (event_id: string) =>
    makeMyPassURL(`/manage-event/${event_id}/download-csv-template/`),

  getFileStatus: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/list-file-status/`),

  uploadFile: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/csv/`),
  sentInvite: (eventId: string) => makeMyPassURL(`/manage-guest/${eventId}/sent-invite/`),

  shortListUser: (eventId: string, userId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/short-list-user/${userId}`),

  listPublicEvents: makeMyPassURL('/manage-event/list-events/'),

  validateSentInvitePayment: (eventId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/validate-sent-invite-payment/`),

  getPerksInfo: (eventId: string) => makeMyPassURL(`/scan-guest/get-perks-info/${eventId}/`),

  getUserPerksInfo: (ticketCode: string) =>
    makeMyPassURL(`/manage-guest/get-user-perks-info/${ticketCode}`),

  updatePerk: (ticketCode: string) => makeMyPassURL(`/checkin/update-perk/${ticketCode}/`),

  getCategories: (eventId: string) =>
    makeMyPassURL(`/manage-event/get-form-categories/${eventId}/`),
  sentPostMail: (eventId: string) => makeMyPassURL(`/communication/${eventId}/manage-post-event/`),

  downloadFormSubmission: (eventId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/download-form-submission-csv/`),

  downloadCSV: (eventId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/download-form-submission-csv/`),

  getPostEventFields: (eventId: string) =>
    makeMyPassURL(`/feedback/get-post-event-fields/${eventId}/`),
  submitFeedback: (eventId: string) => makeMyPassURL(`/feedback/submit-feedback/${eventId}/`),
  getPostEventCategories: (eventId: string) =>
    makeMyPassURL(`/feedback/get-post-event-categories/${eventId}/`),
  getFeedback: (eventId: string) => makeMyPassURL(`/feedback/list-feedback/${eventId}/`),
  parseFromAudio: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/parse-from-audio/`),

  downloadBulkUploadCSV: (eventId: string, fileId: string, fileType: string) =>
    makeMyPassURL(`/manage-event/${eventId}/download_file/${fileId}/?file_type=${fileType}/`),

  createEvent: makeMyPassURL(`/manage-event/create-event/`),

  getEvent: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/get-event/`),

  editEvent: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/edit-event/`),
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
