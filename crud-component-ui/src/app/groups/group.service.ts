import { createRestCrudService } from "../../crud-component";
import { API_BASE_URL } from "../api";
import type { ArticleGroup } from "./group.types";

export const groupService = createRestCrudService<ArticleGroup>(`${API_BASE_URL}/groups`);
