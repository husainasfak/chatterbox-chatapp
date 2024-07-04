import { format } from "date-fns";

export const formatMessageTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = (now.getTime() - date.getTime()) / 1000;

  if (diffInSeconds < 60) {
    return `${Math.floor(diffInSeconds)} seconds ago`;
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  } else {
    return format(date, "hh:mm a"); // Format the time as 'hh:mm AM/PM'
  }
};
