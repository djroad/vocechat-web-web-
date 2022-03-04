import { createSlice } from "@reduxjs/toolkit";
import { isObjectEqual } from "../../common/utils";

const initialState = {};

const channelMsgSlice = createSlice({
  name: "channelMessage",
  initialState,
  reducers: {
    clearChannelMsg() {
      return initialState;
    },
    initChannelMsg(state, action) {
      return action.payload;
    },
    addChannelMsg(state, action) {
      const {
        id,
        content,
        created_at,
        mid,
        from_uid,
        content_type,
        unread = true,
      } = action.payload;
      const newMsg = { content, content_type, created_at, from_uid, unread };
      if (state[id]) {
        let replaceMsg = state[id][mid];
        // 如果存在，并且新消息和缓存消息不一样，则替换掉，并且改为已读（可能有问题）
        if (replaceMsg) {
          const copyMsg = { ...replaceMsg };
          if (!isObjectEqual(copyMsg, newMsg)) {
            state[id][mid] = { ...newMsg, unread: false };
          }
        } else {
          state[id][mid] = newMsg;
        }
      } else {
        state[id] = { [mid]: newMsg };
      }
    },
    setChannelMsgRead(state, action) {
      const { id, mid } = action.payload;
      console.log("set unread", id, mid);
      state[id][mid].unread = false;
    },
    clearChannelMsgUnread(state, action) {
      const gid = action.payload;
      console.log("set channel all unread", gid);
      Object.entries(state[gid]).forEach(([, obj]) => {
        obj.unread = false;
      });
    },
  },
});
export const {
  clearChannelMsg,
  initChannelMsg,
  clearChannelMsgUnread,
  setChannelMsgRead,
  addChannelMsg,
} = channelMsgSlice.actions;
export default channelMsgSlice.reducer;
