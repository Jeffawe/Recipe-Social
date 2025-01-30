import { RecipeData } from "@/components/types/auth";

export interface BlockConfig {
    imageIndex?: number;
    content?: string;
    className?: string[];
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    padding?: 'sm' | 'md' | 'lg';
    alignment?: 'left' | 'center' | 'right';
    [key: string]: any;
}

export interface Block {
    id: string;
    type: string;
    config: BlockConfig;
}

export interface ConfigPanelProps {
    block: Block;
    onConfigUpdate: (blockId: string, newConfig: BlockConfig) => void;
    onClose: () => void;
}

export interface AvailableBlock {
    id: string;
    type: string;
    label: string;
}

export const blocksToString = (blocks: Block[]): string => {
    return JSON.stringify(blocks.map(block => ({
        type: block.type,
        config: block.config
    })));
};


export const convertStringToBlockTypes = (blocksString: string): Block[] => {
    try {
        const parsedBlocks = JSON.parse(JSON.parse(blocksString));
        return parsedBlocks.map((block: { type: string; config: BlockConfig }) => ({
            id: `${block.type}-${Date.now()}`, // Generate a new ID for each block
            type: block.type,
            config: block.config || {}
        }));
    } catch (error) {
        try {
            const cleanString = blocksString.replace(/['"]/g, '');
            const blockTypes = cleanString.split(',');

            return blockTypes.map((block) => ({
                id: `${block}-${Date.now()}`,
                type: block,
                config: {}
            }));
        } catch (error) {
            return [];
        }
    }
};

interface BlockComponentProps {
    data?: RecipeData;
    config?: BlockConfig;
}

const RecipeTitle: React.FC<BlockComponentProps> = ({ data }) => (
    <h1 className="text-3xl font-bold mb-4">{data?.title || 'Recipe Title'}</h1>
);

const RecipeDescription: React.FC<BlockComponentProps> = ({ data }) => (
    <p className="text-gray-600 mb-6">{data?.description || 'Recipe Description'}</p>
);

const IngredientsList: React.FC<BlockComponentProps> = ({ data }) => (
    <div className="mb-6">
        <h2 className="text-2xl text-black font-semibold mb-3">Ingredients</h2>
        <ul className="list-disc text-black pl-5">
            {(data?.ingredients || []).map((ing, idx) => (
                <li key={idx}>
                    {ing.quantity} {ing.unit} {ing.name}
                </li>
            ))}
        </ul>
    </div>
);

const DirectionsList: React.FC<BlockComponentProps> = ({ data }) => (
    <div className="mb-6">
        <h2 className="text-2xl text-black font-semibold mb-3">Directions</h2>
        <ol className="list-decimal text-black pl-5">
            {(data?.directions || []).map((dir, idx) => (
                <li key={idx} className="mb-2">
                    {dir.instruction}
                </li>
            ))}
        </ol>
    </div>
);

const CookingTime: React.FC<BlockComponentProps> = ({ data }) => (
    <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Cooking Time</h2>
        <div className="flex gap-4">
            <div>
                <span className="font-medium">Prep Time:</span> {data?.cookingTime?.prep || 0} minutes
            </div>
            <div>
                <span className="font-medium">Cook Time:</span> {data?.cookingTime?.cook || 0} minutes
            </div>
        </div>
    </div>
);

const NutritionInfo: React.FC<BlockComponentProps> = ({ data }) => (
    <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Nutrition Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>Servings: {data?.nutrition?.servings || 0}</div>
            <div>Calories: {data?.nutrition?.calories || 0}</div>
            <div>Protein: {data?.nutrition?.protein || 0}g</div>
            <div>Carbs: {data?.nutrition?.carbohydrates || 0}g</div>
            <div>Fat: {data?.nutrition?.fat || 0}g</div>
        </div>
    </div>
);

const RecipeImage: React.FC<BlockComponentProps> = ({ data, config }) => (
    <div className="mb-6">
        {data?.images?.[config?.imageIndex || 0] ? (
            <img
                src={data.images[config?.imageIndex || 0].url}
                alt={`Recipe ${(config?.imageIndex || 0) + 1}`}
                className="w-full max-w-2xl rounded-lg shadow-lg"
            />
        ) : (
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                Image Placeholder {(config?.imageIndex || 0) + 1}
            </div>
        )}
    </div>
);

const CustomHeader: React.FC<BlockComponentProps> = ({ config }) => (
    <h2 className="text-2xl font-semibold mb-3">{config?.content || 'Custom Header'}</h2>
);

const CustomText: React.FC<BlockComponentProps> = ({ config }) => (
    <p className="mb-4">{config?.content || 'Custom Text'}</p>
);

// Block Types Enum
export enum BLOCK_TYPES {
    TITLE = 'title',
    DESCRIPTION = 'description',
    INGREDIENTS = 'ingredients',
    DIRECTIONS = 'directions',
    COOKING_TIME = 'cookingTime',
    NUTRITION = 'nutrition',
    IMAGE = 'image',
    CUSTOM_HEADER = 'customHeader',
    CUSTOM_TEXT = 'customText'
}

// Block Components Map
const BLOCK_COMPONENTS: { [key in BLOCK_TYPES]: React.FC<BlockComponentProps> } = {
    [BLOCK_TYPES.TITLE]: RecipeTitle,
    [BLOCK_TYPES.DESCRIPTION]: RecipeDescription,
    [BLOCK_TYPES.INGREDIENTS]: IngredientsList,
    [BLOCK_TYPES.DIRECTIONS]: DirectionsList,
    [BLOCK_TYPES.COOKING_TIME]: CookingTime,
    [BLOCK_TYPES.NUTRITION]: NutritionInfo,
    [BLOCK_TYPES.IMAGE]: RecipeImage,
    [BLOCK_TYPES.CUSTOM_HEADER]: CustomHeader,
    [BLOCK_TYPES.CUSTOM_TEXT]: CustomText,
};

export default BLOCK_COMPONENTS;