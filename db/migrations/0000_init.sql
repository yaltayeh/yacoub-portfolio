CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`link_id` integer NOT NULL,
	`type` text NOT NULL,
	`platform` text,
	`device` text,
	`os` text,
	`country` text,
	`path` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`link_id`) REFERENCES `links`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `events_link_id_created_at_idx` ON `events` (`link_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `events_created_at_idx` ON `events` (`created_at`);--> statement-breakpoint
CREATE TABLE `links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`number` integer,
	`kind` text NOT NULL,
	`name` text,
	`notes` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `links_code_unique` ON `links` (`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `links_number_unique` ON `links` (`number`);