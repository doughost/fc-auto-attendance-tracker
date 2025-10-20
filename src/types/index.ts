export interface Employee {
  id: string;
  name: string;
  sector: string;
  position: string;
}

export interface Absence {
  id: string;
  employee_id: string;
  employee_name: string;
  sector: string;
  position: string;
  date: string;
  reason: string;
  justified: boolean;
  observations?: string;
}

export interface Sector {
  id: string;
  name: string;
}

export interface Position {
  id: string;
  name: string;
}
