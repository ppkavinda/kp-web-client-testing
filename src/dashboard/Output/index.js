import Grid from '@mui/material/Grid';

const Output = props => {
  const {response, error} = props;
  const formattedResponse = JSON.stringify(response, null, 4);
  const formattedError = JSON.stringify(error, null, 4);

  return <Grid style={{borderLeft: 'solid 1px gray', paddingLeft: '10px'}}>
    output
    <div style={{height: '100%', width: '100%', display: 'flex', marginBottom: '15px'}}>
      <code style={{
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
        {formattedResponse ?? 'No output'}
      </code>
    </div>
  </Grid>;
};

export default Output;
