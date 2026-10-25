type BlogPublicationData = { pubDate: Date; publishAt?: Date };

export const blogPostPublishDate = (post: BlogPublicationData) => post.publishAt ?? post.pubDate;

export const isBlogPostPublished = (post: BlogPublicationData, now = new Date()) =>
  blogPostPublishDate(post).getTime() <= now.getTime();
