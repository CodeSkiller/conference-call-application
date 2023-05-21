/* eslint-disable react-hooks/exhaustive-deps */
import VideoCard from "Components/Cards/VideoCard";
import React, { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Footer from "Components/Footer/Footer";
import { alpha, styled } from "@mui/material/styles";
import { ConferenceContext } from "./AntMedia";
import { SvgIcon } from "Components/SvgIcon"
import { Grid, Box, Typography, Tooltip } from "@mui/material";
import NoTransmission from "Components/Cards/NoTransmission";


const CustomizedBox = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.gray[90], 0.5),
}));

const cardBtnStyle = {
  display: "flex",
  justifyContent: "center",
  height: { xs: "2vw", md: "2vw" },
  borderRadius: "20%",
  position: "relative",
  paddingRight: "1em",
  
};

const CustomizedAvatar = styled(Avatar)(({ theme }) => ({
  border: `3px solid ${theme.palette.green[85]} !important`,
  color: "#fff",
  width: 44,
  height: 44,
  [theme.breakpoints.down("md")]: {
    width: 34,
    height: 34,
    fontSize: 16,
  },
}));

const CustomizedAvatarGroup = styled(AvatarGroup)(({ theme }) => ({
  "& div:not(.regular-avatar)": {
    border: `3px solid ${theme.palette.green[85]} !important`,
    backgroundColor: theme.palette.green[80],
    color: "#fff",
    width: 44,
    height: 44,
    [theme.breakpoints.down("md")]: {
      width: 34,
      height: 34,
      fontSize: 14,
    },
  },
}));

