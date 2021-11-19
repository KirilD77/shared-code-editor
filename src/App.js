import { BrowserRouter, Route, Link } from 'react-router-dom';
import Topbar from './components/Topbar';
import styles from "./styles/app.module.css"

function App() {
  return <BrowserRouter>
    <Topbar/>
  </BrowserRouter>;
}

export default App;
