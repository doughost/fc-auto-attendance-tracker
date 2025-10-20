-- Create sectors table
CREATE TABLE public.sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create employees table
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sector TEXT NOT NULL,
  position TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create absences table
CREATE TABLE public.absences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  sector TEXT NOT NULL,
  position TEXT NOT NULL,
  date DATE NOT NULL,
  reason TEXT NOT NULL,
  justified BOOLEAN DEFAULT false,
  observations TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.absences ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since there's no auth yet)
CREATE POLICY "Allow public read access on sectors"
  ON public.sectors FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on sectors"
  ON public.sectors FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public delete on sectors"
  ON public.sectors FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access on employees"
  ON public.employees FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on employees"
  ON public.employees FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update on employees"
  ON public.employees FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete on employees"
  ON public.employees FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access on absences"
  ON public.absences FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on absences"
  ON public.absences FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update on absences"
  ON public.absences FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete on absences"
  ON public.absences FOR DELETE
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_employees_sector ON public.employees(sector);
CREATE INDEX idx_absences_employee_id ON public.absences(employee_id);
CREATE INDEX idx_absences_date ON public.absences(date);