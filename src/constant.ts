import dayjs from "dayjs";

export const FORMAT = "YYYY-MM-DD";
export const today = dayjs().subtract(2, 'day').format(FORMAT);
