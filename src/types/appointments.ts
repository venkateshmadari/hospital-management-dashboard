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
};
