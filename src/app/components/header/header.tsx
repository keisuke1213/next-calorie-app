import React, { FC } from "react";
import Grid from "@mui/material/Grid";
import InputLocation from "./InputLocation";
import Pulldown from "./pulldown";

type HeaderProps = {
  weight: number;
  setWeight: (value: number) => void;
  options: number[];
  getLocationProps: {
    originCoords: { latitude: number; longitude: number } | null;
    handleSubmit: (formData: FormData) => Promise<void>;
  };
};

const Header: FC<HeaderProps> = ({
  weight,
  setWeight,
  options,
  getLocationProps,
}) => {
  const pullDropdownChange = (value: number) => {
    setWeight(value);
  };

  return (
    <header className="bg-[#EF7042] text-white mt-2">
      <div className="container mx-auto flex items-center h-full py-4">
        <Grid container spacing={2} alignItems="center">
          {/* Logo */}
          <Grid item xs={12} md={6} lg={3}>
            <div className="text-5xl font-bold text-center md:text-left">
              CALOCOT
            </div>
          </Grid>

          {/* InputLocation */}
          <Grid
            item
            xs={12}
            md={8}
            lg={7}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <InputLocation {...getLocationProps} />
          </Grid>

          {/* Pulldown */}
          <Grid
            item
            xs={12}
            md={4}
            lg={1}
            sx={{
              display: "flex",
              justifyContent: {
                xs: "flex-end", // xsの時に右端に配置
                md: "center", // md以上の時に中央に配置
              },
              mx: "auto",
              px: "auto",
            }}
          >
            <Pulldown
              onChange={pullDropdownChange}
              weight={weight}
              setWeight={setWeight}
              options={options}
              style={{ width: "100%" }}
            />
          </Grid>
        </Grid>
      </div>
    </header>
  );
};

export default Header;
