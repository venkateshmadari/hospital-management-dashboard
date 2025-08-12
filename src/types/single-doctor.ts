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
};
