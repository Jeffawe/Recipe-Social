import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { X, GripVertical } from 'lucide-react';
import BLOCK_COMPONENTS, { AvailableBlock, Block, BLOCK_TYPES, blocksToString } from './ComponentBlocks';
import { useRecipe } from '@/components/context/RecipeDataContext';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TemplateEditor: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isDragging, setIsDragging] = useState(false);
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

  const navigate = useNavigate();
  const { isEditing, recipeData, setIsEditing } = useRecipe();

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
  });

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false);

    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === 'available' && destination.droppableId === 'editor') {
      const blockType = availableBlocks.find(block => block.id === result.draggableId);
      if (!blockType) return;

      const newBlock: Block = {
        id: `${blockType.id}-${Date.now()}`,
        type: blockType.type,
        config: {}
      };

      setBlocks(prevBlocks => {
        const newBlocks = [...prevBlocks];
        newBlocks.splice(destination.index, 0, newBlock);
        return newBlocks;
      });
    } else if (source.droppableId === 'editor' && destination.droppableId === 'editor') {
      setBlocks(prevBlocks => {
        const newBlocks = Array.from(prevBlocks);
        const [removed] = newBlocks.splice(source.index, 1);
        newBlocks.splice(destination.index, 0, removed);
        return newBlocks;
      });
    }
  };

  const saveTemplate = async (templateData: String, isPublic: boolean = false) => {
    try {
      const token = localStorage.getItem('token');
      const template = JSON.stringify(templateData);

      const response = await axios({
        method: 'POST',
        url: `${API_BASE_URL}/templates/save`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          template,
          public: isPublic
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error saving template:', error);
      throw error;
    }
  };

  const removeBlock = (index: number) => {
    const newBlocks = [...blocks];
    newBlocks.splice(index, 1);
    setBlocks(newBlocks);
  };

  const handleSave = async () => {
    try {
      const templateData = blocksToString(blocks);
      console.log(templateData)
      const response = await saveTemplate(templateData, true);

      //const templateId = response.template;

      if (isEditing) {
        setIsEditing(false);
        navigate('/add-recipe');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error saving or using template:', error);
      alert('Failed to save template. Please try again.');
    }
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

        <DragDropContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Available Blocks</h2>
                <Droppable droppableId="available" isDropDisabled={true}>
                  {(provided, snapshot) => (
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
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`
                                bg-gray-100 text-black p-3 rounded flex items-center gap-2 
                                cursor-move hover:bg-gray-200 transition-colors
                                ${snapshot.isDragging ? 'shadow-lg ring-2 ring-orange-500' : ''}
                              `}
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

            <div className="col-span-9">
              <Droppable droppableId="editor">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`
                      bg-white p-6 rounded-lg shadow min-h-[600px] space-y-4
                      ${snapshot.isDraggingOver ? 'ring-2 ring-orange-500 ring-opacity-50' : ''}
                      ${isDragging ? 'bg-orange-50' : ''}
                    `}
                  >
                    {blocks.map((block, index) => {
                      const Component = BLOCK_COMPONENTS[block.type as BLOCK_TYPES];
                      return (
                        <Draggable
                          key={block.id}
                          draggableId={block.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`
                                relative group 
                                ${snapshot.isDragging ? 'shadow-lg ring-2 ring-orange-500' : ''}
                              `}
                            >
                              <div
                                className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                                {...provided.dragHandleProps}
                              >
                                <GripVertical size={16} className="text-gray-400" />
                              </div>
                              <div className="border border-gray-200 rounded p-4 relative">
                                <button
                                  onClick={() => removeBlock(index)}
                                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={16} />
                                </button>
                                <Component data={recipeData || undefined} />
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
        </DragDropContext>
      </div>
    </div>
  );
};

export default TemplateEditor;