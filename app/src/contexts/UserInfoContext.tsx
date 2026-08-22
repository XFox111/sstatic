import { createContext } from "react";
import type { GetUserResponse } from "../api";

export const UserInfoContext = createContext<GetUserResponse>({ subject: "" });
