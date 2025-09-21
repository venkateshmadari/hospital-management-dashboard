type Doctor = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  speciality: string;
};

type AppointmentStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "COMPLETED"
  | "REASSIGNED";

export type singlePatientAppointmentsTypes = {
  id: string;
  patientId: string;
  doctorId: string;
  doctor: Doctor;
  date: string;
  startTime: string; 
  status: AppointmentStatus;
  createdAt: string; 
  updatedAt: string;
};
