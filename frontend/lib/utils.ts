import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const withProtocol = (url: string) =>
	url.startsWith("http://") || url.startsWith("https://")
		? url
		: `https://${url}`;

export const getURL = () => {
	const url =
		process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

	return url ? withProtocol(url) : `http://localhost:${process.env.PORT || 3000}`;
};
