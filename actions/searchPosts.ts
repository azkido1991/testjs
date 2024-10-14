"use server"

import prisma from "@/lib/db";
import { BlogPost } from "@/lib/types";

export const searchPosts = async (searchQuery: string = ''): Promise<BlogPost[]> => {
    const where = searchQuery
        ? {
            OR: [
                { title: { contains: searchQuery } },
                { body: { contains: searchQuery } },
                { author: { contains: searchQuery } },
                { categories: { some: { name: { contains: searchQuery } } } },
            ],
        }
        : {};

    const posts = await prisma.post.findMany({
        where,
        include: {
            categories: true,
            user: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return posts.map(post => ({
        id: post.id,
        title: post.title,
        body: post.body,
        author: post.author,
        userId: post.userId,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        categories: post.categories,
        user: post.user,
    }));
};
