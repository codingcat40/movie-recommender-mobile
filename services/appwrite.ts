// track searches made by users
import { Client, Databases, ID, Query } from "react-native-appwrite";
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  // check if record is already stored
  // if found increment searchCount field
  // else create new document count -> 1

  try{
  const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.equal("searchTerm", query),
  ]);

  // console.log(result);
  if (result.documents.length > 0) {
    const existingMovie = result.documents[0];
    await database.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      existingMovie.$id,
      {
        count: existingMovie.count + 1,
      }
    );
  } else {
    await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
      searchTerm: query,
      movie_id: movie.id,
      count: 1,
      Title: movie.title,
      poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    });
  }
}catch(err){
    throw err;
}

};
