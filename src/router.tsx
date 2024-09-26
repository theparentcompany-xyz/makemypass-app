import React from 'react';
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom';

import { TillRoles } from '../services/enums';
import RoleChecker from '../services/RoleChecker';
import AuthCheck from './components/AuthCheck/AuthCheck';
import ViewTicket from './components/ViewTicket/ViewTicket';
import CheckIns from './pages/app/CheckIns/CheckIns';
import CheckOutScan from './pages/app/CheckIns/pages/CheckOutScan/CheckOutScan';
import Perks from './pages/app/CheckIns/pages/Perks/Perks';
import ScanQR from './pages/app/CheckIns/pages/ScanQR/ScanQR';
import Venue from './pages/app/CheckIns/pages/Venue/Venue';
import Coupon from './pages/app/Coupon/Coupon';
import CreateEvent from './pages/app/CreateEvent/CreateEvent';
import EditEvent from './pages/app/EditEvent/EditEvent';
import EventGlance from './pages/app/EventGlance/EventGlance';
import EventLogs from './pages/app/EventLogs/EventLogs';
import ThankYouPage from './pages/app/EventPage/components/ThankYouPage/ThankYouPage';
import EventPage from './pages/app/EventPage/EventPage';
import Events from './pages/app/Events/Events';
import FormBuilder from './pages/app/FormBuilder/FormBuilder';
import Gifts from './pages/app/Gifts/Gifts';
import Guests from './pages/app/Guests/Guests';
import InEventStats from './pages/app/InEventStats/InEventStats';
import Insights from './pages/app/Insights/Insights';
import PageViewAnalytics from './pages/app/Insights/pages/PageViewAnalytics/PageViewAnalytics';
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
import Spinwheel from './pages/app/Spinwheel/Spinwheel';
import TermsConditions from './pages/app/TermsCondictions/TermsConditions';
import ValidateData from './pages/app/ValidateData/ValidateData';
import Login from './pages/auth/Login/Login';
import FourNotFour from './pages/FourNotFour/FourNotFour';

const routes: RouteObject[] = [
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
          <RoleChecker roles={TillRoles.VOLUNTEER}>
            <Overview />
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/insights',
        element: (
          <RoleChecker roles={TillRoles.VIEWER}>
            <Insights />
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/guests',
        element: (
          <RoleChecker roles={TillRoles.VOLUNTEER}>
            <Guests />
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/checkins',
        element: (
          <RoleChecker roles={TillRoles.VOLUNTEER}>
            <CheckIns />
          </RoleChecker>
        ),
      },

      {
        path: '/:eventTitle/checkins/checkin/venue',
        element: (
          <RoleChecker roles={TillRoles.VOLUNTEER}>
            <Venue />
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/checkins/checkin/scan',
        element: (
          <RoleChecker roles={TillRoles.VOLUNTEER}>
            <ScanQR />
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/checkins/checkin/gifts',
        element: (
          <RoleChecker roles={TillRoles.VOLUNTEER}>
            <Gifts />
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/checkins/checkin/checkout',
        element: (
          <RoleChecker roles={TillRoles.VOLUNTEER}>
            <CheckOutScan />
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/inevent',
        element: (
          <RoleChecker roles={TillRoles.VOLUNTEER}>
            <InEventStats />
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/postevent',
        element: (
          <RoleChecker roles={TillRoles.VOLUNTEER}>
            <PostEvent />
          </RoleChecker>
        ),
      },
      {
        path: '/create-event',
        element: <CreateEvent />,
      },
      {
        path: '/:eventTitle/manage',
        element: (
          <RoleChecker roles={TillRoles.VIEWER}>
            <EventGlance />
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/manage/edit-event',
        element: (
          <RoleChecker roles={TillRoles.VIEWER}>
            <EditEvent />
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/manage/spinwheel',
        element: (
          <RoleChecker roles={TillRoles.VOLUNTEER}>
            <Spinwheel />
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/formbuilder',
        element: (
          <RoleChecker roles={TillRoles.ADMIN}>
            <FormBuilder />
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/coupon',
        element: (
          <RoleChecker roles={TillRoles.VIEWER}>
            <Coupon />
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/logs',
        element: (
          <RoleChecker roles={TillRoles.ADMIN}>
            <EventLogs />
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/payment-analytics',
        element: (
          <RoleChecker roles={TillRoles.ADMIN}>
            <PaymentAnalytics />
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/perks-analytics',
        element: (
          <RoleChecker roles={TillRoles.ADMIN}>
            <PerkAnalytics />
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/venue-analytics',
        element: (
          <RoleChecker roles={TillRoles.ADMIN}>
            <VenueAnalytics />
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/randomsizer',
        element: (
          <RoleChecker roles={TillRoles.ADMIN}>
            <Randomizer />
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/checkins/perks',
        element: (
          <RoleChecker roles={TillRoles.VOLUNTEER}>
            <Perks />
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/page-view-analytics/',
        element: (
          <RoleChecker roles={TillRoles.VIEWER}>
            <PageViewAnalytics />
          </RoleChecker>
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
    path: '/:eventTitle/thank-you',
    element: <ThankYouPage />,
  },
  {
    path: '*',
    element: <FourNotFour />,
  },
];

const router = createBrowserRouter(routes);

export const Routes: React.FC = () => {
  return <RouterProvider router={router} />;
};
