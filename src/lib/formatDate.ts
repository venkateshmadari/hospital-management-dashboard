import { format } from "date-fns";

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "-";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "-";
    }
    return format(date, "MMMM do, yyyy");
  } catch (error) {
    return "-";
  }
};

export default formatDate;
