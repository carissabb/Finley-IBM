import { useState } from 'react';

interface BudgetData {
  monthlyIncome: number;
  needs: number;
  wants: number;
  savings: number;
}

interface SavingsGoal {
  id: string;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  weeklyTarget: number;
  progress: number;
}

export default function BudgetTracker() {
  const [budget, setBudget] = useState<BudgetData>({
    monthlyIncome: 0,
    needs: 50,
    wants: 30,
    savings: 20,
  });
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    goalName: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
  });

  const needsAmount = (budget.monthlyIncome * budget.needs) / 100;
  const wantsAmount = (budget.monthlyIncome * budget.wants) / 100;
  const savingsAmount = (budget.monthlyIncome * budget.savings) / 100;

  const handleIncomeChange = (value: string) => {
    const income = parseFloat(value) || 0;
    setBudget(prev => ({ ...prev, monthlyIncome: income }));
  };

  const calculateWeeklyTarget = (target: number, current: number, deadline: string): number => {
    const remaining = target - current;
    if (remaining <= 0) return 0;

    const today = new Date();
    const deadlineDate = new Date(deadline);
    const weeksRemaining = Math.ceil((deadlineDate.getTime() - today.getTime()) / (7 * 24 * 60 * 60 * 1000));

    if (weeksRemaining <= 0) return remaining;

    return remaining / weeksRemaining;
  };

  const handleAddGoal = () => {
    if (!newGoal.goalName || !newGoal.targetAmount || !newGoal.deadline) return;

    const targetAmount = parseFloat(newGoal.targetAmount);
    const currentAmount = parseFloat(newGoal.currentAmount) || 0;
    const weeklyTarget = calculateWeeklyTarget(targetAmount, currentAmount, newGoal.deadline);
    const progress = (currentAmount / targetAmount) * 100;

    const goal: SavingsGoal = {
      id: Date.now().toString(),
      goalName: newGoal.goalName,
      targetAmount,
      currentAmount,
      deadline: newGoal.deadline,
      weeklyTarget,
      progress,
    };

    setSavingsGoals(prev => [...prev, goal]);
    setNewGoal({ goalName: '', targetAmount: '', currentAmount: '', deadline: '' });
    setShowGoalForm(false);
  };

  const updateGoalProgress = (goalId: string, newAmount: number) => {
    setSavingsGoals(prev =>
      prev.map(goal => {
        if (goal.id === goalId) {
          const progress = (newAmount / goal.targetAmount) * 100;
          const weeklyTarget = calculateWeeklyTarget(goal.targetAmount, newAmount, goal.deadline);
          return { ...goal, currentAmount: newAmount, progress, weeklyTarget };
        }
        return goal;
      })
    );
  };

  return (
    <div className="budget-tracker-container">
      <div className="budget-header">
        <h1>Budget Tracker</h1>
        <p>Plan your finances with the 50/30/20 rule</p>
      </div>

      <div className="budget-input-card">
        <label htmlFor="income">Monthly Income</label>
        <div className="income-input-wrapper">
          <span className="currency-symbol">$</span>
          <input
            id="income"
            type="number"
            value={budget.monthlyIncome || ''}
            onChange={(e) => handleIncomeChange(e.target.value)}
            placeholder="Enter your monthly income"
            className="income-input"
          />
        </div>
      </div>

      {budget.monthlyIncome > 0 && (
        <div className="budget-breakdown">
          <div className="breakdown-card needs-card">
            <div className="card-icon">🏠</div>
            <div className="card-content">
              <h3>Needs</h3>
              <p className="percentage">{budget.needs}%</p>
              <p className="amount">${needsAmount.toFixed(2)}</p>
              <p className="description">Housing, food, utilities, insurance</p>
            </div>
          </div>

          <div className="breakdown-card wants-card">
            <div className="card-icon">🎉</div>
            <div className="card-content">
              <h3>Wants</h3>
              <p className="percentage">{budget.wants}%</p>
              <p className="amount">${wantsAmount.toFixed(2)}</p>
              <p className="description">Entertainment, dining, hobbies</p>
            </div>
          </div>

          <div className="breakdown-card savings-card">
            <div className="card-icon">💎</div>
            <div className="card-content">
              <h3>Savings</h3>
              <p className="percentage">{budget.savings}%</p>
              <p className="amount">${savingsAmount.toFixed(2)}</p>
              <p className="description">Emergency fund, investments, goals</p>
            </div>
          </div>
        </div>
      )}

      <div className="savings-goals-section">
        <div className="section-header">
          <h2>Savings Goals</h2>
          <button className="add-goal-btn" onClick={() => setShowGoalForm(!showGoalForm)}>
            {showGoalForm ? 'Cancel' : '+ Add Goal'}
          </button>
        </div>

        {showGoalForm && (
          <div className="goal-form-card">
            <input
              type="text"
              placeholder="Goal name (e.g., Emergency Fund)"
              value={newGoal.goalName}
              onChange={(e) => setNewGoal({ ...newGoal, goalName: e.target.value })}
              className="goal-input"
            />
            <input
              type="number"
              placeholder="Target amount"
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
              className="goal-input"
            />
            <input
              type="number"
              placeholder="Current amount (optional)"
              value={newGoal.currentAmount}
              onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
              className="goal-input"
            />
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              className="goal-input"
            />
            <button onClick={handleAddGoal} className="save-goal-btn">
              Save Goal
            </button>
          </div>
        )}

        <div className="goals-list">
          {savingsGoals.map(goal => (
            <div key={goal.id} className="goal-card">
              <div className="goal-header">
                <h3>{goal.goalName}</h3>
                <span className="goal-target">${goal.targetAmount.toFixed(2)}</span>
              </div>

              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${Math.min(goal.progress, 100)}%` }}></div>
              </div>

              <div className="goal-stats">
                <div className="stat">
                  <span className="stat-label">Current</span>
                  <input
                    type="number"
                    value={goal.currentAmount}
                    onChange={(e) => updateGoalProgress(goal.id, parseFloat(e.target.value) || 0)}
                    className="current-amount-input"
                  />
                </div>
                <div className="stat">
                  <span className="stat-label">Weekly Target</span>
                  <span className="stat-value">${goal.weeklyTarget.toFixed(2)}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Progress</span>
                  <span className="stat-value">{goal.progress.toFixed(1)}%</span>
                </div>
              </div>

              <div className="goal-deadline">
                Deadline: {new Date(goal.deadline).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {savingsGoals.length === 0 && !showGoalForm && (
          <div className="empty-state">
            <p>No savings goals yet. Start by adding your first goal!</p>
          </div>
        )}
      </div>
    </div>
  );
}
