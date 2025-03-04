export interface IBlog {
    _id?: string;
    title: string;
    brief: string;
    content: string;
    imageUrl?: string;
    userId: string;
    tags: string[];
    author: string;
    isPublished: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IBlogCreate {
    title: string;
    brief: string;
    content: string;
    imageUrl?: string;
    userId: string;
    tags: string[];
    author: string;
}