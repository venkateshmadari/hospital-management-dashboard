export type AppointmentTypes = {
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
    image?: string;
    phoneNumber?: string;
  };
  ReassignedHistory: {
    appointmentId: string;
    createdAt: string;
    date: string;
    fromDoctorId: string;
    id: string;
    reassignedBy: string;
    startTime: string;
    toDoctorId: string;
  }[];
};
