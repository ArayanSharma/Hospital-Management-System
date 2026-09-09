import { lazy } from "react";

/**
 * Enhanced React lazy wrapper with retry capability for dynamic chunk loading failures.
 * Handles transient network issues and stale cache deployment issues gracefully.
 *
 * @param {Function} componentImport - Dynamic import function, e.g. () => import('./Page.jsx')
 * @param {number} maxRetries - Maximum number of retries before failing over or forcing reload (default: 2)
 * @param {number} interval - Delay in ms between retries (default: 500)
 */
export function lazyWithRetry(componentImport, maxRetries = 2, interval = 500) {
  return lazy(() =>
    new Promise((resolve, reject) => {
      const attemptImport = (retriesLeft) => {
        componentImport()
          .then(resolve)
          .catch((error) => {
            if (retriesLeft > 0) {
              setTimeout(() => {
                attemptImport(retriesLeft - 1);
              }, interval);
            } else {
              // Check if we've already reloaded the page for this session to avoid infinite reload loops
              const storageKey = `chunk_reload_${window.location.pathname}`;
              const pageAlreadyReloaded = sessionStorage.getItem(storageKey);

              if (!pageAlreadyReloaded) {
                sessionStorage.setItem(storageKey, "true");
                window.location.reload();
              } else {
                // Clear key so subsequent navigational errors can attempt reload again if needed
                sessionStorage.removeItem(storageKey);
                reject(error);
              }
            }
          });
      };

      attemptImport(maxRetries);
    })
  );
}

export default lazyWithRetry;
