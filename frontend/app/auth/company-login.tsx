import RoleAuthForm from "../../src/components/RoleAuthForm";
import { companies } from "../../src/data/mockData";

export default function CompanyLogin() {
  const c = companies[0];
  return <RoleAuthForm mode="login" role="company" entityId={c.id} entityName={c.name} />;
}
