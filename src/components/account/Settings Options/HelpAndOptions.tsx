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
import { HelpCircle, MessageSquare, Users } from 'lucide-react';

const HelpSupport : React.FC = () => {
  const faqs = [
    {
      question: "How do I share a recipe?",
      answer: "To share a recipe, click the 'Add Recipe' button in the Home Page. Fill in the recipe details, pick a template, then click 'Submit'."
    },
    {
      question: "Can I edit a recipe after publishing?",
      answer: "Yes, you can edit your published recipes. Go to your profile, find the recipe you want to edit and open it. At the top right is a settings button that can be cicked to edit."
    },
    {
      question: "How do I save recipes from other users?",
      answer: "To save a recipe, Click the star button on a recipe."
    },
    {
      question: "What are recipe collections?",
      answer: "Recipe collections are like playlists for your favorite recipes. You can create themed collections (e.g., 'Quick Dinners', 'Holiday Recipes') and organize saved recipes into them."
    },
    {
      question: "How do I report inappropriate content?",
      answer: "Click the settings menu on any recipe and select 'Report'. Choose the reason for reporting and our moderation team will review it."
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpSupport;