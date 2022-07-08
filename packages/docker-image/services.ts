// lib
import Redis from "@lib/redis";
import Docker from "@lib/docker";
// interface
import { IDockerImage, ISystemDockerImage } from "./interface";

export const GetDockerImage = async (name: string, tag: string): Promise<IDockerImage | undefined> => {
	const result = await Redis.get(`docker:image:${name}:${tag}`);
	return result ? JSON.parse(result) : undefined;
};

export const GetDockerImages = async (): Promise<IDockerImage[]> => {
	const keys = await Redis.keys("docker:image:*");
	const result = keys.map(async (key: string) => {
		const [name, tag] = key.replace("docker:image:", "").split(":");
		return (await GetDockerImage(name, tag)!) as IDockerImage;
	});
	return Promise.all(result);
};

export const GetSystemDockerImages = async (): Promise<ISystemDockerImage[]> => {
	try {
		let result = await Docker.listImages({
			all: true,
		});
		let output: ISystemDockerImage[] = [];
		result = result.filter((item) => !item.RepoTags?.includes("<none>:<none>"));
		for (let item of result) {
			output.push({
				id: item.Id,
				name: item.RepoTags![0].split(":")[0],
				tags: item.RepoTags!.map((tag) => tag.split(":")[1]),
				size: item.Size,
				createdAt: new Date(item.Created * 1000),
			});
		}
		return output;
	} catch (error) {
		return Promise.resolve([]);
	}
};

export const SetDockerImage = (image: IDockerImage) => {
	Redis.set(`docker:image:${image.name}:${image.tag}`, JSON.stringify(image));
};

export const DeleteDockerImage = (name: string, tag: string) => {
	Redis.del(`docker:image:${name}:${tag}`);
};

export const DeleteSystemDockerImage = (name: string, tag: string) => {
	return Docker.getImage(`${name}:${tag}`).remove();
};

export const PullDockerImage = (name: string, tag: string = "latest") => {
	return Docker.pull(`${name}:${tag}`);
};

export default {
	GetDockerImage,
	GetDockerImages,
	GetSystemDockerImages,
	SetDockerImage,
	DeleteDockerImage,
	DeleteSystemDockerImage,
	PullDockerImage,
};
