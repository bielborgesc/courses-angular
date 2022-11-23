export class Course {
		id!: number;
		title!: string;
		description!: string
		image_url!: string;
		price!: number;
		createdAt!: Date;
		updatedAt!: Date;
		teacher_id!: number;
		teacher!: {
			name: string;
    }
}
