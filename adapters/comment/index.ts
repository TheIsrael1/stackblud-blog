import { getSingleBlogSchemaInterface } from '../../types/api.types'
import API from '..'


const getPostsComments = async(params: getSingleBlogSchemaInterface) =>{
    const {data} = await API.get(`/posts/${params?.id}/comments`)
    return data
}


const commentService = {getPostsComments}

export default commentService