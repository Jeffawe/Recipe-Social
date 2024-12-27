import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AddRecipe, Explore, RecipeDetail, NavBar, Home } from './components';
import { AuthProvider } from './components/context/AuthContext';
import ProtectedRoute from './components/context/ProtectedRoute';
import Footer from './components/Footer/Footer';
import TemplateEditor from './components/features/Templates/TemplateEditor';

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
            <Route path="/select-template"
              element={
                <ProtectedRoute>
                  <AddRecipe />
                </ProtectedRoute>
              } />
            <Route path="/templates"
              element={
                  <TemplateEditor />
              } />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;