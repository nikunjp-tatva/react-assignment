import { Component } from 'react';
import { APIResponseInterface, fetchPosts } from '../../../services/apiService';
import { PostInterface } from '../../../interfaces/Post.interface';
import FilterWeb from '../../../components/Filter/Filter.web';
import TableWeb from '../../../components/Table/Table.web';

interface PostControllerState {
  posts: PostInterface[];
  selectedPost: PostInterface | null;
  page: number;
  loading: boolean;
  paginationPage: number;
  rowsPerPage: number;
  sortDirection: 'asc' | 'desc';
  sortBy: keyof PostInterface;
  searchValue: string;
  totalPages: number;
  totalPosts: number;
}
export interface TableColumns {
  id: keyof PostInterface;
  label: string;
}

class PostController extends Component<{}, PostControllerState> {
  protected headCells: TableColumns[] = [
    {
      id: 'title',
      label: 'Title',
    },
    {
      id: 'url',
      label: 'URL',
    },
    {
      id: 'created_at',
      label: 'Created Date',
    },
    {
      id: 'author',
      label: 'Author',
    },
  ];
  constructor(props: {}) {
    super(props);
    this.state = {
      posts: [],
      selectedPost: null,
      page: 0,
      loading: false,
      paginationPage: 0,
      rowsPerPage: 10,
      sortDirection: 'asc',
      sortBy: 'title',
      searchValue: '',
      totalPages: 0,
      totalPosts: 0,
    };
  }

  handleRowClick = (post: PostInterface) => {
    this.setState({ selectedPost: post });
  };

  handleModalClose = () => {
    this.setState({ selectedPost: null });
  };

  handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    this.setState({ paginationPage: newPage });
    this.handleAPIPolling(
      newPage,
      this.state.rowsPerPage,
      this.state.searchValue
    );
  };

  handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rowsPerPage = parseInt(event.target.value, 10);
    this.setState({ rowsPerPage });
    this.setState({ paginationPage: 0 });
    this.setState({ page: 0 });
    this.handleAPIPolling(0, rowsPerPage, this.state.searchValue);
  };

  handleSort = (property: keyof PostInterface) => {
    const { sortBy, sortDirection } = this.state;
    const isAsc = sortBy === property && sortDirection === 'asc';
    this.setState({
      sortBy: property,
      sortDirection: isAsc ? 'desc' : 'asc',
    });
  };

  handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    this.setState({ searchValue });
    this.handleAPIPolling(0, this.state.rowsPerPage, searchValue);
  };

  mergeUnique = (
    mainArray: PostInterface[],
    newArray: PostInterface[],
    property: keyof PostInterface
  ) => {
    const existingValues = mainArray.map((obj) => obj[property]);

    newArray.forEach((obj) => {
      if (!existingValues.includes(obj[property])) {
        mainArray.push(obj);
      }
    });

    return mainArray;
  };

  convertDate = (inputDate: string) => {
    const date = new Date(inputDate);
    const options: {
      year: 'numeric';
      month: 'short';
      day: '2-digit';
    } = { year: 'numeric', month: 'short', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  updatedDateData = (data: PostInterface[]) =>
    data?.map((item) => {
      const formattedDate = this.convertDate(item.created_at);
      return { ...item, created_at: formattedDate };
    });

  handleAPIPolling = async (
    paginationPage: number,
    rowsPerPage: number,
    searchValue: string
  ): Promise<void> => {
    this.setState({ page: paginationPage });
    this.setState({ paginationPage: paginationPage });
    // const oldData = this.state.posts;

    try {
      const data: never[] | APIResponseInterface = await fetchPosts(
        paginationPage,
        rowsPerPage,
        searchValue
      );
      const updatedData = this.updatedDateData(data?.posts);
      // const newData = this.mergeUnique(oldData, updatedData, 'title');

      this.setState({
        rowsPerPage: data.rowsPerPage,
      });
      this.setState({ totalPages: data.totalPages });
      this.setState({
        totalPosts: data.totalPages * data.rowsPerPage,
      });
      this.setState({ posts: updatedData });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  componentDidMount() {
    this.handleAPIPolling(
      this.state.paginationPage,
      this.state.rowsPerPage,
      this.state.searchValue
    );
  }

  render(): JSX.Element {
    const {
      posts,
      sortBy,
      sortDirection,
      searchValue,
      paginationPage,
      rowsPerPage,
    } = this.state;
    // const filteredData = posts.filter(
    //   (item) =>
    //     item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
    //     item.url.toLowerCase().includes(searchValue.toLowerCase()) ||
    //     item.created_at.toLowerCase().includes(searchValue.toLowerCase()) ||
    //     item.author.toLowerCase().includes(searchValue.toLowerCase())
    // );
    const sortedData = posts
      .slice(
        paginationPage * rowsPerPage,
        paginationPage * rowsPerPage + rowsPerPage
      )
      .sort((a, b) => {
        const isAsc = sortDirection === 'asc';
        let nextValue: string = a[sortBy];
        let prevValue: string = b[sortBy];

        prevValue = prevValue.toUpperCase();
        nextValue = nextValue.toUpperCase();

        if (nextValue < prevValue) {
          return isAsc ? -1 : 1;
        }
        if (nextValue > prevValue) {
          return isAsc ? 1 : -1;
        }
        return 0;
      });

    return (
      <>
        <h1>
          <center>News Feed</center>
        </h1>
        {this.state.posts.length > 0 ? (
          <>
            <FilterWeb handleSearch={this.handleSearch} />
            <TableWeb
              paginationPage={this.state.paginationPage}
              rowsPerPage={this.state.rowsPerPage}
              selectedPost={this.state.selectedPost}
              sortDirection={this.state.sortDirection}
              sortBy={this.state.sortBy}
              columns={this.headCells}
              handleRowClick={this.handleRowClick}
              handleChangePage={this.handleChangePage}
              handleChangeRowsPerPage={this.handleChangeRowsPerPage}
              handleModalClose={this.handleModalClose}
              handleSort={this.handleSort}
              sortedData={sortedData}
              count={this.state.totalPosts}
            />
          </>
        ) : (
          <h4>
            <center>Wait! Getting data from API...</center>
          </h4>
        )}
      </>
    );
  }
}

export default PostController;
