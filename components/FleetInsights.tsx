
import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';

import type { FleetInsight } from '@/lib/insights';

export default function FleetInsights({
  insights,
  generated,
}: {
  insights: FleetInsight[] | null;
  generated: boolean;
}) {
  const iconFor = (tone: FleetInsight['tone']) => {
    if (tone === 'negative') {
      return <AlertTriangle size={18} />;
    }

    if (tone === 'positive') {
      return <CheckCircle2 size={18} />;
    }

    if (tone === 'warning') {
      return <TrendingUp size={18} />;
    }

    return <Lightbulb size={18} />;
  };

  return (
    <section
      className="panel insights-panel"
      id="insights"
      aria-labelledby="insights-heading"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">DECISION SUPPORT</p>
          <h2 id="insights-heading">Fleet insights</h2>
        </div>

        <span className="detail-icon">
          <Lightbulb size={18} />
        </span>
      </div>

      {!generated || !insights ? (
        <div className="insights-empty">
          <div className="insight-bulb">
            <Lightbulb size={22} />
          </div>

          <h3>Know where to look next</h3>

          <p>
            Generate calculated fleet findings with their supporting figures
            and practical next steps to investigate.
          </p>

          <span>
            Rule-based analysis. No external AI or network calls
          </span>
        </div>
      ) : (
        <div className="insight-list" aria-live="polite">
          {insights.map((insight, index) => (
            <article
              className={`insight-item insight-${insight.tone}`}
              key={`${insight.title}-${index}`}
            >
              <div className="insight-symbol" aria-hidden="true">
                {iconFor(insight.tone)}
              </div>

              <div className="insight-copy">
                <h3>{insight.title}</h3>

                <p>{insight.finding}</p>

                {insight.evidence.length > 0 && (
                  <ul
                    className="insight-evidence"
                    aria-label="Supporting evidence"
                  >
                    {insight.evidence.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}

                <p>
                  <strong>Suggested investigation:</strong>{' '}
                  {insight.suggestion}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
