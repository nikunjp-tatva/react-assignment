import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TableWeb, { TableWebProps } from '../components/Table/Table.web';
import { PostInterface } from '../interfaces/Post.interface';

const mockColumns: {
  id: keyof PostInterface;
  label: string;
}[] = [
  { id: 'title', label: 'Title' },
  { id: 'url', label: 'URL' },
  { id: 'created_at', label: 'Created At' },
  { id: 'author', label: 'Author' },
];

const mockSortedData: PostInterface[] = [
  {
    author: 'bkolobara',
    title: 'Work Is Work',
    url: 'https://codahale.com//work-is-work/',
    created_at: 'Jan 16, 2024',
  },
  {
    author: 'bkolobasra',
    title: 'Work Is Wsork',
    url: 'https://codashale.com//work-is-work/',
    created_at: 'Jan 13, 2024',
  },
  {
    author: 'gnicholas',
    title:
      'YouTube appears to be reducing video and site performance for ad-block users',
    url: 'https://arstechnica.com/gadgets/2024/01/youtube-appears-to-be-reducing-video-and-site-performance-for-ad-block-users/',
    created_at: 'Jan 16, 2024',
  },
  {
    author: 'keepamovin',
    title: 'Vivek Ramaswamy drops out of race, endorses Trump [video]',
    url: 'https://www.youtube.com/watch?v=zENAMNTpEo0',
    created_at: 'Jan 16, 2024',
  },
  {
    author: 'IronWolve',
    title: 'Prison. Bankruptcy. Suicide. How a software glitch ruined lives',
    url: 'https://www.cnn.com/2024/01/13/business/uk-post-office-fujitsu-horizon-scandal/index.html',
    created_at: 'Jan 16, 2024',
  },
  {
    author: 'walterbell',
    title:
      'The Case for the U.S. Supreme Court to Overturn Chevron Deference',
    url: 'https://www.wsj.com/articles/the-case-for-the-supreme-court-to-overturn-chevron-deference-e7f762b4',
    created_at: 'Jan 16, 2024',
  },
  {
    author: 'IronWolve',
    title:
      "Fujitsu may have to repay 'fortune' spent on British Post Office Scandal",
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
    title: 'Musical Chairs: A Shrinking SaaS TAM',
    url: 'https://humancapitalist.substack.com/p/musical-chairs-a-shrinking-saas-tam',
    created_at: 'Jan 16, 2024',
  },
  {
    author: 'bane',
    title: 'Windows for Warships',
    url: 'https://www.schneier.com/blog/archives/2007/02/windows_for_war_1.html',
    created_at: 'Jan 16, 2024',
  },
  {
    author: 'azhenley',
    title: 'Things I Keep Repeating About Writing (2016)',
    url: 'https://clairelegoues.com/posts/clg-writing-rules.html',
    created_at: 'Jan 16, 2024',
  },
];

const mockProps: TableWebProps = {
  paginationPage: 0,
  rowsPerPage: 10,
  selectedPost: null,
  columns: mockColumns,
  sortDirection: 'asc',
  sortBy: 'title',
  handleRowClick: jest.fn(),
  handleChangePage: jest.fn(),
  handleChangeRowsPerPage: jest.fn(),
  handleModalClose: jest.fn(),
  handleSort: jest.fn(),
  sortedData: mockSortedData,
  count: mockSortedData.length,
};

describe('TableWeb Component', () => {
  test('renders table headers correctly', () => {
    render(<TableWeb {...mockProps} />);
    mockColumns.forEach((column) => {
      const columnHeader = screen.getByText(column.label);
      expect(columnHeader).toBeInTheDocument();
    });
  });

  test('displays rows with correct data', () => {
    render(<TableWeb {...mockProps} />);
    mockSortedData.forEach((row) => {
      Object.values(row).forEach((cellData) => {
        const cell = screen.getAllByText(cellData);
        expect(cell[0]).toBeInTheDocument();
      });
    });
  });

  test('handles pagination change', async () => {
    render(<TableWeb {...mockProps} />);
    const nextPageButton = screen.getByLabelText('Go to next page');
    fireEvent.click(nextPageButton);
    expect(mockProps.handleChangePage).toHaveBeenCalled();
  });

  test('handles rows per page change', async () => {
    render(<TableWeb {...mockProps} />);

    const selectPageOptions = screen.getByRole('combobox', {
      name: 'Rows per page:',
    });
    await act(async () => userEvent.click(selectPageOptions));
    const select20Page = screen.getByRole('option', { name: '20' });
    await act(async () => userEvent.click(select20Page));

    expect(mockProps.handleChangeRowsPerPage).toHaveBeenCalled();
  });

  test('handles column sorting', () => {
    render(<TableWeb {...mockProps} />);
    const titleHeader = screen.getByText('Title');
    fireEvent.click(titleHeader);
    expect(mockProps.handleSort).toHaveBeenCalledWith('title');
  });

  test('displays modal with correct post data', () => {
    const selectedPost = mockSortedData[0];
    const updatedProps = {
      ...mockProps,
      selectedPost,
    };
    render(<TableWeb {...updatedProps} />);
    const row = screen.getByText(selectedPost.title);
    fireEvent.click(row);
    const modalContent = screen.getByText(selectedPost.title);
    expect(modalContent).toBeInTheDocument();
  });
});
