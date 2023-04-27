import Home from "./Pages/Home";
import "./Styles/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorPage from "./Pages/ErrorPage";
import CardHolder from "./Pages/CardHolder";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/data/:index" element={<CardHolder />} /> 
          <Route
            path="*"
            element={<ErrorPage message={"Page Doesn't Exist"} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
