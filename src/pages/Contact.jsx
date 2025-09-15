import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  Headphones,
  FileText
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['123 Real Estate Ave', 'New York, NY 10001', 'United States'],
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543', 'Mon-Fri 9AM-6PM EST'],
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['info@realestatepro.com', 'support@realestatepro.com', 'sales@realestatepro.com'],
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Monday - Friday: 9AM - 6PM', 'Saturday: 10AM - 4PM', 'Sunday: Closed'],
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  const departments = [
    {
      icon: MessageCircle,
      title: 'General Inquiries',
      description: 'Questions about our services, properties, or general information',
      email: 'info@realestatepro.com',
      phone: '+1 (555) 123-4567',
    },
    {
      icon: Headphones,
      title: 'Customer Support',
      description: 'Technical support, account issues, or platform assistance',
      email: 'support@realestatepro.com',
      phone: '+1 (555) 123-4568',
    },
    {
      icon: FileText,
      title: 'Sales & Partnerships',
      description: 'Business partnerships, bulk listings, or sales inquiries',
      email: 'sales@realestatepro.com',
      phone: '+1 (555) 123-4569',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're here to help you find your perfect property or answer any questions 
              you might have about our services.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="property">Property Information</option>
                    <option value="support">Technical Support</option>
                    <option value="sales">Sales & Partnerships</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                    <div className={`w-12 h-12 ${info.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${info.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {info.title}
                    </h3>
                    <div className="space-y-1">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 text-sm">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Departments */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Contact by Department
              </h3>
              <div className="space-y-6">
                {departments.map((dept, index) => {
                  const Icon = dept.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {dept.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2">
                          {dept.description}
                        </p>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Email:</span> {dept.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Phone:</span> {dept.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Visit Our Office
              </h3>
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Interactive Map</p>
                  <p className="text-sm text-gray-500">
                    123 Real Estate Ave, New York, NY 10001
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
