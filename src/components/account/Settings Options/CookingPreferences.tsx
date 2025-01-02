import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChefHat, Leaf, Scale } from 'lucide-react';

const CookingPreferences : React.FC = () => {
  const [isVegetarian, setIsVegetarian] = React.useState(false);
  const [isVegan, setIsVegan] = React.useState(false);
  const [hasPeanutAllergy, setHasPeanutAllergy] = React.useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Cooking Preferences</h2>
        <p className="text-gray-500">Customize your cooking and dietary preferences</p>
      </div>

      {/* Dietary Restrictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Dietary Restrictions
          </CardTitle>
          <CardDescription>
            Set your dietary preferences and restrictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="vegetarian">Vegetarian</Label>
              <p className="text-sm text-gray-500">Exclude meat products</p>
            </div>
            <Switch
              id="vegetarian"
              checked={isVegetarian}
              onCheckedChange={setIsVegetarian}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="vegan">Vegan</Label>
              <p className="text-sm text-gray-500">Exclude all animal products</p>
            </div>
            <Switch
              id="vegan"
              checked={isVegan}
              onCheckedChange={setIsVegan}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="peanut">Peanut Allergy</Label>
              <p className="text-sm text-gray-500">Exclude recipes with peanuts</p>
            </div>
            <Switch
              id="peanut"
              checked={hasPeanutAllergy}
              onCheckedChange={setHasPeanutAllergy}
            />
          </div>
        </CardContent>
      </Card>

      {/* Measurement Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Measurement Preferences
          </CardTitle>
          <CardDescription>
            Choose your preferred measurement system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="units">Measurement System</Label>
            <Select defaultValue="metric">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select measurement system" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (g, ml, °C)</SelectItem>
                <SelectItem value="imperial">Imperial (oz, cups, °F)</SelectItem>
                <SelectItem value="both">Show Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cooking Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Cooking Experience
          </CardTitle>
          <CardDescription>
            Set your cooking experience level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="experience">Experience Level</Label>
            <Select defaultValue="intermediate">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="professional">Professional Chef</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookingPreferences;