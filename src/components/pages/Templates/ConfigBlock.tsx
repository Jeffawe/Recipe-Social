import React, { useState, ChangeEvent } from 'react';
import { X, Settings } from 'lucide-react';
import { BlockConfig, ConfigPanelProps, BLOCK_TYPES } from './ComponentBlocks';

const BlockConfigPanel: React.FC<ConfigPanelProps> = ({ block, onConfigUpdate, onClose }) => {
    const [config, setConfig] = useState<BlockConfig>(block.config || {});
    const [newClassName, setNewClassName] = useState<string>('');

    const handleClassNameAdd = (): void => {
        if (!newClassName) return;
        if (!config.className) {
            config.className = [];
        }
        if (config.className.length >= 5) return;
        
        setConfig(prev => ({
            ...prev,
            className: [...(prev.className || []), newClassName]
        }));
        setNewClassName('');
        updateConfig();
    };

    const handleClassNameRemove = (index: number): void => {
        setConfig(prev => ({
            ...prev,
            className: prev.className?.filter((_, i) => i !== index)
        }));
        updateConfig();
    };

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>, key: keyof BlockConfig): void => {
        setConfig(prev => ({ ...prev, [key]: e.target.value }));
    };

    const handleNumberChange = (e: ChangeEvent<HTMLInputElement>, key: keyof BlockConfig): void => {
        setConfig(prev => ({ ...prev, [key]: parseInt(e.target.value) }));
    };

    const handleTextChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        key: keyof BlockConfig
    ): void => {
        setConfig(prev => ({ ...prev, [key]: e.target.value }));
    };

    const updateConfig = (): void => {
        onConfigUpdate(block.id, config);
    };

    const blockConfigs: Record<BLOCK_TYPES, JSX.Element | null> = {
        [BLOCK_TYPES.IMAGE]: (
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Image Index</label>
                    <input
                        type="number"
                        min="0"
                        value={config.imageIndex || 0}
                        onChange={(e) => handleNumberChange(e, 'imageIndex')}
                        className="w-full p-2 border rounded"
                    />
                </div>
            </div>
        ),
        [BLOCK_TYPES.CUSTOM_HEADER]: (
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Header Text</label>
                    <input
                        type="text"
                        value={config.content || ''}
                        onChange={(e) => handleTextChange(e, 'content')}
                        className="w-full p-2 border rounded"
                    />
                </div>
            </div>
        ),
        [BLOCK_TYPES.CUSTOM_TEXT]: (
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Content</label>
                    <textarea
                        value={config.content || ''}
                        onChange={(e) => handleTextChange(e, 'content')}
                        className="w-full p-2 border rounded"
                        rows={3}
                    />
                </div>
            </div>
        ),
        [BLOCK_TYPES.TITLE]: null,
        [BLOCK_TYPES.DESCRIPTION]: null,
        [BLOCK_TYPES.INGREDIENTS]: null,
        [BLOCK_TYPES.DIRECTIONS]: null,
        [BLOCK_TYPES.COOKING_TIME]: null,
        [BLOCK_TYPES.NUTRITION]: null
    };

    return (
        <div className="fixed right-0 top-[64px] h-[calc(100vh-64px)] w-80 bg-white shadow-lg p-4 overflow-y-auto z-40">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-black">
                    <Settings size={16} />
                    <h3 className="font-semibold">Block Configuration</h3>
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <X size={16} />
                </button>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Max Width</label>
                    <select
                        value={config.maxWidth || 'full'}
                        onChange={(e) => handleSelectChange(e, 'maxWidth')}
                        className="w-full p-2 border rounded"
                    >
                        {['sm', 'md', 'lg', 'xl', 'full'].map((width) => (
                            <option key={width} value={width}>{width}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Padding</label>
                    <select
                        value={config.padding || 'md'}
                        onChange={(e) => handleSelectChange(e, 'padding')}
                        className="w-full p-2 border rounded"
                    >
                        {['sm', 'md', 'lg'].map((padding) => (
                            <option key={padding} value={padding}>{padding}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Alignment</label>
                    <select
                        value={config.alignment || 'left'}
                        onChange={(e) => handleSelectChange(e, 'alignment')}
                        className="w-full p-2 border rounded"
                    >
                        {['left', 'center', 'right'].map((align) => (
                            <option key={align} value={align}>{align}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Custom Tailwind Classes ({(config.className?.length || 0)}/5)
                    </label>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={newClassName}
                            onChange={(e) => setNewClassName(e.target.value)}
                            placeholder="Enter Tailwind class"
                            className="flex-1 p-2 border rounded"
                            disabled={(config.className?.length || 0) >= 5}
                        />
                        <button
                            onClick={handleClassNameAdd}
                            disabled={(config.className?.length || 0) >= 5}
                            className="bg-orange-500 text-white px-3 py-1 rounded disabled:bg-gray-300"
                        >
                            Add
                        </button>
                    </div>
                    <div className="space-y-2">
                        {config.className?.map((className, index) => (
                            <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                <code className="text-sm">{className}</code>
                                <button
                                    onClick={() => handleClassNameRemove(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {blockConfigs[block.type as keyof typeof blockConfigs]}

                <button
                    onClick={updateConfig}
                    className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
                >
                    Apply Changes
                </button>
            </div>
        </div>
    );
};

export default BlockConfigPanel;