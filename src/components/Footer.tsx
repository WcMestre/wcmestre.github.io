
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin 
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-magenta-500 to-magenta-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IT</span>
              </div>
              <span className="text-white font-bold text-xl">TechPro Enterprise</span>
            </div>
            <p className="text-gray-400 text-sm">
              Leading IT outsourcing solutions provider, helping enterprises transform 
              their technology infrastructure for over 15 years.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-magenta-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-magenta-400 cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-magenta-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-magenta-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-magenta-400 transition-colors">Cloud Infrastructure</a></li>
              <li><a href="#" className="text-gray-400 hover:text-magenta-400 transition-colors">Cybersecurity</a></li>
              <li><a href="#" className="text-gray-400 hover:text-magenta-400 transition-colors">Data Management</a></li>
              <li><a href="#" className="text-gray-400 hover:text-magenta-400 transition-colors">24/7 Support</a></li>
              <li><a href="#" className="text-gray-400 hover:text-magenta-400 transition-colors">IT Consulting</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-magenta-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-magenta-400 transition-colors">Case Studies</a></li>
              <li><a href="#" className="text-gray-400 hover:text-magenta-400 transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-magenta-400 transition-colors">Partners</a></li>
              <li><a href="#" className="text-gray-400 hover:text-magenta-400 transition-colors">News</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="h-4 w-4 text-magenta-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-4 w-4 text-magenta-400" />
                <span>enterprise@techpro.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin className="h-4 w-4 text-magenta-400" />
                <span>123 Tech Street, Silicon Valley, CA 94000</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 TechPro Enterprise. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-magenta-400 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-magenta-400 text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-magenta-400 text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
