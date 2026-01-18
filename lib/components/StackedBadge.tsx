import { ReactNode } from "react";
import { capitalize } from "@/lib/utils";
import { Badge } from "@/lib/components/shadcn/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/lib/components/shadcn/ui/tooltip";

export default function StackedBadge(props: {
  label: string;
  value: string;
  title?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="font-semibold">
      <p className="mb-2 border-b border-dashed border-gray-300 px-3 pb-1">
        <Tooltip>
          <TooltipTrigger><span>{props.value}</span></TooltipTrigger>
          {props.title && <TooltipContent>{props.title}</TooltipContent>}
        </Tooltip>
      </p>
      <p>
        <Badge variant="outline">
          {props.icon}
          {capitalize(props.label)}
        </Badge>
      </p>
    </div>
  );
}
