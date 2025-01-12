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
    <Box component="form" action={handleSubmit} sx={styles.container}>
      <TextField
        fullWidth
        variant="outlined"
        name="origin"
        defaultValue={"現在地"}
        placeholder="出発地を入力"
        sx={styles.input}
      />

      <TextField
        fullWidth
        variant="outlined"
        name="destination"
        placeholder="目的地を入力"
        sx={styles.input}
      />

      <Button type="submit" variant="contained" color="primary">
        検索
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