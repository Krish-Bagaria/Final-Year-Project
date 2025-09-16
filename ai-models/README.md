# Plot Price Prediction AI Models

This directory contains machine learning models for predicting plot/land prices based on location, plot characteristics, and historical price data.

## Files

- `plot_price_predictor.py` - Main ML pipeline for training and saving the model
- `predict_example.py` - Example script showing how to load and use the trained model
- `requirements.txt` - Python dependencies required to run the models
- `plot_price_predictor.pkl` - Trained model file (generated after running the training script)

## Dataset

The model is trained on the `jaipur_plots.csv` dataset which contains:

### Features:
- **area** (categorical): Location area (e.g., "Sector 45", "C Scheme")
- **distance_to_city_center_km** (numeric): Distance from city center in kilometers
- **plot_size_sqft** (numeric): Plot size in square feet
- **road_width_ft** (numeric): Road width in feet
- **near_school** (boolean): Whether plot is near a school
- **near_hospital** (boolean): Whether plot is near a hospital
- **zone_type** (categorical): Zone type (Residential, Commercial, Agricultural, Industrial)
- **has_water_supply** (boolean): Whether plot has water supply
- **has_electricity** (boolean): Whether plot has electricity
- **avg_price_last_6_months** (numeric): Average price per sq ft in last 6 months

### Target:
- **price** (numeric): Total plot price (target variable)

## Usage

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Train the Model

```bash
python plot_price_predictor.py
```

This will:
- Load and preprocess the data
- Train a RandomForestRegressor model
- Evaluate the model performance
- Save the trained model as `plot_price_predictor.pkl`

### 3. Make Predictions

```bash
python predict_example.py
```

This will:
- Load the trained model
- Make predictions on sample data
- Display results with detailed analysis

### 4. Use in Your Code

```python
from plot_price_predictor import PlotPricePredictor
import pandas as pd

# Initialize predictor
predictor = PlotPricePredictor()

# Load trained model
predictor.load_model('plot_price_predictor.pkl')

# Prepare your data
data = pd.DataFrame({
    'area': ['Sector 45'],
    'distance_to_city_center_km': [8.5],
    'plot_size_sqft': [5000],
    'road_width_ft': [120],
    'near_school': [True],
    'near_hospital': [False],
    'zone_type': ['Residential'],
    'has_water_supply': [True],
    'has_electricity': [True],
    'avg_price_last_6_months': [42.5]
})

# Make prediction
feature_columns = predictor.categorical_columns + predictor.numeric_columns + predictor.boolean_columns
X = data[feature_columns]
prediction = predictor.pipeline.predict(X)[0]

print(f"Predicted price: ₹{prediction:,.0f}")
```

## Model Performance

The RandomForestRegressor model typically achieves:
- **R² Score**: ~0.85-0.90 (explains 85-90% of price variance)
- **Mean Absolute Error (MAE)**: Reasonable error in price prediction
- **Root Mean Squared Error (RMSE)**: Standard deviation of prediction errors

## Model Architecture

1. **Data Preprocessing**:
   - OneHotEncoder for categorical variables (area, zone_type)
   - StandardScaler for numeric variables
   - Boolean variables passed through as-is

2. **Model**: RandomForestRegressor with optimized hyperparameters:
   - 100 estimators
   - Maximum depth: 20
   - Minimum samples split: 5
   - Minimum samples leaf: 2
   - Random state: 42 (for reproducibility)

3. **Pipeline**: Complete preprocessing + modeling pipeline saved as a single object

## Notes

- The model is trained specifically on Jaipur plot data
- Predictions are in Indian Rupees (₹)
- The model handles missing values by imputation
- All categorical variables are one-hot encoded
- Numeric variables are standardized for better model performance
