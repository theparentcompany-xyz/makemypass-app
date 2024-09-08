import React from 'react';
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom';

import { Roles } from '../services/enums';
import RoleChecker from '../services/RoleChecker';
import AuthCheck from './components/AuthCheck/AuthCheck';
import Theme from './components/Theme/Theme';
import PrivacyPolicy from './pages/app/PrivacyPolicy/PrivacyPolicy';
import TermsConditions from './pages/app/TermsCondictions/TermsConditions';
import Login from './pages/auth/Login/Login';
import FourNotFour from './pages/FourNotFour/FourNotFour';

// Lazy loading of components
const ViewTicket = React.lazy(() => import('./components/ViewTicket/ViewTicket'));
const CheckIns = React.lazy(() => import('./pages/app/CheckIns/CheckIns'));
const CheckIn = React.lazy(() => import('./pages/app/CheckIns/pages/CheckIn/CheckIn'));
const CheckOutScan = React.lazy(
  () => import('./pages/app/CheckIns/pages/CheckOutScan/CheckOutScan'),
);
const Perks = React.lazy(() => import('./pages/app/CheckIns/pages/Perks/Perks'));
const ScanQR = React.lazy(() => import('./pages/app/CheckIns/pages/ScanQR/ScanQR'));
const Venue = React.lazy(() => import('./pages/app/CheckIns/pages/Venue/Venue'));
const Coupon = React.lazy(() => import('./pages/app/Coupon/Coupon'));
const CreateEvent = React.lazy(() => import('./pages/app/CreateEvent/CreateEvent'));
const EditEvent = React.lazy(() => import('./pages/app/EditEvent/EditEvent'));
const EventGlance = React.lazy(() => import('./pages/app/EventGlance/EventGlance'));
const EventLogs = React.lazy(() => import('./pages/app/EventLogs/EventLogs'));
const EventPage = React.lazy(() => import('./pages/app/EventPage/EventPage'));
const Events = React.lazy(() => import('./pages/app/Events/Events'));
const FormBuilder = React.lazy(() => import('./pages/app/FormBuilder/FormBuilder'));
const Gifts = React.lazy(() => import('./pages/app/Gifts/Gifts'));
const Guests = React.lazy(() => import('./pages/app/Guests/Guests'));
const InEventStats = React.lazy(() => import('./pages/app/InEventStats/InEventStats'));
const Insights = React.lazy(() => import('./pages/app/Insights/Insights'));
const PerkAnalytics = React.lazy(
  () => import('./pages/app/Insights/pages/PerkAnalytics/PerkAnalytics'),
);
const VenueAnalytics = React.lazy(
  () => import('./pages/app/Insights/pages/VenueAnalytics/VenueAnalytics'),
);
const LandingPage = React.lazy(() => import('./pages/app/LandingPage/LandingPage'));
const Overview = React.lazy(() => import('./pages/app/Overview/Overview/Overview'));
const PaymentAnalytics = React.lazy(() => import('./pages/app/PaymentAnalytics/PaymentAnalytics'));
const PostEvent = React.lazy(() => import('./pages/app/PostEvent/PostEvent'));
const ProfilePage = React.lazy(() => import('./pages/app/ProfilePage/ProfilePage'));
const Randomizer = React.lazy(() => import('./pages/app/Randomizer/Randomizer'));
const SelfCheckIn = React.lazy(() => import('./pages/app/SelfCheckIn/SelfCheckIn'));
const SetProfilePage = React.lazy(() => import('./pages/app/SetProfilePage/SetProfilePage'));
const ValidateData = React.lazy(() => import('./pages/app/ValidateData/ValidateData'));

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/:eventTitle/ticket',
    element: (
      <React.Suspense fallback={<Theme>Loading...</Theme>}>
        <ViewTicket />
      </React.Suspense>
    ),
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
    element: (
      <React.Suspense fallback={<Theme>Loading...</Theme>}>
        <LandingPage />
      </React.Suspense>
    ),
  },
  {
    path: '/home',
    element: (
      <React.Suspense fallback={<Theme>Loading...</Theme>}>
        <LandingPage />
      </React.Suspense>
    ),
  },
  {
    path: '/profile',
    element: (
      <React.Suspense fallback={<Theme>Loading...</Theme>}>
        <ProfilePage />
      </React.Suspense>
    ),
  },
  {
    path: '/set-profile',
    element: (
      <React.Suspense fallback={<Theme>Loading...</Theme>}>
        <SetProfilePage />
      </React.Suspense>
    ),
  },
  {
    path: '/:eventTitle/public/insights',
    element: (
      <React.Suspense fallback={<Theme>Loading...</Theme>}>
        <Insights type='public' />
      </React.Suspense>
    ),
  },
  {
    path: '/validate-participant/',
    element: (
      <React.Suspense fallback={<Theme>Loading...</Theme>}>
        <ValidateData />
      </React.Suspense>
    ),
  },
  {
    path: '/:eventTitle/checkins/self-checkin',
    element: (
      <React.Suspense fallback={<Theme>Loading...</Theme>}>
        <SelfCheckIn />
      </React.Suspense>
    ),
  },
  {
    path: '/',
    element: <AuthCheck />,
    children: [
      {
        path: '/events',
        element: (
          <React.Suspense fallback={<Theme>Loading...</Theme>}>
            <Events />
          </React.Suspense>
        ),
      },
      {
        path: '/:eventTitle/overview',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.OWNER, Roles.VOLUNTEER]}>
            <React.Suspense fallback={<Theme>Loading...</Theme>}>
              <Overview />
            </React.Suspense>
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/insights',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.OWNER]}>
            <React.Suspense fallback={<Theme>Loading...</Theme>}>
              <Insights />
            </React.Suspense>
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/guests',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.OWNER, Roles.VOLUNTEER]}>
            <React.Suspense fallback={<Theme>Loading...</Theme>}>
              <Guests />
            </React.Suspense>
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/checkins',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.OWNER, Roles.VOLUNTEER]}>
            <React.Suspense fallback={<Theme>Loading...</Theme>}>
              <CheckIns />
            </React.Suspense>
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/checkins/checkin',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.OWNER, Roles.VOLUNTEER]}>
            <React.Suspense fallback={<Theme>Loading...</Theme>}>
              <CheckIn />
            </React.Suspense>
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/checkins/checkin/venue',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.OWNER, Roles.VOLUNTEER]}>
            <React.Suspense fallback={<Theme>Loading...</Theme>}>
              <Venue />
            </React.Suspense>
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/checkins/checkin/scan',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.OWNER, Roles.VOLUNTEER]}>
            <React.Suspense fallback={<Theme>Loading...</Theme>}>
              <ScanQR />
            </React.Suspense>
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/checkins/checkin/gifts',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.OWNER, Roles.VOLUNTEER]}>
            <React.Suspense fallback={<Theme>Loading...</Theme>}>
              <Gifts />
            </React.Suspense>
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/checkins/checkin/checkout',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.OWNER, Roles.VOLUNTEER]}>
            <React.Suspense fallback={<Theme>Loading...</Theme>}>
              <CheckOutScan />
            </React.Suspense>
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/inevent',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.OWNER, Roles.VOLUNTEER]}>
            <React.Suspense fallback={<Theme>Loading...</Theme>}>
              <InEventStats />
            </React.Suspense>
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/postevent',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.OWNER, Roles.VOLUNTEER]}>
            <React.Suspense fallback={<Theme>Loading...</Theme>}>
              <PostEvent />
            </React.Suspense>
          </RoleChecker>
        ),
      },
      {
        path: '/create-event',
        element: (
          <React.Suspense fallback={<Theme>Loading...</Theme>}>
            <CreateEvent />
          </React.Suspense>
        ),
      },
      {
        path: '/:eventTitle/manage',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.OWNER]}>
            <React.Suspense fallback={<Theme>Loading...</Theme>}>
              <EventGlance />
            </React.Suspense>
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/manage/edit-event',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.OWNER]}>
            <React.Suspense fallback={<Theme>Loading...</Theme>}>
              <EditEvent />
            </React.Suspense>
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/formbuilder',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.OWNER]}>
            <React.Suspense fallback={<Theme>Loading...</Theme>}>
              <FormBuilder />
            </React.Suspense>
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/coupon',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.OWNER]}>
            <React.Suspense fallback={<Theme>Loading...</Theme>}>
              <Coupon />
            </React.Suspense>
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/logs',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.OWNER]}>
            <React.Suspense fallback={<Theme>Loading...</Theme>}>
              <EventLogs />
            </React.Suspense>
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/payment-analytics',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.OWNER]}>
            <React.Suspense fallback={<Theme>Loading...</Theme>}>
              <PaymentAnalytics />
            </React.Suspense>
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/perks-analytics',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.OWNER]}>
            <React.Suspense fallback={<Theme>Loading...</Theme>}>
              <PerkAnalytics />
            </React.Suspense>
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/venue-analytics',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.OWNER]}>
            <React.Suspense fallback={<Theme>Loading...</Theme>}>
              <VenueAnalytics />
            </React.Suspense>
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/randomsizer',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.OWNER]}>
            <React.Suspense fallback={<Theme>Loading...</Theme>}>
              <Randomizer />
            </React.Suspense>
          </RoleChecker>
        ),
      },
      {
        path: '/:eventTitle/checkins/perks',
        element: (
          <RoleChecker roles={[Roles.ADMIN, Roles.VOLUNTEER, Roles.OWNER]}>
            <React.Suspense fallback={<Theme>Loading...</Theme>}>
              <Perks />
            </React.Suspense>
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
    element: (
      <React.Suspense fallback={<Theme>Loading...</Theme>}>
        <EventPage />
      </React.Suspense>
    ),
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
