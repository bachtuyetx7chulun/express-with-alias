export const typeDefs = `#graphql
  union SearchResult = Author | Book

  type Author {
    name: String
    age: Int
  }

  type Book {
    title: String
    author: String
  }

  type Comment {
    id: ID!
    comment: String
  }

  type CommentWithTimestamp {
    id: ID!
    comment: String
    timestamp: String
  }

  type Subscription {
    commentAdded: CommentWithTimestamp
  }

  type Query {
    search: [SearchResult]
  }

  type Mutation {
    createComment: Comment
  }
`
