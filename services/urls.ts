const buildURL = (basePath: string) => (endpoint: string) => `${basePath}${endpoint}`;

const buildVerseURL = buildURL('/buildverse');
const makeMyPassURL = buildURL('/makemypass');

export const buildVerse = {
    login: buildVerseURL('/login/'),
    getAccessToken: buildVerseURL('/get-access-token/'),
};

export const makeMyPass = {
    onboardUser: makeMyPassURL('/onboard-user/'),
    listEvents: makeMyPassURL('/list-events/'),
};
