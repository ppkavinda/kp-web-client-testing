import * as React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Output from './Output';
import {Button, CircularProgress, FormControlLabel, FormGroup, Switch, TextField} from '@mui/material';

import {initializeApp} from '@CloudImpl-Inc/http-client-js/lib';

const Dashboard = () => {
  const authTokenRef = useRef('');
  const [tenantId, setTenantId] = useState('cloudimpl');
  const [baseUrl, setBaseUrl] = useState('http://localhost:8082');
  const [serviceName, setServiceName] = useState('');
  const [serviceNameList, setServiceNameList] = useState([]);
  const [version, setVersion] = useState('v1');
  const [routerKey, setRouterKey] = useState();
  const [routerKeyList, setRouterKeyList] = useState([]);
  const [functionName, setFunctionName] = useState();
  const [functionNameList, setFunctionNameList] = useState([]);
  const [payload, setPayload] = useState('{}');
  const [resumeOnError, setResumeOnError] = useState(false);
  const [shouldForcePolling, setShouldForcePolling] = useState(false);
  const [pollingInterval, setPollingInterval] = useState();
  const [authToken, setAuthToken] = useState('');
  const [completeUrl, setCompleteUrl] = useState('');

  const [kPlatform, setKPlatform] = useState(null);
  const [subscription, setSubscription] = useState();

  const [listening, setListening] = useState(false);

  const [response, setResponse] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    const parts = completeUrl?.split('/').filter(w => w);
    if (parts?.length < 4) {
      return;
    }
    setServiceName(parts[0]);
    setVersion(parts[1]);
    setRouterKey(parts[2]);
    setFunctionName(parts[3]);
  }, [completeUrl]);

  const cacheItems = () => {
    if (!serviceNameList.includes(serviceName)) {
      setServiceNameList([serviceName, ...serviceNameList]);
    }
    if (!routerKeyList.includes(routerKey)) {
      setRouterKeyList([routerKey, ...routerKeyList]);
    }
    if (!functionNameList.includes(functionName)) {
      setFunctionNameList([functionName, ...functionNameList]);
    }
  };

  const getAuth = useCallback(() => {
    const refToken = authTokenRef.current;
    const localStoreToken = localStorage.getItem('authToken');
    return Promise.resolve(refToken);
  }, [authToken]);

  const initKplatform = useCallback(() => {
    const kp = initializeApp({
      tenantId,
      baseUrl,
      getAuthTokenFn: () => Promise.resolve(localStorage.getItem('authToken')),
      enableLogging: true,
    });

    setKPlatform(kp);
  }, [authToken, baseUrl, getAuth, tenantId]);

  const getClient = useCallback(() => {
    return kPlatform.getService(serviceName)?.version(version).routeKey(routerKey);
  }, [kPlatform, routerKey, serviceName, version]);

  const execute = () => {
    cacheItems();
    const sub = getClient().execute(functionName, JSON.parse(payload));
    const s = sub.subscribe({
      next: res => {
        if (res.accessToken) {
          setAuthToken(res.accessToken);
        }
        console.log(res);
        setResponse([res]);
      },
      error: err => {
        console.log('error', err);
        setError(err);
      }
    });
    setSubscription(s);

  };

  const startListen = () => {
    cacheItems();

    const config = {resumeOnError, shouldForcePolling};
    if (pollingInterval) {
      config.pollingInterval = pollingInterval;
    }
    setListening(true);
    const sub = getClient().listen(functionName, JSON.parse(payload), config);
    const s = sub.subscribe({
      next: res => {
        console.log('response: ', res);
        setResponse(old => [res, ...old]);
      },
      error: err => {
        console.log('error', err);
        setError(err);
      }
    });
    setSubscription(s);
  };

  const onStop = () => {
    console.log('unsubscribed', subscription);
    subscription.unsubscribe();
    setSubscription(null);
    setListening(false);
  };

  return <Box sx={{flexGrow: 1}}>
    <Grid container spacing={2} style={{padding: '10px'}}>
      <Grid item xs={6}>
        <div style={{display: 'flex',}}>
          <div style={{marginRight: '3px'}}>
            <TextField fullWidth size="small" sx={{mb: 5}} id="outlined-basic" label="Tenant Id" variant="outlined"
                       value={tenantId || ''} onChange={e => setTenantId(e.target.value?.trim())}/>
          </div>
          <TextField fullWidth size="small" sx={{mb: 5}} id="outlined-basic" label="BaseUrl" variant="outlined"
                     value={baseUrl || ''} onChange={e => setBaseUrl(e.target.value?.trim())}/>
        </div>
        <div style={{display: 'flex',}}>
          <TextField
            fullWidth size="small" sx={{mb: 5}} id="outlined-basic" label="Access Token" variant="outlined"
            value={authTokenRef.current || ''} onChange={e => {
            const value = e.target.value?.trim();
            localStorage.setItem('authToken', value);
            authTokenRef.current = value;
            setAuthToken(value);
          }}/>
        </div>

        <div style={{display: 'flex',}}>
          <TextField
            fullWidth size="small" sx={{mb: 1}} id="outlined-basic" label="Complete Url" variant="outlined"
            value={completeUrl || ''}
            onChange={e => {
              const url = e.target.value?.trim();
              setCompleteUrl(url);
            }}/>
        </div>

        <div style={{display: 'flex',}}>
          <TextField
            key="asdf111"
            sx={{width: '100%', mr: 1, mb: 5,}}
            label="Service Name"
            variant="outlined"
            value={serviceName || ''}
            onChange={e => setServiceName(e.target.value?.trim())}
          />

          <TextField
            key="asdf1112"
            sx={{width: '100%', mr: 1, mb: 5,}} id="outlined-basic"
            label="Version"
            variant="outlined"
            value={version || ''} onChange={e => setVersion(e.target.value?.trim())}/>


          <TextField
            key="asdf11341"
            sx={{width: '100%', mr: 1, mb: 5,}}
            label="Router Key"
            variant="outlined"
            value={routerKey || ''}
            onChange={e => setRouterKey(e.target.value?.trim())}
          />

          <TextField
            key="asdf142311"
            sx={{width: '100%', mr: 1, mb: 5,}}
            label="Function Name"
            variant="outlined"
            value={functionName || ''}
            onChange={e => setFunctionName(e.target.value?.trim())}
          />


        </div>
        <div style={{display: 'flex',}}>
          <TextField
            sx={{mr: 1}} multiline fullWidth label="JSON Payload" variant="outlined" value={payload || ''}
            onChange={e => setPayload(e.target.value?.trim())}/>
        </div>
        <div style={{display: 'flex',}}>
          <FormGroup sx={{mr: 1, mb: 5}}>
            <FormControlLabel
              control={<Switch value={resumeOnError}/>} onChange={e => setResumeOnError(e.target.value)}
              label="resumeOnError"/>
            <FormControlLabel
              control={<Switch value={shouldForcePolling}/>}
              onChange={e => setShouldForcePolling(e.target.value)} label="shouldForcePolling"/>
            <TextField
              sx={{mr: 1}} label="Polling Interval" variant="outlined" value={pollingInterval || ''}
              onChange={e => setPollingInterval(e.target.value)}/>
          </FormGroup>
        </div>
        <div style={{display: 'flex', marginBottom: '10px'}}>
          <Button sx={{mr: 1}} variant="contained" color="error" onClick={initKplatform}>
            Init kPlatform
          </Button>
        </div>
        <div style={{display: 'flex', marginBottom: '10px'}}>
          <Button disabled={!kPlatform} sx={{mr: 1}} variant="contained" color="info" onClick={execute}>
            Execute
          </Button>
        </div>
        <div style={{display: 'flex',}}>

          <Button disabled={!kPlatform} sx={{mr: 1}} variant="contained" color="success" onClick={startListen}>
            Listen {listening && <CircularProgress size={20} sx={{marginLeft: '10px'}}/>}
          </Button>
          <Button disabled={!subscription} variant="contained" color="secondary" onClick={onStop}>
            Stop
          </Button>
        </div>
      </Grid>
      <Grid item xs={6}>
        <Output response={response}/>
      </Grid>
    </Grid>
  </Box>;
};

export default Dashboard;
