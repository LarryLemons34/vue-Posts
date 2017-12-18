import Vue from 'vue'
import Router from 'vue-router'
import Posts from '@/components/Posts'
import NewPosts from '@/components/NewPosts'
import EditPosts from '@/components/EditPosts'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/posts',
      name: 'Posts',
      component: Posts
    },
    {
      path: '/posts/new',
      name: 'NewPosts',
      component: NewPosts
    },
    {
      path: '/posts/:id',
      name: 'EditPosts',
      component: EditPosts
    }
  ]
})
