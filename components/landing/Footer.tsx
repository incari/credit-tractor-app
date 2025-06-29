import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Tractor,
  Github,
  ExternalLink,
  Mail,
  Globe,
  Code,
  Heart,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    product: [
      { name: "Live Demo", href: "#", icon: ExternalLink },
      { name: "Features", href: "#features", icon: null },
      { name: "Documentation", href: "#", icon: Code },
      { name: "GitHub", href: "#", icon: Github },
    ],
    deployment: [
      { name: "Local Setup", href: "#", icon: null },
      { name: "Docker Guide", href: "#", icon: null },
      { name: "Cloud Deploy", href: "#", icon: Globe },
      { name: "Database Setup", href: "#", icon: null },
    ],
    community: [
      { name: "Contribute", href: "#", icon: Github },
      { name: "Issues", href: "#", icon: null },
      { name: "Discussions", href: "#", icon: null },
      { name: "Newsletter", href: "#", icon: Mail },
    ],
    support: [
      { name: "Contact", href: "#details", icon: null },
      { name: "FAQ", href: "#", icon: null },
      { name: "Privacy", href: "#", icon: null },
      { name: "Terms", href: "#", icon: null },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-500 p-2 rounded-lg">
                <Tractor className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Credit Tractor</h3>
                <p className="text-gray-400 text-sm">
                  Payment Tracking Made Simple
                </p>
              </div>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Take control of your credit card payments with powerful analytics,
              multi-currency support, and complete privacy.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              <Badge className="bg-green-100 text-green-700">Open Source</Badge>
              <Badge className="bg-blue-100 text-blue-700">PWA Ready</Badge>
              <Badge className="bg-purple-100 text-purple-700">
                35+ Currencies
              </Badge>
            </div>

            <div className="flex items-center text-gray-400 text-sm">
              <Heart className="w-4 h-4 mr-2 text-red-500" />
              Made with love for the community
            </div>
          </div>

          {/* Links sections */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-6">Product</h4>
                <ul className="space-y-3">
                  {links.product.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-white transition-colors flex items-center"
                      >
                        {link.icon && <link.icon className="w-4 h-4 mr-2" />}
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-6">Deployment</h4>
                <ul className="space-y-3">
                  {links.deployment.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-white transition-colors flex items-center"
                      >
                        {link.icon && <link.icon className="w-4 h-4 mr-2" />}
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-6">Community</h4>
                <ul className="space-y-3">
                  {links.community.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-white transition-colors flex items-center"
                      >
                        {link.icon && <link.icon className="w-4 h-4 mr-2" />}
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">21+</div>
              <div className="text-gray-400 text-sm">Feature Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">35+</div>
              <div className="text-gray-400 text-sm">Currencies Supported</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">6</div>
              <div className="text-gray-400 text-sm">Languages Available</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">100%</div>
              <div className="text-gray-400 text-sm">Free & Open Source</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Credit Tractor. Made with ❤️ for the community.
            </div>

            <div className="flex items-center space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
