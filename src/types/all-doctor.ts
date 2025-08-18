export type DoctorsType = {
  createdAt: string;
  designation?: string;
  email: string;
  id: string;
  image: string | null;
  name: string;
  speciality?: string;
  status: "ACTIVE" | "INACTIVE";
};

export type DoctorStatsTypes = {
  activeDoctors: number;
  inActiveDoctors: number;
  totalDoctors: number;
};
