import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import FilterWeb from '../components/Filter/Filter.web';

describe('FilterWeb component', () => {
  it('triggers handleSearch on input change', () => {
    const mockHandleSearch = jest.fn();
    render(<FilterWeb handleSearch={mockHandleSearch} />);

    const inputElement = screen.getByPlaceholderText('Search...');
    fireEvent.change(inputElement, { target: { value: 'Test Search' } });

    expect(mockHandleSearch).toHaveBeenCalledTimes(1);
    expect(mockHandleSearch).toHaveBeenCalledWith(expect.any(Object));
  });

  it('renders with correct placeholder text', () => {
    const mockHandleSearch = jest.fn();
     render(<FilterWeb handleSearch={mockHandleSearch} />);
  
    const inputElement = screen.getByPlaceholderText('Search...');
  
    expect(inputElement).toBeInTheDocument();
  });
  
  it('updates input value correctly', () => {
    const mockHandleSearch = jest.fn();
    render(<FilterWeb handleSearch={mockHandleSearch} />);
  
    const inputElement = screen.getByPlaceholderText('Search...');
    fireEvent.change(inputElement, { target: { value: 'Updated Search' } });
  
    expect(inputElement.value).toBe('Updated Search');
  });
  
});
