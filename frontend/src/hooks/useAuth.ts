import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  loginUser,
  registerUser,
  logout,
  clearError,
} from "../store/authSlice";
import { LoginRequest, RegisterRequest } from "../types";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const login = (data: LoginRequest) => dispatch(loginUser(data));
  const register = (data: RegisterRequest) => dispatch(registerUser(data));
  const logoutUser = () => dispatch(logout());
  const clearAuthError = () => dispatch(clearError());

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logoutUser,
    clearAuthError,
  };
};
