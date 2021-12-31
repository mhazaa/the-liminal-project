export interface FormData {
	name: string;
	email: string;
	phone?: string;
	website?: string;
}

export interface contactSubmissionData extends FormData {
	reason: string;
	message: string;
}

export interface quoteSubmissionData extends FormData {
	details: { [key: string]: string }
}

export type CameraModes = 'frozen' | 'locked' | 'unlocked' | 'tracking' | 'work' | 'mobile';

export type Pages = '' | 'home' | 'about' | 'contact' | 'quote' | 'work' | 'decision';