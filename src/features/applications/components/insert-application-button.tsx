"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import type { Dictionary } from "@/shared/lib/i18n/types";
import { InsertApplicationForm } from "./insert-application-form";

type Props = {
  dict: Dictionary;
};

export function InsertApplicationButton({ dict }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <PlusIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dict.applications.creationDialog.title}</DialogTitle>
          <DialogDescription>
            {dict.applications.creationDialog.description}
          </DialogDescription>
        </DialogHeader>
        <InsertApplicationForm dict={dict} setIsOpen={setIsOpen} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button form="insert-application-form">
            {dict.applications.creationDialog.form.create}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
