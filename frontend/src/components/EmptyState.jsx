import React from "react";
import { PackageOpenIcon } from "lucide-react";
import { Link } from "react-router";

const EmptyState = ({
  icon: Icon = PackageOpenIcon,
  title = "Nothing here yet",
  message = "",
  actionLabel = "",
  actionTo = "",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto text-center">
      <div className="bg-primary/10 rounded-full p-8">
        <Icon className="size-10 text-primary" />
      </div>
      <h3 className="text-2xl font-bold">{title}</h3>
      {message && <p className="text-base-content/70">{message}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
