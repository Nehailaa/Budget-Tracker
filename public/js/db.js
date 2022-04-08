let db;

// Update budget name
const request = indexedDB.open('budget', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('pending', { autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;

    if (navigator.onLine) {
        examineDatabase();
    }
};

request.onerror = function(event) {
    // console log error
    console.log("Whoops! " + event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(['pending'], 'readwrite');

    // access the pending object store
    const  budgetStore = transaction.objectStore('pending');

    // add record to the store with add method
    budgetStore.add(record);
}

function examineDatabase() {

    const transaction = db.transaction(['pending'], 'readwrite');
    const budgetStore = transaction.objectStore('pending');
    const getAll = budgetStore.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(serverFeedback => {
                    if (serverFeedback.message) {
                        throw new Error(serverFeedback);
                    }

                    const transaction = db.transaction(['pending'], 'readwrite');

                    const budgetStore = transaction.objectStore('pending');

                    // clear all items in the store
                    budgetStore.clear();

                    alert('The transactions has been saved and submitted!');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
}

// listen for app coming back online
window.addEventListener('online', examineDatabase);