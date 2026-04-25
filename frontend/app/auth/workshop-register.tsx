import RoleAuthForm from "../../src/components/RoleAuthForm";
import { workshops } from "../../src/data/mockData";

export default function WorkshopRegister() {
  const w = workshops[0];
  return <RoleAuthForm mode="register" role="workshop" entityId={w.id} entityName={w.name} />;
}
