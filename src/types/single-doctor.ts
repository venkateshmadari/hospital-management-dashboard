export type doctorAvailability = {
  id: string;
  doctorId: string;
  day: string;
  startTime: string;
  endTime: string;
  breakStartTime: string;
  breakEndTime: string;
  createdAt: string;
  updatedAt: string;
};

export interface Patient {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  image: string | null;
}

export type doctorsIndividualAppointments = {
  id: string;
  doctorId: string;
  patientId: string;
  patient: Patient;
  date: string;
  startTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type DoctorPermissionsTypes = {
  id: number;
  name: string;
  label: string;
};

export type SingleDoctorTypes = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "ACTIVE" | "INACTIVE";
  designation: string;
  image: any;
  createdAt: string;
  speciality: string;
  description?: any;
  Avability?: doctorAvailability[];
  Appointment: doctorsIndividualAppointments[];
  DoctorPermissions: DoctorPermissionsTypes[];
};
