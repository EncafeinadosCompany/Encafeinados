import React from 'react';
import { Badge } from "@/common/ui/badge";

interface StatusBadgeProps {
  count: number;
  status: 'pending' | 'approved' | 'rejected';
}

export const StatusBadge = ({ count, status }: StatusBadgeProps) => {
  const styles = {
    pending: "text-amber-600 bg-amber-50 border-amber-200",
    approved: "text-green-600 bg-green-50 border-green-200",
    rejected: "text-red-600 bg-red-50 border-red-200",
  };
  
  return (
    <Badge 
      variant="outline" 
      className={`${styles[status]} text-xs font-normal h-5`}
    >
      {count}
    </Badge>
  );
};