from flask import Flask, request, render_template
import pandas as pd
from sklearn.linear_model import LinearRegression

app = Flask(__name__)

# Load and prepare dataset
df = pd.read_csv("admission_predict.csv")
df.columns = df.columns.str.strip()

# Train model
X = df[['GRE Score', 'TOEFL Score', 'University Rating', 'SOP', 'LOR', 'CGPA', 'Research']]
y = df['Chance of Admit']

model = LinearRegression()
model.fit(X, y)

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/predict', methods=['POST'])
def predict():
    gre      = float(request.form['gre'])
    toefl    = float(request.form['toefl'])
    rating   = float(request.form['rating'])
    sop      = float(request.form['sop'])
    lor      = float(request.form['lor'])
    cgpa     = float(request.form['cgpa'])
    research = float(request.form['research'])

    input_data = [[gre, toefl, rating, sop, lor, cgpa, research]]
    prediction = model.predict(input_data)

    result = round(float(prediction[0]) * 100, 2)
    result = max(1.0, min(99.0, result))  # clamp between 1–99

    return render_template("result.html", prediction=result)

if __name__ == "__main__":
    app.run(debug=True)