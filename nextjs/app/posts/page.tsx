import FirstPost, { Props } from './first-post'
import { User } from 'db/models';
//import { UserRepository } from 'db/repositories/UserRepository';
//import { localServerFetch } from '@api/index';
//import { ResponseData } from '@api/list';

export default async function Page() {
  const props = await getPosts()
  return <FirstPost {...props} />
}

export const getPosts = async (): Promise<Props> => {
  try {
    const users = (await User.findAll()).map((model) => model.toJSON());
    return { users };
  } catch (error) {
    return {
      errorCode: 500,
      message: error.message,
    };
  }
  /*
  const { data, errorCode } = await localServerFetch<ResponseData>('/list');
  if (errorCode) {
    return {
      message: "test" + (data.message || data.error),
      errorCode
    };
  } else {
    return {
      ...data,
      errorCode
    };
  }
  */
};
