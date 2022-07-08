export interface IDockerImage {
	thumbnail: string;
	name: string;
	tag: string;
	category: string;
	config: {
		port: number[];
		env: string[];
		vol: string[];
	};
}

export interface ISystemDockerImage {
	id: string;
	name: string;
	tags: string[];
	size: number;
	createdAt: Date | string | number;
}
