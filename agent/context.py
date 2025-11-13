import os
import logging
from langchain_ibm import ChatWatsonx
from pydantic import SecretStr
from langgraph.graph import MessagesState
from typing import Dict, Optional, List


WATSONX_API_KEY = os.environ["WATSONX_API_KEY"]
WATSONX_PROJECT_ID = os.environ["WATSONX_PROJECT_ID"]
WATSONX_URL = SecretStr(os.getenv("WATSONX_URL", "https://us-south.ml.cloud.ibm.com"))
llm = ChatWatsonx(
  model_id="ibm/granite-3-3-8b-instruct",
  project_id=WATSONX_PROJECT_ID,
  url=WATSONX_URL,
)

logger = logging.getLogger("finley")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(name)s: %(message)s"))
logger.addHandler(handler)
logger.propagate = False

class BudgetState(MessagesState):
    # --- Raw user inputs ---
    income_streams: Dict[str, float]               # {"job": 4200, "side hustle": 600}
    fixed_expenses: Dict[str, float]               # {"rent": 1400, "insurance": 250}
    variable_expenses: Dict[str, float]            # {"food": 300, "entertainment": 200}
    debts: Dict[str, Dict[str, float]]             # {"loanA": {"balance": 5000, "rate": 0.06}}
    savings_goals: Dict[str, float]                # {"emergency": 6000, "vacation": 1200}

    # --- Normalized + derived ---
    total_income: float
    total_expenses: float
    surplus: float                                  # income - expenses
    debt_minimums: Dict[str, float]                 # min payments
    required_savings_per_month: Dict[str, float]

    # --- Plan-generation state ---
    plan_constraints: Dict[str, float]              # user-defined rules, e.g. {"max_housing_pct": 0.3}
    plan_candidates: List[Dict]                     # multiple possible budgets generated
    recommended_plan: Optional[Dict]                # final selected one

    # --- Validation flags ---
    is_data_complete: bool
    is_plan_valid: bool

