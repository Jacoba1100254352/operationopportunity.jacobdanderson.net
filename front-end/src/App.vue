<template>
	<div id="app">
		<!----------------
		-   Navigation   -
		----------------->

		<nav
			class="navbar navbar-expand-lg navbar-light"
			style="background-color: #e3f2fd"
		>
			<div class="container-fluid">
				<router-link
					aria-current="page"
					class="nav-item navbar-brand nav-link"
					to="/"
				>
					Operation Opportunity
				</router-link>
				<button
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
					class="navbar-toggler"
					data-bs-target="#navbarSupportedContent"
					data-bs-toggle="collapse"
					type="button"
				>
					<span class="navbar-toggler-icon"></span>
				</button>
				<div id="navbarSupportedContent" class="collapse navbar-collapse">
					<ul class="nav navbar-nav me-auto mb-2 mb-lg-0">
						<li class="nav-item">
							<router-link class="nav-link" to="/">Home</router-link>
						</li>
						<li class="nav-item">
							<router-link class="nav-link" to="/signup">Signup</router-link>
						</li>
						<li class="nav-item">
							<router-link class="nav-link" to="/supportus"
								>Support Us</router-link
							>
						</li>
						<li class="nav-item">
							<router-link class="nav-link" to="/about">About</router-link>
						</li>
						<li class="nav-item">
							<router-link class="nav-link" to="/profile">Profile</router-link>
						</li>
					</ul>
					<!-- Button to logout -->
					<button
						class="btn btn-outline-danger"
						type="submit"
						v-show="loggedIn"
						v-on:click="logout()"
					>
						Logout
					</button>
					<!-- Button to open the modal login form -->
					<button
						class="btn btn-outline-success"
						type="submit"
						v-show="!loggedIn"
						v-on:click="changeLoginView(true)"
					>
						Login
					</button>
					<!-- Button to open the modal signup form -->
					<button
						class="btn btn-outline-primary"
						type="submit"
						v-show="!loggedIn"
						v-on:click="changeSignupView(true)"
					>
						Signup
					</button>
				</div>
			</div>
		</nav>

		<!----------------------------
		-   Login and Signup Forms   -
		----------------------------->

		<TutorManagement />

		<!-----------------
		-   Router View   -
		------------------>

		<router-view />

		<!------------
		-   Footer   -
		------------->

		<footer class="text-center">
			<div class="github">
				<br />
				<h2>Github</h2>
				<br />
				<nav class="footer_nav">
					<ul class="semantic_list">
						<li>
							<a
								href="https://github.com/Jacoba1100254352/operationopportunity.audiot.info"
								target="_blank"
								><img
									id="githubIcon"
									src="../public/Images/github-dark.09072337.svg"
									alt="github Icon"
							/></a>
						</li>
					</ul>
				</nav>
			</div>

			<div class="Logo_and_rights">
				<br />
				<h2>AudioT.info</h2>
				<br />
				<nav class="footer_nav">
					<ul class="semantic_list">
						<li>Provo, UT, USA</li>
						<li>
							©2021
							<a
								href="https://audiot.info"
								target="_blank"
								style="text-decoration: none; color: inherit"
								>AudioT</a
							>. All rights reserved.
						</li>
					</ul>
				</nav>
			</div>

			<div class="parter">
				<br />
				<h2>Project Partner</h2>
				<br />
				<nav class="footer_nav">
					<ul class="semantic_list">
						<li>
							<a
								href="https://nathanielcs260.com"
								target="_blank"
								style="text-decoration: none; color: inherit"
								>Nathaniel Judd</a
							>
						</li>
					</ul>
					<br />
					<p>Time Spent: 4 hours</p>
				</nav>
			</div>

			<p v-if="error" class="error">{{ error }}</p>

			<div class="ip pb-1">
				<p id="ip"></p>
			</div>
		</footer>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import axios from "axios";
import TutorManagement from "@/components/AccountManagement.vue"; // Ensure path is correct

interface RootData {
	users: never | null[];
	tutors: never | null[];
	currentTutor?: { _id: string } | null;
	currentUser: never | null;
	currentAdmin: never | null;
	signupBlock: boolean;
	loginBlock: boolean;
}

@Options({
	components: {
		TutorManagement
	}
})
export default class App extends Vue {
	error: string = "";

	get getUsersArray() {
		if (!this.$root || !this.$root.$data) {
			return null;
		}

		return (this.$root.$data as RootData).users;
	}

	get getTutorsArray() {
		if (!this.$root || !this.$root.$data) {
			return null;
		}

		return (this.$root.$data as RootData).tutors;
	}

	get loggedIn() {
		if (!this.$root || !this.$root.$data) {
			return null;
		}

		const data = this.$root.$data as RootData;
		return (
			data.currentTutor !== null ||
			data.currentUser !== null ||
			data.currentAdmin !== null
		);
	}

	async created() {
		await this.getTutors();
		await this.getUsers();
	}

	changeSignupView(showHide: boolean) {
		if (!this.$root || !this.$root.$data) {
			return;
		}

		(this.$root.$data as RootData).signupBlock = showHide;
	}

