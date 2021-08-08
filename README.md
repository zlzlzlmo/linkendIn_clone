# 링크드인 클론 코딩

[프로젝트 보러가기! 👍](https://linkedinclone-93ffe.web.app/)

## 사용언어는 ?
> React, TypeScript

## 사용 패키지 || 라이브러리는 ?
> firebase, react-router-dom, styled-components, redux-toolkit, moment, react-player

## 👀 어떤 모습으로 개발이 되었나? 

|                  |                                          개발된 이미지                                           |
| ---------------: | :----------------------------------------------------------------------------------------------: |
|           인덱스 | ![](https://images.velog.io/images/hoon_dev/post/ab1d83ab-2a52-45e5-8ae9-6d8e30ba694f/image.png) |
|               홈 | ![](https://images.velog.io/images/hoon_dev/post/119e918d-5d3a-426e-bc16-3d4a19fd8e07/image.png) |
|      포스트 모달 | ![](https://images.velog.io/images/hoon_dev/post/b0cc2239-5539-40fd-a510-884215e27973/image.png) |
| 이미지 업로드 전 | ![](https://images.velog.io/images/hoon_dev/post/201466c4-7d3b-4186-9b08-2b3bd0c5b626/image.png) |
|   영상 업로드 전 | ![](https://images.velog.io/images/hoon_dev/post/cbd763c8-ad26-4257-a173-d84db38755a4/image.png) |
|        업로드 후 | ![](https://images.velog.io/images/hoon_dev/post/a37eb162-6296-4e92-aacb-13324b52e3f1/image.png) |
|         로그아웃 | ![](https://images.velog.io/images/hoon_dev/post/d82973a1-8841-4b20-ad25-75f58e835162/image.png) |

## 🕹 기능정보
---
### 1. 구글로그인
- Firebase Auth를 사용하여 구글 로그인 기능 구현
  
```ts
  const handleSignIn = () => {
    auth.signInWithPopup(provider).then((result) => {
      const user: UserState = {
        name: result.user?.displayName,
        email: result.user?.email,
        photoURL: result.user?.photoURL,
      };
      dispatch(setUserLoginDetails(user));
    });
  };
```

### 2. 업로드전 Preview
- useState에 각 타입별(이미지,비디오) url을 담아 미리보기 지원
  
```ts
{assetArea === "image" ? (
                  <UploadImage>
                    <input
                      type="file"
                      accept="image/gif,image/jpeg,image/png"
                      name="image"
                      id="file"
                      style={{ display: "none" }}
                      onChange={handleChange}
                    />
                    <p>
                      <label htmlFor="file">
                        여기를 클릭하여 사진을 업로드 하세요 :)
                      </label>
                    </p>
                    {shareImage && (
                      <img src={URL.createObjectURL(shareImage)} alt="" />
                    )}
                  </UploadImage>
                ) : (
                  assetArea === "media" && (
                    <>
                      <input
                        type="text"
                        placeholder="영상 링크를 넣으세요"
                        value={videoLink}
                        onChange={(e) => setVideoLink(e.target.value)}
                      />
                      {videoLink && (
                        <ReactPlayer width={"100%"} url={videoLink} />
                      )}
                    </>
                  )
                )}
```

### 4. Firebase Storage를 사용하여 이미지 저장 및 URL 추출

```ts
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
```

### 5. FireStore를 사용하여 게시글 저장
```ts
const addArticleToFB = (data: Article) => {
  return function (dispatch: any) {
    db.collection("article")
      .add(data)
      .then(() => {
        dispatch(getArticleFB());
      });
  };
};
```

### 6. FireStore에 저장된 데이터들 Redux 상태값에 담기
```ts
export const getArticleFB = createAsyncThunk("getArticleFB", async () => {
  let articleArray: any[] = [];
  const response = await db
    .collection("article")
    .orderBy("actor.date", "desc")
    .get()
    .then((querySnapShot) => {
      querySnapShot.forEach((doc) => {
        articleArray.push({ id: doc.id, ...doc.data() });
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
  },
  extraReducers: (builder) => {
    builder.addCase(getArticleFB.fulfilled, (state, action) => {
      state.is_loading = false;
      articleSlice.caseReducers.setArticleState(state, action);
    });
  },
});
```

### 7. 게시글 삭제

```ts
export const deleteArticleFB = (id: any) => {
  return async function (dispatch: any) {
    await db.collection("article").doc(id).delete();
    dispatch(getArticleFB());
  };
};
```


### 8. 로그아웃

```ts
  const handleSignOut = () => {
    auth.signOut().then(() => {
      dispatch(setSignOutState());
      history.push("/");
    });
  };
```

---

😎 감사합니다 :)
