import customFetch from "../utils/customFetch";
export  const adminStatsLoader = async () =>{
    try {
        const { data } = await customFetch.get('/users/admin/app-stats')
        return data ;
    } catch (error) {
        console.error("Error loading stats: ", error);
        return { users: 0, jobs: 0 };
    }
}
