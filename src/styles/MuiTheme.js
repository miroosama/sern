import { createMuiTheme } from '@material-ui/core/styles';

export const muiTheme = createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        'a, p, h1, h2, h3, h4, h5, h6': {
          color: 'white',
          textDecoration: 'none',
          '&:hover': {
            color: 'white',
            textDecoration: 'none',
          }
        }
      }
    },
    MuiButton: {
    root: {
      color: 'white',
      '&&.Mui-disabled': {
        '& .geoMenuLabel': {
          color: 'white'
        },
        '& svg': {
          color: 'rgba(0,0,0,0)'
        }
      }
    },
  },
  MuiTypography: {
    h2: {
      color: 'white'
    }
  },
  MuiPaper: {
    root: {
      backgroundColor: 'rgb(10, 10, 50)',
      color: 'white',
    },
    elevation3: {
      boxShadow: '0 4px 8px 0 rgb(0 0 0 / 15%)'
    }
  },
}});
