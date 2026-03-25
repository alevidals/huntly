"use client";

import { useActionState } from "react";
import { insertApplicationAction } from "@/features/applications/actions/insert-application";
import { Field, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/shared/components/ui/native-select";
import { Textarea } from "@/shared/components/ui/textarea";
import type { Dictionary } from "@/shared/lib/i18n/types";

type Props = {
  dict: Dictionary;
  setIsOpen: (isOpen: boolean) => void;
};

export function InsertApplicationForm({ dict, setIsOpen }: Props) {
  const [state, formAction, pending] = useActionState(
    async (_: unknown, formData: FormData) => {
      const result = await insertApplicationAction(_, formData);

      if (!result.success) {
        return result;
      }

      setIsOpen(false);
      return;
    },
    null,
  );

  return (
    <form
      className="grid gap-2"
      id="insert-application-form"
      action={formAction}
    >
      <Field>
        <FieldLabel htmlFor="input-field-company-name">
          {dict.applications.creationDialog.form.companyName}
        </FieldLabel>
        <Input id="input-field-company-name" type="text" name="companyName" />
      </Field>
      <Field>
        <FieldLabel htmlFor="input-field-position">
          {dict.applications.creationDialog.form.position}
        </FieldLabel>
        <Input id="input-field-position" type="text" name="position" />
      </Field>
      <Field>
        <Label htmlFor="input-field-status">
          {dict.applications.creationDialog.form.status}
        </Label>
        <NativeSelect id="input-field-status" name="status">
          <NativeSelectOption value="inProgress">
            {dict.applications.inProgress}
          </NativeSelectOption>
          <NativeSelectOption value="accepted">
            {dict.applications.accepted}
          </NativeSelectOption>
          <NativeSelectOption value="rejected">
            {dict.applications.rejected}
          </NativeSelectOption>
        </NativeSelect>
      </Field>
      <Field>
        <FieldLabel htmlFor="input-field-applied-at">
          {dict.applications.creationDialog.form.appliedAt}
        </FieldLabel>
        <Input id="input-field-applied-at" type="date" name="appliedAt" />
      </Field>
      <Field>
        <FieldLabel htmlFor="input-field-recruiter-name">
          {dict.applications.creationDialog.form.recruiterName}
        </FieldLabel>
        <Input
          id="input-field-recruiter-name"
          type="text"
          name="recruiterName"
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="input-field-recruiter-email">
          {dict.applications.creationDialog.form.recruiterEmail}
        </FieldLabel>
        <Input
          id="input-field-recruiter-email"
          type="email"
          name="recruiterEmail"
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="input-field-recruiter-phone">
          {dict.applications.creationDialog.form.recruiterPhone}
        </FieldLabel>
        <Input
          id="input-field-recruiter-phone"
          type="tel"
          name="recruiterPhone"
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="input-field-description">
          {dict.applications.creationDialog.form.description}
        </FieldLabel>
        <Textarea id="input-field-description" name="description" />
      </Field>
    </form>
  );
}
