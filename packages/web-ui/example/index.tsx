import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Shell } from '../';

function App() {
  return <Shell />;
}

ReactDOM.render(<App />, document.getElementById('root'));
