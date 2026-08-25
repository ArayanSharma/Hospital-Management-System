import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginApi, logoutApi } from "../services/auth.api.js";
import { setCredentials, logout as logoutAction } from "../../../store/authSlice.js";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const login = async (email, password) => {
    const { data } = await loginApi({ email, password });
    dispatch(setCredentials(data.data)); // { user, accessToken }
    navigate("/dashboard");
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      dispatch(logoutAction());
      navigate("/login");
    }
  };

  return { user, isAuthenticated, login, logout };
};