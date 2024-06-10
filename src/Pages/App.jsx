import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./../Components/Header/Header";
import SearchingPage from "./../Pages/SearchingPage/SearchingPage";
import "./../style/App.scss";
import Companies from "./Companies/Companies";
import Directions from "./Directions/Directions";
import MainScreen from "./Main/MainScreen";
import CompaniesPage from "./CompaniesPage/CompaniesPage";
import DirectionsPage from "./DirectionsPage/DirectionsPage";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/search" element={<SearchingPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/directions" element={<DirectionsPage />} />
        <Route path="/companies/:id" element={<Companies />} />
        <Route path="/professions/:id" element={<Directions />} />
      </Routes>
    </Router>
  );
}
export default App;
