
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  BarChart3, 
  Globe, 
  Languages, 
  Smartphone, 
  Shield, 
  Calculator,
  Calendar,
  Target
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: CreditCard,
      title: "Payment Plan Management",
      description: "Create, edit, and track detailed payment plans with interest calculations and multiple schedule types.",
      badge: "Core Feature",
      color: "bg-blue-500"
    },
    {
      icon: Calculator,
      title: "Credit Card Management",
      description: "Manage multiple cards, track credit limits, utilization, and get smart card recommendations.",
      badge: "Smart Tracking",
      color: "bg-green-500"
    },
    {
      icon: BarChart3,
      title: "Analytics & Charts",
      description: "Interactive dashboards with payment timelines, utilization charts, and comprehensive reporting.",
      badge: "Data Insights",
      color: "bg-purple-500"
    },
    {
      icon: Globe,
      title: "35+ Currencies",
      description: "Full multi-currency support with proper formatting and real-time currency tracking.",
      badge: "Global Ready",
      color: "bg-orange-500"
    },
    {
      icon: Languages,
      title: "6 Languages",
      description: "Complete internationalization with English, Spanish, German, French, Italian, and Portuguese.",
      badge: "Multilingual",
      color: "bg-red-500"
    },
    {
      icon: Smartphone,
      title: "Progressive Web App",
      description: "Installable PWA with offline functionality, responsive design, and native app experience.",
      badge: "PWA Ready",
      color: "bg-teal-500"
    },
    {
      icon: Calendar,
      title: "Payment Tracking",
      description: "Mark payments as complete, track overdue amounts, and get payment reminders.",
      badge: "Never Miss",
      color: "bg-indigo-500"
    },
    {
      icon: Target,
      title: "Smart Features",
      description: "Auto-fill functionality, smart defaults, undo system, and contextual help throughout.",
      badge: "AI Powered",
      color: "bg-pink-500"
    },
    {
      icon: Shield,
      title: "Local & Secure",
      description: "Run locally with Docker, use your own database, or deploy to free cloud services.",
      badge: "Your Data",
      color: "bg-gray-600"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-green-100 text-green-700 mb-4">
            Comprehensive Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Manage Credit Payments
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Credit Tractor provides a complete suite of tools to track, analyze, and optimize 
            your credit card payment strategy with professional-grade features.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="relative group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className={`${feature.color} p-3 rounded-lg text-white mb-4`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg -z-10"></div>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-green-600">21+</div>
              <div className="text-sm text-gray-600">Feature Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">35+</div>
              <div className="text-sm text-gray-600">Currencies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">6</div>
              <div className="text-sm text-gray-600">Languages</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">100%</div>
              <div className="text-sm text-gray-600">Free Local Use</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
