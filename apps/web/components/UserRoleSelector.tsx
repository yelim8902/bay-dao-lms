"use client";

import React from "react";

interface UserRoleSelectorProps {
  currentRole: "student" | "instructor" | "admin";
  onRoleChange: (role: string) => void;
}

export function UserRoleSelector({
  currentRole,
  onRoleChange,
}: UserRoleSelectorProps) {
  const roles = [
    { value: "student", label: "학생", icon: "🎓" },
    { value: "instructor", label: "강사", icon: "👨‍🏫" },
    { value: "admin", label: "관리자", icon: "⚙️" },
  ];

  return (
    <div className="flex space-x-2">
      {roles.map((role) => (
        <button
          key={role.value}
          onClick={() => onRoleChange(role.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentRole === role.value
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <span className="mr-2">{role.icon}</span>
          {role.label}
        </button>
      ))}
    </div>
  );
}
