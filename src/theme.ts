// src/theme.ts
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#DF4425', // 🔴 červená farba
      contrastText: '#fff',
    },
    secondary: {
      main: '#c73a20', // tmavšia pre hover
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // žiadne CAPS
          borderRadius: 8,
        },
      },
    },
  },
})

export default theme
