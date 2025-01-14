import React, { useContext } from "react";
import {
  Grid,
  Typography,
  Button,
  Container,
  Tooltip,
} from "@mui/material";
import VideoCard from "Components/Cards/VideoCard";
import MicButton, {
  CustomizedBtn,
  roundStyle,
} from "Components/Footer/Components/MicButton";
import CameraButton from "Components/Footer/Components/CameraButton";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SettingsDialog } from "Components/Footer/Components/SettingsDialog";
import { SvgIcon } from "Components/SvgIcon";
import { useSnackbar } from "notistack";
import { ConferenceContext } from "./AntMedia";

function WaitingRoom() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectFocus, setSelectFocus] = React.useState(null);

  const roomName = id;
  
  const conference = useContext(ConferenceContext);
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    if(!conference.isPlayOnly &&conference.initialized) {
      conference.setLocalVideo(document.getElementById("localVideo"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conference.initialized]);

  function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  function joinRoom(e) {
    if (conference.localVideo === null && conference.isPlayOnly === false) {
      e.preventDefault();
      enqueueSnackbar(
        {
          message: "Tienes que dar permisos al microfono antes de entrar!",
          variant: "info",
          icon: <SvgIcon size={24} name={"muted-microphone"} color="#fff" />,
        },
        {
          autoHideDuration: 1500,
        }
      );
      //return;
    }
    var generatedStreamId = conference.streamName.replace(/[\W_]/g, "") + "_" + makeid(10);
    
    conference.joinRoom(roomName, generatedStreamId, conference.roomJoinMode);
    conference.setWaitingOrMeetingRoom("meeting");
  }
  const handleDialogOpen = (focus) => {
    setSelectFocus(focus);
    setDialogOpen(true);
  };
  const handleDialogClose = (value) => {
    setDialogOpen(false);
  };

  return (
        <Container>
          <SettingsDialog
              open={dialogOpen}
              onClose={handleDialogClose}
              selectFocus={selectFocus}
              handleBackgroundReplacement={conference.handleBackgroundReplacement}
          />

          <Grid
              container
              spacing={4}
              justifyContent="space-between"
              alignItems={"center"}
          >

            { conference.isPlayOnly === false ?
            <Grid item md={7} alignSelf="stretch">
              <Grid
                  container
                  className="waiting-room-video"
                  sx={{position: "relative"}}
              >
                <VideoCard id="localVideo" autoPlay muted/>

                <Grid
                    container
                    columnSpacing={2}
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      p: 2,
                      zIndex: 10,
                    }}
                >
 
                    { conference.allowCamera &&
                      <Grid item>
                        <CameraButton rounded/>
                      </Grid>
                    }
                  
                  
                  <Grid item>
                    <MicButton rounded/>
                  </Grid>
                  <Grid item sx={{position: "absolute", bottom: 16, right: 16}}>
                    <Tooltip title={t("More options")} placement="top">
                      <CustomizedBtn
                          variant="contained"
                          color="secondary"
                          sx={roundStyle}
                          onClick={() => handleDialogOpen()}
                      >
                        <SvgIcon size={40} name={"settings"} color={"white"}/>
                      </CustomizedBtn>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Grid>
              <Typography align="center" sx={{mt: 2}}>
              Puede elegir activar su {conference.allowCamera && "cámara y"} micrófono antes de entrar a la sala
              </Typography>
            </Grid>
            : null}

            <Grid item md={conference.isPlayOnly === false ? 4 : 12}>
              <Grid container justifyContent={"center"}>
                <Grid container justifyContent={"center"}>
                  <Typography variant="h5" align="center">
                    Hola, {conference.streamName.split("QZh01")[0]}
                  </Typography>
                </Grid>
                <Grid
                    container
                    justifyContent={"center"}
                    sx={{mt: {xs: 1, md: 2.5}}}
                >
                  <Typography
                      variant="h6"
                      align="center"
                      fontWeight={"400"}
                      style={{fontSize: 18}}
                  >
                    Gracias por acudir a la clase de hoy en directo!
                    <br/>
                    <br/>
                    Avisarte que la clase va a ser grabada. Gracias.
                  </Typography>
                </Grid>

                <form
                    onSubmit={(e) => {
                      joinRoom(e);
                    }}
                >
                  <Grid item xs={12} sx={{mt: 3, mb: 4}}>
                  <Typography
                      variant="h6"
                      align="center"
                      fontWeight={"400"}
                      style={{fontSize: 18}}
                  >
                  </Typography>
                    
                  </Grid>
                  <Grid container justifyContent={"center"}>
                    <Grid item sm={6} xs={12}>
                      <Button
                          fullWidth
                          color="secondary"
                          variant="contained"
                          type="submit"
                          id="room_join_button"
                      >
                        Entrar a la sala
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
            </Grid>
          </Grid>
        </Container>
    );
}

export default WaitingRoom;
