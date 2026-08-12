import React from "react";
import { SnowflakeIcon, ThermometerIcon, WindIcon } from "lucide-react";
import { CHAINS } from "../lib/trade";

const icons = {
  chilled: ThermometerIcon,
  frozen: SnowflakeIcon,
  "ambient-cured": WindIcon,
};

// Three chains, always labelled. Nothing is sold as "fresh" that isn't.
const ChainBadge = ({ chain, showTemp = false }) => {
  const meta = CHAINS[chain];
  if (!meta) return null;

  const Icon = icons[chain] || ThermometerIcon;

  return (
    <span className={`badge ${meta.badge} badge-outline gap-1 whitespace-nowrap`}>
      <Icon className="size-3" />
      {meta.label}
      {showTemp && <span className="opacity-70">· {meta.temp}</span>}
    </span>
  );
};

export default ChainBadge;
