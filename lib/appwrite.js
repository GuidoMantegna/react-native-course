// 📍 lib > appwrite.js
import { Client, Account, ID } from "react-native-appwrite"

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

// Register User
export const createUser = () => {
  account.create(ID.unique(), "me@example.com", "password", "Jane Doe").then(
    function (response) {
      console.log(response)
    },
    function (error) {
      console.log(error)
    }
  )
}
