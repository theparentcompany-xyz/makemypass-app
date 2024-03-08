import ReactDOM from 'react-dom/client';
import './index.css';
import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/auth/Login/Login';
import './index.css';
import LandingPage from './pages/app/LandingPage/LandingPage';
import { Toaster, ToastPosition } from 'react-hot-toast';

const Insights = React.lazy(() => import('./pages/app/Insights/Insights'));
const Overview = React.lazy(() => import('./pages/app/Overview/Overview/Overview'));
const Events = React.lazy(() => import('./pages/app/Events/Events'));
const AuthCheck = React.lazy(() => import('./components/AuthCheck/AuthCheck'));
const Guests = React.lazy(() => import('./pages/app/Guests/Guests'));
const TermsConditions = React.lazy(() => import('./pages/app/TermsCondictions/TermsConditions'));
const PrivacyPolicy = React.lazy(() => import('./pages/app/PrivacyPolicy/PrivacyPolicy'));
const FourNotFour = React.lazy(() => import('./pages/FourNotFour/FourNotFour'));
const CheckIns = React.lazy(() => import('./pages/app/CheckIns/CheckIns'));
const CheckIn = React.lazy(() => import('./pages/app/CheckIns/pages/CheckIn/CheckIn'));
const ScanQR = React.lazy(() => import('./pages/app/CheckIns/pages/ScanQR/ScanQR'));
const SpinWheel = React.lazy(() => import('./pages/app/SpinWheel/SpinWheel'));
const InEventStats = React.lazy(() => import('./pages/app/InEventStats/InEventStats'));

const ClaimGifts = React.lazy(() => import('./pages/app/ClaimGifts/ClaimGifts'));
const EventPage = React.lazy(() => import('./pages/app/EventPage/EventPage'));
const Perks = React.lazy(() => import('./pages/app/CheckIns/pages/Perks/Perks'));
const PostEvent = React.lazy(() => import('./pages/app/PostEvent/PostEvent'));
const ProfilePage = React.lazy(() => import('./pages/app/ProfilePage/ProfilePage'));

import SecureAuthRoutes from '../services/authRoutes';

import GlobalContextWrapper from './components/GlobalContextWrapper';

const RoleChecker = SecureAuthRoutes();

const routes = [
  {
    path: '/',
    element: <GlobalContextWrapper />,
    children: [
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
        path: '/',
        element: <AuthCheck />,
        children: [
          {
            path: '/events',
            element: <Events />,
          },
          {
            path: '/:eventTitle/overview',
            element: <RoleChecker roles={['Admin']} children={<Overview />} />,
          },
          {
            path: '/:eventTitle/insights',
            element: <RoleChecker roles={['Admin']} children={<Insights />} />,
          },
          {
            path: '/:eventTitle/guests',
            element: <RoleChecker roles={['Admin']} children={<Guests />} />,
          },
          {
            path: '/:eventTitle/checkins',
            element: <RoleChecker roles={['Admin', 'Volunteer']} children={<CheckIns />} />,
          },
          {
            path: '/:eventTitle/checkins/checkin',
            element: <RoleChecker roles={['Admin', 'Volunteer']} children={<CheckIn />} />,
          },
          {
            path: '/:eventTitle/checkins/checkin/scan',
            element: <RoleChecker roles={['Admin', 'Volunteer']} children={<ScanQR />} />,
          },
          {
            path: `/:eventTitle/checkins/claimgifts`,
            element: <RoleChecker roles={['Admin', 'Volunteer']} children={<ClaimGifts />} />,
          },
          {
            path: '/:eventTitle/checkins/perks',
            element: <RoleChecker roles={['Admin', 'Volunteer']} children={<Perks />} />,
          },
          {
            path: '/:eventTitle/spinwheel',
            element: <RoleChecker roles={['Admin', 'Gamer']} children={<SpinWheel />} />,
          },
          {
            path: '/:eventTitle/inevent',
            element: <RoleChecker roles={['Admin', 'Volunteer']} children={<InEventStats />} />,
          },
          {
            path: '/:eventTitle/postevent',
            element: <RoleChecker roles={['Admin', 'Volunteer']} children={<PostEvent />} />,
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
    ],
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
