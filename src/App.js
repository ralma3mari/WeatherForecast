import Home from './Pages/Home';
import './Styles/App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ErrorPage from './Pages/ErrorPage';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="*" element={<ErrorPage message={"Page Doesn't Exist"}/>}/>

      </Routes>

    </div>
  </BrowserRouter>
  );
}

export default App;
