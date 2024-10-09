from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)
CORS(app)

# Constants
BASE_URL = 'http://localhost:5000/api/expense'  # Replace with your backend URL

def fetch_historical_expenses(token):
    """Fetch historical expenses from the backend."""
    try:
        response = requests.get(
            f'{BASE_URL}/user/historical',
            headers={'Authorization': f'Bearer {token}'}
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return []

def prepare_data(data):
    """Prepare data for analysis."""
    expenses = []
    for expense in data:
        month = pd.to_datetime(expense['createdAt']).month
        year = pd.to_datetime(expense['createdAt']).year
        expenses.append({
            'category_name': expense['Category']['category_name'],
            'amount': expense['amount'],
            'month': month,
            'year': year
        })
    return pd.DataFrame(expenses)

def build_and_predict_next_year_expenses(df):
    """Build a model and predict next year's expenses."""
    yearly_expenses = df.groupby(['category_name', 'year']).sum().reset_index()

    le = LabelEncoder()
    yearly_expenses['category_encoded'] = le.fit_transform(yearly_expenses['category_name'])

    X = yearly_expenses[['category_encoded', 'year']]
    y = yearly_expenses['amount']

    model = LinearRegression()
    model.fit(X, y)

    next_year = yearly_expenses['year'].max() + 1
    next_year_data = pd.DataFrame({
        'category_encoded': yearly_expenses['category_encoded'].unique(),
        'year': next_year
    })

    predictions = model.predict(next_year_data)

    return pd.DataFrame({
        'category_name': le.inverse_transform(next_year_data['category_encoded']),
        'predicted_amount': predictions
    })

def analyze_spending_habits(df):
    """Analyze spending habits by category."""
    spending_summary = df.groupby('category_name')['amount'].sum().reset_index()
    spending_summary.sort_values(by='amount', ascending=False, inplace=True)
    return spending_summary

@app.route('/run-expense-prediction', methods=['GET'])
def run_expense_prediction():
    """Run prediction and spending habits analysis."""
    # Get the token from the request headers
    token = request.headers.get('Authorization').split(" ")[1]  # Extract token from "Bearer {token}"
    
    historical_data = fetch_historical_expenses(token)
    if not historical_data:
        return jsonify({"error": "No historical data found."})

    df = prepare_data(historical_data)

    # Predict next year's expenses
    predicted_expenses = build_and_predict_next_year_expenses(df)

    # Analyze spending habits
    spending_habits = analyze_spending_habits(df)

    # Return both predictions and spending habits
    return jsonify({
        "predicted_expenses": predicted_expenses.to_dict(),
        "spending_habits": spending_habits.to_dict()
    })

if __name__ == "__main__":
    app.run(debug=True, port=5001)  # Specify the port number
