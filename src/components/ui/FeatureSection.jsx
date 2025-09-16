import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FeatureSection = ({ features }) => {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose RealEstatePro?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We combine cutting-edge technology with expert knowledge to provide 
            you with the best real estate experience possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.to ? (
                      <Link to={feature.to} className="hover:underline">
                        {feature.title}
                      </Link>
                    ) : (
                      feature.title
                    )}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  {feature.to && (
                    <div className="mt-4">
                      <Link to={feature.to} className="text-primary-600 hover:text-primary-700">
                        Learn more →
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
