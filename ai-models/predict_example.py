"""
Example: Using the Trained Plot Price Predictor
===============================================

This script demonstrates how to load the trained model and make predictions
on new data points.

Usage:
    python predict_example.py
"""

import pandas as pd
import numpy as np
from plot_price_predictor import PlotPricePredictor

def create_sample_data():
    """
    Create sample data points for prediction.
    
    Returns:
        pd.DataFrame: Sample data with the required features
    """
    sample_data = {
        'area': ['C Scheme', 'Sector 45', 'Malviya Nagar', 'Vaishali Nagar', 'Goner'],
        'distance_to_city_center_km': [5.2, 8.7, 12.3, 15.8, 20.1],
        'plot_size_sqft': [5000, 7500, 3000, 8500, 6000],
        'road_width_ft': [120, 150, 80, 180, 100],
        'near_school': [True, True, False, True, False],
        'near_hospital': [True, False, True, True, False],
        'zone_type': ['Residential', 'Commercial', 'Residential', 'Industrial', 'Agricultural'],
        'has_water_supply': [True, True, False, True, False],
        'has_electricity': [True, True, True, False, True],
        'avg_price_last_6_months': [45.5, 38.2, 42.1, 35.8, 28.9]
    }
    
    return pd.DataFrame(sample_data)

def predict_plot_prices():
    """
    Load the trained model and make predictions on sample data.
    """
    print("=" * 60)
    print("PLOT PRICE PREDICTION EXAMPLE")
    print("=" * 60)
    
    # Initialize predictor
    predictor = PlotPricePredictor()
    
    # Load the trained model
    try:
        model_path = 'plot_price_predictor.pkl'
        predictor.load_model(model_path)
        print(f"✓ Model loaded successfully from {model_path}")
    except FileNotFoundError:
        print("❌ Model file not found. Please run plot_price_predictor.py first to train and save the model.")
        return
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return
    
    # Create sample data
    print("\nCreating sample data for prediction...")
    sample_df = create_sample_data()
    
    print("\nSample Data:")
    print("-" * 50)
    print(sample_df.to_string(index=False))
    
    # Prepare features (same as training)
    feature_columns = predictor.categorical_columns + predictor.numeric_columns + predictor.boolean_columns
    X_sample = sample_df[feature_columns]
    
    # Make predictions
    print("\nMaking predictions...")
    try:
        predictions = predictor.pipeline.predict(X_sample)
        
        # Add predictions to the sample dataframe
        sample_df['predicted_price'] = predictions
        
        print("\nPrediction Results:")
        print("=" * 80)
        print(f"{'Area':<15} {'Plot Size':<10} {'Zone Type':<12} {'Predicted Price':<15}")
        print("-" * 80)
        
        for idx, row in sample_df.iterrows():
            print(f"{row['area']:<15} {row['plot_size_sqft']:<10} {row['zone_type']:<12} ₹{row['predicted_price']:,.0f}")
        
        print("\nDetailed Results:")
        print("-" * 50)
        for idx, row in sample_df.iterrows():
            print(f"\nPlot {idx + 1}:")
            print(f"  Location: {row['area']}")
            print(f"  Plot Size: {row['plot_size_sqft']} sq ft")
            print(f"  Zone Type: {row['zone_type']}")
            print(f"  Distance to City Center: {row['distance_to_city_center_km']} km")
            print(f"  Road Width: {row['road_width_ft']} ft")
            print(f"  Near School: {'Yes' if row['near_school'] else 'No'}")
            print(f"  Near Hospital: {'Yes' if row['near_hospital'] else 'No'}")
            print(f"  Water Supply: {'Yes' if row['has_water_supply'] else 'No'}")
            print(f"  Electricity: {'Yes' if row['has_electricity'] else 'No'}")
            print(f"  Avg Price (6 months): ₹{row['avg_price_last_6_months']}/sq ft")
            print(f"  Predicted Total Price: ₹{row['predicted_price']:,.0f}")
            print(f"  Price per sq ft: ₹{row['predicted_price']/row['plot_size_sqft']:.2f}")
        
        # Calculate some statistics
        print("\nPrediction Statistics:")
        print("-" * 30)
        print(f"Average Predicted Price: ₹{predictions.mean():,.0f}")
        print(f"Minimum Predicted Price: ₹{predictions.min():,.0f}")
        print(f"Maximum Predicted Price: ₹{predictions.max():,.0f}")
        print(f"Standard Deviation: ₹{predictions.std():,.0f}")
        
    except Exception as e:
        print(f"❌ Error making predictions: {e}")

