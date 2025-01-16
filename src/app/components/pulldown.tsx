"use client";
import { useState } from "react";
import { FC } from "react";

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

  return (
    <select
      value={weight}
      onChange={handleChange}
      style={{
        fontFamily: "Arial, sans-serif",
        color: "black",
        padding: "7px",
        fontSize: "32px",
        border: "1px solid rgb(120, 120, 120)",
        borderRadius: "10px",
        position: "relative",
        top: "-68px",
        left: "1200px",
        zIndex: 1,
      }}
    >
      {options.map((value) => (
        <option key={value} value={value}>
          {value}kg
        </option>
      ))}
    </select>
  );
};

export default Pulldown;
