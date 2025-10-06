import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">JaipurEstate</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your trusted partner in finding the perfect property in Jaipur. 
              Verified listings with AI-powered insights for smart investments.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/search" className="text-muted-foreground hover:text-primary transition-colors">Search Properties</Link></li>
              <li><Link to="/sell" className="text-muted-foreground hover:text-primary transition-colors">Sell Property</Link></li>
              <li><Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link to="/preferences" className="text-muted-foreground hover:text-primary transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="font-semibold mb-4">Property Types</h3>
            <ul className="space-y-3">
              <li><Link to="/search?type=flat" className="text-muted-foreground hover:text-primary transition-colors">Flats in Jaipur</Link></li>
              <li><Link to="/search?type=plot" className="text-muted-foreground hover:text-primary transition-colors">Plots in Jaipur</Link></li>
              <li><Link to="/search?type=villa" className="text-muted-foreground hover:text-primary transition-colors">Villas in Jaipur</Link></li>
              <li><Link to="/search?type=commercial" className="text-muted-foreground hover:text-primary transition-colors">Commercial Space</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">C-Scheme, Jaipur, Rajasthan</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">info@jaipurestate.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              © 2024 JaipurEstate. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;