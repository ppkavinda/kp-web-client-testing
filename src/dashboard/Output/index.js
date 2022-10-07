import Grid from '@mui/material/Grid';

const Output = props => {
  const {response, error} = props;

  const latest = response[0];
  const formattedLatest = JSON.stringify(latest, null, 4);

  const history = response.slice(1);
  const formattedHistory = JSON.stringify(history, null, 4);
  const formattedError = JSON.stringify(error, null, 4);

  return <Grid style={{borderLeft: 'solid 1px gray', paddingLeft: '10px'}}>
    Latest output
    <div style={{height: '100%', width: '100%', display: 'flex', marginBottom: '15px'}}>
      <code style={{ maxHeight: '100vh', overflow: 'auto',
        fontFamily: 'monospace',
        fontSize: '.8em',
        whiteSpace: 'pre',
        width: '100%',
        textAlign: 'left',
        background: '#1c202a',
        padding: '10px',
        borderRadius: '8px',
        wordWrap: 'break-word',
      }}>
        {formattedLatest ?? 'No output'}
      </code>
    </div>

    history
    <div style={{height: '100%', width: '100%', display: 'flex', marginBottom: '15px'}}>
      <code style={{ maxHeight: '100vh', overflow: 'auto',
        fontFamily: 'monospace',
        fontSize: '.8em',
        whiteSpace: 'pre',
        width: '100%',
        textAlign: 'left',
        background: '#1c202a',
        padding: '10px',
        borderRadius: '8px',
        wordWrap: 'break-word',
      }}>
        {formattedHistory ?? 'No output'}
      </code>
    </div>
  </Grid>;
};

export default Output;
