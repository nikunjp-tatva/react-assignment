import axios from 'axios';
import Constant from '../constant';
import { PostInterface } from '../interfaces/Post.interface';

const API_URL = Constant.API_URL;
const API_GET_REQUEST = Constant.API_GET_REQUEST;

export interface APIResponseInterface {
  posts: PostInterface[];
  rowsPerPage: number;
  totalPages: number;
}

export const fetchPosts = async (page: number, rowsPerPage: number, searchValue: string) => {
  try {
    const { data } = await axios({
      method: API_GET_REQUEST,
      url: API_URL,
      params: {
        page,
        tags: 'story',
        hitsPerPage: rowsPerPage,
        query: searchValue,
      },
    });

    const result: PostInterface[] = data?.hits?.map((hit: PostInterface) => ({
      author: hit?.author ? hit?.author : '',
      created_at: hit?.created_at ? hit?.created_at : '',
      title: hit?.title ? hit?.title : '',
      url: hit?.url ? hit?.url : '',
    }));

    const apiResponseData: APIResponseInterface = {
      posts: result.length ? result : [],
      rowsPerPage: data.hitsPerPage,
      totalPages: data.nbPages,
    };
    return apiResponseData;
  } catch (error) {
    console.error('Error fetching new posts:', error);
    return [];
  }
};
