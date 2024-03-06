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
import SpinWheel from './pages/app/SpinWheel/SpinWheel';
import InEventStats from './pages/app/InEventStats/InEventStats';

import SecureAuthRoutes from '../services/authRoutes';
import ClaimGifts from './pages/app/ClaimGifts/ClaimGifts';
import EventPage from './pages/app/EventPage/EventPage';
import Perks from './pages/app/CheckIns/pages/Perks/Perks';
import PostEvent from './pages/app/PostEvent/PostEvent';
import GlobalContextWrapper from './components/GlobalContextWrapper';
import ProfilePage from './pages/app/ProfilePage/ProfilePage';

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
        path: '/profile',
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
