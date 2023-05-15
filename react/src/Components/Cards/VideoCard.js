import React, { memo, useCallback, useContext, useEffect } from "react";
import { alpha, styled } from "@mui/material/styles";
import { ConferenceContext } from "pages/AntMedia";
import DummyCard from "./DummyCard";
import { Grid, Typography, useTheme, Box, Tooltip } from "@mui/material";
import { SvgIcon } from "../SvgIcon";
import { useTranslation } from "react-i18next";
import NoTransmission from "./NoTransmission";

const CustomizedVideo = styled("video")({
  borderRadius: 4,
  width: "100%",
  height: "100%",
  objectPosition: "center",
  backgroundColor: "transparent",
});
const CustomizedBox = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.gray[90], 0.4),
}));

const VideoCard = memo(({ srcObject, hidePin, onHandlePin, ...props }) => {
  const conference = useContext(ConferenceContext);

  const { t } = useTranslation();
  const theme = useTheme();

  const cardBtnStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: { xs: "3vw", md: "3vw" },
    height: { xs: "3vw", md: "3vw" },
    borderRadius: "50%",
    position: "relative",
  };

  const refVideo = useCallback(
    (node) => {
      if (node && props.track) {
        node.srcObject = new MediaStream([props.track]);
      }
    },
    [props.track]
  );

  React.useEffect(() => {
    if (props.track?.kind === "video" && !props.track.onended) {
      props.track.onended = (event) => {
        conference?.globals?.trackEvents.push({track:props.track.id,event:"removed"});
        if (conference.participants.length > conference?.globals?.maxVideoTrackCount) {
          console.log("video before:"+JSON.stringify(conference.participants));
          conference.setParticipants((oldParts) => {
            return oldParts.filter(
              (p) => !(p.id === props.id || p.videoLabel === props.id)
            );
          });
          console.log("video after:"+JSON.stringify(conference.participants));

        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.track]);

  let isOff = conference?.cam?.find(
    (c) => c.eventStreamId === props?.id && !c?.isCameraOn
  );

  // if i sharing my screen.
  if (
    conference.isScreenShared === true &&
    props?.id === "localVideo" &&
    conference?.cam.find(
      (c) => c.eventStreamId === "localVideo" && c.isCameraOn === false
    )
  ) {
    isOff = false;
  }
  // screenSharedVideoId is the id of the screen share video.
  if (
    conference.screenSharedVideoId === props?.id &&
    conference?.cam.find(
      (c) => c.eventStreamId === props?.id && c.isCameraOn === false
    )
  ) {
    isOff = false;
  }
  const mic = conference?.mic?.find((m) => m.eventStreamId === props?.id);

  const [isTalking, setIsTalking] = React.useState(false);
  const timeoutRef = React.useRef(null);

  const isLocal = props?.id === "localVideo";
  const mirrorView = isLocal && !conference?.isScreenShared;
  const isScreenSharing =
    conference?.isScreenShared ||
    conference?.screenSharedVideoId === props?.id;
  //conference?.isScreenShared means am i sharing my screen
  //conference?.screenSharedVideoId === props?.id means is someone else sharing their screen
  useEffect(() => {
    if (isLocal && conference.isPublished && !conference.isPlayOnly) {
      conference.setAudioLevelListener((value) => {
        // sounds under 0.01 are probably background noise
        if (value >= 0.01) {
          if (isTalking === false) setIsTalking(true);
          clearInterval(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            setIsTalking(false);
          }, 1000);
          conference.updateAudioLevel(
            Math.floor(value * 100)
          );
        }
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conference.isPublished]);

  return isLocal || props.track?.kind !== "audio" ? (
    <>
      <Grid
        container
        style={{
          height: "100%",
          width: "100%",
          position: "relative",
        }}
      >



        <div
          className={`single-video-card`}
          // style={{
          //   ...(isTalking || conference.talkers.includes(props.id) ? {
          //     outline: `thick solid ${theme.palette.primary.main}`,
          //     borderRadius: '10px'
          //   } : {})
          // }}
        >
          <Grid
            sx={isOff ? {} : { display: "none" }}
            style={{ height: "100%" }}
            container
          >
            {props.noTransmission ? <NoTransmission /> : <DummyCard />}
            
          </Grid>

          <Grid
            container
            sx={isOff ? { display: "none" } : {}}
            style={{
              height: "100%",
              transform: mirrorView ? "rotateY(180deg)" : "none",
            }}
          >
            <CustomizedVideo
              {...props}
              ref={refVideo}
              playsInline
            ></CustomizedVideo>
          </Grid>

          <div
            className="talking-indicator-light"
            style={{
              ...(isTalking || conference.talkers.includes(props.id)
                ? {}
                : { display: "none" }),
            }}
          ></div>

          <Grid
            container
            className="video-card-btn-group"
            columnSpacing={1}
            direction="row-reverse"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              p: { xs: 1, md: 2 },
              zIndex: 9,
            }}
          >
            {mic && mic.isMicMuted && (
              <Tooltip title={t("mic is muted")} placement="top">
                <Grid item>
                  <CustomizedBox sx={cardBtnStyle}>
                    <SvgIcon size={32} name={"muted-microphone"} color="#fff" />
                  </CustomizedBox>
                </Grid>
              </Tooltip>
            )}
            {/* <Grid item>
              <Box sx={cardBtnStyle}>
                <SvgIcon size={36} name={'voice-indicator'} color={theme.palette.grey[80]} />
              </Box>
            </Grid>
             */}
          </Grid>
          {props.name && (
            <div className="name-indicator">
              <Typography color="white" align="left" className="name">
                {props.name}{" "}
                {process.env.NODE_ENV === "development"
                  ? `${
                      isLocal
                        ? conference.publishStreamId +
                          " " +
                          props.id +
                          " " +
                          conference.streamName
                        : props.id + " " + props.track?.id
                    }`
                  : ""}
              </Typography>
            </div>
          )}
        </div>
      </Grid>
    </>
  ) : (
    <>
      <video
        style={{ display: "none" }}
        {...props}
        ref={refVideo}
        playsInline
      ></video>
    </>
  );
});

export default VideoCard;
