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
  listHosts: (eventId: string) => makeMyPassURL(`/pre-event/${eventId}/list-hosts/`),
  getEventId: (eventName: string) => makeMyPassURL(`/get-event-id/${eventName}/`),
  checkInUser: (ticketCode: string, eventId: string) =>
    makeMyPassURL(`/checkin/${eventId}/register/${ticketCode}/`),
  getEventData: (eventId: string) => makeMyPassURL(`/pre-event/${eventId}/info`),
  resentTicket: makeMyPassURL('/pre-event/resent-ticket/'),
  checkInCount: (eventId: string) => makeMyPassURL(`/checkin/${eventId}/checkin-count/`),
  editSubmission: (eventId: string, submissionId: string) =>
    makeMyPassURL(`/pre-event/${eventId}/edit-submission/${submissionId}`),

  listSpinWheelItems: (eventId: string) =>
    makeMyPassURL(`/pre-event/${eventId}/list-spin-wheel-items/`),
  spin: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/pre-event/${eventId}/spin/${ticketCode}`),
  listUserGift: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/pre-event/${eventId}/list-user-gift/${ticketCode}`),
  claimGift: (eventId: string, ticketCode: string, date: string) =>
    makeMyPassURL(`/pre-event/${eventId}/claim-gift/${ticketCode}/${date}`),
  downloadTicket: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/pre-event/${eventId}/download-ticket/${ticketCode}`),

  addHost: (eventId: string) => makeMyPassURL(`/pre-event/${eventId}/add-host/`),
  updateHostRole: (eventId: string) => makeMyPassURL(`/pre-event/${eventId}/edit-host/`),
  removeHost: (eventId: string, hostId: string) =>
    makeMyPassURL(`/pre-event/${eventId}/remove-host/${hostId}`),
  hostWithUs: makeMyPassURL(`/host-with-us/`),

  userInfo: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/checkin/${eventId}/user-info/${ticketCode}`),

  getEventDatas: (eventId: string) => makeMyPassURL(`/event/${eventId}/info/`),
  getTicketInfo: (eventId: string) => makeMyPassURL(`/public-form/get-tickets-info/${eventId}/`),
  getFormFields: (evenid: string) => makeMyPassURL(`/public-form/get-form-fields/${evenid}/`),
  getEventInfo: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/info/`),
  submitForm: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/submit/`),

  createPayment: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/create-order/`),
  validateCoupon: (eventId: string, couponCode: string) =>
    makeMyPassURL(`/public-form/apply-coupon-code/${eventId}/?coupon_code=${couponCode}`),
  validateRsvp: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/validate-rsvp/`),
  CSVdata: (event_id: string) => makeMyPassURL(`/event/${event_id}/csv/`),
  downloadCSVTemplate: (event_id: string) =>
    makeMyPassURL(`/event/${event_id}/download-csv-template/`),

  getFileStatus: (eventId: string) => makeMyPassURL(`/event/${eventId}/list-file-status/`),

  uploadFile: (eventId: string) => makeMyPassURL(`/event/${eventId}/csv/`),
  sentInvite: (eventId: string, ticketId: string) =>
    makeMyPassURL(`/pre-event/${eventId}/sent-invite/${ticketId}`),

  shortListUser: (eventId: string, userId: string) =>
    makeMyPassURL(`/pre-event/${eventId}/short-list-user/${userId}`),

  listPublicEvents: makeMyPassURL('/event/list-events/'),

  getPerksInfo: (eventId: string) => makeMyPassURL(`/checkin/get-perks-info/${eventId}/`),

  getUserPerksInfo: (ticketCode: string) =>
    makeMyPassURL(`/checkin/get-user-perks-info/${ticketCode}`),

  updatePerk: (ticketCode: string) => makeMyPassURL(`/checkin/update-perk/${ticketCode}/`),

  getCategories: (eventId: string) => makeMyPassURL(`/public-form/get-form-categories/${eventId}/`),
  sentPostMail: (eventId: string) => makeMyPassURL(`/pre-event/${eventId}/manage-post-event/`),

  downloadFormSubmission: (eventId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/download-form-submission-csv/`),

  downloadCSV: (eventId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/download-form-submission-csv/`),

  getPostEventFields: (eventId: string) =>
    makeMyPassURL(`/post-event/get-post-event-fields/${eventId}/`),
  submitFeedback: (eventId: string) => makeMyPassURL(`/post-event/submit-feedback/${eventId}/`),
  getPostEventCategories: (eventId: string) =>
    makeMyPassURL(`/post-event/get-post-event-categories/${eventId}/`),
  getFeedback: (eventId: string) => makeMyPassURL(`/post-event/list-feedback/${eventId}/`),
  parseFromAudio: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/parse-from-audio/`),

  downloadBulkUploadCSV: (eventId: string, fileId: string, fileType: string) =>
    makeMyPassURL(`/event/${eventId}/download_file/${fileId}/?file_type=${fileType}`),
};

export const makeMyPassSocket = {
  recentRegistrations: (eventId: string) => `pre-event/${eventId}/recent-registrations/`,

  analytics: (eventId: string) => `pre-event/${eventId}/analytics/`,
  registerCounts: (eventId: string) => `pre-event/${eventId}/register-count/`,
  checkInCounts: (eventId: string) => `checkin/${eventId}/count/`,

  listGuests: (eventId: string) => `pre-event/${eventId}/list-guests/`,
  listCheckinGuests: (eventId: string) => `checkin/${eventId}/list-guests/`,

  checkInAnalytics: (eventId: string) => `checkin/${eventId}/checkin-analytics/`,
};
