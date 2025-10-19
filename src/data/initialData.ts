import { Employee, Sector } from "@/types";

export const initialSectors: Sector[] = [
  { id: "1", name: "ESTOQUE" },
  { id: "2", name: "BALCÃO" },
  { id: "3", name: "OFICINA" },
  { id: "4", name: "MOTOBOY" },
];

export const initialEmployees: Employee[] = [
  // ESTOQUE
  { id: "1", name: "Douglas", sector: "ESTOQUE", position: "Auxiliar de Estoque" },
  { id: "2", name: "Eduardo", sector: "ESTOQUE", position: "Auxiliar de Estoque" },
  { id: "3", name: "Bruno", sector: "ESTOQUE", position: "Auxiliar de Estoque" },
  { id: "4", name: "Ramon", sector: "ESTOQUE", position: "Auxiliar de Estoque" },
  { id: "5", name: "Hyago", sector: "ESTOQUE", position: "Auxiliar de Estoque" },
  { id: "6", name: "Marcelo", sector: "ESTOQUE", position: "Auxiliar de Estoque" },
  { id: "7", name: "Matheus", sector: "ESTOQUE", position: "Auxiliar de Estoque" },
  
  // BALCÃO
  { id: "8", name: "Joselia", sector: "BALCÃO", position: "Atendente" },
  { id: "9", name: "Felipe", sector: "BALCÃO", position: "Atendente" },
  { id: "10", name: "Bragança", sector: "BALCÃO", position: "Atendente" },
  { id: "11", name: "Vinicius", sector: "BALCÃO", position: "Atendente" },
  { id: "12", name: "Jonnes", sector: "BALCÃO", position: "Atendente" },
  { id: "13", name: "Flavio", sector: "BALCÃO", position: "Atendente" },
  
  // OFICINA
  { id: "14", name: "Kevin", sector: "OFICINA", position: "Mecânico" },
  { id: "15", name: "Jhonatas", sector: "OFICINA", position: "Mecânico" },
  { id: "16", name: "Willian", sector: "OFICINA", position: "Mecânico" },
  { id: "17", name: "Christofer", sector: "OFICINA", position: "Mecânico" },
  { id: "18", name: "Hudson", sector: "OFICINA", position: "Mecânico" },
  { id: "19", name: "Lorran", sector: "OFICINA", position: "Mecânico" },
  { id: "20", name: "Alan", sector: "OFICINA", position: "Mecânico" },
  
  // MOTOBOY
  { id: "21", name: "Wallace", sector: "MOTOBOY", position: "Motoboy" },
  { id: "22", name: "Marlon", sector: "MOTOBOY", position: "Motoboy" },
];
