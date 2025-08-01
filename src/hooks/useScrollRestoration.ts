import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const scrollPositions = new Map<string, number>();

export const useScrollRestoration = () => {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;

    // Save current scroll position before route change
    const saveScrollPosition = () => {
      scrollPositions.set(currentPath, window.scrollY);
    };

    // Restore scroll position for current route
    const restoreScrollPosition = () => {
      const savedPosition = scrollPositions.get(currentPath);
      if (savedPosition !== undefined) {
        setTimeout(() => {
          window.scrollTo({
            top: savedPosition,
            behavior: 'instant'
          });
        }, 0);
      }
    };

    // Handle browser back/forward navigation
    const handlePopState = () => {
      restoreScrollPosition();
    };

    window.addEventListener('beforeunload', saveScrollPosition);
    window.addEventListener('popstate', handlePopState);

    // Check if we're returning to a previous page
    if (scrollPositions.has(currentPath)) {
      restoreScrollPosition();
    }

    return () => {
      saveScrollPosition();
      window.removeEventListener('beforeunload', saveScrollPosition);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname]);
};