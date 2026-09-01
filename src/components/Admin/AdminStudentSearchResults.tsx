import type { Student } from "../../types/students";
import StudentSearchCard from "./StudentSearchCard";

const students = [
  {
    id: "1",
    name: "Luka Marić",
    email: "luka.maric@gmail.com",
    phone: "+385 91 234 5678",
  },
  {
    id: "2",
    name: "Petra Antić",
    email: "petra.antic@gmail.com",
    phone: "+385 98 345 6789",
  },
  {
    id: "3",
    name: "Ivan Vuković",
    email: "ivan.vukovic@gmail.com",
    phone: "+385 95 456 7890",
  },
  {
    id: "4",
    name: "Ana Kovač",
    email: "ana.kovac@gmail.com",
    phone: "+385 99 567 8901",
  },
  {
    id: "5",
    name: "Marko Horvat",
    email: "marko.horvat@gmail.com",
    phone: "+385 91 678 9012",
  },
  {
    id: "6",
    name: "Lucija Babić",
    email: "lucija.babic@gmail.com",
    phone: "+385 98 789 0123",
  },
  {
    id: "7",
    name: "Filip Novak",
    email: "filip.novak@gmail.com",
    phone: "+385 95 890 1234",
  },
  {
    id: "8",
    name: "Mia Jurić",
    email: "mia.juric@gmail.com",
    phone: "+385 99 901 2345",
  },
  {
    id: "9",
    name: "Nikola Radić",
    email: "nikola.radic@gmail.com",
    phone: "+385 91 012 3456",
  },
  {
    id: "10",
    name: "Sara Matić",
    email: "sara.matic@gmail.com",
    phone: "+385 98 123 4567",
  },
  {
    id: "11",
    name: "Matej Perić",
    email: "matej.peric@gmail.com",
    phone: "+385 95 234 5678",
  },
  {
    id: "12",
    name: "Ema Barišić",
    email: "ema.barisic@gmail.com",
    phone: "+385 99 345 6789",
  },
  {
    id: "13",
    name: "Josip Grgić",
    email: "josip.grgic@gmail.com",
    phone: "+385 91 456 7890",
  },
  {
    id: "14",
    name: "Lea Pavlović",
    email: "lea.pavlovic@gmail.com",
    phone: "+385 98 567 8901",
  },
  {
    id: "15",
    name: "Karlo Šarić",
    email: "karlo.saric@gmail.com",
    phone: "+385 95 678 9012",
  },
  {
    id: "16",
    name: "Nika Božić",
    email: "nika.bozic@gmail.com",
    phone: "+385 99 789 0123",
  },
  {
    id: "17",
    name: "Antonio Matić",
    email: "antonio.matic@gmail.com",
    phone: "+385 91 890 1234",
  },
  {
    id: "18",
    name: "Iva Marković",
    email: "iva.markovic@gmail.com",
    phone: "+385 98 901 2345",
  },
  {
    id: "19",
    name: "David Tomić",
    email: "david.tomic@gmail.com",
    phone: "+385 95 012 3456",
  },
  {
    id: "20",
    name: "Laura Knežević",
    email: "laura.knezevic@gmail.com",
    phone: "+385 99 123 4567",
  },
];

function AdminStudentSearchResults() {
  return (
    <div className="flex flex-col gap-2 p-4 pt-0">
      {students.map((student: Student) => (
        <StudentSearchCard key={student.id} student={student} />
      ))}
    </div>
  );
}

export default AdminStudentSearchResults;
