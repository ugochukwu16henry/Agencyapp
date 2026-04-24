import type { Role } from "./types";

export const hasRole = (role: Role, requiredRoles: Role[]) => requiredRoles.includes(role);

export const assertRole = (role: Role, requiredRoles: Role[]) => {
  if (!hasRole(role, requiredRoles)) {
    throw new Error("Unauthorized");
  }
};
