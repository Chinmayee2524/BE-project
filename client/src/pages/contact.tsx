
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
    setIsOpen(false);
  };

  return (
    <div className="container mx-auto p-8 flex justify-center items-center min-h-[80vh]">
      <div className={`relative w-96 h-72 ${isOpen ? 'envelope-open' : 'envelope-closed'}`}>
        <div className="envelope-background bg-white border-2 border-gray-300 w-full h-full flex items-center justify-center cursor-pointer"
             onClick={() => !isOpen && setIsOpen(true)}>
          <div className={`heart ${isOpen ? 'heart-clicked' : ''}`}>❤️</div>
        </div>
        
        <div className={`letter bg-white p-6 rounded-lg shadow-lg transition-all duration-500 ${isOpen ? 'letter-open' : 'letter-closed'}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-4">Send Us a Message</h2>
            <Input
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <Input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <Textarea
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
              className="min-h-[100px]"
            />
            <div className="flex gap-2">
              <Button type="submit" className="w-full">Send</Button>
              <Button type="button" variant="outline" className="w-full" 
                      onClick={() => setIsOpen(false)}>Close</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
