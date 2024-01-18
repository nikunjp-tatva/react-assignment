import axios from 'axios';
import { fetchPosts } from '../services/apiService';

jest.mock('axios');
const api = axios as jest.Mocked<typeof axios>;

const mockData = {
  hits: [
    {
      author: 'John Doe',
      created_at: '2023-12-31T12:00:00Z',
      title: 'Test Post - John Doe',
      url: 'https://example.com',
    },
    {
      author: 'Jane Doe',
      created_at: '2023-12-01T12:00:00Z',
      title: 'Jane Doe - Test Post',
      url: 'https://example.com',
    },
    {
      author: 'author 3',
      created_at: '',
      title: 'Title 3',
      url: 'https://example3.com',
    },
    {
      author: '',
      created_at: '2023-12-01T10:00:00Z',
      title: 'Title 4',
      url: 'https://example4.com',
    },
    {
      author: 'author 5',
      created_at: '2023-12-01T02:00:00Z',
      title: '',
      url: 'https://example5.com',
    },
    {
      author: 'author 6',
      created_at: '2023-12-01T01:00:00Z',
      title: 'Title 6',
      url: '',
    },
  ],
  hitsPerPage: 10,
  nbPages: 100,
};

const emptyMockData = {
  hits: [],
  hitsPerPage: 10,
  nbPages: 0,
};
describe('fetchPosts', () => {
  test('should check api success response', async () => {
    api.get.mockResolvedValue({ data: mockData });
    expect(api.get).not.toHaveBeenCalled();
    const { posts } = await fetchPosts(0, 10, 'Test');
    expect(api.get).toHaveBeenCalledTimes(1);
    expect(posts).toHaveLength(6);
    expect(posts[0].title).toEqual('Test Post - John Doe');
    expect(posts[1].title).toEqual('Jane Doe - Test Post');
  });

  test('should check api response with empty array', async () => {
    api.get.mockResolvedValue({ data: emptyMockData });
    expect(api.get).not.toHaveBeenCalled();
    const { posts } = await fetchPosts(0, 10, 'Test');
    expect(api.get).toHaveBeenCalledTimes(1);
    expect(posts).toHaveLength(0);
  });

  test('handles error', async () => {
    const errorMessage = 'Network Error';
    const rejectedPromise = Promise.reject(new Error(errorMessage));

    api.get.mockReturnValue(rejectedPromise);

    await expect(fetchPosts(1, 10, 'test')).rejects.toThrow(errorMessage);
  });
});
