// 📍 lib > appwrite.js
import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Storage,
  Query,
} from "react-native-appwrite"

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1", // this is the endpoint of the appwrite server
  platform: "com.guido.aora", // this is the platform name
  projectId: "668fb38d001ebb91ceda", // the project id copied from the appwrite 'overview' tab
  storageId: "668fbc4f00058c6082b2", // the storage id copied from the appwrite 'storage' tab
  databaseId: "668fb8600001bb1a4ee4", // the database id copied from the appwrite 'database' tab
  userCollectionId: "668fb8f50024402046c8", // the collection id of the user collection
  videoCollectionId: "668fb940003c2e92a4c7", // the collection id of the video collection
}

// Init your React Native SDK
const client = new Client()

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.

const account = new Account(client)
const storage = new Storage(client)
const avatars = new Avatars(client)
const databases = new Databases(client)

// Register user
export async function createUser(email, password, username) {
  try {
    // 1s step: create an account passing the email, password and username
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    )

    // if the account is not created, throw an error
    if (!newAccount) throw Error

    // 2nd step: create an avatar for the user using 'avatars' service from appwrite
    const avatarUrl = avatars.getInitials(username) //

    // 3rd step: login the created user
    await signIn(email, password)

    // 4th step: create a new document in the user collection
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(), // the document id
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    )

    // 5th step: return the new user
    return newUser
  } catch (error) {
    throw new Error(error)
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    // Stablish a new user session using the email and password
    const session = await account.createEmailPasswordSession(email, password)

    return session
  } catch (error) {
    throw new Error(error)
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get()

    return currentAccount
  } catch (error) {
    throw new Error(error)
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount()
    if (!currentAccount) throw Error

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId, // 1st define from which database you want to get the documents
      appwriteConfig.userCollectionId, // 2nd define from which collection you want to get the documents
      [Query.equal("accountId", currentAccount.$id)] // 3rd define the query to get the documents
    )

    if (!currentUser) throw Error // if there is no user, throw an error

    return currentUser.documents[0] // If there is a user, return the first document
  } catch (error) {
    console.log(error)
    return null
  }
}

// Get latest created video posts
export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    )

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

// Get video posts that matches search query
export async function searchPosts(query) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)] // To be able to search for a query, you need to create a search index in the required collection
    )

    if (!posts) throw new Error("Something went wrong")

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

// Get video posts created by user
export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("creator", userId)]
    )

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export async function signOut() {
  try {
    const session = await account.deleteSession("current")

    return session
  } catch (error) {
    throw new Error(error)
  }
}
