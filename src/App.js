import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Cart from "./pages/Cart";
import Category from "./pages/Category";
import Navbar from "./pages/components/Navbar";
import PDP from "./pages/PDP";



function App() {
  return (
      <div className="App" style={{marginLeft: '6vw', marginRight: '6vw',}}>
        <Router>
          <Navbar />
          <Routes>
            <Route exact path=""  element={<Category  />} />
            <Route exact path="/details/:uid"  element={<PDP />} />
            <Route exact path="/mycart"  element={<Cart />} />
          </Routes>
        </Router>
      </div>
  );
}

export default App;
