import "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js";
import "https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyCvn1T4YvYzNItenZ3E40qgCRZI8ZjqEVk",
    authDomain: "libra-engineering.firebaseapp.com",
    projectId: "libra-engineering",
    storageBucket: "libra-engineering.appspot.com",
    messagingSenderId: "568176612388",
    appId: "1:568176612388:web:7112aba10823b7b845f4b1",
    measurementId: "G-NSZBHTHVZ9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', main);
else main();

function main() {
    //connect to firebase and load the data needed to feed this section
    if (getAuthState().state === true) {
        document.getElementById('login-btn').style.display = 'none';

        // create a spinner
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("spinner").classList.add("spinner");
        //fetch data from firebase
        fetchInvoices();
    }
    else {
        alert('Please Login to Continue.......');
        window.location.href = '../pages/login.html';
    }

    eventListeners();

    document.getElementById("unodered-list-invoices").addEventListener("click", (e) => {
        let targetId = "";
        if (e.target.classList.contains("view-btn")) {
            targetId = e.target.id;
            viewInvoice(targetId);
        }
        else if (e.target.classList.contains("delete-btn")) {
            targetId = e.target.id;
            deleteInvoice(targetId);
        }
        else {
            return;
        }
        return;
    })
}

function getAuthState() {
    if (JSON.parse(window.sessionStorage.getItem('authState')) === true) return { state: true }
    return { state: false }
}

function eventListeners() {

    document.getElementById('search-form').addEventListener('submit', (e) => {

        e.preventDefault();

        const searchValue = document.getElementById('search-invoice').value;
        const searchBtn = document.getElementById('search-btn');
        const searchBox = document.getElementById('search-results');
        const closeBtn = document.getElementById('close-btn');


        searchBtn.textContent = 'Searching...';
        searchBox.classList.remove('hidden');
        closeBtn.addEventListener('click', () => {
            searchBox.classList.add('hidden');
            location.href = "";
        });

        if (searchBox.classList.contains('hidden')) {
            console.log('hidden');
        }
        else {
            document.addEventListener('click', (e) => {
                e.preventDefault();
                searchBox.classList.add('hidden');
                location.href = "";
            });
            searchForInvoice(e, searchValue, searchBtn);
        }
    });
}

function totalToString(total) {
    total = total.toString();
    total = [...total];

    if (total.length - 3 == 1) {
        total.splice(total.length - 3, 0, ',');
    }
    else if (total.length - 4 == 1) {
        total.splice(total.length - 3, 0, ',');
    }
    else if (total.length - 5 == 1) {
        total.splice(total.length - 3, 0, ',');
    }
    else if (total.length - 6 == 1) {
        total.splice(total.length - 3, 0, ',');
        total.splice(total.length - 7, 0, ',')
    }
    else if (total.length - 7 == 1) {
        total.splice(total.length - 3, 0, ',');
        total.splice(total.length - 7, 0, ',')
    }
    else if (total.length - 8 == 1) {
        total.splice(total.length - 3, 0, ',');
        total.splice(total.length - 7, 0, ',')
    }
    else if (total.length - 9 == 1) {
        total.splice(total.length - 3, 0, ',');
        total.splice(total.length - 7, 0, ',')
        total.splice(total.length - 11, 0, ',')
    }
    else if (total.length - 10 == 1) {
        total.splice(total.length - 3, 0, ',');
        total.splice(total.length - 7, 0, ',')
        total.splice(total.length - 11, 0, ',')
    }
    else if (total.length - 11 == 1) {
        total.splice(total.length - 3, 0, ',');
        total.splice(total.length - 7, 0, ',')
        total.splice(total.length - 11, 0, ',')
    }
    else if (total.length - 12 == 1) {
        total.splice(total.length - 3, 0, ',');
        total.splice(total.length - 7, 0, ',')
        total.splice(total.length - 11, 0, ',')
        total.splice(total.length - 15, 0, ',')
    }
    else if (total.length - 13 == 1) {
        total.splice(total.length - 3, 0, ',');
        total.splice(total.length - 7, 0, ',')
        total.splice(total.length - 11, 0, ',')
        total.splice(total.length - 15, 0, ',')
    }
    else if (total.length - 14 == 1) {
        total.splice(total.length - 3, 0, ',');
        total.splice(total.length - 7, 0, ',')
        total.splice(total.length - 11, 0, ',')
        total.splice(total.length - 15, 0, ',')
    }
    else if (total.length - 15 == 1) {
        total.splice(total.length - 3, 0, ',');
        total.splice(total.length - 7, 0, ',')
        total.splice(total.length - 11, 0, ',')
        total.splice(total.length - 15, 0, ',')
        total.splice(total.length - 19, 0, ',')
    }
    else if (total.length - 16 == 1) {
        total.splice(total.length - 3, 0, ',');
        total.splice(total.length - 7, 0, ',')
        total.splice(total.length - 11, 0, ',')
        total.splice(total.length - 15, 0, ',')
        total.splice(total.length - 19, 0, ',')
    }

    let newTotalString = '';
    total.forEach(num => {
        newTotalString = newTotalString + num
    })
    return newTotalString;
}


