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
import { Moon, Sun, Type } from 'lucide-react';

const AppearanceSettings = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Appearance</h2>
        <p className="text-gray-500">Customize how RecipeSocial looks</p>
      </div>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            Theme
          </CardTitle>
          <CardDescription>
            Choose your preferred theme
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-gray-500">Use dark theme</p>
            </div>
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="reduced-motion">Reduced Motion</Label>
              <p className="text-sm text-gray-500">Minimize animations</p>
            </div>
            <Switch
              id="reduced-motion"
              checked={reducedMotion}
              onCheckedChange={setReducedMotion}
            />
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Typography
          </CardTitle>
          <CardDescription>
            Customize text appearance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="font-size">Font Size</Label>
            <Select defaultValue="medium">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="font-family">Font Family</Label>
            <Select defaultValue="system">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select font family" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System Default</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="sans">Sans-serif</SelectItem>
                <SelectItem value="mono">Monospace</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceSettings;