const buildURL = (basePath: string) => (endpoint: string) => `${basePath}${endpoint}`;

const buildVerseURL = buildURL('/buildverse');
const makeMyPassURL = buildURL('/makemypass');

export const makeMyPass = {
  //Common
  onboardUser: makeMyPassURL('/common/onboard-user/'),
  listEvents: makeMyPassURL('/common/user/events/'),

  //Scan Guest
  scanGuestCheckin: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/checkin`),
  scanGuestButtons: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/buttons/`),
  scanGuestCheckout: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/checkout`),
  scanGuestVenueCheckin: (eventId: string) =>
    makeMyPassURL(`/scan-guest/${eventId}/venue/checkin/`),
  scanGuestVenueList: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/venue/list`),
  scanGuestGiftList: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/gift/list`),
  scanGuestGiftClaim: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/gift/claim`), //Scratch Card
  scanGuestPerkClaim: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/perk/claim`),
  scanGuestPerkList: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/perk/list`),
  scanGuestPrint: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/print`),

  //Manage Guests
  eventCreate: makeMyPassURL(`/manage-event/create/`),

  guestVisitedVenues: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest/${eventRegisterId}/visited-venues/`),
  guestMailLog: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest/${eventRegisterId}/mail-log/`),
  guestResentTicket: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest/${eventRegisterId}/resend-ticket/`),
  guestEditSubmission: (eventId: string, submissionId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest/${submissionId}/edit/`),
  guestDownloadTicket: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest/${eventRegisterId}/download-ticket`),
  guestSendInvite: (eventId: string) => makeMyPassURL(`/manage-guest/${eventId}/send-invite/`),
  guestShortList: (eventId: string, userId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest/${userId}/shortlist`),
  guestRegisterList: (eventId: string) => makeMyPassURL(`/manage-guest/${eventId}/register-list/`),
  guestInitateRefund: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest/${eventRegisterId}/initiate-refund/`),
  guestInformation: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest/${eventRegisterId}/`),
  guestFormInfo: (eventId: string) => makeMyPassURL(`/manage-guest/${eventId}/form-info/`),
  guestDownloadCSV: (eventId: string) => makeMyPassURL(`/manage-guest/${eventId}/download-csv/`),
  guestListFormCategories: (eventId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/list-form-categories/`),

  //Manage Logs
  mailLog: (eventId: string) => makeMyPassURL(`/manage-log/${eventId}/mail-log/`),
  paymentLog: (eventId: string) => makeMyPassURL(`/manage-log/${eventId}/payment-log/`),
  paymentLogCSV: (eventId: string) => makeMyPassURL(`/manage-log/${eventId}/payment-log/csv/`),

  //Manage Ticket
  ticketList: (eventId: string) => makeMyPassURL(`/manage-ticket/${eventId}/list/`),
  ticketCreate: (eventId: string) => makeMyPassURL(`/manage-ticket/${eventId}/create/`),
  ticketInformation: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/manage-ticket/${eventId}/ticket/${ticketCode}`),
  ticketShortList: (eventId: string) => makeMyPassURL(`/manage-ticket/${eventId}/list/short`),

  // Manage Event
  event: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/event/`),
  getEventInfo: (eventName: string) => makeMyPassURL(`/manage-event/get-event-info/${eventName}/`),
  getEventId: (eventName: string) => makeMyPassURL(`/manage-event/get-event-id/${eventName}/`),
  eventHostList: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/host/list`),
  eventHostCreate: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/host/create`),
  host: (eventId: string, hostId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/host/${hostId}`),
  eventCreateDuplicate: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/duplicate/`),

  eventVenueList: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/venue/list`),
  eventVenueCreate: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/venue/create`),
  eventVenueUpdate: (eventId: string, venueId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/venue/${venueId}`),

  eventSpeakerList: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/speaker/list`),
  eventSpeakerUpdate: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/speaker/update`),

  //Feedback
  feedbackList: (eventId: string) => makeMyPassURL(`/feedback/${eventId}/list/`),
  feedbackFormInfo: (eventId: string) => makeMyPassURL(`/feedback/${eventId}/form-info/`),
  feedbackSubmit: (eventId: string) => makeMyPassURL(`/feedback/${eventId}/submit/`),
  feedbackCategories: (eventId: string) => makeMyPassURL(`/feedback/${eventId}/categories/`),

  //Bulk Import
  bulkGuestUpload: (eventId: string) => makeMyPassURL(`/bulk/${eventId}/import-guest/upload`),
  bulkDownloadTemplate: (event_id: string) =>
    makeMyPassURL(`/bulk/${event_id}/import-guest/download-template/`),
  bulkGuestList: (eventId: string) => makeMyPassURL(`/bulk/${eventId}/import-guest/list`),

  //Public Form
  formValidatePayment: makeMyPassURL(`/public-form/validate-payment/`),
  formVerfifyParticipant: (verificationCode: string) =>
    makeMyPassURL(`/public-form/verify-participant/${verificationCode}/`),
  formEventInfo: (eventName: string) => makeMyPassURL(`/public-form/${eventName}/info/`),
  formCreateOrder: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/create-order/`),
  formValidateCoupon: (eventId: string, couponCode: string) =>
    makeMyPassURL(`/public-form/${eventId}/apply-coupon-code/?coupon_code=${couponCode}`),
  formValidateRSVP: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/validate-rsvp/`),
  formSubmit: (eventId: string) => makeMyPassURL(`/public-form/${eventId}/submit/`),
  formParseFromAudio: (eventId: string) =>
    makeMyPassURL(`/public-form/${eventId}/parse-from-audio/`),
  formSendVerfication: (eventId: string) =>
    makeMyPassURL(`/public-form/${eventId}/send-verification/`),

  //FormBuilder
  formBuilderForm: (eventId: string) => makeMyPassURL(`/form-builder/${eventId}/register-form/`),

  //Communication
  communicationMailList: (eventId: string) => makeMyPassURL(`/communication/${eventId}/mail/list/`),
  communicationMailTest: (eventId: string, mailId: string) =>
    makeMyPassURL(`/communication/${eventId}/mail/${mailId}/send-test`),
  communcationMailGet: (eventId: string, mailId: string) =>
    makeMyPassURL(`/communication/${eventId}/mail/${mailId}/`),
  communicationMailUPdate: (eventId: string, mailId: string) =>
    makeMyPassURL(`/communication/${eventId}/mail/${mailId}/`),
  communcationPostEventSendMail: (eventId: string) =>
    makeMyPassURL(`/communication/${eventId}/post-event/send-mail/`),
  communicationPostEventStatus: (eventId: string) =>
    makeMyPassURL(`/communication/${eventId}/post-event/status/`),
  communicationServiceMail: (eventId: string) =>
    makeMyPassURL(`/communication/${eventId}/service/mail`),
  communicationMailDeleteAttachment: (eventId: string, mailId: string) =>
    makeMyPassURL(`/communication/${eventId}/mail/${mailId}/delete-attachment/`),

  //manage-coupon
  couponsList: (eventId: string) => makeMyPassURL(`/manage-coupon/${eventId}/list/`),
  couponCreate: (eventId: string) => makeMyPassURL(`/manage-coupon/${eventId}/create/`),
  coupon: (eventId: string, couponId: string) =>
    makeMyPassURL(`/manage-coupon/${eventId}/coupon/${couponId}/`),
  couponStatusUpdate: (eventId: string) => makeMyPassURL(`/manage-coupon/${eventId}/status`),

  //Analytics API
  getAnalyticsVisibility: (eventId: string) =>
    makeMyPassURL(`/analytics/${eventId}/analytics-visibility/`),

  //Manage Games
  scratchCardClaim: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/games/${eventId}/scratch-card/${eventRegisterId}/claim`),
  spinWheelList: (eventId: string) => makeMyPassURL(`/games/${eventId}/randomuser/list`),

  spinWheelLogList: (eventId: string) => makeMyPassURL(`/games/${eventId}/randomuser/log/`),
};

export const makeMyPassSocket = {
  registerInsights: (eventId: string) => `analytics/${eventId}/register-insights/`,
  registerGlanceCount: (eventId: string) => `analytics/${eventId}/register-glance-count/`,
  checkinGlanceCount: (eventId: string) => `analytics/${eventId}/checkin-glance-count/`,
  checkinInsights: (eventId: string) => `analytics/${eventId}/checkin-insights/`,
  guestCheckinList: (eventId: string) => `manage-guest/${eventId}/checkin-list/`,
  guestRecentRegistrations: (eventId: string) => `manage-guest/${eventId}/recent-registrations/`,
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
