
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Zap, 
  Shield, 
  Palette,
  CheckCircle
} from "lucide-react";

const SpecsSection = () => {
  const techSpecs = [
    {
      category: "Frontend Technology",
      icon: Code,
      color: "bg-blue-500",
      specs: [
        "React 18 with TypeScript",
        "Vite for fast development",
        "Tailwind CSS for styling",
        "Shadcn/UI components",
        "Responsive design system"
      ]
    },
    {
      category: "Performance",
      icon: Zap,
      color: "bg-yellow-500",
      specs: [
        "Optimized rendering",
        "Local storage persistence",
        "Minimal re-renders",
        "Fast load times",
        "Offline functionality"
      ]
    },
    {
      category: "Security & Privacy",
      icon: Shield,
      color: "bg-green-500",
      specs: [
        "Client-side only",
        "No data sent to servers",
        "Local storage encryption",
        "Privacy by design",
        "GDPR compliant"
      ]
    },
    {
      category: "User Experience",
      icon: Palette,
      color: "bg-purple-500",
      specs: [
        "Modern, clean interface",
        "Intuitive navigation",
        "Contextual help",
        "Smart defaults",
        "Accessibility features"
      ]
    }
  ];

  const features = [
    "🎯 21 Major Feature Categories",
    "🌍 6 Languages Supported", 
    "💰 35+ Currencies Supported",
    "📱 Full PWA Implementation",
    "🎨 Modern UI with 50+ Components",
    "💾 Complete Data Persistence",
    "📊 Advanced Analytics & Charts",
    "🔧 TypeScript Implementation",
    "⚡ Component-based Architecture",
    "🔒 Type-safe Data Structures",
    "📈 Performance Optimized",
    "🚀 Fast Local Storage Operations"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-purple-100 text-purple-700 mb-4">
            Technical Specifications
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Built with Modern Technology
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Credit Tractor is built using cutting-edge web technologies to ensure 
            performance, security, and maintainability.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {techSpecs.map((spec, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <div className={`${spec.color} p-3 rounded-lg text-white w-12 h-12 flex items-center justify-center mb-4`}>
                  <spec.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {spec.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {spec.specs.map((item, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Complete Feature Overview
            </h3>
            <p className="text-gray-600">
              A comprehensive payment tracking solution with enterprise-grade features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center text-sm text-gray-700 bg-white p-3 rounded-lg">
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecsSection;
