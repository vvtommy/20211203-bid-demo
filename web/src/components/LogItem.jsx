import { Grid, Typography } from '@mui/material';
import { hexy } from 'hexy';
import { useMemo } from 'react';
import { grey, purple } from '@mui/material/colors';

const LogItem = ({ from = 'Unkown', dateTime = new Date(), data, spend }) => {
  const dump = useMemo(() => {
    if (data == null) {
      return <Typography>&lt;Unkown Data&gt;</Typography>;
    }

    return hexy(data, { caps: 'upper', html: true, format: 'twos' });
  }, [data]);
  return (
    <Grid item>
      <Grid container>
        <Grid item xs={12} md={12}>
          <Typography
            sx={{
              fontSize: 10,
              color: grey[600],
              fontFamily: 'monospace',
              fontWeight: 600,
              display: 'inline-block',
            }}
          >
            [{dateTime.toLocaleTimeString()}]
          </Typography>
          &nbsp;
          <Typography
            sx={{
              fontSize: 10,
              color: purple[500],
              fontFamily: 'monospace',
              fontWeight: 600,
              display: 'inline-block',
            }}
          >
            {from} ~{spend}ms
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <Typography
            sx={{
              fontFamily: 'Monospace',
              fontSize: 14,
              fontWeight: 600,
              color: grey[800],
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: dump }} />
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LogItem;
