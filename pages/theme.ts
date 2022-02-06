import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    red: {
      contrastText: "#fff",
      main: "#e9131d"
    },
    green: {
      contrastText: "#fff",
      main: "#1ed07b"
    },
    orange: {
      contrastText: "#fff",
      main: "#ffa500"
    },
    light_orange: {
      contrastText: "#fff",
      main: "#ffc079"
    },
    yellow: {
      contrastText: "#fff",
      main: "#fcbe00"
    },
    cyan: {
      contrastText: "#fff",
      main: "#2baed1"
    },
    purple: {
      contrastText: "#fff",
      main: "#c39bea"
    }
  },
});

export default theme;