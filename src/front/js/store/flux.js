const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			token: localStorage.getItem("token") || null,
			registered: false,
			login: false,
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},

			// FUNCION LOGIN:
			getLogin: async (data) => {
				const store = getStore();

				try {
					// let response = await fetch("https://3001-jars4u-authenticationre-1cderhmg6ba.ws-us104.gitpod.io/api/login", {
					let response = await fetch(`${process.env.BACKEND_URL}/login`, {

						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(data)
					});
					let dataToken = await response.json();
					console.log(dataToken);
					console.log(response);
					setStore({
						token: dataToken.token,
					});

					localStorage.setItem("token", dataToken.token);
					setStore({
						login: true,
					});

				} catch (error) {
					console.log(error);
				}

			},

			// FUNCION REGISTER:
			getRegister: async (data) => {
				const store = getStore()

				try {
					// let response = await fetch("https://3001-jars4u-authenticationre-1cderhmg6ba.ws-us104.gitpod.io/api/register", {
					let response = await fetch(`${process.env.BACKEND_URL}/register`, {
						method: "POST",
						headers: {
							"Content-type": "application/json"
						},
						body: JSON.stringify(data)
					})
					setStore({
						registered: true
					})
					console.log("User Registered")

				} catch (err) {
					console.log(err)
				}
			},


			//FUNCION LOGOUT:
			logout: () => {
				try {
					localStorage.removeItem('token');
					setStore({
						token: null
					})
				} catch (err) {
					console.log(err)
				}
			}

		}
	};
}

export default getState;
