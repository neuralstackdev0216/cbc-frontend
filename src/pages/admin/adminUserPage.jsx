
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../../components/loading";

// User avatar with initials fallback
function UserAvatar({ user }) {
  const [imageFailed, setImageFailed] = useState(false);

  const firstInitial = user.firstName?.trim()?.charAt(0) || "";
  const lastInitial = user.lastName?.trim()?.charAt(0) || "";

  const initials =
    (firstInitial + lastInitial).toUpperCase() || "U";

  const hasImage =
    typeof user.img === "string" &&
    user.img.trim() !== "" &&
    !imageFailed;

  if (!hasImage) {
    return (
      <div className="w-10 h-10 rounded-full bg-slate-600 text-white flex items-center justify-center text-sm font-semibold shrink-0">
        {initials}
      </div>
    );
  }

  return (
    <img
      src={user.img}
      alt={`${user.firstName || "User"} profile`}
      onError={() => setImageFailed(true)}
      className="w-10 h-10 rounded-full object-cover bg-slate-200 shrink-0"
    />
  );
}

export default function AdminUserPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingEmail, setUpdatingEmail] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch users from backend
  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("token");

    async function fetchUsers() {
      if (!token) {
        toast.error("Please log in first");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/users/all",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
            signal: controller.signal,
          }
        );

        if (!controller.signal.aborted) {
          setUsers(response.data.users || []);
        }
      } catch (error) {
        if (!axios.isCancel(error) && !controller.signal.aborted) {
          toast.error(
            error.response?.data?.message ||
              "Fetching users failed"
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchUsers();

    return () => controller.abort();
  }, []);

  // Block or unblock customer
  async function changeBlock(user) {
    if (updatingEmail !== null) return;

    // Prevent blocking admin accounts through this page
    if (user.role?.toLowerCase() === "admin") {
      toast.error("Admin accounts cannot be blocked here");
      return;
    }

    const newState = !user.isBlocked;
    const action = newState ? "Block" : "Unblock";

    if (!window.confirm(`${action} ${user.email}?`)) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in first");
      return;
    }

    setUpdatingEmail(user.email);

    try {
      await axios.put(
        import.meta.env.VITE_BACKEND_URL +
          "/api/users/block/" +
          encodeURIComponent(user.email),
        {
          isBlocked: newState,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      // Update user status in React state
      setUsers((previousUsers) =>
        previousUsers.map((item) =>
          item.email === user.email
            ? { ...item, isBlocked: newState }
            : item
        )
      );

      toast.success(
        `User ${
          newState ? "blocked" : "unblocked"
        } successfully`
      );
    } catch (error) {
      console.error("Failed to update user:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update user"
      );
    } finally {
      setUpdatingEmail(null);
    }
  }

  // Search + role + status filtering
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName || ""} ${
      user.lastName || ""
    }`.toLowerCase();

    const email = (user.email || "").toLowerCase();
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      fullName.includes(search) || email.includes(search);

    const matchesRole =
      roleFilter === "all" ||
      user.role?.toLowerCase() === roleFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "blocked" && user.isBlocked === true) ||
      (statusFilter === "active" && user.isBlocked === false);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Loading screen
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-primary">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-screen overflow-y-auto bg-primary p-4 md:p-6">
      <div className="w-full mx-auto">
        {/* Page Header */}
        <div className="mb-7">
          <h1 className="text-3xl font-bold text-white">
            Users
          </h1>

          <p className="text-slate-400 mt-2">
            Manage customer and admin accounts
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-5 flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search users"
            className="w-full md:max-w-md px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
          />

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            aria-label="Filter users by role"
            className="w-full md:w-44 px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter users by status"
            className="w-full md:w-44 px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-5 py-4 text-left font-semibold">
                    User
                  </th>

                  <th className="px-5 py-4 text-left font-semibold">
                    Email
                  </th>

                  <th className="px-5 py-4 text-left font-semibold">
                    Role
                  </th>

                  <th className="px-5 py-4 text-left font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      {searchTerm.trim() ||
                      roleFilter !== "all" ||
                      statusFilter !== "all"
                        ? "No users match your filters."
                        : "No users found."}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id || user.email}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar user={user} />

                          <span className="font-medium text-slate-900">
                            {`${user.firstName || ""} ${
                              user.lastName || ""
                            }`.trim() || "Unnamed User"}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4 text-slate-700">
                        {user.email}
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span className="capitalize font-medium text-slate-700">
                          {user.role || "Unknown"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={
                            "inline-flex px-3 py-1 rounded-md text-xs font-semibold " +
                            (user.isBlocked
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700")
                          }
                        >
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4">
                        {user.role?.toLowerCase() === "admin" ? (
                          <span className="text-slate-400">
                            —
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => changeBlock(user)}
                            disabled={updatingEmail !== null}
                            className={
                              "px-4 py-2 rounded-lg text-white text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed " +
                              (user.isBlocked
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-red-600 hover:bg-red-700")
                            }
                          >
                            {updatingEmail === user.email
                              ? "Updating..."
                              : user.isBlocked
                              ? "Unblock"
                              : "Block"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Counts */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">
          <p>Total users: {users.length}</p>
          <p>Showing: {filteredUsers.length}</p>
        </div>
      </div>
    </div>
  );
}
