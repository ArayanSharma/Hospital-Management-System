import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginApi, googleLoginApi, logoutApi } from "../services/auth.api.js";
import { setCredentials, logout as logoutAction } from "../../../store/authSlice.js";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const login = async (email, password) => {
    const { data } = await loginApi({ email, password });
    dispatch(setCredentials(data.data));
    const u = data.data?.user;
    if (u && u.isProfileComplete === false) {
      navigate("/complete-profile");
    } else {
      navigate("/dashboard");
    }
  };

  const googleLogin = async (idToken, firebaseUser) => {
    const { data } = await googleLoginApi({
      idToken,
      email: firebaseUser.email,
      name: firebaseUser.displayName,
      photoUrl: firebaseUser.photoURL,
      firebaseUid: firebaseUser.uid,
    });
    dispatch(setCredentials(data.data));
    const u = data.data?.user;
    if (u && u.isProfileComplete === false) {
      navigate("/complete-profile");
    } else {
      navigate("/dashboard");
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      dispatch(logoutAction());
      navigate("/login");
    }
  };

  return { user, isAuthenticated, login, googleLogin, logout };
};