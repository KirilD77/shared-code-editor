import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Topbar from './components/Topbar';
import styles from './styles/app.module.css';
import Editor from './components/Editor';

function App() {
  return (
    <BrowserRouter>
      <Topbar />
      <Routes>
        <Route path="/editor/:id" element={<Editor/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
