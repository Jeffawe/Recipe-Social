import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AddRecipe, Explore, RecipeDetail, NavBar, Home } from './components';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;