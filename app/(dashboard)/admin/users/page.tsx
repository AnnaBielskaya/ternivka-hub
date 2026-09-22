import { getUsers } from "@/features/users/actions/get-users";
import UsersTableClient from "@/features/users/components/UsersTableClient";

const Page = async () => {
  const users = await getUsers();

  return (
    <div className="flex flex-col space-y-6 px-6 pt-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Користувачі</h1>

          <p className="mt-1 text-sm text-gray-500">
            Керування користувачами системи
          </p>
        </div>
      </div>

      <UsersTableClient users={users} />
    </div>
  );
};

export default Page;
