
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-black/95 backdrop-blur-sm border-b border-magenta-900/20 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-magenta-500 to-magenta-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IT</span>
            </div>
            <span className="text-white font-bold text-xl">TechPro Enterprise</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-gray-300 hover:text-magenta-400 transition-colors">Services</a>
            <a href="#benefits" className="text-gray-300 hover:text-magenta-400 transition-colors">Benefits</a>
            <a href="#about" className="text-gray-300 hover:text-magenta-400 transition-colors">About</a>
            <a href="#contact" className="text-gray-300 hover:text-magenta-400 transition-colors">Contact</a>
            <Button className="bg-magenta-600 hover:bg-magenta-700 text-white">
              Get Started
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-magenta-900/20">
            <div className="flex flex-col space-y-4 pt-4">
              <a href="#services" className="text-gray-300 hover:text-magenta-400 transition-colors">Services</a>
              <a href="#benefits" className="text-gray-300 hover:text-magenta-400 transition-colors">Benefits</a>
              <a href="#about" className="text-gray-300 hover:text-magenta-400 transition-colors">About</a>
              <a href="#contact" className="text-gray-300 hover:text-magenta-400 transition-colors">Contact</a>
              <Button className="bg-magenta-600 hover:bg-magenta-700 text-white w-fit">
                Get Started
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
