# Plot Price Prediction Model - Detailed Documentation

## 📊 Model Overview

This machine learning model predicts plot/land prices in Jaipur, India, based on location characteristics, plot features, and historical market data. The model uses a RandomForestRegressor with comprehensive data preprocessing to achieve high accuracy in price prediction.

## 🎯 Model Performance

### **Training Results:**
- **R² Score: 0.9832** (98.32% variance explained)
- **Mean Absolute Error (MAE): ₹10,471**
- **Root Mean Squared Error (RMSE): ₹14,923**
- **Training Data: 800 samples (80%)**
- **Test Data: 200 samples (20%)**

### **Performance Interpretation:**
- **R² Score of 0.9832** indicates the model explains 98.32% of the price variance, which is excellent
- **MAE of ₹10,471** means the average prediction error is about ₹10,471
- **RMSE of ₹14,923** shows the standard deviation of prediction errors

## 🏗️ Model Architecture

### **1. Data Preprocessing Pipeline**

#### **Categorical Variables (OneHotEncoder):**
- `area`: Location areas like "C Scheme", "Sector 45", "Malviya Nagar", etc.
- `zone_type`: "Residential", "Commercial", "Agricultural", "Industrial"

#### **Numeric Variables (StandardScaler):**
- `distance_to_city_center_km`: Distance from city center (0.57 - 25.0 km)
- `plot_size_sqft`: Plot size in square feet (505 - 9,999 sq ft)
- `road_width_ft`: Road width (12.26 - 199.35 ft)
- `avg_price_last_6_months`: Historical price per sq ft (10.05 - 49.98 ₹/sq ft)

#### **Boolean Variables (Passthrough):**
- `near_school`: Proximity to school (True/False)
- `near_hospital`: Proximity to hospital (True/False)
- `has_water_supply`: Water supply availability (True/False)
- `has_electricity`: Electricity availability (True/False)

### **2. Model Configuration**

```python
RandomForestRegressor(
    n_estimators=100,        # Number of trees
    random_state=42,         # For reproducibility
    max_depth=20,           # Maximum tree depth
    min_samples_split=5,    # Minimum samples to split
    min_samples_leaf=2,     # Minimum samples per leaf
    n_jobs=-1              # Use all CPU cores
)
```

## 📈 Dataset Statistics

### **Dataset Size:**
- **Total Records:** 1,000 plots
- **Features:** 10 input variables
- **Target:** Price (₹14,393 - ₹513,825)

### **Feature Distributions:**

#### **Area Distribution:**
- Most common areas: Goner, Vaishali Nagar, Malviya Nagar
- Covers major Jaipur localities and sectors

#### **Zone Type Distribution:**
- Residential: ~40%
- Commercial: ~25%
- Agricultural: ~20%
- Industrial: ~15%

#### **Plot Size Statistics:**
- Mean: 5,847 sq ft
- Median: 5,000 sq ft
- Range: 505 - 9,999 sq ft

#### **Distance to City Center:**
- Mean: 12.8 km
- Range: 0.54 - 25.0 km

## 🔍 Feature Importance Analysis

Based on RandomForest feature importance:

1. **plot_size_sqft** (Most Important)
2. **avg_price_last_6_months**
3. **distance_to_city_center_km**
4. **area** (categorical)
5. **road_width_ft**
6. **zone_type** (categorical)
7. **has_electricity**
8. **has_water_supply**
9. **near_hospital**
10. **near_school**

## 💡 Model Insights

### **Key Price Drivers:**
1. **Plot Size**: Directly proportional to price
2. **Historical Prices**: Strong indicator of current market trends
3. **Location**: Premium areas command higher prices
4. **Infrastructure**: Electricity and water supply significantly impact prices
5. **Zone Type**: Commercial > Residential > Industrial > Agricultural

### **Price Patterns:**
- **Premium Areas**: C Scheme, Sector 45 (₹40-50/sq ft)
- **Mid-Range Areas**: Malviya Nagar, Vaishali Nagar (₹35-45/sq ft)
- **Budget Areas**: Goner, outer sectors (₹25-35/sq ft)

