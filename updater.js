import client from "./services/obyteInstance.js";
import githubAxiosInstance from "./services/githubAxiosInstance.js";
import store from "./store.js";

const limit = process.env.LIMIT_OF_POPULAR;

export const updater = async () => {

  // get list of repositories
  let data = {};
  try {
    let lastKey = "";
    while (true) {
      const chunkData = (await client.api.getAaStateVars({
        address: process.env.AA_ADDRESS,
        var_prefix_from: lastKey
      }));
      const keys = Object.keys(chunkData);
      if (keys.length > 1) {
        data = { ...data, ...chunkData };
        lastKey = keys[keys.length - 1];
      } else {
        break;
      }
    }
  } catch (e) {
    console.log("Error: ", e);
  }

  data = Object.keys(data).filter((key) => key.indexOf('*total_received*base') >= 0).map((key) => {
    const [full_name] = key.split("*");

    return {
      total_received_in_base: data[key],
      full_name
    }
  }).sort((a, b) => b.total_received_in_base - a.total_received_in_base).slice(0, limit);

  // get data from github
  const dataGetter = data.map((repo) => getRepoByFullName(repo.full_name).then((data) => { Object.keys(data).length > 0 && delete repo.full_name; repo.info = data }));

  try {
    await Promise.all(dataGetter);
    store.update(data);
  } catch (err) {
    console.log("error", err)
  }
}


export const getRepoByFullName = (full_name) => {
  return githubAxiosInstance.get(`/repos/${full_name}`).then((res) => {
    const data = res?.data;
    return {
      full_name: data.full_name,
      // owner: data.owner,
      description: data.description,
      language: data.language,
      stargazers_count: data.stargazers_count,
      forks_count: data.forks_count,
      created_at: data.created_at
    }
  }).catch(() => ({}));
}