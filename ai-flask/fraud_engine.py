from rules import check_trusted_merchant, check_fake_support_name

def analyze_transaction(upi_id, merchant_name, amount, reports_count=0):
    """
    Rule-based scoring engine.
    Risk scoring:
    0-30: safe
    31-70: suspicious
    71-100: dangerous
    """
    
    # Trusted merchant override: always safe regardless of other rules
    if check_trusted_merchant(merchant_name):
        return {
            "risk_score": 0,
            "status": "SAFE",
            "reason": ["Verified trusted merchant"]
        }

    risk_score = 0
    reasons = []

    # 1. Check for fake support names / dangerous keywords in UPI
    if check_fake_support_name(upi_id):
        risk_score += 80
        reasons.append("Reported suspicious UPI formatting (e.g. fake support/reward)")
    
    # 2. Check Amount
    try:
        amt = float(amount)
        if amt > 5000:
            risk_score += 40
            reasons.append("Unusual high amount (>5000)")
    except (ValueError, TypeError):
        pass # Invalid amount format

    # 3. Check Merchant Name
    if merchant_name:
        risk_score += 15
        reasons.append("Unknown merchant")
    else:
        risk_score += 20
        reasons.append("No merchant name provided")

    # 4. Dynamic Risk from Blacklist/Reports
    if reports_count > 0:
        added_risk = reports_count * 20
        risk_score += added_risk
        reasons.append(f"UPI ID has been reported {reports_count} time(s)")

    # Cap the score between 0 and 100
    risk_score = max(0, min(100, risk_score))

    # Determine status
    if risk_score <= 30:
        status = "SAFE"
        reasons = ["Safe transaction"]
    elif risk_score <= 70:
        status = "SUSPICIOUS"
    else:
        status = "HIGH RISK"

    return {
        "risk_score": risk_score,
        "status": status,
        "reason": reasons
    }
