CREATE TABLE `site_visits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`platform` text,
	`source` text,
	`referrer_host` text,
	`device` text,
	`os` text,
	`country` text,
	`city` text,
	`path` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `site_visits_created_at_idx` ON `site_visits` (`created_at`);