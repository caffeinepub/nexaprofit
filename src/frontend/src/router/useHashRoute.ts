import { useState, useEffect } from 'react';

export type Route = '/' | '/dashboard' | '/wallet' | '/plans' | '/profile';

export function useHashRoute() {
  const getRoute = (): Route => {
    const hash = window.location.hash.slice(1) || '/';
    if (hash === '/dashboard') return '/dashboard';
    if (hash === '/wallet') return '/wallet';
    if (hash === '/plans') return '/plans';
    if (hash === '/profile') return '/profile';
    return '/';
  };

  const [route, setRoute] = useState<Route>(getRoute);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRoute());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (newRoute: Route) => {
    window.location.hash = newRoute;
  };

  return { route, navigate };
}
