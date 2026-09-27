import { createRestCrudService } from "../../crud-component";
import { API_BASE_URL } from "../api";
import type { Article } from "./article.types";

export const articleService = createRestCrudService<Article>(`${API_BASE_URL}/articles`);
