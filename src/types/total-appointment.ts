export type TotalAppointmentTypes = {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  startTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  patient: {
    id: string;
    email: string;
    name: string;
  };
  doctor: {
    id: string;
    name: string;
    email: string;
    speciality: string;
  };
};
