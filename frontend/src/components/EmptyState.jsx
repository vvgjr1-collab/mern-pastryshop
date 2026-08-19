import React from "react";
import { Link } from "react-router";

const EmptyState = ({
  title = "Nothing here yet",
  message = "",
  actionLabel = "",
  actionTo = "",
}) => {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h3 className="mb-3 font-display text-[30px] leading-[1.05] text-sop-ink">{title}</h3>
      {message && (
        <p className="mb-6 font-plex text-xs leading-[1.7] text-sop-ink-50">{message}</p>
      )}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="sop-btn-outline">
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
