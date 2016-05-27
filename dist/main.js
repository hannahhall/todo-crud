const API_URL = 'https://testproject-92609.firebaseio.com';
var input = $(".inputToDo");
let edit = false;

const getTasks = () => {
	$.get(`${API_URL}/${userId}/tasks.json?auth=${token}`)
		.done((data) => {
			if (data) {
				Object.keys(data).forEach((id) => {
					addToDoItem(data[id], id)
				})
			}
		})
}

const getCompTasks = () => {
	$.get(`${API_URL}/${userId}/completed.json?auth=${token}`)
		.done((data) => {
			if (data) {
				Object.keys(data).forEach((id) => {
					completedItem(data[id], id)
				})
			}
		})
}

const addToDoItem = (item, id) => {
	var row = `<tr data-id="${id}">
		<td class="task">${item.task}</td>
		<td>
			<button class="btn btn-success completeBtn">Complete</button>
			<button class="btn btn-primary editBtn">Edit</button>
			<button class="btn btn-danger delete">Delete</button>
		</td>
	</tr>`;
	$('.toDo').html(row);
}

const completedItem = (item, id) => {
	var row = `<tr data-id="${id}">
		<td>${item.task}</td>
		<td>
			<button class="btn btn-danger delete">Delete</button>
		</td>
	</tr>`;
	$('.completed').html(row);
}

// Moves task from todo list to completed
$('tbody').on('click', '.completeBtn', (e) => {
	var row =  $(e.target).closest('tr');
	var taskId = row.data('id');
	var message = row.children().html();
	console.log(message);
	$.post(`${API_URL}/${userId}/completed.json?auth=${token}`, JSON.stringify({task: `${message}`})).done(() =>
	$.ajax({url: `${API_URL}/${userId}/tasks/${taskId}.json?auth=${token}`, method: 'DELETE'}).done(() => {
		row.remove();
		location.reload();
	}))
})

// CREATE: form submit event to POST data to firebase
$(".buttonSubmit").click(() => {
	if (edit) {
		$.ajax({
			url: `${API_URL}/${userId}/tasks/${taskId}.json?auth=${token}`,
			method: 'PATCH',
			data: JSON.stringify({task: `${input.val()}`})
			}).done(() => {
			location.reload();
		})
		edit = false;
	} else {
		$.post(`${API_URL}/${userId}/tasks.json?auth=${token}`, JSON.stringify({task: `${input.val()}`}))
			.done(() => {
			location.reload();
		});
	}
})

// DELETE: click event on delete to send DELETE to firebase.
$('tbody').on('click', '.delete', (e) => {
	var row =  $(e.target).closest('tr');
	var taskId = row.data('id');
	$.ajax({
		url: `${API_URL}/${userId}/tasks/${taskId}.json?auth=${token}`,
		method: 'DELETE'
	}).done(() => {
		row.remove();
	})
})

//Deletes completed tasks
$('.completed').on('click', '.delete', (e) => {
	var row =  $(e.target).closest('tr');
	var taskId = row.data('id');
	$.ajax({
		url: `${API_URL}/${userId}/completed/${taskId}.json?auth=${token}`,
		method: 'DELETE'
	}).done(() => {
		row.remove()
	})
})

// Edit- moves message to input field
$('.toDo').on('click', '.editBtn', (e) => {
	var row =  $(e.target).closest('tr');
	taskId = row.data('id');
	var message = row.children().html();
	$('.inputToDo').val(message);
	edit = true
})
