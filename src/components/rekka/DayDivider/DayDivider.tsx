import s from './DayDivider.module.css';

export function DayDivider({ label }: { label: string }) {
  return <p className={`body_tiny ${s.root}`}>{label}</p>;
}
