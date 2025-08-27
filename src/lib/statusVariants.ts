export const AppointmentStatusVariant = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "lightCyan";
    case "ACCEPTED":
      return "success";
    case "PENDING":
      return "warning";
    case "REJECTED":
      return "error";
    default:
      return "default";
  }
};
