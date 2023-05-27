import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { SvgIcon } from '../../SvgIcon';
import { useTranslation } from 'react-i18next';
import { ConferenceContext } from 'pages/AntMedia';
import CustomTooltip from 'Components/CustomToolTip';

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

function RaiseHand({ footer, ...props }) {
    const conference = React.useContext(ConferenceContext);
    const {t} = useTranslation();
    return (
            <CustomTooltip title={t('Levantar la mano')} placement="top">
                <CustomizedBtn
                    onClick={() => {
                        conference.handleRaiseHand()
                    }}
                    variant="contained"
                    className={footer ? 'footer-icon-button' : ''}
                    color={conference.raisedHand ? 'primary' : 'secondary'}
                >
                    <SvgIcon size={36} color={conference.raisedHand ? 'red' : 'white'} name={'hand'} />
                </CustomizedBtn>
            </CustomTooltip>
        );
}

export default RaiseHand;
