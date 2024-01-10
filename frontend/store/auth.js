const state = () => ({
    accsesToke: null,
    refreshToken: null,
    fullname: null,
});

const mutations = {
    setAccessToken(state, accessToken) {
        state.accsesToken = accessToken;
    },
    setRefreshToken(state, refreshToken) {
        state.refreshToken = refreshToken;
    },
    setFullname(state, fullname) {
        state.fullname = fullname;
    },
};

const actions = {
    async login({ commit }, payload) {
        const response = await this.$axios.post("http://localhost:3000/api/login", payload);
        if (!response) {
            return false;
        }
        commit("setAccessToken", response.data.accessToken);
        commit("setRefreshToken", response.data.refreshToken);
        commit("setFullname", response.data.fullname);

        return response;
    },
};

export default { state, mutations, actions };
