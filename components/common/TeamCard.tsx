import type { TeamMember } from "@/types";

export interface TeamCardProps {
  member: TeamMember;
  index: number;
}

export function TeamCard({ member, index }: TeamCardProps) {
  const initials = member.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
  return (
    <article className="flex flex-col rounded-[1.4rem] border border-line bg-snow p-6">
      <div className="flex items-center justify-between">
        <span className="grid size-14 place-items-center rounded-full bg-ink font-display text-2xl text-snow" aria-hidden>
          {initials}
        </span>
        <span className="font-mono text-xs text-muted">0{index + 1}</span>
      </div>
      <h3 className="mt-6 text-3xl">{member.name}</h3>
      <p className="mt-1 text-sm font-medium text-glacier">{member.role}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{member.built}</p>
    </article>
  );
}