function fetchInvoices() {

    const db = firebase.firestore();
    db.collection("invoices-main")
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.docs.length === 0 || querySnapshot.docs == undefined) {
                //create a div to inform user that invoice database is empty
                document.getElementById('rec-title').style.display = 'none';

                const infoDiv = document.createElement('div');
                infoDiv.classList.add('title');
                infoDiv.innerHTML = 'No recent Invoices';
                document.getElementById('list-of-rec-inv').append(infoDiv);
            }
            else {
                querySnapshot.forEach((doc) => {
                    const receipient = doc.data().Address.receipient;
                    const dateAndTime = doc.data().Address.dateAndTime;
                    const oneProduct = doc.data().Orders[0].order.description;
                    const currency = doc.data().Orders[0].order.price.currency;
                    let total = doc.data().total;
                    total = totalToString(total);

                    const invoiceCard = document.createElement('li');
                    invoiceCard.classList.add('invoice-list-item');
                    invoiceCard.setAttribute('id', `${doc.id}`);
                    invoiceCard.innerHTML = `
                        <div class="buyer-and-item-div">
                            <div class="buyer-name">${receipient}</div>
                            <div class="item-list">${oneProduct}</div>
                        </div>
                        <div class="date-and-time">
                            <div class="date">${dateAndTime}</div>
                        </div>
                        <div class="total-amount">${currency} ${total}.00</div>
                        <div class="action-buttons">
                            <button type="button" class="view-btn" id="${doc.id}">View</button>
                            <button type="button" class="delete-btn" id="${doc.id}">DELETE</button>
                        </div>
                    `;
                    document.getElementById('unodered-list-invoices').append(invoiceCard)
                    //remove spinner
                    document.getElementById("spinner").classList.remove("spinner");
                    document.getElementById("spinner").classList.add("hidden");
                });
            }
        });
}
function viewInvoice(id) {
    localStorage.setItem("view-item", JSON.stringify(id));
    location.href = "../wpages/viewInvoice.html";
}

function deleteInvoice(id) {

}



function searchForInvoice(e, value, btn) {

    const db = firebase.firestore();
    db.collection("invoices-main")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach(doc => {

                const id = doc.id;
                const invoiceTree = doc.data();

                const receipient = invoiceTree["Address"]["receipient"].trim();
                const lpoNumber = invoiceTree["Address"]["lpoNumber"].trim();
                const address = invoiceTree["Address"]["address"].trim();

                if (receipient === value) {
                    //create a card with this info and append to dearch results box
                    appendToSearchDiv(invoiceTree, id);
                }
                else if (lpoNumber == value) {
                    //create a card with this info and append to dearch results box
                    appendToSearchDiv(invoiceTree, id);
                }
                else if (address == value) {
                    //create a card with this info and append to dearch results box
                    appendToSearchDiv(invoiceTree, id);
                }
                else if (receipient != value || lpoNumber != value || address != value) {
                    for (let order of invoiceTree["Orders"]) {
                        // console.log(order.order);
                        const description = order.order.description.trim();
                        const amount = order.order["price"].amount.toString().trim();
                        const quantity = order.order["quantity"].trim();
                        const val = value.toLowerCase();

                        // console.log(typeof(description));
                        // console.log(`${description} ---- ${value}`);
                        // console.log(`${receipient} ---- ${value}`);
                        // console.log(`${typeof(receipient)} ---- ${typeof(value)}`);
                        // console.log(`${address} ---- ${value}`);
                        // console.log(`${lpoNumber} ---- ${value}`);
                        // console.log(`${amount} ---- ${value}`);
                        // console.log(`${quantity} ---- ${value}`);

                        if (description.toLowerCase() == val) {
                            //create a card with this info and append to dearch results box
                            appendToSearchDiv(invoiceTree, id);
                            break;
                        }
                        else if (amount == val) {
                            //create a card with this info and append to dearch results box
                            appendToSearchDiv(invoiceTree, id);
                            break;
                        }
                        else if (quantity.toString().toLowerCase() == val) {
                            //create a card with this info and append to dearch results box
                            appendToSearchDiv(invoiceTree, id);
                            break;
                        }
                    }
                }
                else {
                    alert('no such result found')
                    window.location.href = "";
                }
            })
        })

    btn.textContent = 'SEARCH';
    btn.addEventListener("click", (e) => {
        const searchValue = document.getElementById('search-invoice').value;
        searchForInvoice(e, searchValue, btn);
        eventListeners();
    })
}

function appendToSearchDiv(invoiceTree, id) {

    const invCard = document.createElement('div');
    invCard.classList.add('search-res');
    invCard.setAttribute('id', id);

    const orderArr = invoiceTree["Orders"];
    const lengthOfArr = orderArr.length - 1;

    const receipient = invoiceTree["Address"]["receipient"];

    for (let order of invoiceTree["Orders"]) {
        const description = order.order["description"];
        const amount = order.order["price"].amount;
        const currency = order.order.price["currency"];

        invCard.innerHTML = `
            <div class="upper-hold">
                <div class="res-title">${receipient}</div>
                <div class="price-tot">${currency} ${amount}</div>
            </div>
            <div class="prods">${description} + ${lengthOfArr} others</div>
        `;
    }
    document.getElementById('results-append-here').append(invCard);
    const foundRes = [...document.getElementsByClassName('search-res')];
    if (foundRes.length == 1) document.getElementById('find-count').textContent = foundRes.length + " item found";
    else document.getElementById('find-count').textContent = foundRes.length + " items found"

}