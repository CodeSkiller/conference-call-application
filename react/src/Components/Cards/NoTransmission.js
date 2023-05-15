import React from "react";
import { Grid } from "@mui/material";
function NoTransmission() {
  return (
    <Grid
      container
      style={{
        borderRadius: 4,
        height: "100%",
      }}
      justifyContent="center"
      alignItems={"center"}
    >
      <Grid  style={{
        backgroundColor: "white",
        borderRadius: "4%",
        padding: "40px",
      }}>
        <img src="https://campus.veropo.com/pluginfile.php/1/theme_remui/logo/1684153043/Logo_Veropo.png" width={"240px"} />
      </Grid>
    </Grid>
  );
}

export default NoTransmission;
