import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Topbar from './components/Topbar';
import Editor from './components/Editor';
import { useAuth0 } from '@auth0/auth0-react';
import Loader from './components/Loader';
import { useDispatch } from 'react-redux';
import { setIsLogged } from './redux/actionCreators';

function App() {
  console.log("app render");
  const { isLoading, isAuthenticated } = useAuth0();
  const dispatch = useDispatch();
  
  // if information about user's auth status is loaded dispatch info about it
  if (isLoading === false) {
    dispatch(setIsLogged(isAuthenticated));
    console.log(isAuthenticated);
  }

  // while isLoading show loader
  return isLoading ? (
    <Loader />
  ) : (
    <BrowserRouter>
      <Topbar />
      <Routes>
        <Route path="/editor/:id" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
