import React, { useState } from "react";
import Link from "next/link";
import Head from "next/head";

export default function UserManagementPage() {
  // Mock data - in a real app this would come from an API
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Dr. John Smith",
      email: "john.smith@medicalcenter.com",
      role: "Doctor",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "jane.doe@medicalcenter.com",
      role: "Receptionist",
      status: "Active",
    },
    {
      id: 3,
      name: "Dr. Susan Miller",
      email: "susan.miller@medicalcenter.com",
      role: "Doctor",
      status: "Active",
    },
    {
      id: 4,
      name: "Robert Johnson",
      email: "robert.johnson@medicalcenter.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 5,
      name: "Maria Garcia",
      email: "maria.garcia@medicalcenter.com",
      role: "Lab Technician",
      status: "Inactive",
    },
  ]);

  const [roles, setRoles] = useState([
    {
      id: 1,
      name: "Doctor",
      description:
        "Can create and view medical reports, add visits, view patient data",
    },
    {
      id: 2,
      name: "Admin",
      description:
        "Full system access including user management and configuration",
    },
    {
      id: 3,
      name: "Receptionist",
      description: "Can register patients, schedule visits, handle billing",
    },
    {
      id: 4,
      name: "Lab Technician",
      description: "Can create and manage medical reports and lab results",
    },
    {
      id: 5,
      name: "Billing Staff",
      description: "Can create and manage bills, handle financial aspects",
    },
  ]);

  // State for modals and forms
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter roles based on search term
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // New user form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Doctor",
    password: "",
    confirmPassword: "",
  });

  // New role form state
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
  });

  // Handle new user input change
  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  // Handle new role input change
  const handleRoleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRole((prev) => ({ ...prev, [name]: value }));
  };

  // Add new user
  const handleAddUser = (e) => {
    e.preventDefault();

    // Simple validation
    if (
      !newUser.name ||
      !newUser.email ||
      !newUser.password ||
      newUser.password !== newUser.confirmPassword
    ) {
      alert(
        "Please check your inputs. All fields are required and passwords must match."
      );
      return;
    }

    // Add new user with mock ID
    const newUserId = Math.max(...users.map((u) => u.id)) + 1;
    setUsers([
      ...users,
      {
        id: newUserId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: "Active",
      },
    ]);

    // Reset form and close modal
    setNewUser({
      name: "",
      email: "",
      role: "Doctor",
      password: "",
      confirmPassword: "",
    });
    setIsAddUserModalOpen(false);
  };

  // Add new role
  const handleAddRole = (e) => {
    e.preventDefault();

    // Simple validation
    if (!newRole.name || !newRole.description) {
      alert("Please provide both a role name and description.");
      return;
    }

    // Add new role with mock ID
    const newRoleId = Math.max(...roles.map((r) => r.id)) + 1;
    setRoles([
      ...roles,
      {
        id: newRoleId,
        name: newRole.name,
        description: newRole.description,
      },
    ]);

    // Reset form and close modal
    setNewRole({
      name: "",
      description: "",
    });
    setIsAddRoleModalOpen(false);
  };

  // Toggle user status (active/inactive)
  const toggleUserStatus = (userId) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "Active" ? "Inactive" : "Active",
            }
          : user
      )
    );
  };

  return (
    <>
      <Head>
        <title>User Management | Medical Center Management System</title>
      </Head>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  Dashboard
                </Link>
              </li>
              <li>
                <span className="text-gray-400 mx-1">/</span>
                <Link
                  href="/admin"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Admin
                </Link>
              </li>
              <li>
                <span className="text-gray-400 mx-1">/</span>
                <span className="text-gray-900">User Management</span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              User Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage users, roles, and permissions
            </p>
          </div>
          <div className="space-x-3">
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Add User
            </button>
            <button
              onClick={() => setIsAddRoleModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              Add Role
            </button>
          </div>
        </div>

        {/* Tabs & Search */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-3 px-6 font-medium text-sm border-b-2 ${
                activeTab === "users"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm border-b-2 ${
                activeTab === "roles"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("roles")}
            >
              Roles & Permissions
            </button>
          </div>

          <div className="mt-4 md:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={user.status === "Inactive" ? "bg-gray-50" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-2"
                        onClick={() => alert(`Edit user: ${user.name}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-purple-600 hover:text-purple-900 mr-2"
                        onClick={() =>
                          alert(`Edit permissions for: ${user.name}`)
                        }
                      >
                        Permissions
                      </button>
                      <button
                        className={`${
                          user.status === "Active"
                            ? "text-red-600 hover:text-red-900"
                            : "text-green-600 hover:text-green-900"
                        }`}
                        onClick={() => toggleUserStatus(user.id)}
                      >
                        {user.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No users found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Roles Tab */}
        {activeTab === "roles" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRoles.map((role) => (
              <div key={role.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {role.name}
                  </h3>
                  <div className="space-x-2">
                    <button
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      onClick={() => alert(`Edit role: ${role.name}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      onClick={() =>
                        alert(`Configure permissions for: ${role.name}`)
                      }
                    >
                      Permissions
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                <h4 className="font-medium text-gray-700 mb-2 text-sm">
                  Permissions:
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {/* Mock permissions for each role */}
                  {role.name === "Doctor" && (
                    <>
                      <div className="text-xs bg-green-100 text-green-700 p-1 px-2 rounded-full">
                        View Patients
                      </div>
                      <div className="text-xs bg-green-100 text-green-700 p-1 px-2 rounded-full">
                        Create Reports
                      </div>
                      <div className="text-xs bg-green-100 text-green-700 p-1 px-2 rounded-full">
                        Edit Reports
                      </div>
                      <div className="text-xs bg-green-100 text-green-700 p-1 px-2 rounded-full">
                        Add Visits
                      </div>
                    </>
                  )}
                  {role.name === "Admin" && (
                    <>
                      <div className="text-xs bg-green-100 text-green-700 p-1 px-2 rounded-full">
                        Full Access
                      </div>
                      <div className="text-xs bg-green-100 text-green-700 p-1 px-2 rounded-full">
                        Manage Users
                      </div>
                      <div className="text-xs bg-green-100 text-green-700 p-1 px-2 rounded-full">
                        System Config
                      </div>
                      <div className="text-xs bg-green-100 text-green-700 p-1 px-2 rounded-full">
                        View Logs
                      </div>
                    </>
                  )}
                  {role.name === "Receptionist" && (
                    <>
                      <div className="text-xs bg-green-100 text-green-700 p-1 px-2 rounded-full">
                        Register Patients
                      </div>
                      <div className="text-xs bg-green-100 text-green-700 p-1 px-2 rounded-full">
                        Schedule Visits
                      </div>
                      <div className="text-xs bg-green-100 text-green-700 p-1 px-2 rounded-full">
                        Billing
                      </div>
                      <div className="text-xs bg-green-100 text-green-700 p-1 px-2 rounded-full">
                        View Patient Info
                      </div>
                    </>
                  )}
                  {role.name === "Lab Technician" && (
                    <>
                      <div className="text-xs bg-green-100 text-green-700 p-1 px-2 rounded-full">
                        Create Reports
                      </div>
                      <div className="text-xs bg-green-100 text-green-700 p-1 px-2 rounded-full">
                        View Patient Info
                      </div>
                      <div className="text-xs bg-green-100 text-green-700 p-1 px-2 rounded-full">
                        Manage Lab Results
                      </div>
                    </>
                  )}
                  {role.name === "Billing Staff" && (
                    <>
                      <div className="text-xs bg-green-100 text-green-700 p-1 px-2 rounded-full">
                        Create Bills
                      </div>
                      <div className="text-xs bg-green-100 text-green-700 p-1 px-2 rounded-full">
                        Edit Bills
                      </div>
                      <div className="text-xs bg-green-100 text-green-700 p-1 px-2 rounded-full">
                        View Financial Reports
                      </div>
                      <div className="text-xs bg-green-100 text-green-700 p-1 px-2 rounded-full">
                        Process Payments
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
            {filteredRoles.length === 0 && (
              <div className="col-span-2 bg-white shadow rounded-lg p-8 text-center">
                <p className="text-gray-500">
                  No roles found matching your search criteria.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Add User Modal */}
        {isAddUserModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Add New User
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setIsAddUserModalOpen(false)}
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAddUser}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newUser.name}
                      onChange={handleUserInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newUser.email}
                      onChange={handleUserInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Role
                    </label>
                    <select
                      name="role"
                      id="role"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newUser.role}
                      onChange={handleUserInputChange}
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newUser.password}
                      onChange={handleUserInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newUser.confirmPassword}
                      onChange={handleUserInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setIsAddUserModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Role Modal */}
        {isAddRoleModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Add New Role
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setIsAddRoleModalOpen(false)}
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAddRole}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="roleName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Role Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="roleName"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newRole.name}
                      onChange={handleRoleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="roleDescription"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="roleDescription"
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newRole.description}
                      onChange={handleRoleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <h4 className="block text-sm font-medium text-gray-700 mb-2">
                      Default Permissions
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="viewPatients"
                          name="viewPatients"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="viewPatients"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          View Patients
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="createReports"
                          name="createReports"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="createReports"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Create Reports
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="manageBilling"
                          name="manageBilling"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="manageBilling"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Manage Billing
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="adminAccess"
                          name="adminAccess"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="adminAccess"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Admin Access
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setIsAddRoleModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create Role
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
