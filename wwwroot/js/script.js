document.addEventListener("DOMContentLoaded", () => {

    const messagesContainer = document.getElementById('messages');
    function renderTable(messages) {
        const messagesArray = Array.isArray(messages) ? messages : [messages];
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        const headers = ['Id', 'Email', 'Text', 'Date', 'Time', 'Action'];

        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        messagesArray.forEach(product => {
            const row = document.createElement('tr');
            Object.values(product).forEach(text => {
                const cell = document.createElement('td');
                cell.textContent = text;
                row.appendChild(cell);
            });
            const actionsCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', async () => {
                await deleteMessage(product.id);
            });
            actionsCell.appendChild(deleteButton);
            row.appendChild(actionsCell);
            table.appendChild(row);
        });

        messagesContainer.innerHTML = '';
        messagesContainer.appendChild(table);
    }

    async function deleteMessage(id) {
        const response = await fetch(`/api/messages/${id}`, {
            method: 'DELETE'
        });
        if (response.status == 204) {
            await loadAllMessages();
        } else {
            console.error('Failed to delete message');
        }
    }

    async function loadAllMessages() {
        const response = await fetch('/api/messages');
        const messages = await response.json();
        renderTable(messages);
    }

    async function searchById(id) {
        if (!id) return;
        const response = await fetch(`/api/messages/${id}`, { method: "GET" });

        if (response.ok) {
            const message = await response.json();
            renderTable(message);
        } else {
            messagesContainer.innerHTML = '<p>Message not found</p>';
        }
    }

    async function searchByEmail(email) {
        if (!email) return;
        const response = await fetch(`/api/messages/${email}`, { method: "GET" });

        if (response.ok) {
            const messages = await response.json();
            renderTable(messages);
        } else {
            messagesContainer.innerHTML = '<p>Messages not found</p>';
        }
    }

    document.querySelector('#loadMessagesButton')
        .addEventListener('click', async () => {
            await loadAllMessages();
        });

    const searchButton = document.getElementById("search");
    if (searchButton) {
        searchButton.addEventListener("click", () => {
            const searchValue = document.getElementById("information")?.value;
            const searchType = document.querySelector('input[name="searchType"]:checked')?.value;
            if (searchType === "id") {
                searchById(searchValue);
            } else if (searchType === "email") {
                searchByEmail(searchValue);
            }
        });
    }
    loadAllMessages();
});