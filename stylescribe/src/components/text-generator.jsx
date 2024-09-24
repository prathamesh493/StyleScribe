"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Send, HelpCircle } from "lucide-react";

// Mock data for available authors
const availableAuthors = [
  { id: '1', name: 'Jane Austen' },
  { id: '2', name: 'Charles Dickens' },
  { id: '3', name: 'Mark Twain' },
  { id: '4', name: 'Virginia Woolf' },
];

export default function TextGenerator() {
  const [authorSource, setAuthorSource] = useState('search');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [file, setFile] = useState(null);
  const [customAuthorName, setCustomAuthorName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleGenerate = async () => {
    try {
      const formData = new FormData();
      const authorName = authorSource === 'search' ? selectedAuthor : customAuthorName;
      
      formData.append('authorName', authorName);
      formData.append('prompt', prompt);
      
      if (file) {
        formData.append('file', file);
      }
      console.log(formData);
      const response = await fetch('http://localhost:8000/api/generate-text', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedText(data.generatedText);
      } else {
        console.error('Error generating text');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Author Style Text Generator</h1>
      
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Choose an author from the available list or upload your own text file.</li>
          <li>If uploading, provide the author's name.</li>
          <li>Enter a prompt for the text you want to generate.</li>
          <li>Click the "Generate Text" button to create new text in the author's style.</li>
          <li>View the generated text in the output section below.</li>
        </ol>
      </Card>

      <Card className="p-6 mb-6">
        <Tabs defaultValue="search" onValueChange={(value) => setAuthorSource(value)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search Authors</TabsTrigger>
            <TabsTrigger value="upload">Upload Text</TabsTrigger>
          </TabsList>
          <TabsContent value="search" className="mt-4">
            <Label htmlFor="author-select" className="block mb-2">Select an Author</Label>
            <Select onValueChange={setSelectedAuthor}>
              <SelectTrigger id="author-select">
                <SelectValue placeholder="Choose an author" />
              </SelectTrigger>
              <SelectContent>
                {availableAuthors.map((author) => (
                  <SelectItem key={author.id} value={author.name}>{author.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TabsContent>
          <TabsContent value="upload" className="mt-4">
            <Label htmlFor="file-upload" className="block mb-2">Upload Author's Text</Label>
            <div className="flex items-center space-x-2 mb-4">
              <Input
                id="file-upload"
                type="file"
                accept=".txt,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button onClick={() => document.getElementById('file-upload')?.click()}>
                <Upload className="mr-2 h-4 w-4" /> Upload File
              </Button>
              {file && <FileText className="h-4 w-4" />}
              <span>{file ? file.name : 'No file selected'}</span>
            </div>
            <Label htmlFor="author-name" className="block mb-2">Author's Name</Label>
            <Input
              id="author-name"
              type="text"
              placeholder="Enter author's name"
              value={customAuthorName}
              onChange={(e) => setCustomAuthorName(e.target.value)}
            />
          </TabsContent>
        </Tabs>
      </Card>

      <Card className="p-6 mb-6">
        <Label htmlFor="prompt" className="block mb-2">Enter Your Prompt</Label>
        <Textarea
          id="prompt"
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mb-4"
        />
        <Button 
          onClick={handleGenerate} 
          disabled={(authorSource === 'search' && !selectedAuthor) || 
                    (authorSource === 'upload' && (!file || !customAuthorName)) || 
                    !prompt}
        >
          <Send className="mr-2 h-4 w-4" /> Generate Text
        </Button>
      </Card>

      {generatedText && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Generated Text</h2>
          <p className="whitespace-pre-wrap">{generatedText}</p>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <HelpCircle className="mr-2 h-5 w-5" /> FAQs
        </h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>What file types are supported for upload?</AccordionTrigger>
            <AccordionContent>
              Currently, we support .txt (text) and .pdf (PDF) file formats for uploading author's work.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How long should the uploaded text be?</AccordionTrigger>
            <AccordionContent>
              For best results, we recommend uploading a substantial amount of text, ideally several pages or chapters of the author's work. This helps our system better capture the author's style.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Can I use any author not in the list?</AccordionTrigger>
            <AccordionContent>
              Yes, you can upload text from any author not in our predefined list. Simply use the "Upload Text" option and provide the author's name.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>How specific should my prompt be?</AccordionTrigger>
            <AccordionContent>
              Your prompt can be as specific or general as you like. More specific prompts often yield more focused results, while general prompts allow for more creative freedom in the generated text.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>Is the generated text plagiarism-free?</AccordionTrigger>
            <AccordionContent>
              The generated text is created based on the style of the author, not by copying their exact words. However, it's always a good practice to review and potentially edit the generated content, especially if you plan to publish it.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
}
