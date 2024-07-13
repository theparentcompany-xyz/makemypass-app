import ReactDOM from 'react-dom/client';
import './index.css';
import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/auth/Login/Login';
import './index.css';
import LandingPage from './pages/app/LandingPage/LandingPage';
import { Toaster, ToastPosition } from 'react-hot-toast';
import Insights from './pages/app/Insights/Insights';
import Overview from './pages/app/Overview/Overview/Overview';
import Events from './pages/app/Events/Events';
import AuthCheck from './components/AuthCheck/AuthCheck';
import Guests from './pages/app/Guests/Guests';
import TermsConditions from './pages/app/TermsCondictions/TermsConditions';
import PrivacyPolicy from './pages/app/PrivacyPolicy/PrivacyPolicy';
import FourNotFour from './pages/FourNotFour/FourNotFour';
import CheckIns from './pages/app/CheckIns/CheckIns';
import CheckIn from './pages/app/CheckIns/pages/CheckIn/CheckIn';
import ScanQR from './pages/app/CheckIns/pages/ScanQR/ScanQR';
import InEventStats from './pages/app/InEventStats/InEventStats';
import EventPage from './pages/app/EventPage/EventPage';
import PostEvent from './pages/app/PostEvent/PostEvent';
import ProfilePage from './pages/app/ProfilePage/ProfilePage';
import RoleChecker from '../services/RoleChecker';
import Feedback from './pages/app/Feedback/Feedback';
import CreateEvent from './pages/app/CreateEvent/CreateEvent';
import EventGlance from './pages/app/EventGlance/EventGlance';
import EditEvent from './pages/app/EditEvent/EditEvent';
import FormBuilder from './pages/app/FormBuilder/FormBuilder';
import ValidateData from './pages/app/ValidateData/ValidateData';
import Coupon from './pages/app/Coupon/Coupon';
import Venue from './pages/app/CheckIns/pages/Venue/Venue';
import CheckOutScan from './pages/app/CheckIns/pages/CheckOutScan/CheckOutScan';

// import EventFeedback from './pages/app/EventFeedback/EventFeedback';
// import SpinWheel from './pages/app/SpinWheel/SpinWheel';
// import ClaimGifts from './pages/app/ClaimGifts/ClaimGifts';
// import Perks from './pages/app/CheckIns/pages/Perks/Perks';

const role = {
  ADMIN: 'Admin',
  OWNER: 'Owner',
  VOLUNTEER: 'Volunteer',
};

const routes = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/termsandconditions',
    element: <TermsConditions />,
  },
  {
    path: '/privacypolicy',
    element: <PrivacyPolicy />,
  },
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/home',
    element: <LandingPage />,
  },

  {
    path: '/set-profile',
    element: <ProfilePage />,
  },
  {
    path: '/:eventTitle/public/insights',
    element: <Insights type='public' />,
  },

  {
    path: '/validate-participant/',
    element: <ValidateData />,
  },
  {
    path: '/',
    element: <AuthCheck />,
    children: [
      {
        path: '/events',
        element: <Events />,
      },
      {
        path: '/:eventTitle/overview',
        element: (
          <RoleChecker roles={[role.ADMIN, role.OWNER, role.VOLUNTEER]} children={<Overview />} />
        ),
      },
      {
        path: '/:eventTitle/insights',
        element: <RoleChecker roles={[role.ADMIN, role.OWNER]} children={<Insights />} />,
      },
      {
        path: '/:eventTitle/guests',
        element: (
          <RoleChecker roles={[role.ADMIN, role.OWNER, role.VOLUNTEER]} children={<Guests />} />
        ),
      },
      {
        path: '/:eventTitle/checkins',
        element: (
          <RoleChecker roles={[role.ADMIN, role.OWNER, role.VOLUNTEER]} children={<CheckIns />} />
        ),
      },
      {
        path: '/:eventTitle/checkins/checkin',
        element: (
          <RoleChecker roles={[role.ADMIN, role.OWNER, role.VOLUNTEER]} children={<CheckIn />} />
        ),
      },
      {
        path: '/:eventTitle/checkins/checkin/venue',
        element: (
          <RoleChecker roles={[role.ADMIN, role.OWNER, role.VOLUNTEER]} children={<Venue />} />
        ),
      },
      {
        path: '/:eventTitle/checkins/checkin/scan',
        element: (
          <RoleChecker roles={[role.ADMIN, role.OWNER, role.VOLUNTEER]} children={<ScanQR />} />
        ),
      },
      {
        path: '/:eventTitle/checkins/checkin/checkout',
        element: (
          <RoleChecker
            roles={[role.ADMIN, role.OWNER, role.VOLUNTEER]}
            children={<CheckOutScan />}
          />
        ),
      },

      {
        path: '/:eventTitle/inevent',
        element: (
          <RoleChecker
            roles={[role.ADMIN, role.OWNER, role.VOLUNTEER]}
            children={<InEventStats />}
          />
        ),
      },
      {
        path: '/:eventTitle/postevent',
        element: (
          <RoleChecker roles={[role.ADMIN, role.OWNER, role.VOLUNTEER]} children={<PostEvent />} />
        ),
      },

      {
        path: '/create-event',
        element: <CreateEvent />,
      },
      {
        path: '/:eventTitle/manage',
        element: <RoleChecker roles={[role.ADMIN, role.OWNER]} children={<EventGlance />} />,
      },
      {
        path: '/:eventTitle/manage/edit-event',
        element: <RoleChecker roles={[role.ADMIN, role.OWNER]} children={<EditEvent />} />,
      },
      {
        path: '/:eventTitle/formbuilder',
        element: <RoleChecker roles={[role.ADMIN, role.OWNER]} children={<FormBuilder />} />,
      },
      {
        path: '/:eventTitle/coupon',
        element: <RoleChecker roles={[role.ADMIN, role.OWNER]} children={<Coupon />} />,
      },
      // {
      //   path: `/:eventTitle/checkins/claimgifts`,
      //   element: <RoleChecker roles={[role.ADMIN, role.OWNER, role.VOLUNTEER]} children={<ClaimGifts />} />,
      // },
      // {
      //   path: '/:eventTitle/checkins/perks',
      //   element: <RoleChecker roles={[role.ADMIN, role.OWNER, role.VOLUNTEER]} children={<Perks />} />,
      // },
      // {
      //   path: '/:eventTitle/spinwheel',
      //   element: <RoleChecker roles={['Admin', 'Owner', 'Gamer']} children={<SpinWheel />} />,
      // },
      // {
      //   path: '/:eventTitle/feedback',
      //   element: (
      //     <RoleChecker roles={[role.ADMIN, role.OWNER, role.VOLUNTEER]} children={<EventFeedback />} />
      //   ),
      // },
    ],
  },

  {
    path: '/404',
    element: <FourNotFour />,
  },
  {
    path: '/:eventTitle',
    element: <EventPage />,
  },
  {
    path: '/:eventTitle/feedback-form',
    element: <Feedback />,
  },
  {
    path: '*',
    element: <FourNotFour />,
  },
];

const router = createBrowserRouter(routes);

const toasterProps = {
  containerStyle: {
    fontFamily: 'Inter, sans-serif',
  },
  toastOptions: {
    style: {
      backgroundColor: '#1B2725',
      border: '0.5px solid #232A2B',
      color: '#fdfdfd',
    },
  },
  position: 'bottom-center' as ToastPosition,
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />

    <Toaster {...toasterProps} />
  </React.StrictMode>,
);
