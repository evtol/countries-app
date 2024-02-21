import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Spinner from './components/Spinner';
// import Home from './routes/Home';
// import Detail from './routes/Detail';

/* code splitting for better load times
*  this way when we load the home page we don't
*  load also the code of the details page
* */
const Home = lazy(() => import('routes/Home'));
const Detail = lazy(() => import('routes/Detail'));

/**
 * HOCs for:
 * controlling api cashing,
 * Error boundaries - show error view when something goes wrong
 * Suspense - show spinner when a lazy component is loading
 * Routing
 */
export default function App() {
  return (
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
  );
}
