
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BarChart3, 
  CreditCard, 
  Calendar,
  PieChart,
  TrendingUp,
  Target
} from "lucide-react";

const ImageShowcaseSection = () => {
  const showcaseItems = [
    {
      icon: BarChart3,
      title: "Payment Analytics",
      description: "Track your payment progress with interactive charts and detailed analytics",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: CreditCard,
      title: "Card Management", 
      description: "Manage multiple credit cards with utilization tracking and smart recommendations",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: Calendar,
      title: "Payment Scheduling",
      description: "Never miss a payment with intelligent scheduling and reminder system",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: PieChart,
      title: "Credit Utilization",
      description: "Monitor your credit usage across all cards with visual progress indicators",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: TrendingUp,
      title: "Financial Progress",
      description: "Track your debt reduction progress and projected payoff dates",
      color: "from-teal-500 to-blue-600"
    },
    {
      icon: Target,
      title: "Goal Setting",
      description: "Set payment goals and track your progress toward becoming debt-free",
      color: "from-pink-500 to-purple-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-white/10 text-white border-white/20 mb-4">
            Visual Experience
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Beautiful Interface, Powerful Features
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Credit Tractor combines elegant design with powerful functionality to make 
            credit card payment management both intuitive and comprehensive.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {showcaseItems.map((item, index) => (
            <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className={`bg-gradient-to-r ${item.color} p-4 rounded-lg w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Mock App Interface */}
        <div className="relative max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* App Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">CT</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Credit Tractor</h3>
                    <p className="text-white/80 text-sm">Payment Dashboard</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-white/20 text-white border-white/30">
                    6 Languages
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30">
                    35+ Currencies
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* App Content */}
            <div className="p-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-gray-900 mb-1">$4,250</div>
                  <div className="text-gray-600 text-sm">Total Remaining</div>
                  <div className="mt-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full inline-block">
                    ↓ 15% this month
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-green-600 mb-1">$1,180</div>
                  <div className="text-gray-600 text-sm">This Month</div>
                  <div className="mt-2 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full inline-block">
                    5 payments due
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-blue-600 mb-1">72%</div>
                  <div className="text-gray-600 text-sm">Avg. Utilization</div>
                  <div className="mt-2 bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full inline-block">
                    Monitor closely
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment List */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Upcoming Payments</h4>
                  <div className="space-y-3">
                    {[
                      { card: "Visa ****1234", amount: "$245", date: "Dec 15", status: "due" },
                      { card: "Master ****5678", amount: "$180", date: "Dec 20", status: "upcoming" },
                      { card: "Amex ****9012", amount: "$320", date: "Dec 25", status: "upcoming" }
                    ].map((payment, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{payment.card}</div>
                            <div className="text-sm text-gray-600">{payment.date}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{payment.amount}</div>
                          <div className={`text-xs ${payment.status === 'due' ? 'text-orange-600' : 'text-green-600'}`}>
                            {payment.status === 'due' ? '● Due soon' : '● On track'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Chart Preview */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Payment Timeline</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">December 2024</span>
                      <span className="text-sm font-medium">$1,180</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full" style={{width: '75%'}}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">January 2025</span>
                      <span className="text-sm font-medium">$980</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full" style={{width: '60%'}}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">February 2025</span>
                      <span className="text-sm font-medium">$720</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full" style={{width: '45%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute -top-8 -left-8 w-16 h-16 bg-green-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default ImageShowcaseSection;
