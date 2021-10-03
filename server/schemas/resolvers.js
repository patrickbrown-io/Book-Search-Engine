const { User, Book } = require("../models");
const {AuthenticationError} = require("apollo-server-express");
const {signToken} = require("../utils/auth")

const resolvers= {
    Query: {
        me: async (parent, args, context) => {
            if(context.user){
                return User.findOne({_id: context.user._id});
            }
            throw new AuthenticationError("You need to be logged in.")
        },
    },

    Mutation: {
        //  add user mutation
        addUser: async (parent, { name, email, password}) => {
            const User = await User.create({name, email, password});
            const token = signToken(User);

            return { token, User};
        },

        // login

        login: async (parent, {email, password})=> {
            const User = await User.findOne({email});

            if(!User) {
                throw new AuthenticationError("No user with this email found")
            }

            const correctPass = await User.isCorrectPassword(password);

            if(!correctPass){
                throw new AuthenticationError("The email/password you tried is not valid. Please try again.")
            }

            const token = signToken(User);
            return { token, User}
        },


        saveBook: async(parent, args, context) => {
            if (context.user){
                return User.findOneAndUpdate(
                    {
                        _id: UserId
                    },
                    {
                        $addToSet: {savedBooks: args.input},
                    },
                    {
                        new: true,
                    }
                );
            }
            throw new AuthenticationError("You need to be logged in")
        },

        removeBook: async (parent, {skill},context)=>{
            if(context.user){
                return User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$pull: { savedBooks:{ bookId: args.bookId}}},
                    {new: true}
                );
            }
            throw new AuthenticationError("You need to be logged in");
        },
    },
};

module.exports = resolvers;

