import React, { useState } from 'react';
import BugReportModal from '../Beta/BugReportModal';

interface FooterProps {
  appName?: string;
}

const Footer: React.FC<FooterProps> = ({ 
  appName = 'Recipe Social'
}) => {
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-orange-500 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <button 
            onClick={() => setIsBugModalOpen(true)}
            className="bg-white text-orange-500 px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Report a Bug
          </button>

          <div className="text-center">
            <p className="text-sm text-white">
              Created by{' '}
              <a 
                href="https://jeffawe.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-slate-600 text-white"
              >
                Jeffery Ozoekwe Awagu
              </a>
            </p>
          </div>
          
          <div className="text-center text-xs text-white">
            <p>© {currentYear} {appName}. All rights reserved.</p>
            <p className="mt-1">
              This website and its contents are protected by copyright law. 
              Unauthorized use or reproduction of this material is strictly prohibited.
            </p>
            <p className='py-2'>Chef icon by <a className="text-white hover:text-gray-700" href='https://icons8.com'>Icon8</a></p>
          </div>
        </div>
      </div>

      <BugReportModal 
        isOpen={isBugModalOpen} 
        onClose={() => setIsBugModalOpen(false)} 
      />
    </footer>
  );
};

export default Footer;