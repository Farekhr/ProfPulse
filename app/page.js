'use client'
import Image from "next/image";
import {useState} from "react";
import {Box, Stack, TextField, Button, Typography, createTheme, ThemeProvider} from '@mui/material';



export default function Home() {
  
  const theme = createTheme({
    typography: {

      fontWeightBold: 700,
      fontWeightLight: 70,

    },

  });
  
  return (
    <ThemeProvider theme={theme}>
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="primary.main"
    >
      <Stack
        direction={'column'}
        width="50%"
        height="90%"
        border="1px secondary.contrastText"
        p={2}
        spacing={3}
      > 
        <Box>
          <Box pb={8}><Typography variant="h1" color='white'  sx={{ fontWeight: 'fontWeightLight', flexGrow: 1, textAlign:'center'}} >
          ProfPulse
          </Typography></Box>
          <Box bgcolor="primary.light" borderRadius={5} pt={4} pb={4} pl={3} pr={3}>
            <Typography variant="h3" color='white' sx={{ flexGrow: 1, textAlign:'center', fontFamily: 'sans-serif'}}>Welcome to ProfPulse! </Typography>
            <Typography variant="h6" color='white' sx={{ flexGrow: 1, textAlign:'center', fontFamily: 'sans-serif'}}>ProfPulse is the best rate my professor app for finding and rating university professors based on real student experiences. Discover the best instructors, share your insights, and make informed decisions about your courses—all in one easy-to-use platform!</Typography>
          </Box> 
        </Box> 
        <Box pt={1} alignContent='center' alignItems='center' alignSelf='center' textAlign='center'><Button variant="contained" href="/result" color="secondary">Rate My Professor →</Button></Box>
      </Stack>
    </Box>
    </ThemeProvider>
  )
}

