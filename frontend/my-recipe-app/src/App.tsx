import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AddRecipe, Explore, RecipeDetail, NavBar, Home } from './components';
import { AuthProvider } from './components/context/AuthContext';
import ProtectedRoute from './components/context/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route
              path="/add-recipe"
              element={
                <ProtectedRoute>
                  <AddRecipe />
                </ProtectedRoute>
              }
            />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;