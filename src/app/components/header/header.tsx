import React, { FC } from "react";
import Grid from "@mui/material/Grid";
import InputLocation from "../header/InputLocation";
import Pulldown from "./pulldown";
import { Box } from "@mui/material";

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
          {/* Logo and Pulldown */}
          <Grid
            item
            xs={12}
            md={6}
            lg={3}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: {
                xs: "space-between", // xsの時にロゴとプルダウンを左右に配置
                md: "flex-start", // md以上の時に左揃え
              },
            }}
          >
            <div className="text-4xl font-bold text-center md:text-left ps-3">
              CALOCULATE
            </div>
            <Box
              sx={{
                display: {
                  xs: "block", // xsの時に表示
                  md: "none", // md以上の時に非表示
                },
              }}
            >
              <Pulldown
                onChange={pullDropdownChange}
                weight={weight}
                setWeight={setWeight}
                options={options}
              />
            </Box>
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

          {/* Pulldown for larger screens */}
          <Grid
            item
            xs={12}
            md={4}
            lg={1}
            sx={{
              display: {
                xs: "none", // xsの時に非表示
                md: "flex", // md以上の時に表示
              },
              justifyContent: {
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
            />
          </Grid>
        </Grid>
      </div>
    </header>
  );
};

export default Header;
