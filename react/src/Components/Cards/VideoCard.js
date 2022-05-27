import React, { useCallback, useContext } from "react";
import { styled } from "@mui/material/styles";
import { MediaSettingsContext } from "pages/AntMedia";
import DummyCard from "./DummyCard";
import { Grid, Typography, useTheme, Box, Tooltip, Fab } from "@mui/material";
import { SvgIcon } from "../SvgIcon";

const CustomizedVideo = styled("video")({
  borderRadius: 4,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
  backgroundColor: "transparent",
});

const VideoCard = React.memo(({ srcObject, ...props }) => {
  const mediaSettings = useContext(MediaSettingsContext);

  const [displayHover, setDisplayHover] = React.useState(false);
  const theme = useTheme();

  const cardBtnStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green.10",
    width: {xs:'6vw',md:32},
    height: {xs:'6vw',md:32},
    borderRadius: "50%",
    position: "relative",
  };

  const refVideo = useCallback(
    (node) => {
      if (node && props.tracks) node.srcObject = new MediaStream(props.tracks);
    },
    [props.tracks]
  );

  let isOff = mediaSettings?.cam?.find(
    (c) => c.eventStreamId === props?.id && !c?.isCameraOn
  );
  const mic = mediaSettings?.mic?.find((m) => m.eventStreamId === props?.id);

  let isTalking = false;
 const isLocal = props?.id === "localVideo";
 const mirrorView = isLocal && !mediaSettings?.isScreenShared;

  return (
    <>
      <Grid
        container
        style={{ height: "100%", width: "100%", position: "relative" }}
        onMouseEnter={() => setDisplayHover(true)}
        onMouseLeave={(e) => setDisplayHover(false)}
      >
        {!isLocal && (
          <Grid
            container
            justifyContent={"center"}
            alignItems="center"
            sx={{
              opacity: displayHover ? 1 : 0,
              transition: "opacity 0.3s ease",
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              background: "#2929295c",
              zIndex: 1,
            }}
          >
            <Grid
              container
              justifyContent={"center"}
              alignItems="center"
              style={{ height: "100%" }}
              spacing={2}
            >
              <Grid item>
                <Tooltip
                  title={`${props.pinned ? "unpin" : "pin"} ${props.name}`}
                  placement="top"
                >
                  <Fab
                    onClick={props.onHandlePin}
                    color="primary"
                    aria-label="add"
                    size="small"
                  >
                    <SvgIcon
                      size={36}
                      name={props.pinned ? "unpin" : "pin"}
                      color={theme.palette.grey[80]}
                    />
                  </Fab>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        )}
        <div className={`single-video-card ${isTalking ? " is-talking " : ""}`}>
          <Grid
            sx={isOff ? {} : { display: "none" }}
            style={{ height: "100%" }}
            container
          >
            <DummyCard />
          </Grid>

          <Grid
            container
            sx={isOff ? { display: "none" } : {}}
            style={{ height: "100%",transform: mirrorView ? "rotateY(180deg)" :"none", }}
          >
            <CustomizedVideo
              {...props}
              ref={refVideo}
              playsInline
            ></CustomizedVideo>
          </Grid>

          {/* <div className="talking-indicator-light"></div> */}

          <Grid
            container
            className="video-card-btn-group"
            columnSpacing={1}
            direction="row-reverse"
            sx={{ position: "absolute", top: 0, left: 0, p: {xs:1,md:2}, zIndex: 9 }}
          >
            {mic && mic.isMicMuted && (
              <Tooltip title="mic is muted" placement="top">
                <Grid item>
                  <Box sx={cardBtnStyle}>
                    <SvgIcon
                      size={32}
                      name={"muted-microphone"}
                      color={theme.palette.grey[80]}
                    />
                  </Box>
                </Grid>
              </Tooltip>
            )}
            {/* <Grid item>
              <Box sx={cardBtnStyle}>
                <SvgIcon size={36} name={'voice-indicator'} color={theme.palette.grey[80]} />
              </Box>
            </Grid>
             */}
            {props.pinned && (
              <Tooltip title="pinned by you" placement="top">
                <Grid item>
                  <Box sx={cardBtnStyle}>
                    <SvgIcon
                      size={36}
                      name={"pin"}
                      color={theme.palette.grey[80]}
                    />
                  </Box>
                </Grid>
              </Tooltip>
            )}
          </Grid>
          {props.name && (
            <div className="name-indicator">
              <Typography
                color="white"
                align="left"
                className="name"
              >
                {props.name}
              </Typography>
            </div>
          )}
        </div>
      </Grid>
    </>
  );
});

export default VideoCard;