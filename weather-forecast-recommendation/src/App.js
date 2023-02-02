import Home from './Pages/Home';
import './Styles/App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />}/>
        

      </Routes>

    </div>
  </BrowserRouter>
  );
}

export default App;
