export const translateMode = (mode: string): string => {
  switch (mode) {
    case "DRIVING":
    case "driving":
      return "🚘";
    case "WALK":
    case "walking":
      return "🚶";
    case "BICYCLING":
    case "bicycling":
      return "🚲";
    case "BUS":
    case "SUBWAY":
      return "🚌";
    default:
      return "";
  }
};
