import React from 'react';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';

export default function SimpleBreadcrumbs(props) {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link color="inherit" href="/" onClick={()=>props.history.push('/')}>
        Home
      </Link>
      <Typography color="textPrimary">{props.location.pathname.split('/')[1]}</Typography>
    </Breadcrumbs>
  );
}
