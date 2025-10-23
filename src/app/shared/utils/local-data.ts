import { Blog, Category, Status } from '../../core/models/blog';
import { BlogResponse } from '../../core/interfaces/blog-http.interface';

export const blogs: BlogResponse[] = [
  {
    blog: {
      id: "blog-1",
      title: 'Blog 1',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.',
      image: 'https://picsum.photos/id/10/200/300',
      publishedDate: '2023-01-01',
      modifiedDate: '2023-01-01',
      state: Status.Draft,
      author: {
        firstName: 'John Doe',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'johndoe@example.com'
      },
      category: {
        id: "category-1",
        name: 'Mental Health'
      }
    },
    reactionCount: 0,
    commentCount: 0,
    hasLiked: false
  }
];

export const categories: Category[] = [
  {
    id: "category-1",
    name: 'Mental Health'
  },
  {
    id: "category-2",
    name: 'Nutrition'
  },
  {
    id: "category-3",
    name: 'Fitness'
  }
];
