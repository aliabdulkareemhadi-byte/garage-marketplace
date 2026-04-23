import RoleAuthForm from "../../src/components/RoleAuthForm";
import { workshops } from "../../src/data/mockData";

export default function WorkshopLogin() {
  const w = workshops[0];
  return <RoleAuthForm mode="login" role="workshop" entityId={w.id} entityName={w.name} />;
}
