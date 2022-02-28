import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import { ReactNode } from 'react';

type PaletteColors = 'primary' | 'secondary' | 'error' | 'info' | 'warning' | 'success';

const SeverityPillRoot = styled('span')(({ theme, ownerState }: { theme: any, ownerState: PaletteColors }) => {
  const backgroundColor = theme.palette[ownerState].main;
  const color = theme.palette[ownerState].contrastText;

  return {
    alignItems: 'center',
    backgroundColor,
    borderRadius: 12,
    color,
    cursor: 'default',
    display: 'inline-flex',
    flexGrow: 0,
    flexShrink: 0,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.pxToRem(12),
    lineHeight: 2,
    fontWeight: 600,
    justifyContent: 'center',
    letterSpacing: 0.5,
    minWidth: 20,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    textTransform: 'uppercase',
    whiteSpace: 'nowrap'
  };
});


interface Props {
    color: PaletteColors;
    children: ReactNode;
}

export const SeverityPill = (props: Props) => {
  const theme = useTheme();
  const { color = 'primary', children, ...other } = props;

  return (
    <SeverityPillRoot
      theme={theme}
      ownerState={color}
      {...other}
    >
      {children}
    </SeverityPillRoot>
  );
};

SeverityPill.propTypes = {
  children: PropTypes.node,
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'error',
    'info',
    'warning',
    'success'
  ])
};