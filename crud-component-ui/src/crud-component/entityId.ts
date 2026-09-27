import type { EntityId, IdField } from "./types";

export const getEntityId = <T,>(item: T, idField: IdField<T>): EntityId => item[idField] as EntityId;
