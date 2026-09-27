import { createRestCrudService } from "../../crud-component";
import { API_BASE_URL } from "../api";
import type { Issue } from "./issue.types";

export const issueService = createRestCrudService<Issue>(`${API_BASE_URL}/issues`);
