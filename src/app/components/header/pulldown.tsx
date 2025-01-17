import React, { FC } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { styled } from "@mui/system";

type PulldownProps = {
  weight: number;
  setWeight: (weight: number) => void;
  options: number[];
  onChange: (value: number) => void;
};

const Pulldown: FC<PulldownProps> = ({ weight, setWeight, options }) => {
  const handleChange = (event: SelectChangeEvent<number>) => {
    setWeight(Number(event.target.value));
  };

  return (
    <FormControl variant="outlined" sx={{ mr: { xs: 2 } }}>
      <InputLabel
        style={{
          marginTop: "12px",
          marginLeft: "8px",
          padding: "0px",
          color: "black",
          fontSize: "17px",
          fontWeight: "bold",
        }}
        id="weight-select-label"
      >
        体重設定
      </InputLabel>
      <Select
        labelId="weight-select-label"
        value={weight}
        onChange={handleChange}
        label="Weight"
        sx={{
          width: 100,
          backgroundColor: "white",
          color: "black",
          fontSize: "24px",
        }}
      >
        {options.map((value) => (
          <MenuItem key={value} value={value}>
            {value}kg
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Pulldown;
//　プルダウンメニュー