import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageSquare, Book, Users, Bookmark, Shield } from 'lucide-react';

const HelpSupport : React.FC = () => {
  const faqs = [
    {
      question: "How do I share a recipe?",
      answer: "To share a recipe, click the 'Create Recipe' button in the navigation bar. Fill in the recipe details, including ingredients and instructions, then click 'Publish'."
    },
    {
      question: "Can I edit a recipe after publishing?",
      answer: "Yes, you can edit your published recipes. Go to your profile, find the recipe you want to edit, and click the 'Edit' button."
    },
    {
      question: "How do I save recipes from other users?",
      answer: "To save a recipe, click the bookmark icon on any recipe card. You can find your saved recipes in your profile under 'Saved Recipes'."
    },
    {
      question: "What are recipe collections?",
      answer: "Recipe collections are like playlists for your favorite recipes. You can create themed collections (e.g., 'Quick Dinners', 'Holiday Recipes') and organize saved recipes into them."
    },
    {
      question: "How do I report inappropriate content?",
      answer: "Click the three dots menu on any recipe or comment and select 'Report'. Choose the reason for reporting and our moderation team will review it."
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Help & Support</h2>
        <p className="text-gray-500">Get help with RecipeSocial</p>
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Find answers to common questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Contact Support
          </CardTitle>
          <CardDescription>
            Get in touch with our support team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Input placeholder="Subject" />
            </div>
            <div>
              <Textarea 
                placeholder="Describe your issue or question..."
                className="h-32"
              />
            </div>
            <Button>Send Message</Button>
          </form>
        </CardContent>
      </Card>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Documentation
          </CardTitle>
          <CardDescription>
            Learn more about using RecipeSocial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="w-full justify-start">
              <Book className="mr-2 h-4 w-4" />
              Getting Started Guide
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Bookmark className="mr-2 h-4 w-4" />
              Recipe Creation Guide
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Community Guidelines
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Privacy & Security
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Community Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Community Support
          </CardTitle>
          <CardDescription>
            Connect with the RecipeSocial community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Community Forum</h3>
              <p className="text-sm text-gray-500 mb-3">
                Join discussions, share tips, and get help from other community members.
              </p>
              <Button variant="secondary">Visit Forum</Button>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Recipe Exchange Program</h3>
              <p className="text-sm text-gray-500 mb-3">
                Partner with other cooks to share recipes and cooking techniques.
              </p>
              <Button variant="secondary">Learn More</Button>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Cooking Workshops</h3>
              <p className="text-sm text-gray-500 mb-3">
                Join live online workshops hosted by experienced community members.
              </p>
              <Button variant="secondary">Browse Workshops</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>
            Helpful resources and information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <a href="#" className="text-orange-600 hover:underline">Report a Bug</a>
            <a href="#" className="text-orange-600 hover:underline">Feature Requests</a>
            <a href="#" className="text-orange-600 hover:underline">System Status</a>
            <a href="#" className="text-orange-600 hover:underline">Terms of Service</a>
            <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a>
            <a href="#" className="text-orange-600 hover:underline">Cookie Settings</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpSupport;