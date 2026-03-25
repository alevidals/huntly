CREATE TABLE `applications` (
	`id` text PRIMARY KEY NOT NULL,
	`company_name` text NOT NULL,
	`position` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`recruiter_name` text,
	`recruiter_email` text,
	`recruiter_phone` text,
	`applied_at` text NOT NULL,
	`description` text,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "applications_status_check" CHECK("applications"."status" IN ('pending', 'in_progress', 'rejected', 'accepted'))
);
--> statement-breakpoint
CREATE INDEX `applications_userId_appliedAt_idx` ON `applications` (`user_id`,"applied_at" desc);--> statement-breakpoint
CREATE INDEX `applications_userId_status_idx` ON `applications` (`user_id`,`status`);