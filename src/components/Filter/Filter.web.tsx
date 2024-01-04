import { Component } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface FilterWebType {
    handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }

export default class FilterWeb extends Component<FilterWebType> {
  render() {
    return (
      <TextField
        variant='outlined'
        placeholder='Search...'
        onChange={this.props.handleSearch}
        label='Search'
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    );
  }
}
