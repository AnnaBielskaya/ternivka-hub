import Header from "@/components/ui/Header";
import { getUsers } from "@/features/users/actions/get-users";
import UsersTableClient from "@/features/users/components/UsersTableClient";

const Page = async () => {
  const { users, invitations } = await getUsers();

  return (
    <div className="space-y-6">
      <Header variant="users" />

      <UsersTableClient users={users} invitations={invitations} />
    </div>
  );
};

export default Page;
