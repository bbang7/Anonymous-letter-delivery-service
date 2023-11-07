import axios, { AxiosResponse } from 'axios'

const DOMAIN = process.env.NEXT_PUBLIC_TEST
const axiosInstance = axios.create({
  withCredentials: true,
})

export const linkPost = async (
  content: string,
  icon: number,
): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await axiosInstance.post(
      `${DOMAIN}/api/rolls/`,
      {
        content: content,
        icon: icon,
      },
    )
    if (!response || response.status !== 200) {
      throw new Error('에러')
    }
    return response.data
  } catch (error) {
    throw new Error('네트워크 오류')
  }
}
