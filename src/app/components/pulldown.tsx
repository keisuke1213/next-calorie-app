"use client";
import { useState } from "react";

interface PulldownProps {
  onChange?: (value: number) => void; // onChangeは任意プロパティ
  style?: React.CSSProperties;
}

const Pulldown: React.FC<PulldownProps> = ({ onChange }) => {
  const [selectedValue, setSelectedValue] = useState<number>(30);

  // 30から150までの整数リストを生成
  const options = Array.from({ length: 121 }, (_, i) => i + 30);

  // 選択時の処理
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(Number(event.target.value));
  };

  return (
      <select
        value={selectedValue}
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
