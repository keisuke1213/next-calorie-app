"use client";
import React, { FC } from "react";
import { Box, TextField, Button } from "@mui/material";

type GetLocationProps = {
  originCoords: { latitude: number; longitude: number } | null;
  handleSubmit: (formData: FormData) => Promise<void>;
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
  },
  input: {
    backgroundColor: "white",
    height: "50px",
    width: "300px", // デフォルトの幅を100%に設定
    borderRadius: "40px",
    boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.2)",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: "none", // 境界線を消す
      },
    },
    "@media (min-width: 600px)": {
      width: "400px", // 画面幅が600px以上の場合の幅を500pxに設定
    },
    "@media (min-width: 960px)": {
      width: "550px", // 画面幅が960px以上の場合の幅を670pxに設定
    },
    "@media (max-width: 600px)": {
      width: "230px", // 画面幅が768px以下の場合の幅を100%に設定
    },
  },
  button: {
    margin: "10px", // ボタンとテキストボックスの間隔を調整
    minWidth: "40px", // ボタンの最小幅を設定（ボタンが小さくなるのを防ぐ）
    // width: "60px", // デフォルトの幅を設定
    height: "30px", // デフォルトの高さを設定
    borderRadius: "20px", // 必要に応じて角を丸く（高さの半分に設定）
    fontSize: "16px", // デフォルトのフォントサイズを指定
    backgroundColor: "#8AE2FF", // 背景色を指定
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)", // 通常時のドロップシャドウ
    transition: "box-shadow 0.3s ease", // なめらかな切り替え
    "&:hover": {
      boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.5)", // ホバー時のインナーシャドウ
    },
    "@media (min-width: 600px)": {
      width: "120px", // 画面幅が600px以上の場合の幅を120pxに設定
      height: "50px", // 画面幅が600px以上の場合の高さを50pxに設定
      fontSize: "18px", // 画面幅が600px以上の場合のフォントサイズを18pxに設定
      borderRadius: "25px", // 画面幅が600px以上の場合の角を丸く（高さの半分に設定）
    },
    "@media (min-width: 960px)": {
      width: "70px", // 画面幅が960px以上の場合の幅を150pxに設定
      height: "50px", // 画面幅が960px以上の場合の高さを60pxに設定
      fontSize: "30px", // 画面幅が960px以上の場合のフォントサイズを20pxに設定
      borderRadius: "30px", // 画面幅が960px以上の場合の角を丸く（高さの半分に設定）
    },
    "@media (max-width: 600px)": {
      top: 0,
      right: 0,
      bottom: 0,
      left: 7,
      width: "70px",
      height: "50px",
      fontSize: "30px",
      borderRadius: "30px",
    },
  },
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
          display: "flex",
          padding: 1,
        },
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        name="destination"
        placeholder="　目的地を入力"
        sx={styles.input}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={styles.button}
      >
        🔍
      </Button>
    </Box>
  );
};

export default InputLocation;
