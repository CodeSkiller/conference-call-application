import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Routes, Route } from "react-router-dom";
import Error from "pages/Error";
import Home from "pages/Home";
import AntMedia from "pages/AntMedia";
import { getUrlParameter } from "@antmedia/webrtc_adaptor";
import { Grid, CircularProgress, Box } from "@mui/material";

function CustomRoutes(props) {
  const theme = useTheme();

  const [userName, setUserName] = useState();
  const [allowCamera, setAllowCamera] = useState(false);
  const [loading, setLoading] = useState(true);
  

  const mdlUsrId = getUrlParameter('user');
  const courseName = getUrlParameter('course');

  useEffect(()=>{

    if(!mdlUsrId || !courseName) return;
    setLoading(true)    
    fetch('https://gestion.veropo.com:5443/api/moodle/check_permissions?userid='+mdlUsrId+'&course='+courseName)
    .then(async response => {
      let res = await response.json();
      console.log(res)
      if (response.ok) {
          let usern = res.data.user
          setUserName(usern)
          res.data.roles.forEach(
            e => {
              if(e===3 || e===16){
                setAllowCamera(true)
                setUserName((usern+"QZh01"+courseName).replace(/\s/g, ''))
              }
            }
          );
      }else{
        setUserName("error")
      }
  })
  .catch(error => {
    console.log("eee", error)
    setUserName("error")
  }).finally(()=>{
    setLoading(false)
  });
  }, [mdlUsrId, courseName])



  return (
    <Grid container style={{ background: theme.palette.background }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={
          (loading ? <Grid
            container
            spacing={0}
            justifyContent="center"
          >
            <Box sx={{ display: 'flex' }}>
              <CircularProgress size="4rem" />
            </Box>
          </Grid> : (userName !== "error" ? 
          <AntMedia userName={userName} allowCamera={allowCamera} courseName={courseName} /> : 
          <Error />))
          } />
      </Routes>
    </Grid>
  );
}

export default CustomRoutes;
