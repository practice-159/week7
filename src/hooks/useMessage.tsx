import { useDispatch } from "react-redux";

import type { AppDispatch } from "../store/store";

import { createAsyncMessage } from "../slices/messageSlice";
export const useMessage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const showSuccess = (message: string) => {
    dispatch(
      createAsyncMessage({
        success: true,
        message,
      }),
    );
  };

  const showError = (message: string) => {
    dispatch(
      createAsyncMessage({
        success: false,
        message,
      }),
    );
  };

  return { showSuccess, showError };
};
