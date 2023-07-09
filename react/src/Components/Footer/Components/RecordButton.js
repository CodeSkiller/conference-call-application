import React, { useState, useEffect, useCallback} from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { SvgIcon } from '../../SvgIcon';
import { Tooltip } from '@mui/material';
import { ConferenceContext } from 'pages/AntMedia';
import grabacion_iniciada from "../../../static/audio/grabacion-iniciada.mp3"
import grabacion_detenida from "../../../static/audio/grabacion-detenida.mp3"
import { useSnackbar } from "notistack";


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
    const [btnBlock, setBtnBlock] = useState(false);
    const [init, setInit] = useState(false);

    const { enqueueSnackbar } = useSnackbar();


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
    
    }, [conference.streamName]);

    const toggleRecording = async () => {
      if(btnBlock){
        enqueueSnackbar({
          message: "Espere un momento para iniciar o deneter la grabacion nuevamente.",
          variant: 'info',
          icon: <SvgIcon size={24} name={'video-record'} color="#fff" />
        }, {
          autoHideDuration: 1500,
        });
        return
      }
      setBtnBlock(true);
      setTimeout(()=>{setBtnBlock(false)}, 2000);
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

    useEffect(()=>{
      if(!init){setInit(true); return;}
      if(recording){
        let audio = new Audio(grabacion_iniciada);
        audio.volume = 1;
        audio.play();

        enqueueSnackbar({
          message: "Se ha iniciado la grabacion.",
          variant: 'info',
          icon: <SvgIcon size={24} name={'video-record'} color="#fff" />
        }, {
          autoHideDuration: 1500,
        });

      }else{
        let audio = new Audio(grabacion_detenida);
        audio.volume = 1;
        audio.play();

        enqueueSnackbar({
          message: "Se ha detenido la grabacion.",
          variant: 'info',
          icon: <SvgIcon size={24} name={'video-record'} color="#fff" />
        }, {
          autoHideDuration: 1500,
        });
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recording]);

    useEffect(() => {
      let intervalId = setInterval(()=>{checkIsRecording()}, 5000);
      return(() => {
          clearInterval(intervalId)
      })
  }, [checkIsRecording])

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
