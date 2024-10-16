const buildURL = (basePath: string) => (endpoint: string) => `${basePath}${endpoint}`;

const buildVerseURL = buildURL('/buildverse');
const makeMyPassURL = buildURL('/makemypass');

export const makeMyPass = {
  //Common
  onboardUser: makeMyPassURL('/common/onboard-user/'),
  listEvents: makeMyPassURL('/common/user/events/'),
  listCommonTags: makeMyPassURL('/common/user/list-tags/'),
  listOrgs: makeMyPassURL('/common/user/org/list'),

  //Scan Guest
  scanGuestCheckin: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/checkin`), //Till Volunteer
  scanGuestMapNewCode: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/map-new-code`), //Till Volunteer
  scanGuestButtons: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/buttons/`), //Till Volunteer
  scanGuestCheckout: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/checkout`), //Till Volunteer
  scanGuestVenueCheckin: (eventId: string) =>
    makeMyPassURL(`/scan-guest/${eventId}/venue/checkin/`), //Till Volunteer
  scanGuestVenueList: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/venue/list`), //Till Volunteer
  scanGuestGiftList: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/gift/list`), //Till Viweer, Patch Editor
  scanGuestGiftClaim: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/gift/claim`), //TODO: FIX //Scratch Card //Till Volunteer
  scanGuestPerkClaim: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/perk/claim`), //Till Volunteer
  scanGuestPerkList: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/perk/list`), //Till Viewer, Patch Editor
  scanGuestPrint: (eventId: string) => makeMyPassURL(`/scan-guest/${eventId}/print`), //Till Volunteer
  scanGuestSubEventCheckin: (eventId: string) =>
    makeMyPassURL(`/scan-guest/${eventId}/sub-event/checkin/`), //Till Volunteer
  scanGuestSubEventList: (eventId: string) =>
    makeMyPassURL(`/scan-guest/${eventId}/sub-event/list`), //Till Volunteer

  //Manage Guests
  eventCreate: makeMyPassURL(`/manage-event/create/`), // SuperUser

  //Manage Org
  orgCreate: makeMyPassURL(`/manage-org/create/`), // SuperUser
  orgCRUD: (orgId: string) => makeMyPassURL(`/manage-org/${orgId}/org`),

  guestVisitedVenues: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest/${eventRegisterId}/visited-venues/`),
  guestMailLog: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest/${eventRegisterId}/mail-log/`), //Till Volunteer
  guestResentTicket: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest/${eventRegisterId}/resend-ticket/`), //Till Volunteer
  guestEditSubmission: (eventId: string, submissionId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest/${submissionId}/edit/`), //Till Volunteer
  guestDownloadTicket: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest/${eventRegisterId}/download-ticket/`), //Till Volunteer
  guestSendInvite: (eventId: string) => makeMyPassURL(`/manage-guest/${eventId}/send-invite/`), //Till Volunteer
  guestShortList: (eventId: string, userId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest/${userId}/shortlist`), //Till Volunteer
  guestRegisterList: (eventId: string) => makeMyPassURL(`/manage-guest/${eventId}/register-list/`), //Till Volunteer
  guestInitateRefund: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest/${eventRegisterId}/initiate-refund/`), //Till Admin
  guestInformation: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/guest/${eventRegisterId}/`), //Till Volunteer
  guestFormInfo: (eventId: string) => makeMyPassURL(`/manage-guest/${eventId}/form-info/`),
  guestDownloadCSV: (eventId: string) => makeMyPassURL(`/manage-guest/${eventId}/download-csv/`), //Till Admin
  guestListFormCategories: (eventId: string) =>
    makeMyPassURL(`/manage-guest/${eventId}/list-form-categories/`),
  guestList: (eventId = '') => makeMyPassURL(`/manage-guest/${eventId}/register-list/`), //Till Volunteer

  //Manage Logs
  mailLog: (eventId: string) => makeMyPassURL(`/manage-log/${eventId}/mail-log/`), //Till Admin
  paymentLog: (eventId: string) => makeMyPassURL(`/manage-log/${eventId}/payment-log/`), //Till Admin
  paymentLogCSV: (eventId: string) => makeMyPassURL(`/manage-log/${eventId}/payment-log/csv/`), //Till Admin

  //Manage Ticket
  ticketList: (eventId: string) => makeMyPassURL(`/manage-ticket/${eventId}/list/`), //Till Viewer
  ticketCreate: (eventId: string) => makeMyPassURL(`/manage-ticket/${eventId}/create/`), //Till Editor
  ticketInformation: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/manage-ticket/${eventId}/ticket/${ticketCode}`), //Till Editor
  ticketShortList: (eventId: string) => makeMyPassURL(`/manage-ticket/${eventId}/list/short`),

  // Manage Event
  event: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/event/`), // Till Viewer, Patch Editor, Delete Owner.
  getEventInfo: (eventName: string) => makeMyPassURL(`/manage-event/get-event-info/${eventName}/`),
  getEventId: (eventName: string) => makeMyPassURL(`/manage-event/get-event-id/${eventName}/`),
  eventHostList: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/host/list`),
  eventHostCreate: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/host/create`), // Till Admin
  host: (eventId: string, hostId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/host/${hostId}`), // Till Admin
  eventCreateDuplicate: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/duplicate/`), // Till Admin

  eventVenueList: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/venue/list`), // Till Viewer
  eventVenueCreate: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/venue/create`), // Till Editor
  eventVenueUpdate: (eventId: string, venueId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/venue/${venueId}`), //Till Editor

  eventSpeakerList: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/speaker/list`), // Till Viewer
  eventSpeakerCreate: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/speaker/create`), // Till Editor
  eventSpeakerUpdate: (eventId: string, speakerId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/speaker/${speakerId}`), // Till Editor

  addTags: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/add-tags/`), //Till Admin
  listTags: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/list-tags/`), //Till Admin

  closeForm: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/close-form/`), //Till Editor

  getFormKeys: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/get-form-keys/`), //Till Admin

  //Feedback
  feedbackList: (eventId: string) => makeMyPassURL(`/feedback/${eventId}/list/`),
  feedbackFormInfo: (eventId: string) => makeMyPassURL(`/feedback/${eventId}/form-info/`), //
  feedbackSubmit: (eventId: string) => makeMyPassURL(`/feedback/${eventId}/submit/`),
  feedbackCategories: (eventId: string) => makeMyPassURL(`/feedback/${eventId}/categories/`),

  //Bulk Import
  bulkGuestUpload: (eventId: string) => makeMyPassURL(`/bulk/${eventId}/import-guest/upload`), //Till Editor
  bulkDownloadTemplate: (event_id: string) =>
    makeMyPassURL(`/bulk/${event_id}/import-guest/download-template/`), //Till Editor
  bulkGuestList: (eventId: string) => makeMyPassURL(`/bulk/${eventId}/import-guest/list`), //Till Editor

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
  formBuilderForm: (eventId: string) => makeMyPassURL(`/form-builder/${eventId}/register-form/`), //Till Editor for Edit and Viewer for View

  //Communication
  communicationMailList: (eventId: string) => makeMyPassURL(`/communication/${eventId}/mail/list/`), //Till Viewer
  communicationMailTest: (eventId: string, mailId: string) =>
    makeMyPassURL(`/communication/${eventId}/mail/${mailId}/send-test`), //Till Viewer
  communcationMailGet: (eventId: string, mailId: string) =>
    makeMyPassURL(`/communication/${eventId}/mail/${mailId}/`), //Till Viewer, TODO: Disable Editing for Viewer
  communicationMailUPdate: (eventId: string, mailId: string) =>
    makeMyPassURL(`/communication/${eventId}/mail/${mailId}/`), //Till Editor
  communcationPostEventSendMail: (eventId: string) =>
    makeMyPassURL(`/communication/${eventId}/post-event/send-mail/`), //Till Editor
  communicationPostEventStatus: (eventId: string) =>
    makeMyPassURL(`/communication/${eventId}/post-event/status/`), //Till Viewer
  communicationServiceMail: (eventId: string) =>
    makeMyPassURL(`/communication/${eventId}/service/mail`), //Till Admin

  //manage-coupon
  couponsList: (eventId: string) => makeMyPassURL(`/manage-coupon/${eventId}/list/`), // Till Viewer
  couponCreate: (eventId: string) => makeMyPassURL(`/manage-coupon/${eventId}/create/`), // Till Editor
  coupon: (eventId: string, couponId: string) =>
    makeMyPassURL(`/manage-coupon/${eventId}/coupon/${couponId}/`), //Till Viewer
  couponStatusUpdate: (eventId: string) => makeMyPassURL(`/manage-coupon/${eventId}/status`), //Till Editro

  //Analytics API
  getAnalyticsVisibility: (eventId: string) =>
    makeMyPassURL(`/analytics/${eventId}/analytics-visibility/`),
  getPerkAnalytics: (eventId: string) => makeMyPassURL(`/analytics/${eventId}/perk-analytics/`), //Till Volunteer
  getVenueAnalytics: (eventId: string) => makeMyPassURL(`/analytics/${eventId}/venue-analytics/`), //Till Volunteer
  getPageViewAnalytics: (eventId: string) =>
    makeMyPassURL(`/analytics/${eventId}/page-view-analytics/`), //Till Viewer

  //Manage Games
  scratchCardClaim: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/games/${eventId}/scratch-card/${eventRegisterId}/scratch`),
  spinWheelList: (eventId: string) => makeMyPassURL(`/games/${eventId}/pick-user/list`), //Till Editor
  spinWheelCheckPickUser: (eventId: string) => makeMyPassURL(`/games/${eventId}/check-pick-user/`), //Till Editor
  spinWheelLogList: (eventId: string) => makeMyPassURL(`/games/${eventId}/pick-user/log/`), //Till Editor
  getSpinWheelData: (eventId: string) => makeMyPassURL(`/games/${eventId}/spin-wheel/scan`), //Till Device Only
  getSpinWheelGift: (eventId: string) => makeMyPassURL(`/games/${eventId}/spin-wheel/spin`), //Till Device Only

  //UTM

  utmList: (eventId: string) => makeMyPassURL(`/utm/${eventId}/list/`), //Till Viewer
  createUtm: (eventId: string) => makeMyPassURL(`/utm/${eventId}/create/`), //Till Viewer

  //Sub-Event
  viewSubEvent: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/sub-events/${eventId}/view/${eventRegisterId}/`), //Till Editor
  getSubEventForm: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/sub-events/${eventId}/get-form/${eventRegisterId}/`), //Till Editor
  subEventRegister: (eventId: string, eventRegisterId: string) =>
    makeMyPassURL(`/sub-events/${eventId}/register/${eventRegisterId}/`), //Till Viewer
  removeRegisteredSubEvent: (eventId: string, eventRegisterId: string, userSubEventId: string) =>
    makeMyPassURL(
      `/sub-events/${eventId}/remove-register/${eventRegisterId}/sub-event/${userSubEventId}/`,
    ), //Till Viewer
  listSubEvents: (eventId: string) => makeMyPassURL(`/sub-events/${eventId}/list/`), //Till Viewer
  createNewSubEvent: (eventId: string) => makeMyPassURL(`/sub-events/${eventId}/create/`), //Till Editor
  updateSubEvent: (eventId: string, subEventId: string) =>
    makeMyPassURL(`/sub-events/${eventId}/sub-event/${subEventId}/`), //Till Editor
};

export const makeMyPassSocket = {
  registerInsights: (eventId: string) => `analytics/${eventId}/register-insights/`, //Till Volunteer
  registerGlanceCount: (eventId: string) => `analytics/${eventId}/register-glance-count/`, //Till Volunteer
  checkinGlanceCount: (eventId: string) => `analytics/${eventId}/checkin-glance-count/`,
  checkinInsights: (eventId: string) => `analytics/${eventId}/checkin-insights/`,
  guestCheckinList: (eventId: string) => `manage-guest/${eventId}/checkin-list/`,
  guestRecentRegistrations: (eventId: string) => `manage-guest/${eventId}/recent-registrations/`, //Till Volunteer
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
