import s from './ProgressBar.module.css';

export function ProgressBar({ label, percent }: { label: string; percent: number }) {
  return (
    <div className={s.root}>
      <div className={`body_tiny ${s.labels}`}>
        <span>{label}</span>
        <span className="tabular">{Math.round(percent)}%</span>
      </div>
      <div className={s.track} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(percent)}>
        <span className={s.fill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
