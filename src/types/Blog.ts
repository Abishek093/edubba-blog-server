// Blog.ts
export interface BlogDocument {
    _id: string;
    title: string;
    brief: string;
    content: string;
    imageUrl?: string;
    userId: string | UserDocument;
    tags: string[];
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface UserDocument {
    _id: string;
    username: string;
    profilePicture?: string;
    profession?: string;
  }
  
  export interface FormattedBlog {
    _id: string;
    title: string;
    brief: string;
    content: string;
    imageUrl?: string;
    userId: string;
    tags: string[];
    author: string;
    authorDetails?: {
      profilePicture?: string;
      profession?: string;
    };
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface SearchBlogsResponse {
    blogs: FormattedBlog[];
    totalCount: number;
  }
  
  export interface SearchBlogsParams {
    query: string;
    page?: number; 
    limit?: number; 
  }