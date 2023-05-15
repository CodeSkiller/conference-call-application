import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { SvgIcon } from '../../SvgIcon';
import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
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
    const {t} = useTranslation();

    return (
            <Tooltip title={t('Iniciar grabacion')} placement="top">
                <CustomizedBtn
                    onClick={() => {
                      conference.handleRecord()
                    }}
                    variant="contained"
                    className={footer ? 'footer-icon-button' : ''}
                    color='secondary'
                >
                    <SvgIcon size={28} color='red' name={'video-record'} />
                </CustomizedBtn>
            </Tooltip>
        );
}

export default RecordButton;
