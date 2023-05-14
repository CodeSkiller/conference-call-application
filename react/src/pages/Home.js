import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

function Home() {
  return (
    <>
      <Grid container justifyContent={"center"} sx={{ mt: 8 }}>
        <Box py={8}>
          <Typography variant="h1" align="center">
            CodewIO streaming :)
          </Typography>
        </Box>
      </Grid>
    </>
  );
}

export default Home;
