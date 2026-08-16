import re
from typing import Optional

def normalize_meeting_code(code: str) -> str:
    """Strip whitespace, dashes, and special characters from a meeting code."""
    if not code:
        return ""
    return re.sub(r'[^a-zA-Z0-9]', '', code).strip()

def format_meeting_code(raw_code: str) -> str:
    """Format a 9-digit meeting code into standard XXX-XXX-XXX format if applicable."""
    cleaned = normalize_meeting_code(raw_code)
    if len(cleaned) == 9 and cleaned.isdigit():
        return f"{cleaned[:3]}-{cleaned[3:6]}-{cleaned[6:]}"
    return raw_code.strip()

def sanitize_string(text: Optional[str], default: str = "") -> str:
    """Sanitize string inputs by trimming whitespace and handling None."""
    if text is None:
        return default
    return text.strip() or default

def validate_meeting_code_format(code: str) -> bool:
    """Validate if a meeting code matches valid length and format."""
    normalized = normalize_meeting_code(code)
    return 3 <= len(normalized) <= 20
