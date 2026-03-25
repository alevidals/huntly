import { Badge } from "@/shared/components/ui/badge";
import type { Application } from "@/shared/lib/db/schema";

type Props = {
  status: Application["status"];
  text: string;
};

const STATUS_COLORS: Record<Application["status"], string> = {
  inProgress: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export function ApplicationStatusBadge({ status, text }: Props) {
  return <Badge className={STATUS_COLORS[status]}>{text}</Badge>;
}
