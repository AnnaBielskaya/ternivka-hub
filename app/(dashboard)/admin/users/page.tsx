import { getUsers } from "@/features/users/actions/get-users";
import UsersTableClient from "@/features/users/components/UsersTableClient";

const Page = async () => {
  const { users, invitations } = await getUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Користувачі</h1>

        <p className="mt-1 text-sm text-gray-500">
          Керування користувачами системи
        </p>
      </div>

      <UsersTableClient users={users} invitations={invitations} />
    </div>
  );
};

export default Page;
