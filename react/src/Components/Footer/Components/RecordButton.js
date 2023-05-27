import React, { useState, useEffect, useCallback} from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { SvgIcon } from '../../SvgIcon';
import { Tooltip } from '@mui/material';
import { ConferenceContext } from 'pages/AntMedia';

const CustomizedBtn = styled(Button)(({ theme }) => ({
  '&.footer-icon-button':{
    height: '100%',
    [theme.breakpoints.down('sm')]:{
      padding: 8,
      minWidth: 'unset',
      width: '100%',
      '& > svg': {
        width: 36
      },
    },
  }
}));


function RecordButton({ footer, ...props }) {
    const conference = React.useContext(ConferenceContext);
    const [recording, setRecording] = useState(false)

    const checkIsRecording = useCallback(() => {
      fetch('https://gestion.veropo.com:5443/api/check_recording?stream_id='+conference.streamName)
      .then(async response => {
        await response.json();
        if (!response.ok) {
            setRecording(false)
        }else{
          setRecording(true)
        }
    })
    .catch(error => {
        setRecording(false);
        console.error('There was an error!', error);
    });
    
    },[conference.streamName])

    const toggleRecording = async () => {
      fetch("https://gestion.veropo.com:5443/api/record_video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: !recording,
          stream_id: conference.publishStreamId
        }),
      }).then((response)=>{
        if (response.ok) {
          setRecording(!recording)
      }
      });
    }

    useEffect(() => {
      let intervalId = setInterval(checkIsRecording, 5000)
      return(() => {
          clearInterval(intervalId)
      })
  },[checkIsRecording])
    return (
            <Tooltip title={(!recording ? "Inciar" : "Detener")+' grabacion'} placement="top">
                <CustomizedBtn
                    onClick={() => {
                      toggleRecording()
                    }}
                    variant="contained"
                    className={footer ? 'footer-icon-button' : ''}
                    color={recording?'primary':'secondary'}
                >
                    <SvgIcon size={28} color={recording?'red':'white'} name={'video-record'} />
                </CustomizedBtn>
            </Tooltip>
        );
}

export default RecordButton;
