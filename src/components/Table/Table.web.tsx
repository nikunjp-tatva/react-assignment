import { Component } from 'react';
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  styled,
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { visuallyHidden } from '@mui/utils';
import InfoIcon from '@mui/icons-material/Info';

import { PostInterface } from '../../interfaces/Post.interface';
import ModalWeb from '../Modal/Modal.web';
import { TableColumns } from '../../blocks/Post/src/PostController.web';

interface TableWebProps {
  paginationPage: number;
  rowsPerPage: number;
  selectedPost: PostInterface | null;
  columns: TableColumns[];
  sortDirection: 'asc' | 'desc';
  sortBy: string;
  handleRowClick: (post: PostInterface) => void;
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleModalClose: () => void;
  handleSort: (property: keyof PostInterface) => void;
  sortedData: PostInterface[];
  count: number;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontWeight: 600,
  },
}));

export default class TableWeb extends Component<TableWebProps> {
  render() {
    return (
      <div>
        <TableContainer component={Paper} sx={{ maxHeight: 770 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {this.props.columns.map((headCell) => (
                  <StyledTableCell
                    key={headCell.id}
                    sortDirection={
                      this.props.sortBy === headCell.id
                        ? this.props.sortDirection
                        : false
                    }>
                    <TableSortLabel
                      active={true}
                      direction={
                        this.props.sortBy === headCell.id
                          ? this.props.sortDirection
                          : 'asc'
                      }
                      onClick={() => this.props.handleSort(headCell.id)}>
                      {headCell.label}

                      {this.props.sortBy === headCell.id ? (
                        <Box component='span' sx={visuallyHidden}></Box>
                      ) : null}
                    </TableSortLabel>
                  </StyledTableCell>
                ))}
                <StyledTableCell>View</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.sortedData.map((row: PostInterface) => (
                <TableRow
                  key={row.title}
                 >
                  <StyledTableCell sx={{ width: 600 }}>
                    {row.title}
                  </StyledTableCell>
                  <StyledTableCell sx={{ width: 650 }}>
                    {row.url}
                  </StyledTableCell>
                  <StyledTableCell sx={{ width: 150 }}>
                    {row.created_at}
                  </StyledTableCell>
                  <StyledTableCell sx={{ width: 250 }}>
                    {row.author}
                  </StyledTableCell>
                  <StyledTableCell  onClick={() => this.props.handleRowClick(row)}>
                  <IconButton sx={{ width: 20 }} aria-label='expand row' size='small'>
                    <InfoIcon />
                  </IconButton>
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component='div'
          count={this.props.count}
          page={this.props.paginationPage}
          onPageChange={this.props.handleChangePage}
          rowsPerPage={this.props.rowsPerPage}
          onRowsPerPageChange={this.props.handleChangeRowsPerPage}
        />
        <ModalWeb
          selectedPost={this.props.selectedPost}
          handleModalClose={this.props.handleModalClose}
        />
      </div>
    );
  }
}
