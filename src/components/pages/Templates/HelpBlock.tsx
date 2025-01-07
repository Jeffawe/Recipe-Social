import React from 'react';
import { X } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-black font-bold">Template Editor Help</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-2 text-black">Block Configuration</h3>
            <p className="mb-2">To configure any block:</p>
            <ol className="list-decimal ml-5 space-y-2">
              <li>Hover over a block to reveal the settings (gear) icon</li>
              <li>Click the gear icon to open the configuration panel</li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Configuration Options</h3>
            <div className="space-y-2">
              <p><strong>Max Width:</strong> Controls the maximum width of the block content</p>
              <p><strong>Padding:</strong> Adjusts the internal spacing of the block</p>
              <p><strong>Alignment:</strong> Sets text alignment within the block</p>
              <p><strong>Custom Classes:</strong> Add up to 5 Tailwind CSS classes for custom styling</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Block-Specific Settings</h3>
            <div className="space-y-2">
              <p><strong>Image Block:</strong> Select which image to display using the image index</p>
              <p><strong>Custom Header:</strong> Enter custom header text</p>
              <p><strong>Custom Text:</strong> Add custom paragraph content</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;