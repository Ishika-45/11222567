import { v4 as uuidv4 } from "uuid";

export const generateShortCode = () => uuidv4().slice(0, 6);