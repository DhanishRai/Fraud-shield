# rules.py

TRUSTED_MERCHANTS = [
    "zomato", "swiggy", "amazon", "flipkart", "irctc", 
    "bigbasket", "myntra", "paytm mall", "jiomart"
]

SCAM_KEYWORDS = [
    "support", "helpdesk", "refund", "reward", "kyc", 
    "verify", "claim", "lottery", "prize", "update", 
    "customer care", "bank", "g00gle", "phon3pe"
]

def check_trusted_merchant(merchant_name):
    """
    Check if the merchant name contains known safe merchant keywords.
    Returns True if safe, False if empty or unknown.
    """
    if not merchant_name:
        return False
        
    merchant_name_lower = merchant_name.lower()
    
    # Check if any trusted keyword is inside the merchant name
    for merchant in TRUSTED_MERCHANTS:
        if merchant in merchant_name_lower:
            return True
            
    return False

def check_fake_support_name(upi_id):
    """
    Check if the UPI ID contains words typical of a scammer or fake support.
    Also detects common number substitutions like g00gle.
    Returns True if suspicious, False if clean.
    """
    if not upi_id:
        return False
        
    upi_id_lower = upi_id.lower()
    
    # Check if any scam keyword or number substitution is in the UPI ID
    for keyword in SCAM_KEYWORDS:
        if keyword in upi_id_lower:
            return True
            
    return False
