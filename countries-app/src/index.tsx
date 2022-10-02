import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import './index.css';
import ErrorBoundary from 'components/ErrorBoundary';
import Spinner from 'components/Spinner';
import reportWebVitals from './reportWebVitals';

/* code splitting for better load times
*  this way when we load the home page we don't
*  load also the code of the details page
* */
const Home = lazy(() => import('routes/Home'));
const Detail = lazy(() => import('routes/Detail'));
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

// Create a client
const queryClient = new QueryClient();

/**
 * HOCs for:
 * controlling api cashing,
 * Error boundaries - show error view when something goes wrong
 * Suspense - show spinner when a lazy component is loading
 * Routing
 */

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={<Spinner show isOverlay />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/detail/:cca3" element={<Detail />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
