import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { Application } from "@/shared/lib/db/schema";
import type { Dictionary } from "@/shared/lib/i18n/types";
import { ApplicationStatusBadge } from "./application-status-badge";

type Props = {
  applications: Application[];
  dict: Dictionary;
};

export function ApplicationsTable({ applications, dict }: Props) {
  return (
    <Table>
      <TableCaption>{dict.applications.listOfApplications}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>{dict.applications.companyName}</TableHead>
          <TableHead>{dict.applications.position}</TableHead>
          <TableHead>{dict.applications.recruiter}</TableHead>
          <TableHead>{dict.applications.appliedAt}</TableHead>
          <TableHead>{dict.applications.status}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((application) => (
          <TableRow key={application.id}>
            <TableCell>{application.companyName}</TableCell>
            <TableCell>{application.position}</TableCell>
            <TableCell>
              {application.recruiterName} ({application.recruiterEmail})
            </TableCell>
            <TableCell>
              {new Date(application.appliedAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <ApplicationStatusBadge
                status={application.status}
                text={dict.applications[application.status]}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