def predict_single_plot():
    """
    Example of predicting price for a single plot with custom input.
    """
    print("\n" + "=" * 60)
    print("SINGLE PLOT PREDICTION EXAMPLE")
    print("=" * 60)
    
    # Initialize predictor
    predictor = PlotPricePredictor()
    
    # Load the trained model
    try:
        model_path = 'plot_price_predictor.pkl'
        predictor.load_model(model_path)
    except FileNotFoundError:
        print("❌ Model file not found. Please run plot_price_predictor.py first.")
        return
    
    # Create a single data point
    single_plot = pd.DataFrame({
        'area': ['Sector 12'],
        'distance_to_city_center_km': [10.5],
        'plot_size_sqft': [4000],
        'road_width_ft': [90],
        'near_school': [True],
        'near_hospital': [False],
        'zone_type': ['Residential'],
        'has_water_supply': [True],
        'has_electricity': [True],
        'avg_price_last_6_months': [40.5]
    })
    
    print("Custom Plot Details:")
    print("-" * 30)
    print(f"Area: {single_plot['area'].iloc[0]}")
    print(f"Plot Size: {single_plot['plot_size_sqft'].iloc[0]} sq ft")
    print(f"Zone Type: {single_plot['zone_type'].iloc[0]}")
    print(f"Distance to City Center: {single_plot['distance_to_city_center_km'].iloc[0]} km")
    print(f"Road Width: {single_plot['road_width_ft'].iloc[0]} ft")
    print(f"Near School: {'Yes' if single_plot['near_school'].iloc[0] else 'No'}")
    print(f"Near Hospital: {'Yes' if single_plot['near_hospital'].iloc[0] else 'No'}")
    print(f"Water Supply: {'Yes' if single_plot['has_water_supply'].iloc[0] else 'No'}")
    print(f"Electricity: {'Yes' if single_plot['has_electricity'].iloc[0] else 'No'}")
    print(f"Avg Price (6 months): ₹{single_plot['avg_price_last_6_months'].iloc[0]}/sq ft")
    
    # Prepare features
    feature_columns = predictor.categorical_columns + predictor.numeric_columns + predictor.boolean_columns
    X_single = single_plot[feature_columns]
    
    # Make prediction
    try:
        prediction = predictor.pipeline.predict(X_single)[0]
        
        print(f"\nPrediction Result:")
        print("-" * 20)
        print(f"Predicted Total Price: ₹{prediction:,.0f}")
        print(f"Price per sq ft: ₹{prediction/single_plot['plot_size_sqft'].iloc[0]:.2f}")
        
    except Exception as e:
        print(f"❌ Error making prediction: {e}")

def main():
    """
    Main function to run the prediction examples.
    """
    # Run multiple predictions example
    predict_plot_prices()
    
    # Run single prediction example
    predict_single_plot()
    
    print("\n" + "=" * 60)
    print("EXAMPLE COMPLETED SUCCESSFULLY!")
    print("=" * 60)
    print("\nTo use this model in your own code:")
    print("1. Import: from plot_price_predictor import PlotPricePredictor")
    print("2. Initialize: predictor = PlotPricePredictor()")
    print("3. Load model: predictor.load_model('plot_price_predictor.pkl')")
    print("4. Prepare data: Create DataFrame with required columns")
    print("5. Predict: predictions = predictor.pipeline.predict(X)")

if __name__ == "__main__":
    main()
