import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ModalWeb from '../components/Modal/Modal.web';
import { PostInterface } from '../interfaces/Post.interface';

describe('ModalWeb component', () => {
  const selectedPost: PostInterface | null = {
    title: 'Test Post',
    url: 'http://example.com/',
    created_at: '22 Apr, 2023',
    author: 'John',
  };

  it('renders modal with selectedPost data', () => {
    const handleModalClose = jest.fn();

    render(
      <ModalWeb
        selectedPost={selectedPost}
        handleModalClose={handleModalClose}
      />
    );

    const titleElement = screen.getByText('Post JSON Data');
    expect(titleElement).toBeInTheDocument();

    const expectedTextRegex = /Test Post.*example.com.*22 Apr, 2023.*John/;
    expect(screen.getByText(expectedTextRegex)).toBeInTheDocument();
  });

  it('calls handleModalClose when close button is clicked', () => {
    const handleModalClose = jest.fn();

    render(
      <ModalWeb
        selectedPost={selectedPost}
        handleModalClose={handleModalClose}
      />
    );

    const closeButton = screen.getByLabelText('close');
    fireEvent.click(closeButton);

    expect(handleModalClose).toHaveBeenCalledTimes(1);
  });

  it('does not render modal when selectedPost is null', () => {
    const handleModalClose = jest.fn();

    render(
      <ModalWeb selectedPost={null} handleModalClose={handleModalClose} />
    );

    const titleElement = screen.queryByText('Post JSON Data');
    expect(titleElement).toBeNull();
  });
});
