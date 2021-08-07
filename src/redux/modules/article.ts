import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { storage } from "../../firebase";
import db from "../../firebase";
import { UserStateValue } from "./user";
import { RootState } from "../configStore";

export interface ActorState {
  date: UserStateValue;
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
    await db.collection("article").add(data);
    return data;
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

export const getArticleFB = createAsyncThunk("getArticleFB", async () => {
  let articleArray: any[] = [];
  const response = await db
    .collection("article")
    .orderBy("actor.date", "desc")
    .get()
    .then((querySnapShot) => {
      querySnapShot.forEach((doc) => {
        articleArray.push(doc.data());
      });
      return articleArray;
    });
  return response;
});

const articleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {
    setArticleLoading: (state, action: PayloadAction<boolean>) => {
      state.is_loading = action.payload;
    },
    setArticleState: (state, action: PayloadAction<Article[]>) => {
      state.list = action.payload;
    },
    setPushArticleState: (state, action) => {
      state.list.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addArticleToFB.pending, (state) => {
      state.is_loading = true;
    });
    builder.addCase(addArticleToFB.fulfilled, (state, action) => {
      state.is_loading = false;
      articleSlice.caseReducers.setPushArticleState(state, action);
    });
    builder.addCase(getArticleFB.fulfilled, (state, action) => {
      articleSlice.caseReducers.setArticleState(state, action);
    });
  },
});

export const getAritcles = (state: RootState) => state.article;
export const { setArticleState } = articleSlice.actions;
export default articleSlice.reducer;
