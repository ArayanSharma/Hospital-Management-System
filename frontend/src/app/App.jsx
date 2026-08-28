import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes.jsx";
import { getMeApi } from "../features/auth/services/auth.api.js";
import { setCredentials, logout } from "../store/authSlice.js";
import Loading from "../components/common/Loading.jsx";
import ErrorBoundary from "../components/common/ErrorBoundary.jsx";

function App() {
  const dispatch = useDispatch();
  const { accessToken, user } = useSelector((state) => state.auth);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (accessToken && !user) {
        try {
          const { data } = await getMeApi();
          dispatch(setCredentials({ user: data.data, accessToken }));
        } catch {
          dispatch(logout());
        }
      }
      setCheckingAuth(false);
    };
    restoreSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (checkingAuth) return <Loading message="Loading..." />;

  return (
    <ErrorBoundary
      title="Application Error"
      message="The application encountered an unexpected error. Please reload the page."
    >
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;