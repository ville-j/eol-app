import { createSlice } from "@reduxjs/toolkit";
import { client } from "../utils";

const tags = createSlice({
  name: "tags",
  initialState: { list: [] },
  reducers: {
    getTagsSuccess(state, action) {
      state.list = action.payload;
    },
  },
});

const { getTagsSuccess } = tags.actions;

const fetchTags = () => async (dispatch) => {
  try {
    const response = await client.get("https://api.elma.online/api/tag", true);
    dispatch(
      getTagsSuccess(
        response.map((t) => ({
          name: t.Name,
          id: t.TagIndex,
          hidden: t.Hidden,
        }))
      )
    );
  } catch (err) {
    console.log(err);
  }
};

export { fetchTags };

export default tags.reducer;
