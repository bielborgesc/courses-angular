export class Lesson {
	id?: number;
	title!: string;
	description!: string
	url_video!: string;
	step!: number;
	course_id?: number;
	createdAt?: Date;
	updatedAt?: Date;
}
