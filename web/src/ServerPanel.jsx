import { Box, Card, CardContent, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import LogItem from './components/LogItem';

const ServerPanel = () => {
  const logs = useSelector((state) => [...state.logs]);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: 400,
      }}
    >
      <Card sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <CardContent sx={{}}>
          <Typography>中心节点</Typography>
          {logs.map((log) => (
            <LogItem from={log.id} key={log.dateTime} {...log} />
          ))}
          {/* <LogItem
            from="windows"
            data={Buffer.from(
              'ABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABC'
            )}
          /> */}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ServerPanel;
