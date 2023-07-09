import React from "react";
import { Grid, CircularProgress, Box } from "@mui/material";
import { ConferenceContext } from 'pages/AntMedia';

function NoTransmission({msg, loading}) {
  const conference = React.useContext(ConferenceContext);

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
        <img src="https://campus.veropo.com/pluginfile.php/1/theme_remui/logo/1684153043/Logo_Veropo.png" width={"240px"} alt="No transmission yet."/>
        <br/><br/>
        {
          conference.host? 
          <>
            {msg??""}
            {loading && <Grid
                container
                spacing={0}
                justifyContent="center"
              >
                <Box sx={{ display: 'flex' }}>
                  <CircularProgress size="4rem" />
                </Box>
              </Grid> }
          </> : (conference.allParticipants.length>0 ? <> Parece que el profesor aun no ha iniciado la clase.</> : <>Parece que no hay nadie mas en la sala.</>)
        }
      </Grid>
    </Grid>
  );
}

export default NoTransmission;
