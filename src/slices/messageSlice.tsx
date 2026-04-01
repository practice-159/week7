import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

type Message = {
  id: string;
  type: string;
  title: string;
  text: string;
};

const messageSlice = createSlice({
  name: "messageSlice",
  initialState: [] as Message[],
  reducers: {
    createMessage(state, action) {
      state.push({
        id: action.payload.id,
        type: action.payload.success ? "success" : "danger",
        title: action.payload.success ? "成功" : "失敗",
        text: action.payload.message,
      });
    },
    removeMessage(state, action) {
      const index = state.findIndex((i) => i.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

export const createAsyncMessage = createAsyncThunk(
  "message/createAsyncMessage",
  async (
    payload: { success: boolean; message: string },
    { dispatch, requestId },
  ) => {
    dispatch(createMessage({ ...payload, id: requestId }));
    setTimeout(() => {
      dispatch(removeMessage(requestId));
    }, 2000);
  },
);

export const { createMessage, removeMessage } = messageSlice.actions;
export default messageSlice.reducer;
