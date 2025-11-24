export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
  isError?: boolean;
}

export interface CodeState {
  filename: string;
  language: string;
  content: string;
}

export enum StepStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export interface Step {
  id: number;
  title: string;
  description: string;
  status: StepStatus;
}

export interface ChartData {
  name: string;
  value: number;
  fill: string;
}