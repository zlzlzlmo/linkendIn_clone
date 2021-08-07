import { useAppDispatch } from "./../configStore";
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from "@reduxjs/toolkit";
import { storage } from "../../firebase";
import db from "../../firebase";
import firebase from "firebase/app";
import { UserStateValue } from "./user";
import { RootState } from "../configStore";
import { AnyArray } from "immer/dist/internal";

export interface ActorState {
  date: string;
  email: UserStateValue;
  name: UserStateValue;
  photoURL: UserStateValue;
}

export interface Article {
  actor: ActorState;
  comments: number;
  description: string;
  sharedImage: any;
  video: string;
}

interface ArticleState {
  list: Article[];
  is_loading: boolean;
}

const initialState: ArticleState = {
  list: [],
  is_loading: false,
};

const addArticleToFB = createAsyncThunk(
  "addAricleDB",
  async (data: Article): Promise<Object> => {
    const response: any = await db.collection("article").add(data);
    return response;
  }
);

export const uploadArticleAPI = (data: Article) => {
  return function (dispatch: any) {
    dispatch(articleSlice.actions.setArticleLoading(true));
    if (data.sharedImage !== "") {
      const upload = storage
        .ref(`images/${data.sharedImage.name}`)
        .put(data.sharedImage);
      upload.on(
        "state_changed",
        (snapshot) => {
          let progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => console.log(error.code),
        async () => {
          const downloadURL = await (await upload).ref.getDownloadURL();
          data.sharedImage = downloadURL;
          dispatch(addArticleToFB(data));
        }
      );
    } else {
      dispatch(addArticleToFB(data));
    }
  };
};

const articleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {
    setArticleLoading: (state, action: PayloadAction<boolean>) => {
      state.is_loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addArticleToFB.pending, (state) => {
      state.is_loading = true;
    });
    builder.addCase(addArticleToFB.fulfilled, (state) => {
      state.is_loading = false;
    });
  },
});

export const getAritcles = (state: RootState) => state.article;

export default articleSlice.reducer;
