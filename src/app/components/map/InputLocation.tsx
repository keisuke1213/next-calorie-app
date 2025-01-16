"use client";
import React, { FC } from "react";
import { Box, TextField, Button } from "@mui/material";

type GetLocationProps = {
  originCoords: { latitude: number; longitude: number } | null;
  handleSubmit: (formData: FormData) => Promise<void>;
};

const InputLocation: FC<GetLocationProps> = ({
  originCoords,
  handleSubmit,
}) => {
  return (
    <Box
      component="form"
      action={handleSubmit}
      sx={{
        ...styles.container,
        "@media (max-width: 768px)": {
          flexDirection: "column",
          padding: 1,
        },
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        name="destination"
        placeholder="　目的地を入力"
        sx={{
          ...styles.input,
          backgroundColor: "white",
          height: "50px",
          width: "670px",
          marginLeft: "-30px",
          borderRadius: "40px",
          boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.2)",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              border: "none", // 境界線を消す
            },
          },
          "@media (max-width: 768px)": {
            width: "73%",
            marginTop: "65px",
            marginLeft: "-375px",
          },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{
          width: "75px", // 横幅を指定
          height: "50px", // 高さを指定
          marginLeft: "655px", // ボタンとテキストボックスの間隔を調整
          marginTop: "-67px", // ボタンとテキストボックスの間隔を調整
          marginBottom: "-22px",
          minWidth: "50px", // ボタンの最小幅を設定（ボタンが小さくなるのを防ぐ）
          borderRadius: "40px", // 必要に応じて角を丸く
          fontSize: "30px", // フォントサイズを指定
          backgroundColor: "#8AE2FF", // 背景色を指定
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)", // 通常時のドロップシャドウ
          transition: "box-shadow 0.3s ease", // なめらかな切り替え
          "&:hover": {
            boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.5)", // ホバー時のインナーシャドウ
          },
          "@media (max-width: 768px)": {
            width: "15%",
            marginLeft: "-40px",
            marginTop: "-66.5px",
          },
        }}
      >
        🔍
      </Button>
    </Box>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 2,
    marginTop: 2,
  },
  input: {
    marginBottom: 2,
  },
};

export default InputLocation;
