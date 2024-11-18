import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.svm import SVC, SVR
from sklearn.neural_network import MLPClassifier, MLPRegressor
#from xgboost import XGBClassifier, XGBRegressor
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score, r2_score
import matplotlib.pyplot as plt
import seaborn as sns
import json
import os

def get_model(problem_type):
    """
    Get all relevant models based on problem type
    
    Args:
        problem_type: 'classification' or 'regression'
    
    Returns:
        Dictionary of model instances
    """
    if problem_type == 'classification':
        return {
            'logistic_regression': LogisticRegression(random_state=42),
            'decision_tree': DecisionTreeClassifier(random_state=42),
            'random_forest': RandomForestClassifier(n_estimators=100, random_state=42),
            # 'xgboost': XGBClassifier(random_state=42),
            'knn': KNeighborsClassifier(),
            'svm': SVC(random_state=42),
            'naive_bayes': GaussianNB(),
            'gradient_boosting': GradientBoostingClassifier(random_state=42),
            'neural_network': MLPClassifier(random_state=42, max_iter=1000)
        }
    elif problem_type == 'regression':
        return {
            'linear_regression': LinearRegression(),
            'decision_tree': DecisionTreeRegressor(random_state=42),
            'random_forest': RandomForestRegressor(n_estimators=100, random_state=42),
            # 'xgboost': XGBRegressor(random_state=42),
            'knn': KNeighborsRegressor(),
            'svm': SVR(),
            'gradient_boosting': GradientBoostingRegressor(random_state=42),
            'neural_network': MLPRegressor(random_state=42, max_iter=1000)
        }
    else:
        raise ValueError("problem_type must be either 'classification' or 'regression'")

def run_ml_pipeline(df, target_column, output_dir='outputs'):
    """
    Complete ML pipeline that automatically detects problem type and runs all relevant models
    
    Args:
        df: Input DataFrame (cleaned)
        target_column: Name of target variable
        output_dir: Directory to save outputs (default: 'outputs')
    
    Returns:
        Tuple containing:
        1. Frontend-friendly JSON with model comparisons
        2. Dictionary of feature importance plots
    """
    # Create output directories if they don't exist
    os.makedirs(f'{output_dir}/results', exist_ok=True)
    os.makedirs(f'{output_dir}/plots', exist_ok=True)
    
    # Initialize feature importance plots dictionary
    feature_importance_plots = {}
    
    # Automatically detect problem type
    unique_values = df[target_column].nunique()
    problem_type = 'classification' if unique_values < 10 else 'regression'
    print(f"\nDetected problem type: {problem_type}")
    
    # Get all relevant models
    models = get_model(problem_type)
    
    # Prepare data once for all models
    X = df.drop(target_column, axis=1)
    y = df[target_column]
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    X_scaled = pd.DataFrame(X_scaled, columns=X.columns)
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.3, random_state=42)
    
    print("\nTraining all relevant models...")
    print("-" * 50)
    print(f"{'Model':<20} {'Train Score':>15} {'Test Score':>15}")
    print("-" * 50)
    
    # Create frontend-friendly JSON structure
    frontend_json = {
        "modelComparison": {
            "problemType": problem_type,
            "targetVariable": target_column,
            "metrics": {
                "type": "accuracy" if problem_type == 'classification' else "r2_score",
                "description": "Classification accuracy (0-1)" if problem_type == 'classification' else "R-squared score (0-1)"
            },
            "models": [],
            "bestModel": None
        }
    }
    
    # Train and evaluate each model
    for model_name, model in models.items():
        try:
            # Train model
            model.fit(X_train, y_train)
            
            # Get predictions
            train_pred = model.predict(X_train)
            test_pred = model.predict(X_test)
            
            # Calculate metrics
            if problem_type == 'classification':
                train_score = float(accuracy_score(y_train, train_pred))
                test_score = float(accuracy_score(y_test, test_pred))
            else:
                train_score = float(r2_score(y_train, train_pred))
                test_score = float(r2_score(y_test, test_pred))
            
            # Store model results in frontend-friendly format
            model_result = {
                "name": model_name,
                "scores": {
                    "train": round(train_score, 3),
                    "test": round(test_score, 3)
                }
            }
            
            # Add feature importance if available
            if hasattr(model, 'feature_importances_'):
                feature_importance = pd.DataFrame({
                    'feature': X.columns,
                    'importance': model.feature_importances_
                }).sort_values('importance', ascending=False)
                
                # Add feature importance to JSON
                model_result["featureImportance"] = [
                    {
                        "feature": row['feature'],
                        "importance": round(float(row['importance']), 3)
                    }
                    for _, row in feature_importance.head(10).iterrows()
                ]
                
                # Create plot
                plt.figure(figsize=(10, 6))
                sns.barplot(x='importance', y='feature', data=feature_importance.head(10))
                plt.title(f'Top 10 Feature Importance - {model_name}')
                plt.tight_layout()
                feature_importance_plots[model_name] = plt
            
            frontend_json["modelComparison"]["models"].append(model_result)
            print(f"{model_name:<20} {train_score:>15.3f} {test_score:>15.3f}")
            
        except Exception as e:
            print(f"{model_name:<20} Failed to run: {str(e)}")
            frontend_json["modelComparison"]["models"].append({
                "name": model_name,
                "error": str(e)
            })
    
    # Sort models by test score
    frontend_json["modelComparison"]["models"].sort(
        key=lambda x: x.get("scores", {}).get("test", -1) 
        if "scores" in x else -1, 
        reverse=True
    )
    
    # Add best model info
    valid_models = [m for m in frontend_json["modelComparison"]["models"] if "error" not in m]
    if valid_models:
        best_model = valid_models[0]
        frontend_json["modelComparison"]["bestModel"] = {
            "name": best_model["name"],
            "score": best_model["scores"]["test"]
        }
        print(f"\nBest Model: {best_model['name']}")
        print(f"Test Score: {best_model['scores']['test']:.3f}")
    # Create DataFrame for model comparisons
    model_comparison_df = pd.DataFrame([
        {
            "Model Name": model["name"],
            "Train Score": model.get("scores", {}).get("train", "N/A"),
            "Test Score": model.get("scores", {}).get("test", "N/A")
        }
        for model in frontend_json["modelComparison"]["models"]
    ])
    
    # Save as CSV
    csv_path = f'{output_dir}/results/model_comparison.csv'
    model_comparison_df.to_csv(csv_path, index=False)
    print(f"✓ Model comparison CSV saved to {csv_path}")
    # Save JSON file
    json_path = f'{output_dir}/results/model_comparison.json'
    with open(json_path, 'w') as f:
        json.dump(frontend_json, f, indent=4)
    print(f"\n✓ Model comparison saved to {json_path}")
    
    # Save feature importance plots
    for model_name, plot in feature_importance_plots.items():
        plot_path = f'{output_dir}/plots/{model_name}_importance.png'
        plot.savefig(plot_path)
        plot.close()
    print(f"✓ Feature importance plots saved to {output_dir}/plots/")
    
    return frontend_json, feature_importance_plots