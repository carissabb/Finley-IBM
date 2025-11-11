import { useState } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

const AVAILABLE_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_chat',
    title: 'Hello, Finley!',
    description: 'Started your first conversation with Finley',
    icon: '👋',
    points: 10,
    unlocked: true,
    unlockedAt: new Date(),
  },
  {
    id: 'first_budget',
    title: 'Budget Beginner',
    description: 'Created your first budget',
    icon: '💰',
    points: 25,
    unlocked: false,
  },
  {
    id: 'savings_goal',
    title: 'Goal Setter',
    description: 'Set up your first savings goal',
    icon: '🎯',
    points: 25,
    unlocked: false,
  },
  {
    id: 'week_streak',
    title: 'Week Warrior',
    description: 'Tracked your budget for 7 days straight',
    icon: '🔥',
    points: 50,
    unlocked: false,
  },
  {
    id: 'save_100',
    title: 'Century Saver',
    description: 'Saved your first $100',
    icon: '💵',
    points: 50,
    unlocked: false,
  },
  {
    id: 'save_1000',
    title: 'Grand Saver',
    description: 'Reached $1,000 in savings',
    icon: '💎',
    points: 100,
    unlocked: false,
  },
  {
    id: 'goal_complete',
    title: 'Dream Achiever',
    description: 'Completed your first savings goal',
    icon: '🏆',
    points: 100,
    unlocked: false,
  },
  {
    id: 'month_streak',
    title: 'Monthly Master',
    description: 'Stayed on budget for 30 days',
    icon: '⭐',
    points: 150,
    unlocked: false,
  },
  {
    id: 'financial_guru',
    title: 'Financial Guru',
    description: 'Reached Level 10',
    icon: '🤑',
    points: 200,
    unlocked: false,
  },
];

export default function Achievements() {
  const [achievements] = useState<Achievement[]>(AVAILABLE_ACHIEVEMENTS);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0);
  const maxPoints = achievements.reduce((sum, a) => sum + a.points, 0);
  const level = Math.floor(totalPoints / 100) + 1;
  const pointsToNextLevel = (level * 100) - totalPoints;

  return (
    <div className="achievements-container">
      <div className="achievements-header">
        <h1>Your Achievements</h1>
        <p>Track your financial journey milestones</p>
      </div>

      <div className="level-card">
        <div className="level-badge">
          <div className="level-number">Level {level}</div>
        </div>
        <div className="level-stats">
          <div className="stat-row">
            <span className="stat-label">Total Points</span>
            <span className="stat-value">{totalPoints} / {maxPoints}</span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${((totalPoints % 100) / 100) * 100}%` }}
            ></div>
          </div>
          <div className="stat-row">
            <span className="next-level-text">
              {pointsToNextLevel > 0
                ? `${pointsToNextLevel} points to Level ${level + 1}`
                : 'Level up available!'}
            </span>
          </div>
        </div>
      </div>

      <div className="achievements-section">
        <h2>Unlocked ({unlockedAchievements.length})</h2>
        <div className="achievements-grid">
          {unlockedAchievements.map(achievement => (
            <div key={achievement.id} className="achievement-card unlocked">
              <div className="achievement-icon">{achievement.icon}</div>
              <h3>{achievement.title}</h3>
              <p>{achievement.description}</p>
              <div className="achievement-points">+{achievement.points} points</div>
              {achievement.unlockedAt && (
                <div className="unlocked-date">
                  Unlocked {achievement.unlockedAt.toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="achievements-section">
        <h2>Locked ({lockedAchievements.length})</h2>
        <div className="achievements-grid">
          {lockedAchievements.map(achievement => (
            <div key={achievement.id} className="achievement-card locked">
              <div className="achievement-icon">{achievement.icon}</div>
              <h3>{achievement.title}</h3>
              <p>{achievement.description}</p>
              <div className="achievement-points">+{achievement.points} points</div>
            </div>
          ))}
        </div>
      </div>

      <div className="encouragement-card">
        <h3>Keep Going!</h3>
        <p>
          You're doing amazing! Every small step towards better financial habits counts.
          Complete more goals and track your budget to unlock new achievements!
        </p>
      </div>
    </div>
  );
}
