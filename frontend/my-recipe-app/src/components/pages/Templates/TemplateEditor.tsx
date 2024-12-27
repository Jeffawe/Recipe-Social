import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { DragDropContext, Droppable, Draggable, DropResult, DraggableProvided, DroppableProvided } from '@hello-pangea/dnd';
import { X, GripVertical, Plus } from 'lucide-react';
import BLOCK_COMPONENTS, { AvailableBlock, Block, BLOCK_TYPES } from './ComponentBlocks';

const TemplateEditor: React.FC = () => {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [availableBlocks] = useState<AvailableBlock[]>([
        { id: 'title', type: BLOCK_TYPES.TITLE, label: 'Title' },
        { id: 'description', type: BLOCK_TYPES.DESCRIPTION, label: 'Description' },
        { id: 'ingredients', type: BLOCK_TYPES.INGREDIENTS, label: 'Ingredients' },
        { id: 'directions', type: BLOCK_TYPES.DIRECTIONS, label: 'Directions' },
        { id: 'cookingTime', type: BLOCK_TYPES.COOKING_TIME, label: 'Cooking Time' },
        { id: 'nutrition', type: BLOCK_TYPES.NUTRITION, label: 'Nutrition' },
        { id: 'image', type: BLOCK_TYPES.IMAGE, label: 'Image' },
        { id: 'customHeader', type: BLOCK_TYPES.CUSTOM_HEADER, label: 'Custom Header' },
        { id: 'customText', type: BLOCK_TYPES.CUSTOM_TEXT, label: 'Custom Text' },
    ]);

    const editor = useEditor({
        extensions: [StarterKit],
        content: '',
    });


    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        if (result.source.droppableId === 'available' && result.destination.droppableId === 'editor') {
            const blockType = availableBlocks.find(block => block.id === result.draggableId);
            if (!blockType) return;

            const newBlock: Block = {
                id: `${blockType.id}-${Date.now()}`,
                type: blockType.type,
                config: {}
            };

            const newBlocks = [...blocks];
            newBlocks.splice(result.destination.index, 0, newBlock);
            setBlocks(newBlocks);
        } else if (result.source.droppableId === 'editor' && result.destination.droppableId === 'editor') {
            const newBlocks = Array.from(blocks);
            const [removed] = newBlocks.splice(result.source.index, 1);
            newBlocks.splice(result.destination.index, 0, removed);
            setBlocks(newBlocks);
        }
    };

    const removeBlock = (index: number) => {
        const newBlocks = [...blocks];
        newBlocks.splice(index, 1);
        setBlocks(newBlocks);
    };

    const handleSave = () => {
        console.log('Template blocks:', blocks);
    };

    return (
        <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl text-black font-bold">Template Editor</h1>
            <button
              onClick={handleSave}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Save Template
            </button>
          </div>
  
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-12 gap-6">
              {/* Available Blocks Sidebar */}
              <div className="col-span-3">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg font-semibold mb-4">Available Blocks</h2>
                  <Droppable droppableId="available" isDropDisabled={true}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {availableBlocks.map((block, index) => (
                          <Draggable
                            key={block.id}
                            draggableId={block.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-gray-100 text-black p-3 rounded flex items-center gap-2 cursor-move hover:bg-gray-200"
                              >
                                <GripVertical size={16} />
                                {block.label}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
  
              {/* Editor Area */}
              <div className="col-span-9">
                <div className="bg-white p-6 rounded-lg shadow min-h-[600px]">
                  <Droppable droppableId="editor">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-4"
                      >
                        {blocks.map((block, index) => {
                          const Component = BLOCK_COMPONENTS[block.type as BLOCK_TYPES];
                          return (
                            <Draggable
                              key={block.id}
                              draggableId={block.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="relative group"
                                >
                                  <div className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div {...provided.dragHandleProps}>
                                      <GripVertical size={16} className="text-gray-400" />
                                    </div>
                                  </div>
                                  <div className="border border-gray-200 rounded p-4 relative">
                                    <button
                                      onClick={() => removeBlock(index)}
                                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X size={16} />
                                    </button>
                                    <Component data={{}} />
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            </div>
          </DragDropContext>
        </div>
      </div>
    );
};

export default TemplateEditor;