
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Monitor, 
  Smartphone, 
  Database, 
  Cloud, 
  Container,
  ArrowRight
} from "lucide-react";

const HumanoidSection = () => {
  const deploymentOptions = [
    {
      icon: Monitor,
      title: "Local Development",
      description: "Run locally on localhost for development and testing",
      features: ["No internet required", "Full privacy", "Fast performance"]
    },
    {
      icon: Container,
      title: "Docker Container",
      description: "Deploy using Docker for consistent environments",
      features: ["Easy deployment", "Scalable", "Portable"]
    },
    {
      icon: Database,
      title: "Own Database",
      description: "Connect to your own database for full control",
      features: ["Your data", "Custom schema", "Full control"]
    },
    {
      icon: Cloud,
      title: "Free Cloud",
      description: "Deploy to free cloud services like Vercel or Netlify",
      features: ["Zero cost", "Global CDN", "Automatic deploys"]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-blue-100 text-blue-700 mb-4">
            Flexible Deployment
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Deploy Anywhere, Run Everywhere
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Credit Tractor is designed for flexibility. Whether you want to run it locally, 
            in a container, or on the cloud, we've got you covered with multiple deployment options.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {deploymentOptions.map((option, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <option.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {option.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {option.description}
                </p>
                <ul className="space-y-1">
                  {option.features.map((feature, idx) => (
                    <li key={idx} className="text-xs text-gray-500 flex items-center justify-center">
                      <div className="w-1 h-1 bg-green-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Choose your preferred deployment method and start tracking your credit payments today. 
            All options include the complete feature set with no limitations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="px-8 py-3">
              View Documentation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-white border-white hover:bg-white hover:text-gray-900">
              <Monitor className="mr-2 h-5 w-5" />
              Try Local Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HumanoidSection;
