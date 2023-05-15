import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import styled from "@mui/material/styles/styled";
import InfoButton from "./Components/InfoButton";
import MicButton from "./Components/MicButton";
import CameraButton from "./Components/CameraButton";
import OptionButton from "./Components/OptionButton";
import ShareScreenButton from "./Components/ShareScreenButton";
import MessageButton from "./Components/MessageButton";
import ParticipantListButton from "./Components/ParticipantListButton";
import EndCallButton from "./Components/EndCallButton";
import TimeZone from "./Components/TimeZone";
import { useParams } from "react-router-dom";
import { ConferenceContext } from 'pages/AntMedia';
import ReconnectButton from './Components/ReconnectButton';
import RecordButton from './Components/RecordButton';
import RaiseHand from './Components/RaiseHand';
import FullScreenButton from "./Components/FullScreenButton"

const CustomizedGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: "transparent",
  position: "absolute",
  bottom: 0,
  left: 0,
  padding: 16,
  width: "100%",
  zIndex: 2,
  height: 80,
}));
function Footer(props) {
  const { id } = useParams();
  const conference = React.useContext(ConferenceContext);
    return (
        <CustomizedGrid
            container
            alignItems={"center"}
            justifyContent={{xs: "center", sm: "space-between"}}
        >
          <Grid item sx={{display: {xs: "none", sm: "block"}}}>
            <Grid container  id="levitate-info" alignItems={"center"}>
              <InfoButton/> 
              <Typography variant="body1">
                Sala: {id}
              </Typography>
            </Grid>
          </Grid>
              <Grid item>
                <Grid
                    container
                    justifyContent="center"
                    columnSpacing={{xs: 1, sm: 2}}
                >
                  <Grid item xs={0}>
                    <OptionButton footer/>
                  </Grid>

                  {conference.allowCamera && conference.isPlayOnly === false ?
                  <Grid item xs={0}>
                    <CameraButton {...props} footer/>
                  </Grid>
                    : null}

                  {conference.isPlayOnly === false ?
                  <Grid item xs={0}>
                    <MicButton footer/>
                  </Grid>
                      : null}

                  {conference.allowCamera && conference.isPlayOnly === false ?
                  <Grid item xs={0}>
                    {" "}
                    <ShareScreenButton footer/>
                  </Grid>
                      : null}

                  <Grid item xs={0}>
                    <MessageButton footer/>
                  </Grid>
                  <Grid item xs={0}>
                      <ParticipantListButton footer />
                  </Grid>
                  <Grid item xs={0}>
                    <EndCallButton footer/>
                  </Grid>
                  {false && process.env.NODE_ENV === "development"
                    ?
                    <Grid item xs={0}>
                      <ReconnectButton footer/>
                    </Grid>
                    : null
                  }
                  {conference.allowCamera
                    ?
                    <Grid item xs={0}>
                      <RecordButton footer/>
                    </Grid>
                    : 
                    <Grid item xs={0}>
                      <RaiseHand footer/>
                    </Grid>
                  }
                  <Grid item xd={0}>
                    <FullScreenButton footer/>
                  </Grid>
                </Grid>
              </Grid>

          <Grid item sx={{display: {xs: "none", sm: "block"}}}>
            <TimeZone/>
          </Grid>
        </CustomizedGrid>
    );
}

export default Footer;