function debounce(fn, ms) {
  let timer;
  return (_) => {
    clearTimeout(timer);
    timer = setTimeout((_) => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}

function calculateLayout(
  containerWidth,
  containerHeight,
  videoCount,
  aspectRatio
) {
  let bestLayout = {
    area: 0,
    cols: 0,
    rows: 0,
    width: 0,
    height: 0,
  };
  // brute-force search layout where video occupy the largest area of the container
  for (let cols = 1; cols <= videoCount; cols++) {
    const rows = Math.ceil(videoCount / cols);
    const hScale = containerWidth / (cols * aspectRatio);
    const vScale = containerHeight / rows;
    let width;
    let height;
    if (hScale <= vScale) {
      width = Math.floor(containerWidth / cols);
      height = Math.floor(width / aspectRatio);
    } else {
      height = Math.floor(containerHeight / rows);
      width = Math.floor(height * aspectRatio);
    }
    const area = width * height;
    if (area > bestLayout.area) {
      bestLayout = {
        area,
        width,
        height,
        rows,
        cols,
      };
    }
  }
  return bestLayout;
}

const MeetingRoom = React.memo((props) => {
  const conference = React.useContext(ConferenceContext);

  const allParticipantsExceptLocal = conference.allParticipants.filter(
      (p) => p.streamId !== conference.publishStreamId
  );

  const filterAndSortOthersTile = (all, showing) => {
    const participantIds = showing.map(({id}) => id);
    const othersIds = all.filter((p) => !participantIds.includes(p.streamId));
    return othersIds.sort((a, b) => a.streamName.localeCompare(b.streamName));
  };

  useEffect(() => {
    let localVid = document.getElementById("localVideo");
    if (localVid) {
      conference.setLocalVideo(document.getElementById("localVideo"));
    }
  }, [conference.host]);

  function handleGalleryResize(calcDrawer) {
    const gallery = document.getElementById("meeting-gallery");

    if (calcDrawer) {
      if (conference.messageDrawerOpen || conference.participantListDrawerOpen) {
        gallery.classList.add("drawer-open");
      } else {
        gallery.classList.remove("drawer-open");
      }
    }
    const aspectRatio = 16 / 9;
    const screenWidth = gallery.getBoundingClientRect().width;

    const screenHeight = gallery.getBoundingClientRect().height;
    const videoCount = document.querySelectorAll(
        "#meeting-gallery .single-video-container.not-pinned"
    ).length;

    const {width, height, cols} = calculateLayout(
        screenWidth,
        screenHeight,
        videoCount,
        aspectRatio
    );

    let Width = width - 8;
    let Height = height - 8;

    gallery.style.setProperty("--width", `calc(100% / ${cols})`);
    gallery.style.setProperty("--maxwidth", Width + "px");
    gallery.style.setProperty("--height", Height + "px");
    gallery.style.setProperty("--cols", cols + "");
  }



  React.useEffect(() => {
    handleGalleryResize(false);
  }, [conference.participants, conference.host]);

  React.useEffect(() => {
    handleGalleryResize(true);
  }, [conference.messageDrawerOpen, conference.participantListDrawerOpen]);

  React.useEffect(() => {
    const debouncedHandleResize = debounce(handleGalleryResize, 500);
    window.addEventListener("resize", debouncedHandleResize);

    return (_) => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });
  

  const getUnpinnedParticipants = () => {
    const array = [
      conference.pinnedVideoId !== "localVideo" && {id: "localVideo"},
      ...conference.allParticipants.filter((v) => v.id !== conference.pinnedVideoId),
    ];
    const filtered = array.filter(Boolean);
    return filtered;
  };

  const OthersTile = (maxGroup, othersArray = []) => {
    let others = [];
    if (othersArray?.length > 0) {
      others = othersArray;
    } else {
      others = filterAndSortOthersTile(
          allParticipantsExceptLocal,
          conference.participants
      );
    }

    return (
        <div className="others-tile-inner">
          <CustomizedAvatarGroup max={maxGroup} sx={{justifyContent: "center"}}>
            {others.map(({name, streamName}, index) => {
              let username = name || streamName;
              if (username?.length > 0) {
                const nameArr = username.split(" ");
                const secondLetter = nameArr.length > 1 ? nameArr[1][0] : "";
                const initials =
                    `${nameArr[0][0]}${secondLetter}`.toLocaleUpperCase();

                return (
                    <CustomizedAvatar
                        key={index}
                        alt={username}
                        className="regular-avatar"
                        sx={{
                          bgcolor: "green.50",
                          color: "#fff",
                          fontSize: {xs: 16, md: 22},
                        }}
                    >
                      {initials}
                    </CustomizedAvatar>
                );
              } else {
                return null;
              }
            })}
          </CustomizedAvatarGroup>
          <Typography sx={{mt: 2, color: "#ffffff"}}>
            {others.length} other{others.length > 1 ? "s" : ""}
          </Typography>
        </div>
    );
  };

  const returnListGallery = () => {
    const r = <div className="unpinned">
      {conference.allParticipants.filter(p=>!p.streamId.includes("H0s999") && conference.talkers.includes(p.streamId)).map((e, index)=>{
        return <div className="" key={"lg"+index}>
              <Tooltip 
                title={
                  "Hablando.."+(conference.allowCamera ? "Si hace click, lo silenciara": "")
                } 
                placement="top" 
                onClick={()=>conference.turnOffYourMicNotification(e.streamId)}
              >
                <Grid item>
                  <CustomizedBox sx={cardBtnStyle} variant="contained">
                  <Grid container direction="row" alignItems="center">
                    <Grid item>
                      <SvgIcon size={"36px"} name={"microphone"} color="#fff" />
                    </Grid>
                    <Grid item>
                      <span style={{"color": "#fff"}}>{e.streamName}</span>
                    </Grid>
                  </Grid>
                  </CustomizedBox>
                </Grid>
              </Tooltip>
        </div>
    })}
  </div>
    return r 
  }
  
  const returnHandsRaised = () => {
    const r = <div className="">
      {conference.handsUp.map((e, index)=>{
        return <div className="" key={"hr"+index}>
              <Tooltip title={e+", ha levantado la mano."} placement="top" onClick={()=>conference.handleDownHand(e)}>
                <Grid item>
                  <CustomizedBox sx={cardBtnStyle} variant="contained">
                  <Grid container direction="row" alignItems="center">
                    <Grid item>
                      <SvgIcon size={"42px"} name={"hand"} color="#fff" />
                    </Grid>
                    <Grid item>
                      <span style={{"color": "#fff"}}>{e}</span>
                    </Grid>
                  </Grid>
                  </CustomizedBox>
                </Grid>
              </Tooltip>
        </div>
    })}
  </div>
    return r 
  }

  const returnUnpinnedGallery = () => {
    //pinned tile
    let unpinnedParticipants = getUnpinnedParticipants();
    const showAsOthersLimitPinned = 5;
    const showAsOthersSliceIndexPinned = showAsOthersLimitPinned - 2;

    const slicePinnedTiles =
        unpinnedParticipants.length + 1 > showAsOthersLimitPinned;

    let slicedParticipants = [];
    if (slicePinnedTiles) {
      slicedParticipants = unpinnedParticipants.slice(
          0,
          showAsOthersSliceIndexPinned
      );
      unpinnedParticipants = unpinnedParticipants.slice(
          showAsOthersSliceIndexPinned
      );
    } else {
      slicedParticipants = unpinnedParticipants;
    }
    return slicedParticipants.length > 0 ? (
        <>
          {slicedParticipants.map(({id, videoLabel, track, name}, index) => {
            if (id !== "localVideo") {
              return (
                  <div className="unpinned" key={index}>
                    <div className="single-video-container">
                      <VideoCard
                          onHandlePin={() => {
                            conference.pinVideo(id, videoLabel);
                          }}
                          id={id}
                          track={track}
                          autoPlay
                          name={name?.replace("H0s999", "")}
                      />
                    </div>
                  </div>
              );
            } else if (conference.isPlayOnly === false) {
              return (
                  <div className="unpinned">
                    <div className="single-video-container pinned keep-ratio" key={index}>
                      <VideoCard
                          onHandlePin={() => {
                            conference.pinVideo("localVideo", "localVideo");
                          }}
                          id="localVideo"
                          autoPlay
                          name="Tu"
                          muted
                      />
                    </div>
                  </div>
              );
            } else {
              return null;
            }
          })}
          {sliceTiles ? (
              <div className="unpinned">
                <div className="single-video-container  others-tile-wrapper">
                  {OthersTile(2)}
                </div>
              </div>
          ) : (
              slicePinnedTiles && (
                  <div className="unpinned">
                    <div className="single-video-container  others-tile-wrapper">
                      {OthersTile(2, unpinnedParticipants)}
                    </div>
                  </div>
              )
          )}
        </>
    ) : (
        <Typography variant="body2" sx={{color: "green.50", mt: 3}}>
          No hay nadie mas en la sala.
        </Typography>
    );
  };

  //main tile other limit set, max count
  const showAsOthersLimit = conference.globals.maxVideoTrackCount + 1; // the total video cards i want to see on screen including my local video card and excluding the others tile. if this is set to 2, user will see 3 people and 1 "others card" totaling to 4 cards and 2x2 grid.
  //with 2 active video participants + 1 me + 1 card
  const sliceTiles = allParticipantsExceptLocal.length + 1 > showAsOthersLimit; //plus 1 is me

  const pinLayout = true;

  const conferenceHost = conference.participants.find((v) => v.id === conference.host);

  return (
        <>
          <div>
            {conference.audioTracks.map((audio, index) => (
                <VideoCard
                    key={index}
                    onHandlePin={() => {
                    }}
                    id={audio.streamId}
                    track={audio.track}
                    autoPlay
                    name={""}
                    style={{display: "none"}}
                />
            ))}
            <div id="meeting-gallery" style={{height: "calc(100vh - 80px)"}}>
              
              {pinLayout && (
                  <>
                    {conference.allowCamera ? (
                        <div className="single-video-container pinned keep-ratio">
                          <VideoCard
                              id="localVideo"
                              autoPlay
                              name="Tu"
                              muted
                              pinned
                          />
                        </div>
                    ) : (
                      conferenceHost ? (
                            <div className="single-video-container">
                              <VideoCard
                                  id={conferenceHost?.id}
                                  track={conferenceHost.track}
                                  autoPlay
                                  name={conferenceHost.name?.replace("H0s999", "")}
                                  pinned
                                  noTransmission={true}
                              />
                            </div>
                        ):(
                          <div className="single-video-container">
                            <Grid
                              sx={{}}
                              style={{ height: "100%" }}
                              container
                            >
                              <NoTransmission />
                            </Grid>
                          </div>
                      )
                    )}
                    <div id="somewhere-else" style={{"display": "none"}}>{returnUnpinnedGallery()}</div>
                    <div style={{"position": "fixed", "top":"15px", "left":"15px"}}>{returnListGallery()}</div>
                    <div style={{"position": "fixed", "top":"15px", "right":"15px"}}>{returnHandsRaised()}</div>

                  </>
              )}
            </div>
            <Footer {...props}/>
          </div>
        </>
    )
});

export default MeetingRoom;
