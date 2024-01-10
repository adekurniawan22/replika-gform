<template>
    <v-row justify="center">
        <v-col cols="10" md="6">
            <v-card>
                <v-toolbar color="primary" dark> Login </v-toolbar>
                <v-card-text>
                    <v-alert color="red lighten-2" dark v-if="isError">{{ $i18n.t(message) }} </v-alert>
                    <v-form ref="form">
                        <v-text-field
                            v-model="form.email"
                            label="Email"
                            :rules="rules.email"
                            required
                            @keydown="resetEmailExist"
                        ></v-text-field>
                        <v-text-field
                            v-model="form.password"
                            label="Password"
                            :rules="rules.password"
                            :type="passwordFieldType"
                            required
                        >
                            <template v-slot:append>
                                <v-icon
                                    class="password-toggle-icon"
                                    @mousedown="togglePasswordVisibility(true, 'password')"
                                    @mouseup="togglePasswordVisibility(false, 'password')"
                                    >{{ passwordIcon }}</v-icon
                                >
                            </template>
                        </v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn :loading="isLoading" color="primary" @click="onSubmit">Register</v-btn>
                </v-card-actions>
            </v-card>
            <div class="d-flex align-baseline">
                <p>Kamu belum punya akun?</p>
                <v-btn text plain :ripple="false" class="pl-2" to="/register" color="primary">Register</v-btn>
            </div>
        </v-col>
    </v-row>
</template>

<script>
export default {
    layout: "auth",
    data() {
        return {
            isError: false,
            message: "",
            isLoading: false,
            form: {
                fullname: "",
                email: "",
                password: "",
                password_confirmation: "",
            },
            passwordVisible: false,
            passwordConfirmationVisible: false,
            rules: {
                fullname: [(v) => !!v || "Fullname is required"],
                email: [
                    (v) => !!v || "E-mail is required",
                    (v) => /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(v) || "E-mail must be valid",
                ],
                password: [
                    (v) => !!v || "Password is required",
                    (v) => v.length >= 6 || "Password must be at least 6 characters",
                ],
                password_confirmation: [
                    (v) => !!v || "Confirm password is required",
                    (v) => v === this.form.password || "Passwords do not match",
                ],
            },
        };
    },
    computed: {
        passwordFieldType() {
            return this.passwordVisible ? "text" : "password";
        },
        passwordIcon() {
            return this.passwordVisible ? "mdi-eye" : "mdi-eye-off";
        },
    },
    methods: {
        resetEmailExist() {
            this.emailExist = false;
        },
        async onSubmit() {
            try {
                if (this.$refs.form.validate()) {
                    this.isLoading = true;
                    const user = await this.$store.dispatch("auth/login", this.form);
                    setTimeout(() => {
                        this.isLoading = false;
                        alert("Halo, selamat datang " + user.data.fullname);
                        this.form = {
                            fullname: "",
                            email: "",
                            password: "",
                            password_confirmation: "",
                        };
                        this.$refs.form.resetValidation();
                    }, 2000);
                }
            } catch (error) {
                this.isError = true;
                this.message = error.response ? error.response.data.message : "SERVER_ERROR";
                this.isLoading = false;
                this.$refs.form.validate();
            }
        },
        togglePasswordVisibility(isVisible, field) {
            if (field === "password") {
                this.passwordVisible = isVisible;
            }
            this.$refs.form.validate();
        },
    },
};
</script>

<style scoped>
.password-toggle-icon {
    cursor: pointer;
}
</style>
