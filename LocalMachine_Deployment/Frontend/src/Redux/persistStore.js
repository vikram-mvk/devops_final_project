export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("twitter_state");
    if (!serializedState) return undefined;
    else return JSON.parse(serializedState);
  } catch(err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("twitter_state", serializedState);
  } catch(err) {
    console.log(err);
  }
};