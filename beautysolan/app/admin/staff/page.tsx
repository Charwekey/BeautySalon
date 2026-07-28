import { getStaffMembers } from "@/actions/staffActions";
import { getSession } from "@/lib/auth";
import StaffClient from "./StaffClient";

export default async function StaffManagementPage() {
  const session = await getSession();
  const { staffList, allStaffUsers } = await getStaffMembers();

  return (
    <StaffClient
      currentSession={session}
      staffList={staffList}
      allStaffUsers={allStaffUsers}
    />
  );
}
