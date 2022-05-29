async function deleteUser(element) {
    const userId = parseInt(element.dataset.userId, 0);
    const userRow = document.getElementById(userId.toString())

    const body = {
        userId: userId
    }
    await fetch(window.location.href + '/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).finally(function() {
        userRow.remove()
    });
}

