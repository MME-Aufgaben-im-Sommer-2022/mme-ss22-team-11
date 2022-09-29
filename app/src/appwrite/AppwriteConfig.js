/**
 * Zentrales Konfigurationsobjekt für alle wichtigen Appwrite-Paramter
 */
export default {
 endpoint: "https://appwrite.software-engineering.education/v1", // API-Endpoint
 project: "62ecf9068d60a3eb72ab", // Projekt-ID für Anwendung
 database: {
  id: "633441b010a3d7ab7519",
  collections: {
   user: {
    id: "633441b6674e76102ea8",
   },
   recipe: {
    id: "633442068d24b2efce9b",
   },
  },
  documents: {
   communityRecipes: {
    id: "communityRecipes",
   },
  },
 },
};