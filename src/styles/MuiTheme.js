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
      '&:hover': {
        backgroundColor: 'rgb(50, 50, 50, 0.5)',
      },
      color: 'white',
    },
  },
  MuiTypography: {
    h4: {
      color: 'white'
    },
    h5: {
      color: 'white'
    },
    h6: {
      color: 'white'
    }
  },
  MuiPaper: {
    root: {
      backgroundColor: 'rgb(0, 0, 0)',
      color: 'white',
    },
    elevation3: {
      boxShadow: '0 4px 8px 0 rgb(0 0 0 / 15%)'
    }
  },
  MuiListItem: {
    button: {
      '&&:hover': {
        background: 'rgb(50, 50, 50, 0.5)'
      }
    }
  },
}});
