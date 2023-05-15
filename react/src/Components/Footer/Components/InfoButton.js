import React from 'react';
import Button from '@mui/material/Button';
import { SvgIcon } from 'Components/SvgIcon';
import { styled } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { ListItemText, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ConferenceContext } from 'pages/AntMedia';

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  '& .MuiListItemText-primary': {
    fontSize: 14,
  },
}));
const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  cursor: 'default',
  padding:'8px 12px',
  paddingTop: 4
}));

function InfoButton(props) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const conference = React.useContext(ConferenceContext);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getResolution = () => {
      // Sometimes, it takes some time to get the video track. So, we have to try catch it.
    try {
        const {width, height} = document.getElementById('localVideo').srcObject.getVideoTracks()[0].getSettings();
        return width + ' x ' + height;
    } catch (e) {
        return "";
    }
  }

  return (
        <>
          <Tooltip title={t('Info')} placement="top">
            <Button
                id="info-button"
                variant="text"
                aria-controls={open ? 'info-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{ml: 0.5, px: 1, py: 1.5, minWidth: 'unset'}}
            >
              <SvgIcon size={20} name={'info'} viewBox="0 0 500 500" />
            </Button>
          </Tooltip>
          <Menu
              id="info-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
                sx: {bgcolor: 'gray.90', minWidth: 275},
              }}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
          >

              {conference.allowCamera && conference.isPlayOnly === false ?
            <Typography variant="body2" sx={{px: 1.5, py: 0.5, fontSize: 14, fontWeight: 700}} color="#fff">
              {t('Resolution')}
            </Typography>
                  :
                  <Typography variant="body2" sx={{px: 1.5, py: 0.5, fontSize: 14, fontWeight: 700}} color="#fff">
                      {t('You are in play only mode')}
                  </Typography>}

              {conference.isPlayOnly === false ?
            <StyledMenuItem>
              <StyledListItemText>{getResolution()}</StyledListItemText>
            </StyledMenuItem>
                    : null}

          </Menu>
        </>
    );
}

export default InfoButton;
