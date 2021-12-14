import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useWS } from './ws';

const ENCRIPTION_LABEL = 'encryption-select';

const ClientPanel = ({ client = {} }) => {
  const { id, key, encoders } = client;
  const [encoder, setEncoder] = useState('');
  const [text, setText] = useState('');
  const ws = useWS();
  const send = () => {
    if (encoder.length < 1) {
      return;
    }
    ws.send(JSON.stringify({ type: 'send', id, key, data: text.trim() }));
  };
  return (
    <Card>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography sx={{ fontSize: 12 }} color="text.secondary">
              {key}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" component="div">
              {id}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id={ENCRIPTION_LABEL}>加密算法</InputLabel>
              <Select
                size="small"
                onChange={(e) => {
                  setEncoder(e.target.value);
                  ws.send(
                    JSON.stringify({
                      type: 'change',
                      id,
                      key,
                      encoder: e.target.value,
                    })
                  );
                }}
                value={encoder}
                labelId={ENCRIPTION_LABEL}
                label="加密算法"
              >
                {Object.keys(encoders).map((encoderName) => (
                  <MenuItem value={encoders[encoderName]} key={encoderName}>
                    {encoderName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                onChange={(e) => setText(e.target.value)}
                value={text}
                multiline
                label="明文"
              ></TextField>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button onClick={send} variant="contained">
          发送
        </Button>
      </CardActions>
    </Card>
  );
};

export default ClientPanel;
