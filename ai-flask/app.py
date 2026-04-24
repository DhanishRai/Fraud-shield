from flask import Flask, request, jsonify
from flask_cors import CORS
from fraud_engine import analyze_transaction

app = Flask(__name__)
CORS(app) # Allow cross-origin requests from Node backend

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No input data provided"}), 400
            
        upi_id = data.get('upiId', '')
        merchant_name = data.get('merchantName', '')
        amount = data.get('amount', 0)
        reports_count = data.get('reportsCount', 0)
        
        if not upi_id:
            return jsonify({"error": "upiId is required"}), 400
            
        result = analyze_transaction(upi_id, merchant_name, amount, reports_count)
        
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "fraud-shield-ai"}), 200

if __name__ == '__main__':
    # Run the Flask app on port 5001 so it doesn't conflict with Node on 5000
    app.run(host='0.0.0.0', port=5001, debug=True)
