import axios from 'axios';
import Constant from '../constant';

const API_URL = Constant.API_URL;
const API_GET_REQUEST = Constant.API_GET_REQUEST;

interface APIResponseInterface {
  author: string;
  created_at: string;
  title: string;
  url: string;
}

export const fetchPosts = async (page: number) => {
  try {
    const { data } = await axios({
      method: API_GET_REQUEST,
      url: API_URL,
      params: {
        page,
        tags: 'story',
      },
    });

    const result: APIResponseInterface[] = data.hits.map(
      (hit: APIResponseInterface) => ({
        author: hit?.author ? hit?.author : '',
        created_at: hit?.created_at ? hit?.created_at : '',
        title: hit?.title ? hit?.title : '',
        url: hit?.url ? hit?.url : '',
      })
    );

    return result;
  } catch (error) {
    console.error('Error fetching new posts:', error);
    return [];
  }
};
