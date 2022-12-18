import { withFilter } from 'graphql-subscriptions'
import { authors, books } from '@/graphql/database'
import { Author, Book } from '@/graphql/types'
import { pubsub } from '@/graphql/services/redis'

const resolvers = {
  SearchResult: {
    __resolveType(obj: Book | Author | any) {
      if (obj.title) {
        return 'Book'
      }

      if (obj.name) {
        return 'Author'
      }

      return null
    }
  },

  Mutation: {
    createComment(_ctx: Object, _args: Object, _cont: Object) {
      const comments = ['This is a comment', 'This is another comment', 'This is a third comment']
      const comment = {
        id: Math.floor(Math.random() * 100),
        comment: comments[Math.floor(Math.random() * comments.length)],
        timestamp: new Date().toISOString()
      }
      pubsub.publish('COMMENT_ADDED', { commentAdded: comment })

      return {
        ...comment
      }
    }
  },

  Query: {
    search: () => {
      const data = [...authors, ...books]
      return data.splice(0, Math.random() * data.length)
    }
  },

  Subscription: {
    commentAdded: {
      // * The popular way to subscribe to COMMENT_ADDED event
      subscribe: withFilter(
        () => pubsub.asyncIterator('COMMENT_ADDED'),
        (_payload, _variables) => {
          // * Filter out all odd comment ids
          return _payload.commentAdded.id % 2 === 0
        }
      )

      // * Can also use the following line instead to subcribe to COMMENT_ADDED event
      // subscribe: () => pubsub.asyncIterator('COMMENT_ADDED')
    }
  }
}

export { resolvers }
