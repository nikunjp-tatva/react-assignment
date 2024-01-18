import {
  render,
  fireEvent,
  screen,
  act,
} from '@testing-library/react';
import axios from 'axios';
import PostController from '../blocks/Post/src/PostController.web';
import { fetchPosts } from '../services/apiService';
import userEvent from '@testing-library/user-event';

jest.mock('axios');
const api = axios as jest.Mocked<typeof axios>;

const apiMockResponse = {
  hits: [
    {
      author: 'bkolobara',
      title: 'Work Is Work',
      url: 'https://codahale.com//work-is-work/',
      created_at: 'Jan 16, 2024',
    },
    {
      author: 'bkolobasra',
      title: 'Work-Load',
      url: 'https://codashale.com//work-is-work/',
      created_at: 'Jan 13, 2024',
    },
    {
      author: 'gnicholas',
      title: 'YouTube',
      url: 'https://arstechnica.com/gadgets/2024/01/youtube-appears-to-be-reducing-video-and-site-performance-for-ad-block-users/',
      created_at: 'Jan 16, 2024',
    },
    {
      author: 'test',
      title: 'AA Test',
      url: 'https://test.com/users/',
      created_at: 'Jan 16, 2024',
    },
    {
      author: 'testSecondLast',
      title: 'YY Test',
      url: 'https://test.com/last/',
      created_at: 'Jan 16, 2024',
    },
    {
      author: 'testLast',
      title: 'ZZ Test',
      url: 'https://test.com/',
      created_at: 'Jan 16, 2024',
    },
    {
      author: 'keepamovin',
      title: 'Vivek Ramaswam',
      url: 'https://www.youtube.com/watch?v=zENAMNTpEo0',
      created_at: 'Jan 16, 2024',
    },
    {
      author: 'IronWolve',
      title: 'Prison',
      url: 'https://www.cnn.com/2024/01/13/business/uk-post-office-fujitsu-horizon-scandal/index.html',
      created_at: 'Jan 16, 2024',
    },
    {
      author: 'walterbell',
      title: 'The Case',
      url: 'https://www.wsj.com/articles/the-case-for-the-supreme-court-to-overturn-chevron-deference-e7f762b4',
      created_at: 'Jan 16, 2024',
    },
    {
      author: 'IronWolve',
      title: 'Fujitsu',
      url: 'https://www.theguardian.com/uk-news/2024/jan/11/fujitsu-repay-post-office-scandal-horizon-it-software',
      created_at: 'Jan 16, 2024',
    },
    {
      author: 'azhenley',
      title: 'Prime streams',
      url: 'https://notes.jordanscales.com/primes',
      created_at: 'Jan 16, 2024',
    },
    {
      author: 'annabyrd',
      title: 'Musical Chairs',
      url: 'https://humancapitalist.substack.com/p/musical-chairs-a-shrinking-saas-tam',
      created_at: 'Jan 16, 2024',
    },
    {
      author: 'bane',
      title: 'Windows',
      url: 'https://www.schneier.com/blog/archives/2007/02/windows_for_war_1.html',
      created_at: 'Jan 16, 2024',
    },
    {
      author: 'azhenley',
      title: 'Things',
      url: 'https://clairelegoues.com/posts/clg-writing-rules.html',
      created_at: 'Jan 16, 2024',
    },
  ],
  hitsPerPage: 10,
  nbPages: 100,
};

const actDefer = async () => {
  await act(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  });
};

