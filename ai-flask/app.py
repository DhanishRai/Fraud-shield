from flask import Flask, request, jsonify
from fraud_logic import analyze_upi

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    upi_id = data.get('upi_id')
    result = analyze_upi(upi_id)
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
