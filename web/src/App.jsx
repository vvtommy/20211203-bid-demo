/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react/macro';
import { Container, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import ClientPanel from './ClientPanel';
import ServerPanel from './ServerPanel';
import {useEffect} from 'react';

const container = css`
  margin: 0 auto;
  padding: 32px 0 0 0;
`;

function App() {
  const clients = useSelector((state) => state.clients);
useEffect(() => {
    document.title = "加密演示程序"
  }, [])
  return (
    <Container css={container} maxWidth="lg">
      {/* <Global
        styles={css`
          html,
          body {
            background: #0b0d0d;
          }
        `}
      /> */}
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Grid container>
            <Grid item xs={12}>
              {Object.keys(clients).map((id) => {
                const client = clients[id];
                return <ClientPanel client={client} key={id} />;
              })}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={8}>
          <ServerPanel />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
