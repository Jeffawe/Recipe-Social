import React from 'react';
import LandingPage from './LandingPage'
import SearchBar from './SearchBar';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full px-0 flex-grow">
        <LandingPage />
        <SearchBar />
      </div>
    </div>
  );
};

export default Home;