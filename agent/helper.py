def extract_text(response):
    content = response.content

    # Case 1: already a string
    if isinstance(content, str):
        return content

    # Case 2: list of strings or list of dicts
    if isinstance(content, list):
        parts = []
        for item in content:
            if isinstance(item, str):
                parts.append(item)
            elif isinstance(item, dict):
                # pick fields that contain text if they exist
                if "text" in item:
                    parts.append(item["text"])
                elif "content" in item:
                    parts.append(item["content"])
        return "\n".join(parts)

    # Fallback
    return str(content)


def _to_float(x):
    """Safely convert common money formats to float."""
    if x is None:
        return None
    if isinstance(x, (int, float)):
        return float(x)
    if isinstance(x, str):
        s = x.lower().replace(",", "").replace("$", "").strip()
        # handle things like "1.2k"
        if s.endswith("k"):
            return float(s[:-1]) * 1000
        # handle things like "100-150"
        if "-" in s:
            parts = s.split("-")
            try:
                nums = [float(p) for p in parts]
                return sum(nums) / len(nums)    # midpoint
            except:
                pass
        try:
            return float(s)
        except:
            return None
    return None


def _normalize_to_monthly(amount, freq):
    """Convert amounts to monthly based on frequency."""
    if amount is None:
        return None

    if freq in ["monthly", None]:
        return amount
    if freq == "yearly" or freq == "annual":
        return amount / 12
    if freq == "weekly":
        return amount * 52 / 12
    if freq == "biweekly" or freq == "bi-weekly":
        return amount * 26 / 12
    if freq == "daily":
        return amount * 30.4375   # avg month length

    return amount  # unknown frequency → leave unchanged
