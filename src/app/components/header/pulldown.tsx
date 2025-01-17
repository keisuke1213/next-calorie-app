"use client";
import { useState } from "react";
import { FC } from "react";
import { CSSProperties } from "react";

interface PulldownProps {
  onChange?: (value: number) => void; // onChangeは任意プロパティ
  style?: React.CSSProperties;
  weight?: number;
  setWeight: (weight: number) => void;
  options: number[];
}

const Pulldown: FC<PulldownProps> = ({ weight, setWeight, options }) => {
  // 30から150までの整数リストを生成

  // 選択時の処理
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setWeight(Number(event.target.value));
  };

  const styles: { [key: string]: CSSProperties } = {
    pull: {
      fontFamily: "Arial, sans-serif",
      color: "black",
      padding: "7px",
      fontSize: "32px",
      border: "1px solid rgb(120, 120, 120)",
      borderRadius: "10px",
      zIndex: 1,
      "@media (maxWidth: 600px)": {
        fontFamily: "Arial, sans-serif",
        top: 120,
        left: -80,
        right: 60,
        bottom: 0,
        color: "black",
        padding: "4px",
        fontSize: "22px",
        border: "1px solid rgb(120, 120, 120)",
        borderRadius: "10px",
        position: "relative",
        zIndex: 1,
      },
    } as CSSProperties,
  };

  return (
    <select value={weight} onChange={handleChange} style={styles.pull}>
      {options.map((value) => (
        <option key={value} value={value}>
          {value}kg
        </option>
      ))}
    </select>
  );
};

export default Pulldown;
