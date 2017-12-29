import Api from '@/services/Api'
/* eslint-disable */
export default {
  fetchPosts () {
    return Api().get('posts')
  },
  fetchGraphPosts (){
    return Api().get('graphPosts')
  },
  addPost (params) {
    return Api().post('posts', params)
  },
  updatePost (params){
    return Api().put('posts/' + params.id, params)
  },
  getPost (params){
    return Api().get('post/' + params.id)
  },
  deletePost (id){
    return Api().delete('posts/' + id)
  },
  addGraphPost (params){
    return Api().post('graphPosts' + params)
  }

}