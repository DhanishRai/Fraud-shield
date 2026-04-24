# Fraud rules definitions

SAFE_MERCHANTS = [
    'amazon', 'flipkart', 'zomato', 'swiggy', 'uber', 'ola', 
    'reliance', 'dmart', 'bigbasket', 'blinkit'
]

SUSPICIOUS_KEYWORDS = [
    'customercare', 'support', 'helpdesk', 'reward', 'cashback', 
    'claim', 'winner', 'lottery', 'refund', 'banksupport'
]

def check_trusted_merchant(merchant_name):
    if not merchant_name:
        return False
    name_lower = merchant_name.lower().replace(" ", "")
    for safe in SAFE_MERCHANTS:
        if safe in name_lower:
            return True
    return False

def check_fake_support_name(upi_id):
    if not upi_id:
        return False
    upi_lower = upi_id.lower()
    for keyword in SUSPICIOUS_KEYWORDS:
        if keyword in upi_lower:
            return True
    return False
