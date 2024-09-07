import './index.css';

import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster, ToastPosition } from 'react-hot-toast';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Roles } from '../services/enums';
import RoleChecker from '../services/RoleChecker';
import AuthCheck from './components/AuthCheck/AuthCheck';
import ViewTicket from './components/ViewTicket/ViewTicket';
import CheckIns from './pages/app/CheckIns/CheckIns';
import CheckIn from './pages/app/CheckIns/pages/CheckIn/CheckIn';
import CheckOutScan from './pages/app/CheckIns/pages/CheckOutScan/CheckOutScan';
import Perks from './pages/app/CheckIns/pages/Perks/Perks';
import ScanQR from './pages/app/CheckIns/pages/ScanQR/ScanQR';
import Venue from './pages/app/CheckIns/pages/Venue/Venue';
import Coupon from './pages/app/Coupon/Coupon';
import CreateEvent from './pages/app/CreateEvent/CreateEvent';
import EditEvent from './pages/app/EditEvent/EditEvent';
import EventGlance from './pages/app/EventGlance/EventGlance';
import EventLogs from './pages/app/EventLogs/EventLogs';
import EventPage from './pages/app/EventPage/EventPage';
import Events from './pages/app/Events/Events';
import FormBuilder from './pages/app/FormBuilder/FormBuilder';
import Gifts from './pages/app/Gifts/Gifts';
import Guests from './pages/app/Guests/Guests';
import InEventStats from './pages/app/InEventStats/InEventStats';
import Insights from './pages/app/Insights/Insights';
import PerkAnalytics from './pages/app/Insights/pages/PerkAnalytics/PerkAnalytics';
import VenueAnalytics from './pages/app/Insights/pages/VenueAnalytics/VenueAnalytics';
import LandingPage from './pages/app/LandingPage/LandingPage';
import Overview from './pages/app/Overview/Overview/Overview';
import PaymentAnalytics from './pages/app/PaymentAnalytics/PaymentAnalytics';
import PostEvent from './pages/app/PostEvent/PostEvent';
import PrivacyPolicy from './pages/app/PrivacyPolicy/PrivacyPolicy';
import ProfilePage from './pages/app/ProfilePage/ProfilePage';
import Randomizer from './pages/app/Randomizer/Randomizer';
import SelfCheckIn from './pages/app/SelfCheckIn/SelfCheckIn';
import SetProfilePage from './pages/app/SetProfilePage/SetProfilePage';
import TermsConditions from './pages/app/TermsCondictions/TermsConditions';
import ValidateData from './pages/app/ValidateData/ValidateData';
import Login from './pages/auth/Login/Login';
import FourNotFour from './pages/FourNotFour/FourNotFour';

const routes = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/:eventTitle/ticket',
    element: <ViewTicket />,
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
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/set-profile',
    element: <SetProfilePage />,
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
    path: '/:eventTitle/checkins/self-checkin',
    element: <SelfCheckIn />,
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
          <RoleChecker
            roles={[Roles.ADMIN, Roles.OWNER, Roles.VOLUNTEER]}
            children={<Overview />}
          />
        ),
      },
      {
        path: '/:eventTitle/insights',
        element: <RoleChecker roles={[Roles.ADMIN, Roles.OWNER]} children={<Insights />} />,
      },
      {
        path: '/:eventTitle/guests',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.OWNER, Roles.VOLUNTEER]} children={<Guests />} />
        ),
      },
      {
        path: '/:eventTitle/checkins',
        element: (
          <RoleChecker
            roles={[Roles.ADMIN, Roles.OWNER, Roles.VOLUNTEER]}
            children={<CheckIns />}
          />
        ),
      },
      {
        path: '/:eventTitle/checkins/checkin',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.OWNER, Roles.VOLUNTEER]} children={<CheckIn />} />
        ),
      },
      {
        path: '/:eventTitle/checkins/checkin/venue',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.OWNER, Roles.VOLUNTEER]} children={<Venue />} />
        ),
      },
      {
        path: '/:eventTitle/checkins/checkin/scan',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.OWNER, Roles.VOLUNTEER]} children={<ScanQR />} />
        ),
      },
      {
        path: '/:eventTitle/checkins/checkin/gifts',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.OWNER, Roles.VOLUNTEER]} children={<Gifts />} />
        ),
      },
      {
        path: '/:eventTitle/checkins/checkin/checkout',
        element: (
          <RoleChecker
            roles={[Roles.ADMIN, Roles.OWNER, Roles.VOLUNTEER]}
            children={<CheckOutScan />}
          />
        ),
      },
      {
        path: '/:eventTitle/inevent',
        element: (
          <RoleChecker
            roles={[Roles.ADMIN, Roles.OWNER, Roles.VOLUNTEER]}
            children={<InEventStats />}
          />
        ),
      },
      {
        path: '/:eventTitle/postevent',
        element: (
          <RoleChecker
            roles={[Roles.ADMIN, Roles.OWNER, Roles.VOLUNTEER]}
            children={<PostEvent />}
          />
        ),
      },

      {
        path: '/create-event',
        element: <CreateEvent />,
      },
      {
        path: '/:eventTitle/manage',
        element: <RoleChecker roles={[Roles.ADMIN, Roles.OWNER]} children={<EventGlance />} />,
      },
      {
        path: '/:eventTitle/manage/edit-event',
        element: <RoleChecker roles={[Roles.ADMIN, Roles.OWNER]} children={<EditEvent />} />,
      },
      {
        path: '/:eventTitle/formbuilder',
        element: <RoleChecker roles={[Roles.ADMIN, Roles.OWNER]} children={<FormBuilder />} />,
      },
      {
        path: '/:eventTitle/coupon',
        element: <RoleChecker roles={[Roles.ADMIN, Roles.OWNER]} children={<Coupon />} />,
      },
      {
        path: '/:eventTitle/logs',
        element: <RoleChecker roles={[Roles.ADMIN, Roles.OWNER]} children={<EventLogs />} />,
      },
      {
        path: '/:eventTitle/payment-analytics',
        element: <RoleChecker roles={[Roles.ADMIN, Roles.OWNER]} children={<PaymentAnalytics />} />,
      },
      {
        path: '/:eventTitle/perks-analytics',
        element: <RoleChecker roles={[Roles.ADMIN, Roles.OWNER]} children={<PerkAnalytics />} />,
      },
      {
        path: '/:eventTitle/venue-analytics',
        element: <RoleChecker roles={[Roles.ADMIN, Roles.OWNER]} children={<VenueAnalytics />} />,
      },
      {
        path: '/:eventTitle/randomsizer',
        element: <RoleChecker roles={[Roles.ADMIN, Roles.OWNER]} children={<Randomizer />} />,
      },
      {
        path: '/:eventTitle/checkins/perks',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.VOLUNTEER, Roles.OWNER]} children={<Perks />} />
        ),
      },
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
