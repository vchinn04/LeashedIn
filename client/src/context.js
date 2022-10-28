// This file only exists to solve a circular dependency
// from keeping context in App.js

import { createContext } from "react";

export const AuthContext = createContext();
