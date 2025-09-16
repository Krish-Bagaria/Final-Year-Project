"""
Plot Price Prediction Pipeline
==============================

This script implements a complete machine learning pipeline for predicting plot prices
based on location, plot characteristics, and historical price data.

Features:
- Data preprocessing with OneHotEncoder and StandardScaler
- RandomForestRegressor model training
- Model evaluation with R², MAE, and RMSE metrics
- Model persistence using joblib
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import joblib
import os
import warnings
warnings.filterwarnings('ignore')

class PlotPricePredictor:
    """
    A complete machine learning pipeline for predicting plot prices.
    """
    
    def __init__(self):
        self.pipeline = None
        self.feature_columns = None
        self.categorical_columns = ['area', 'zone_type']
        self.numeric_columns = ['distance_to_city_center_km', 'plot_size_sqft', 
                              'road_width_ft', 'avg_price_last_6_months']
        self.boolean_columns = ['near_school', 'near_hospital', 'has_water_supply', 'has_electricity']
        
    def load_data(self, file_path):
        """
        Load the dataset from CSV file.
        
        Args:
            file_path (str): Path to the CSV file
            
        Returns:
            pd.DataFrame: Loaded dataset
        """
        print(f"Loading data from {file_path}...")
        df = pd.read_csv(file_path)
        print(f"Dataset loaded successfully. Shape: {df.shape}")
        return df
    
    def preprocess_data(self, df):
        """
        Preprocess the dataset by handling missing values and preparing features.
        
        Args:
            df (pd.DataFrame): Raw dataset
            
        Returns:
            pd.DataFrame: Preprocessed dataset
        """
        print("Preprocessing data...")
        
        # Create a copy to avoid modifying original data
        df_processed = df.copy()
        
        # Handle missing values
        print("Handling missing values...")
        missing_before = df_processed.isnull().sum().sum()
        print(f"Missing values before preprocessing: {missing_before}")
        
        # Drop rows with missing values in critical columns
        df_processed = df_processed.dropna(subset=['price'])
        
        # For numeric columns, fill missing values with median
        for col in self.numeric_columns:
            if col in df_processed.columns:
                df_processed[col] = df_processed[col].fillna(df_processed[col].median())
        
        # For boolean columns, fill missing values with False
        for col in self.boolean_columns:
            if col in df_processed.columns:
                df_processed[col] = df_processed[col].fillna(False)
        
        # For categorical columns, fill missing values with 'Unknown'
        for col in self.categorical_columns:
            if col in df_processed.columns:
                df_processed[col] = df_processed[col].fillna('Unknown')
        
        missing_after = df_processed.isnull().sum().sum()
        print(f"Missing values after preprocessing: {missing_after}")
        
        # Convert boolean columns to int (0/1)
        for col in self.boolean_columns:
            if col in df_processed.columns:
                df_processed[col] = df_processed[col].astype(int)
        
        print("Data preprocessing completed.")
        return df_processed
    
    def create_pipeline(self):
        """
        Create the preprocessing and modeling pipeline.
        
        Returns:
            sklearn.pipeline.Pipeline: Complete ML pipeline
        """
        print("Creating ML pipeline...")
        
        # Define preprocessing steps
        numeric_transformer = StandardScaler()
        categorical_transformer = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
        
        # Combine all feature columns
        all_feature_columns = self.categorical_columns + self.numeric_columns + self.boolean_columns
        
        # Create column transformer
        preprocessor = ColumnTransformer(
            transformers=[
                ('num', numeric_transformer, self.numeric_columns),
                ('cat', categorical_transformer, self.categorical_columns),
                ('bool', 'passthrough', self.boolean_columns)
            ]
        )
        
        # Create complete pipeline
        self.pipeline = Pipeline([
            ('preprocessor', preprocessor),
            ('regressor', RandomForestRegressor(
                n_estimators=100,
                random_state=42,
                max_depth=20,
                min_samples_split=5,
                min_samples_leaf=2,
                n_jobs=-1
            ))
        ])
        
        print("Pipeline created successfully.")
        return self.pipeline
    
    def train_model(self, X, y):
        """
        Train the model using the provided features and target.
        
        Args:
            X (pd.DataFrame): Feature matrix
            y (pd.Series): Target variable
            
        Returns:
            sklearn.pipeline.Pipeline: Trained pipeline
        """
        print("Training model...")
        
        # Create pipeline if not already created
        if self.pipeline is None:
            self.create_pipeline()
        
        # Train the model
        self.pipeline.fit(X, y)
        
        print("Model training completed.")
        return self.pipeline
    
    def evaluate_model(self, X_test, y_test):
        """
        Evaluate the trained model on test data.
        
        Args:
            X_test (pd.DataFrame): Test features
            y_test (pd.Series): Test target
            
        Returns:
            dict: Evaluation metrics
        """
        print("Evaluating model...")
        
        # Make predictions
        y_pred = self.pipeline.predict(X_test)
        
        # Calculate metrics
        r2 = r2_score(y_test, y_pred)
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        
        metrics = {
            'R² Score': r2,
            'Mean Absolute Error (MAE)': mae,
            'Root Mean Squared Error (RMSE)': rmse
        }
        
        print("Model evaluation completed.")
        return metrics
    
    def save_model(self, file_path='plot_price_predictor.pkl'):
        """
        Save the trained pipeline to disk.
        
        Args:
            file_path (str): Path where to save the model
        """
        print(f"Saving model to {file_path}...")
        
        if self.pipeline is None:
            raise ValueError("No trained model found. Please train the model first.")
        
        # Create directory if it doesn't exist (only if there's a directory path)
        if os.path.dirname(file_path):
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        # Save the model
        joblib.dump(self.pipeline, file_path)
        print(f"Model saved successfully as {file_path}")
    
    def load_model(self, file_path='plot_price_predictor.pkl'):
        """
        Load a trained pipeline from disk.
        
        Args:
            file_path (str): Path to the saved model
            
        Returns:
            sklearn.pipeline.Pipeline: Loaded pipeline
        """
        print(f"Loading model from {file_path}...")
        self.pipeline = joblib.load(file_path)
        print("Model loaded successfully.")
        return self.pipeline

def main():
    """
    Main function to run the complete pipeline.
    """
    print("=" * 60)
    print("PLOT PRICE PREDICTION PIPELINE")
    print("=" * 60)
    
    # Initialize the predictor
    predictor = PlotPricePredictor()
    
    # Load data
    data_path = '../DataSets/jaipur_plots.csv'
    df = predictor.load_data(data_path)
    
    # Preprocess data
    df_processed = predictor.preprocess_data(df)
    
    # Prepare features and target
    feature_columns = predictor.categorical_columns + predictor.numeric_columns + predictor.boolean_columns
    X = df_processed[feature_columns]
    y = df_processed['price']
    
    print(f"Features used: {feature_columns}")
    print(f"Target variable: price")
    print(f"Training data shape: {X.shape}")
    
    # Split data
    print("\nSplitting data into train/test sets (80/20)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"Training set: {X_train.shape}")
    print(f"Test set: {X_test.shape}")
    
    # Train model
    print("\n" + "=" * 40)
    print("MODEL TRAINING")
    print("=" * 40)
    predictor.train_model(X_train, y_train)
    
    # Evaluate model
    print("\n" + "=" * 40)
    print("MODEL EVALUATION")
    print("=" * 40)
    metrics = predictor.evaluate_model(X_test, y_test)
    
    # Print results
    print("\nModel Performance:")
    print("-" * 30)
    for metric, value in metrics.items():
        print(f"{metric}: {value:.4f}")
    
    # Save model
    print("\n" + "=" * 40)
    print("MODEL PERSISTENCE")
    print("=" * 40)
    model_path = 'plot_price_predictor.pkl'
    predictor.save_model(model_path)
    
    print(f"\nModel saved as {model_path}")
    print("\nPipeline completed successfully!")
    
    return predictor

if __name__ == "__main__":
    predictor = main()
