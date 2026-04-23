import RoleAuthForm from "../../src/components/RoleAuthForm";
import { companies } from "../../src/data/mockData";

export default function CompanyRegister() {
  const c = companies[0];
  return <RoleAuthForm mode="register" role="company" entityId={c.id} entityName={c.name} />;
}
