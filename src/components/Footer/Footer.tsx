import React from 'react';

interface FooterProps {
  appName?: string;
}

const Footer: React.FC<FooterProps> = ({ 
  appName = 'Recipe Social'
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-orange-500 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center space-y-4">
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
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;