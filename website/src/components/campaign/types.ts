// Party component types and interfaces
export interface Character {
  name: string;
  race: string;
  class: string;
  description: string;
  roles: Array<{ name: string; style: string }>;
  gradient: string;
}

export interface Quest {
  title: string;
  status: string;
  statusColor: string;
  description: string;
  tags: Array<{ name: string; color: string }>;
  details: string;
  borderColor: string;
}

export interface TimelineEvent {
  number: string;
  title: string;
  date: string;
  description: string;
  tags: Array<{ name: string; color: string }>;
  isFuture?: boolean;
}

export interface Mystery {
  title: string;
  description: string;
  tag: { name: string; color: string };
}

export interface Rumor {
  title: string;
  status: string;
  statusColor: string;
  description: string;
  tags: Array<{ name: string; color: string }>;
  details: string;
  borderColor: string;
}

export interface StatCard {
  value: number;
  label: string;
  color: string;
}

export interface Resource {
  href: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

export interface QuickNav {
  href: string;
  icon: string;
  label: string;
}
