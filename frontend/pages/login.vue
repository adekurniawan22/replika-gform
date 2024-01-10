<template>
    <v-row justify="center">
        <v-col cols="10" md="6">
            <v-card>
                <v-toolbar color="primary" dark> Login </v-toolbar>
                <v-card-text>
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
                    <v-btn :loading="isLoading" color="primary" @click="onSubmit">Login</v-btn>
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
            isLoading: false,
            form: {
                email: "",
                password: "",
            },
            passwordVisible: false,
            rules: {
                email: [
                    (v) => !!v || "E-mail is required",
                    (v) => /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(v) || "E-mail must be valid",
                    (v) => !this.emailExist || "E-mail already exists",
                ],
                password: [
                    (v) => !!v || "Password is required",
                    (v) => v.length >= 6 || "Password must be at least 6 characters",
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
                    const response = await this.$axios.$post("http://localhost:3000/api/register", this.form);
                    console.log(response);
                    setTimeout(() => {
                        this.isLoading = false;
                        alert("REGISTER SUCCESS");
                        // window.location.reload();
                    }, 3000);
                }
            } catch (error) {
                console.error(error);
                if (error.response.data.message == "EMAIL_ALREADY_EXIST") {
                    this.emailExist = true;
                    this.isLoading = false;
                    this.$refs.form.validate();
                }
            }
        },
        togglePasswordVisibility(isVisible, field) {
            if (field === "password") {
                this.passwordVisible = isVisible;
            } else if (field === "password_confirmation") {
                this.passwordConfirmationVisible = isVisible;
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