describe('PostController', () => {
  test('fetches posts from an API and displays them', async () => {
    api.get.mockResolvedValueOnce({ data: apiMockResponse });

    render(<PostController />);

    // Wait for the posts to be displayed
    await screen.findByText('Work Is Work');

    expect(screen.getByText('Work Is Work')).toBeInTheDocument();
    expect(screen.getByText('YY Test')).toBeInTheDocument();
  });

  test('handles API errors', async () => {
    const errorMessage = 'Network Error';
    const rejectedPromise = Promise.reject(new Error(errorMessage));

    api.get.mockReturnValue(rejectedPromise);

    await expect(fetchPosts(1, 10, 'test')).rejects.toThrow(errorMessage);
  });

  test.skip('searches posts based on the search value', async () => {
    api.get.mockResolvedValueOnce({ data: apiMockResponse });

    render(<PostController />);
    await actDefer();
    const inputElement = screen.getByPlaceholderText('Search...');
    await act(async () => {
      fireEvent.change(inputElement, { target: { value: 'Work' } });
    });
    api.get.mockResolvedValueOnce({ data: apiMockResponse });
    render(<PostController />);
    await actDefer();
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.queryByText('Worsk')).toBeNull();
  });

  test('sorts posts based on the selected sort column and direction via title', async () => {
    api.get.mockResolvedValueOnce({ data: apiMockResponse });

    render(<PostController />);
    await actDefer();
    fireEvent.click(screen.getByText('Title'));

    await screen.findByText('Work Is Work');

    expect(screen.getAllByRole('row')[1]).toHaveTextContent('ZZ Test');
    expect(screen.getAllByRole('row')[2]).toHaveTextContent('YY Test');
  });

  test('sorts posts based on the selected sort column and direction via url', async () => {
    api.get.mockResolvedValueOnce({ data: apiMockResponse });

    render(<PostController />);
    await actDefer();
    fireEvent.click(screen.getByText('URL'));

    await screen.findByText('Work Is Work');

    expect(screen.getAllByRole('row')[1]).toHaveTextContent('YouTube');
    expect(screen.getAllByRole('row')[2]).toHaveTextContent('Work Is Work');
  });

  test('sorts posts based on the selected sort column and direction via author', async () => {
    api.get.mockResolvedValueOnce({ data: apiMockResponse });

    render(<PostController />);
    await actDefer();
    fireEvent.click(screen.getByText('Author'));

    await screen.findByText('bkolobasra');

    expect(screen.getAllByRole('row')[1]).toHaveTextContent('bkolobara');
    expect(screen.getAllByRole('row')[2]).toHaveTextContent('bkolobasra');
  });

  test('sorts posts based on the selected sort column and direction via created date', async () => {
    api.get.mockResolvedValueOnce({ data: apiMockResponse });

    render(<PostController />);
    await actDefer();
    fireEvent.click(screen.getByText('Created Date'));

    await screen.findByText('Work Is Work');

    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Jan 13, 2024');
    expect(screen.getAllByRole('row')[2]).toHaveTextContent('Jan 16, 2024');
  });

  test('paginates posts based on the selected page and rows per page', async () => {
    api.get.mockResolvedValueOnce({ data: apiMockResponse });

    render(<PostController />);
    await actDefer();
    const selectPageOptions = screen.getByRole('combobox', {
      name: 'Rows per page:',
    });
    await act(async () => userEvent.click(selectPageOptions));
    const select5Page = screen.getByRole('option', { name: '5' });
    await act(async () => userEvent.click(select5Page));

    await screen.findByText('Work Is Work');

    expect(screen.getByText('Work Is Work')).toBeInTheDocument();
    expect(screen.getByText('Work-Load')).toBeInTheDocument();
    expect(screen.queryByText('ZZ Test')).toBeNull();

    fireEvent.click(screen.getByLabelText('Go to next page'));

    await screen.findByText('ZZ Test');

    expect(screen.queryByText('Work Is Work')).toBeNull();
    expect(screen.queryByText('Work-Load')).toBeNull();
    expect(screen.getByText('ZZ Test')).toBeInTheDocument();
  });

  test('displays a modal with the post data when a row is clicked', async () => {
    api.get.mockResolvedValueOnce({ data: apiMockResponse });

    render(<PostController />);
    await actDefer();

    await screen.findByText('Work Is Work');
    fireEvent.click(screen.getAllByLabelText('expand row')[0]);

    await screen.findByText('Post JSON Data');

    expect(screen.getByText('Post JSON Data')).toBeInTheDocument();
  });

  test('closes the modal when the close button is clicked', async () => {
    api.get.mockResolvedValueOnce({ data: apiMockResponse });

    render(<PostController />);
    await actDefer();

    await screen.findByText('Work Is Work');

    fireEvent.click(screen.getAllByLabelText('expand row')[0]);

    await screen.findByText('Post JSON Data');

    expect(screen.getByText('Post JSON Data')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('close'));

    expect(screen.queryByText('Post JSON Data')).toBeNull();
  });
});
