import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AddRecipe, Explore, RecipePage, NavBar, Home } from './components';
import { AuthProvider } from './components/context/AuthContext';
import ProtectedRoute from './components/context/ProtectedRoute';
import Footer from './components/Footer/Footer';
import TemplateEditor from './components/pages/Templates/TemplateEditor';
import { RecipeProvider } from './components/context/RecipeDataContext';
import SettingsLayout from './components/account/Settings';
import AccountSettings from './components/account/Settings Options/AccountSettings';
import ProfileSettings from './components/account/Settings Options/Profile';
import AppearanceSettings from './components/account/Settings Options/Appearance';
import HelpSupport from './components/account/Settings Options/HelpAndOptions';
import CookingPreferences from './components/account/Settings Options/CookingPreferences';
import ProfilePage from './components/account/Profile';
import UpdateRecipe from './components/pages/UpdateRecipe/UpdateRecipe';
import SearchPage from './components/pages/SearchPage/SearchPage';
import { Analytics } from '@vercel/analytics/react';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <RecipeProvider>
        <Router>
          <div className='bg-gradient-to-br from-orange-50 to-white'>
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/advanced-search" element={<SearchPage />} />
              <Route
                path="/add-recipe"
                element={
                  <ProtectedRoute>
                    <AddRecipe />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/update-recipe/:id"
                element={
                  <ProtectedRoute>
                    <UpdateRecipe />
                  </ProtectedRoute>
                }
              />
              <Route path="/templates" element={<TemplateEditor />} />
              <Route path="/recipe/:originalId" element={<RecipePage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/settings" element={<ProtectedRoute> <SettingsLayout /> </ProtectedRoute>}>
                <Route path="account" element={<ProtectedRoute> <AccountSettings /> </ProtectedRoute>} />
                <Route path="profile" element={<ProtectedRoute> <ProfileSettings /> </ProtectedRoute>} />
                <Route path="appearance" element={<ProtectedRoute> <AppearanceSettings /> </ProtectedRoute>} />
                <Route path="help" element={<ProtectedRoute> <HelpSupport /> </ProtectedRoute>} />
                <Route path="cooking" element={<ProtectedRoute> <CookingPreferences /> </ProtectedRoute>} />
              </Route>
            </Routes>
            <Footer />
            <Analytics />
          </div>
        </Router>
      </RecipeProvider>
    </AuthProvider>
  );
};

export default App;