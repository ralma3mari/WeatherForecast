import Home from './pages/Home';
import './styles/App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
        
        <Routes>
          <Route path= "/" element={<Home/>}/>
          <Route path="*" element={<ErrorPage message={"Page doesn't"}/>}/>
        </Routes>
        
    </div>
    </BrowserRouter>
  );
}

export default App;
