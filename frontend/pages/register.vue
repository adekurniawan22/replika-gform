<template>
    <v-row justify="center">
        <v-col cols="10" md="6">
            <v-card>
                <v-toolbar color="primary" dark> Register </v-toolbar>
                <v-card-text>
                    <v-form ref="form">
                        <v-text-field v-model="form.fullname" label="Fullname" :rules="rules.fullname" required></v-text-field>
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
                                <v-icon @click="togglePasswordVisibility">{{ passwordIcon }}</v-icon>
                            </template>
                        </v-text-field>
                        <v-text-field
                            v-model="form.password_confirmation"
                            label="Confirm Password"
                            :rules="rules.password_confirmation"
                            :type="passwordFieldType"
                            required
                        >
                            <template v-slot:append>
                                <v-icon @click="togglePasswordVisibility">{{ passwordIcon }}</v-icon>
                            </template>
                        </v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="onSubmit">Register</v-btn>
                </v-card-actions>
            </v-card>
            <div class="d-flex align-baseline">
                <p>Kamu belum punya akun?</p>
                <v-btn text plain :ripple="false" class="pl-2" to="/login" color="primary">Login</v-btn>
            </div>
        </v-col>
    </v-row>
</template>

<script>
export default {
    layout: "auth",
    data() {
        return {
            emailExist: false,
            form: {
                fullname: "",
                email: "",
                password: "",
                password_confirmation: "",
            },
            passwordVisible: false,
            rules: {
                fullname: [(v) => !!v || "Fullname is required"],
                email: [
                    (v) => !!v || "E-mail is required",
                    (v) => /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(v) || "E-mail must be valid",
                    (v) => !this.emailExist || "E-mail already exist",
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
                    await this.$axios.$post("http://localhost:3000/api/register", this.form);
                }
            } catch (error) {
                console.error(error);
                if (error.response.data.message == "EMAIL_ALREADY_EXIST") {
                    this.emailExist = true;
                    this.$refs.form.validate();
                }
            }
        },
        togglePasswordVisibility() {
            this.passwordVisible = !this.passwordVisible;
        },
    },
};
</script>
