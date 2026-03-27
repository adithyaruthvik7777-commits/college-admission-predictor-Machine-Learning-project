from flask import Flask, redirect, render_template, request, url_for

app = Flask(__name__)

FORM_FIELDS = ("gre", "toefl", "rating", "sop", "lor", "cgpa", "research")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/result")
def result():
    return render_template("result.html")


@app.route("/predict", methods=["POST"])
def predict():
    query_args = {field: request.form.get(field, "") for field in FORM_FIELDS}
    return redirect(url_for("result", **query_args))


if __name__ == "__main__":
    app.run(debug=True)
