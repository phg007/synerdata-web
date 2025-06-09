
import { getPbUrlByCompany } from "./services/get-pburl-by-company";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CustomerReport from "./components/customer-report";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const companyId = session.user.empresa;

  const pbUrl = await getPbUrlByCompany(companyId);

  return <CustomerReport pbUrl={pbUrl} />;
}
