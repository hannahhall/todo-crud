let token = null;
let userId = null;
let taskId = null;
// Get info from overview page of project
firebase.initializeApp({
	apiKey: "AIzaSyC9PXIi-vxyHRUFoSPfdwNlylaVuay51c0",
	authDomain: "testproject-92609.firebaseapp.com",
	databaseURL: "https://testproject-92609.firebaseio.com",
	storageBucket: "testproject-92609.appspot.com",
})

	// both return promise like objects
const login = (email, password) => (
	firebase.auth()
		.signInWithEmailAndPassword(email, password)
)

const register = (user, password) => (
	firebase.auth().createUserWithEmailAndPassword(user, password)
)

$('.login form').submit((e) => {
	const form = $(e.target);
	const email = form.find('input[type="text"]').val();
	const password = form.find('input[type="password"]').val();
	// call login function created above
	login(email, password)
		.then(console.log)
		.catch(console.err);
	e.preventDefault();
})

	$('input[value="Register"]').click((e) => {
		const form = $(e.target).closest('form');
		const email = form.find('input[type="text"]').val();
		const password = form.find('input[type="password"]').val();
		// calls register function created above
		register(email, password)
			.then(() => login(email, password))
			.then(console.log)
			.catch(console.err);
		e.preventDefault();
	})

$('.logout').click(() => {
  firebase.auth().signOut();
})

firebase.auth().onAuthStateChanged((user) => {
	if (user) {
		// logged in
		$('.app').show();
		$('.login').hide();
		$('.logged_in_user').text(user.email);
		userId = user.uid;
		user.getToken()
			.then(t => token = t)
			.then(getTasks)
			.then(getCompTasks);
	} else {
		// logged out
		$('.app').hide();
		$('.login').show();
		$('tbody').empty();
	}
})
