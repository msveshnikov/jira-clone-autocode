// src/utils/theme.js

import { createTheme } from '@mui/material/styles';

const jiraPalette = {
    primary: {
        main: '#0052CC',
        light: '#4C9AFF',
        dark: '#0747A6'
    },
    secondary: {
        main: '#FF5630',
        light: '#FF8F73',
        dark: '#DE350B'
    },
    background: {
        default: '#F4F5F7',
        paper: '#FFFFFF'
    },
    text: {
        primary: '#172B4D',
        secondary: '#6B778C'
    },
    error: {
        main: '#FF5630',
        light: '#FF8F73',
        dark: '#DE350B'
    },
    warning: {
        main: '#FFAB00',
        light: '#FFE380',
        dark: '#FF8B00'
    },
    info: {
        main: '#0065FF',
        light: '#4C9AFF',
        dark: '#0747A6'
    },
    success: {
        main: '#36B37E',
        light: '#79F2C0',
        dark: '#006644'
    }
};

const darkPalette = {
    primary: {
        main: '#4C9AFF',
        light: '#79B8FF',
        dark: '#0747A6'
    },
    secondary: {
        main: '#FF8F73',
        light: '#FFBDAD',
        dark: '#DE350B'
    },
    background: {
        default: '#1C2025',
        paper: '#2D3035'
    },
    text: {
        primary: '#FFFFFF',
        secondary: '#B0BEC5'
    },
    error: {
        main: '#FF8F73',
        light: '#FFBDAD',
        dark: '#DE350B'
    },
    warning: {
        main: '#FFE380',
        light: '#FFF0B3',
        dark: '#FF8B00'
    },
    info: {
        main: '#4C9AFF',
        light: '#79B8FF',
        dark: '#0747A6'
    },
    success: {
        main: '#79F2C0',
        light: '#ABF5D1',
        dark: '#006644'
    }
};

const createCustomTheme = (mode) => {
    const palette = mode === 'dark' ? darkPalette : jiraPalette;

    return createTheme({
        palette: {
            mode,
            ...palette
        },
        typography: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            h1: {
                fontSize: '2.5rem',
                fontWeight: 700
            },
            h2: {
                fontSize: '2rem',
                fontWeight: 700
            },
            h3: {
                fontSize: '1.75rem',
                fontWeight: 600
            },
            h4: {
                fontSize: '1.5rem',
                fontWeight: 600
            },
            h5: {
                fontSize: '1.25rem',
                fontWeight: 500
            },
            h6: {
                fontSize: '1rem',
                fontWeight: 500
            },
            button: {
                textTransform: 'none',
                fontWeight: 600
            }
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: '3px',
                        padding: '8px 16px'
                    },
                    containedPrimary: {
                        '&:hover': {
                            backgroundColor: palette.primary.dark
                        }
                    },
                    containedSecondary: {
                        '&:hover': {
                            backgroundColor: palette.secondary.dark
                        }
                    }
                }
            },
            MuiTextField: {
                defaultProps: {
                    variant: 'outlined'
                },
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '3px'
                        }
                    }
                }
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                        borderRadius: '3px'
                    }
                }
            },
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        scrollbarColor: `${palette.primary.main} ${palette.background.default}`,
                        '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                            backgroundColor: palette.background.default,
                            width: '8px'
                        },
                        '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                            borderRadius: '8px',
                            backgroundColor: palette.primary.main,
                            minHeight: '24px'
                        },
                        '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
                            backgroundColor: palette.primary.dark
                        },
                        '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
                            backgroundColor: palette.primary.dark
                        },
                        '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: palette.primary.light
                        },
                        '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
                            backgroundColor: palette.background.default
                        }
                    }
                }
            }
        },
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 960,
                lg: 1280,
                xl: 1920
            }
        }
    });
};

export default createCustomTheme;