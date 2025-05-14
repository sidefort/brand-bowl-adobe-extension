export interface Logo {
    uuid: string;
    label?: string;
    type?: string;
    file: File;
    isPrimary: boolean;
    hidden: boolean;
}

export interface File {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    totalFileSize: number;
    fileURL: string;
    thumbURL?: string;
    trimmedURL?: string;
    width?: number;
    height?: number;
}

export interface Project {
    id: string;
    name: string;
    createdAt: Date;
    userId: string;
    description: string | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
    slug: string;
}