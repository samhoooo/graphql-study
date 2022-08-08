const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { 
    GraphQLSchema, 
    GraphQLObjectType, 
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql');
const app = express();

const books = [
    {
        id: 1,
        name: 'Harry Potter and the Chamber of Secrets',
        authorId: 1
    },
    {
        id: 2,
        name: 'Harry Potter and the Prisoner of Azkaban',
        authorId: 1
    },
    {
        id: 3,
        name: 'The Felloship of the Ring',
        authorId: 2
    }
];

const authors = [
    {
        id: 1, 
        name: 'J. K. Rowling'
    },
    {
        id: 2,
        name: 'J. R. R. Tolkien'
    }
]

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents an author of a book',
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLInt)
        },
        name: {
            type: GraphQLNonNull(GraphQLString)
        },
        books: {
            type: GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => book.id === author.id)
            }
        }
    })
});

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This represents a book written by an author',
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLInt)
        },
        name: { 
            type: GraphQLNonNull(GraphQLString)
        },
        authorId: {
            type: GraphQLNonNull(GraphQLInt)
        },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
});

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        book: {
            type: BookType,
            description: 'A single book',
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'List of book types',
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of authors',
            resolve: () => authors
        },
        author: {
            type: AuthorType,
            description: 'A single author',
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve: (parent, args) => authors.find(author => author.id === args.id)
        }
    })
});

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add a book',
            args: {
                name: {
                    type: GraphQLNonNull(GraphQLString)
                },
                authorId: {
                    type: GraphQLNonNull(GraphQLInt)
                }
            },
            resolve: (parent, args) => {
                const book = {
                    id: books.length + 1,
                    name: args.name,
                    authorId: args.authorId
                };
                books.push(book);
                return book;
            }
        },
        addAuthor: {
            type: AuthorType,
            description: 'Add an author',
            args: {
                name: {
                    type: GraphQLNonNull(GraphQLString)
                }
            },
            resolve: (parent, args) => {
                const author = {
                    id: authors.length + 1,
                    name: args.name,
                };
                authors.push(author);
                return author;
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});


app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));
app.listen(3000, () => console.log('Server is ronning'));