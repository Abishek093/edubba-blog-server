// Profile.ts
export interface UpdateProfileRequest {
    username?: string;
    profession?: string;
    bio?: string;
    profilePicture?: string;
}

export interface PresignedUrlRequest {
    userId: string;
    fileType: string;
}

export interface PresignedUrlResponse {
    uploadUrl: string;
    key: string;
}