import { Component } from 'react';
import { fetchPosts } from '../../../services/apiService';
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
}
export interface TableColumns {
  id: keyof PostInterface;
  label: string;
}

class PostController extends Component<{}, PostControllerState> {
  private polling: NodeJS.Timeout | null = null;
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
      page: 1,
      loading: false,
      paginationPage: 0,
      rowsPerPage: 10,
      sortDirection: 'asc',
      sortBy: 'title',
      searchValue: '',
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
  };

  handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
    this.setState({ paginationPage: 0 });
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
    this.setState({ searchValue: event.target.value });
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

  updatedDateData = (data: PostInterface[]) => data.map(item => {
      const formattedDate = this.convertDate(item.created_at);
      return { ...item, created_at: formattedDate };
    });

  handleAPIPolling = async (): Promise<void> => {
    this.setState((prevState) => ({ page: prevState.page + 1 }));
    const oldData = this.state.posts;

    const data = await fetchPosts(this.state.page);
    const updatedData = this.updatedDateData(data);
    const newData = this.mergeUnique(oldData, updatedData, 'title');
    this.setState({ posts: newData });
  };

  componentDidMount() {
    // this.handleAPIPolling();
    this.polling = setInterval(this.handleAPIPolling, 10000) as NodeJS.Timeout;
  }

  componentWillUnmount() {
    if (this.polling !== null) {
      clearInterval(this.polling);
    }
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
    const filteredData = posts.filter((item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.url.toLowerCase().includes(searchValue.toLowerCase()) || 
      item.created_at.toLowerCase().includes(searchValue.toLowerCase()) || 
      item.author.toLowerCase().includes(searchValue.toLowerCase())
    );
    const sortedData = filteredData
      .slice(
        paginationPage * rowsPerPage,
        paginationPage * rowsPerPage + rowsPerPage
      )
      .sort((a, b) => {
        const isAsc = sortDirection === 'asc';
        let nextValue: string | Date = a[sortBy];
        let prevValue: string | Date = b[sortBy];

        if (sortBy === 'created_at') {
          prevValue = new Date(prevValue);
          nextValue = new Date(nextValue);
        } else if (
          typeof prevValue === 'string' &&
          typeof nextValue === 'string'
        ) {
          prevValue = prevValue.toUpperCase();
          nextValue = nextValue.toUpperCase();
        }

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
              count={filteredData.length}
            />
          </>
        ) : (
          <h4>
            {' '}
            <center>Wait! Getting data from API...</center>
          </h4>
        )}
      </>
    );
  }
}

export default PostController;
