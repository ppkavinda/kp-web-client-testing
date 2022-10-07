import './App.css';

import Dashboard from './dashboard';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
      <div className="App-header">
        kPlatform web client tester
        <Dashboard />
      </div>
    </div>
    </ThemeProvider>
  );
}

export default App;
