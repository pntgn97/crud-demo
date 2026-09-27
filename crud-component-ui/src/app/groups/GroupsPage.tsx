import { CrudComponent } from "../../crud-component";
import { groupConfig } from "./group.config";
import { groupService } from "./group.service";

export const GroupsPage = () => {
  return <CrudComponent service={groupService} config={groupConfig} viewMode="master-detail" />;
};