	changeLoginView(showHide: boolean) {
		if (!this.$root || !this.$root.$data) {
			return;
		}

		(this.$root.$data as RootData).loginBlock = showHide;
	}

	async getTutors() {
		if (!this.$root || !this.$root.$data) {
			return;
		}

		try {
			const response = await axios.get("/api/tutors");
			(this.$root.$data as RootData).tutors = response.data;
		} catch (error) {
			console.log(`Error: ${error}`);
			if (error instanceof Error) {
				this.error = "Error: " + error.message;
			} else {
				// Handle the case where error is not an instance of Error
				this.error = "An unknown error occurred";
			}
		}
	}

	async getUsers() {
		if (!this.$root || !this.$root.$data) {
			return;
		}

		if ((this.$root.$data as RootData).currentTutor === null) return;

		try {
			const response = await axios.get(
				`/api/users/oftutor/${(this.$root.$data as RootData).currentTutor!._id}`
			);

			(this.$root.$data as RootData).users = response.data;
		} catch (error) {
			console.log(`Error: ${error}`);
			if (error instanceof Error) {
				this.error = "Error: " + error.message;
			} else {
				// Handle the case where error is not an instance of Error
				this.error = "An unknown error occurred";
			}
		}
	}

	async logout() {
		if (!this.$root || !this.$root.$data) {
			return;
		}

		try {
			if ((this.$root.$data as RootData).currentTutor)
				await axios.delete("/api/tutors/logout");
			if ((this.$root.$data as RootData).currentUser)
				await axios.delete("/api/users/logout");
			if ((this.$root.$data as RootData).currentAdmin)
				await axios.delete("/api/admins/logout");
			(this.$root.$data as RootData).currentTutor = null;
			(this.$root.$data as RootData).currentUser = null;
			(this.$root.$data as RootData).currentAdmin = null;
		} catch (error) {
			(this.$root.$data as RootData).currentTutor = null;
			(this.$root.$data as RootData).currentUser = null;
			(this.$root.$data as RootData).currentAdmin = null;
		}
	}
}

// TypeScript does not allow the direct manipulation of `window` object in the same way as JavaScript.
// You might want to handle the modal logic inside mounted lifecycle hook or use Vue directives in your template for a more Vue-centric approach.
</script>

<style>
/**************
*   Default   *
**************/

/*noinspection CssOverwrittenProperties*/
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video /* eslint-disable-line */ {
	margin: 0;
	padding: 0;
	border: 0;
	/*font-size: 100%;*/
	/*font: inherit;*/
	vertical-align: baseline;
}

/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section /* eslint-disable-line */ {
	display: block;
}

body {
	line-height: 1;
}

ol, ul /* eslint-disable-line */ {
	list-style: none;
}

blockquote, q /* eslint-disable-line */ {
	quotes: none;
}

/*noinspection CssOverwrittenProperties*/
blockquote:before, blockquote:after,
q:before, q:after /* eslint-disable-line */ {
	content: "";
	content: none;
}

table {
	border-collapse: collapse;
	border-spacing: 0;
}

/**************
*   General   *
**************/

* {
	box-sizing: border-box;
	font-family: Helvetica, Arial, sans-serif;
}

body {
	background-color: rgb(255, 255, 255);
	/*--common_area_background_color: white;*/

	--size_adjustment: 1.5;
	--text_scalar: 1;
}

h1, h2, h3, h4 /* eslint-disable-line */ {
	font-family: Didot, Calibri, Candara, sans-serif;
}

nav {
	font-family: Verdana, Calibri, Candara, sans-serif;
}

.error {
	margin-top: 10px;
	display: inline;
	padding: 5px 20px;
	border-radius: 30px;
	font-size: 10px;
	background-color: #d9534f;
	color: #fff;
}

@media only screen and (min-width: 1px) and (max-width: 960px) {
	body {
		--text_scalar: 0.8;
	}
}

/**************
*   Section   *
**************/

section {
	margin: 4% 10%;
}

section h1 {
	font-size: 50px;
	font-weight: bold;
}

section h2 {
	font-size: 35px;
}

section p,
select,
label {
	font-size: 18px;
	text-align: justify;
	font-family: Optima, sans-serif;
}

img {
	width: 50%;
}

#githubIcon {
	width: 10%;
}

/*#audiotIcon {
  width: 1.6%;
}

#audiotLogo {
  width: 9%;
  transform: translateY(1px);
}*/

/*************
*   Footer   *
*************/

footer {
	display: flex;
	color: grey;
	flex-flow: row wrap;
	padding: 10px;
	width: 100%;
	background-color: rgb(247, 247, 247);
}

footer div {
	width: calc(100% / 3);
}

footer h2 {
	text-transform: uppercase;
	font-size: calc(19px * var(--text_scalar));
	letter-spacing: 2px;
	font-family: Optima, Tahoma, Trebuchet, Arial, sans-serif;
}

footer li {
	font-size: 12px;
	font-family: Arial, "Courier New", sans-serif, serif;
	height: 100%;
}

/********************
*   Media Screens   *
********************/

@media only screen and (min-width: 1px) and (max-width: 960px) {
	section p {
		font-size: 15px;
	}

	img {
		width: 80%;
	}
}
</style>