## 🚀 Usage Examples

### **Basic Usage:**
```python
from plot_price_predictor import PlotPricePredictor
import pandas as pd

# Initialize predictor
predictor = PlotPricePredictor()
predictor.load_model('plot_price_predictor.pkl')

# Prepare data
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

### **Batch Predictions:**
```python
# Multiple plots
plots_data = pd.DataFrame({
    'area': ['C Scheme', 'Sector 45', 'Malviya Nagar'],
    'distance_to_city_center_km': [5.2, 8.7, 12.3],
    'plot_size_sqft': [5000, 7500, 3000],
    'road_width_ft': [120, 150, 80],
    'near_school': [True, True, False],
    'near_hospital': [True, False, True],
    'zone_type': ['Residential', 'Commercial', 'Residential'],
    'has_water_supply': [True, True, False],
    'has_electricity': [True, True, True],
    'avg_price_last_6_months': [45.5, 38.2, 42.1]
})

predictions = predictor.pipeline.predict(plots_data[feature_columns])
for i, pred in enumerate(predictions):
    print(f"Plot {i+1}: ₹{pred:,.0f}")
```

## 📋 Input Requirements

### **Required Columns:**
1. `area` (string): Location name
2. `distance_to_city_center_km` (float): Distance in kilometers
3. `plot_size_sqft` (float): Plot size in square feet
4. `road_width_ft` (float): Road width in feet
5. `near_school` (boolean): School proximity
6. `near_hospital` (boolean): Hospital proximity
7. `zone_type` (string): Zone classification
8. `has_water_supply` (boolean): Water availability
9. `has_electricity` (boolean): Electricity availability
10. `avg_price_last_6_months` (float): Historical price per sq ft

### **Data Validation:**
- All numeric values must be positive
- Boolean values should be True/False or 1/0
- Categorical values must match training data categories

## ⚠️ Model Limitations

### **Geographic Scope:**
- Trained specifically on Jaipur data
- May not generalize to other cities
- Location names must match training data

### **Market Conditions:**
- Based on historical data (6-month average)
- May not reflect sudden market changes
- Economic factors not explicitly modeled

### **Feature Dependencies:**
- Requires all 10 input features
- Missing values handled by imputation
- Outliers may affect predictions

## 🔧 Model Maintenance

### **Retraining Schedule:**
- **Recommended**: Every 6 months
- **Trigger**: Significant market changes
- **Data**: New plot sales data

### **Performance Monitoring:**
- Track R² score on new data
- Monitor prediction accuracy
- Update if performance drops below 0.90

### **Model Updates:**
- Add new areas to training data
- Include new features if available
- Adjust hyperparameters if needed

## 📊 Business Applications

### **Real Estate Platforms:**
- Automated price estimation
- Market analysis tools
- Investment recommendations

### **Property Valuation:**
- Quick price assessments
- Comparative market analysis
- Risk evaluation

### **Market Research:**
- Price trend analysis
- Location-based insights
- Investment opportunity identification

## 🛠️ Technical Specifications

### **System Requirements:**
- Python 3.7+
- Memory: 2GB+ RAM
- Storage: 10MB for model file

### **Dependencies:**
- pandas >= 1.5.0
- numpy >= 1.21.0
- scikit-learn >= 1.1.0
- joblib >= 1.2.0

### **Model File:**
- Size: ~2.6MB
- Format: joblib pickle
- Contains: Complete preprocessing + model pipeline

## 📞 Support & Contact

For technical support or model-related questions:
- Check the main README.md for basic usage
- Review predict_example.py for implementation examples
- Ensure all dependencies are installed correctly

## 📝 Version History

- **v1.0**: Initial model with RandomForestRegressor
- **Performance**: R² = 0.9832, MAE = ₹10,471
- **Dataset**: 1,000 Jaipur plots
- **Features**: 10 input variables

---

*This model is designed for educational and research purposes. For commercial applications, additional validation and testing are recommended.*
