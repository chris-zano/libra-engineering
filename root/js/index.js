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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);

}
else {
    main();
}

function main() {
    //connect to firebase and load the data needed to feed this section
    if (getAuthState().state === true) {
        document.getElementById('login-btn').style.display = 'none'
        fetchInvoices()
    }
    else {
        alert('Please Login to Continue.......')
        window.location.href = '/pages/login.html';
    }

    eventListeners()
}

function getAuthState() {
    if (JSON.parse(window.sessionStorage.getItem('authState')) === true) return {
        state: true
    }
    return {
        state: false
    }
}

function eventListeners() {

    document.getElementById('search-form').addEventListener('submit', (e) => {
        const searchValue = document.getElementById('search-invoice').value
        const searchBtn = document.getElementById('search-btn')
        const searchBox = document.getElementById('search-results')
        const closeBtn = document.getElementById('close-btn');

        e.preventDefault()
        searchBtn.textContent = 'Searching...'
        searchBox.classList.remove('hidden')
        closeBtn.addEventListener('click', () => searchBox.classList.add('hidden'))

        document.addEventListener('click', (e) => {
            e.preventDefault()
            searchBox.classList.add('hidden')
        })

        searchForInvoice(e, searchValue, searchBtn)
        // const sBoxDiv = document.getElementsByClassName('results-append-here')
        // document.getElementById('find-count').textContent = sBoxDiv.length +1 + ' items found'
    });

    // document.getElementById('view-btn').addEventListener('click', viewInvoice);
    // document.getElementById('delete-btn').addEventListener('click', deleteInvoice);
}

function totalToString(total) {
    total = total.toString()
    total = [...total]

    if (total[total.length - 3] != undefined) {
        total.splice(total.length - 3, 0, ',')
    }
    if (total[total.length - 7] != undefined) {
        total.splice(total.length - 7, 0, ',')
    }
    if (total[total.length - 10] != undefined) {
        total.splice(total.length - 10, 0, ',')
    }
    if (total[total.length - 13] != undefined) {
        total.splice(total.length - 13, 0, ',')
    }
    if (total[total.length - 16] != undefined) {
        total.splice(total.length - 16, 0, ',')
    }
    let newTotalString = ''
    total.forEach(num => {
        newTotalString = newTotalString + num
    })
    return newTotalString;
}


function fetchInvoices() {
    console.log('fetchInvoices function has been called');

    const db = firebase.firestore();
    db.collection("invoices-main")
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.docs.length === 0) {
                //create a div to inform user that invoice database is empty
                document.getElementById('rec-title').style.display = 'none'

                const infoDiv = document.createElement('div');
                infoDiv.classList.add('title')
                infoDiv.innerHTML = 'No recent Invoices';
                document.getElementById('list-of-rec-inv').append(infoDiv)
            }
            else {
                querySnapshot.forEach((doc) => {
                    const receipient = doc.data().Address.receipient
                    const dateAndTime = (doc.data().Address.dateAndTime)

                    const oneProduct = doc.data().Orders[0].order.description
                    const currency = doc.data().Orders[0].order.price.currency
                    let total = (doc.data().total)
                    total = totalToString(total)

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
                            <div class="view-btn" id="${doc.id}">View</div>
                            <div class="delete-btn" id="${doc.id}">DELETE</div>
                        </div>
                    `;
                    document.getElementById('unodered-list-invoices').append(invoiceCard)

                });
            }
        });
}
function viewInvoice() {
    console.log('viewInvoice function has been called');
}

function deleteInvoice() {
    console.log('deleteInvoice function has been called');
}



function searchForInvoice(e, value, btn) {

    console.log(e.target.parentElement, value);

    const db = firebase.firestore();
    db.collection("invoices-main")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach(doc => {
                const id = doc.id
                const invoiceTree = doc.data()

                if (invoiceTree["Address"]["receipient"] == value) {
                    //create a card with this info and append to dearch results box
                    appendToSearchDiv(invoiceTree, id)
                }
                else if (invoiceTree["Address"]["receipient"] != value) {
                    for (let order of invoiceTree["Orders"]) {
                        if ((order.order.description).toString().toLowerCase() == value.toString().toLowerCase()) {
                            //create a card with this info and append to dearch results box
                            appendToSearchDiv(invoiceTree, id, value)
                        }
                    }
                }
                else {
                    alert('no such result found')
                    window.location.href = ''
                }
            })
        })

    btn.textContent = 'Search'
}

function appendToSearchDiv(invoiceTree, id, value) {
    const invCard = document.createElement('div');
    invCard.classList.add('search-res');
    invCard.setAttribute('id', id);

    const receipient = invoiceTree["Address"]["receipient"]
    const currency = invoiceTree["Orders"][0]["order"].price["currency"]
    let total = invoiceTree["total"]
    total = totalToString(total)

    let prodVal;
    const orderArr = invoiceTree["Orders"]
    const lengthOfArr = orderArr.length - 1

    try {
        if (value != null || value != undefined) {

            for (let order of orderArr) {
                if (order.order.description == value) {
                    prodVal = value
                    invCard.innerHTML = `
                        <div class="upper-hold">
                            <div class="res-title">${receipient}</div>
                            <div class="price-tot">${currency} ${total}</div>
                        </div>
                        <div class="prods">${prodVal} + ${lengthOfArr} others</div>
                    `;
                }
                else {
                    prodVal = orderArr[0]["order"].description
                    invCard.innerHTML = `
                        <div class="upper-hold">
                            <div class="res-title">${receipient}</div>
                            <div class="price-tot">${currency} ${total}</div>
                        </div>
                        <div class="prods">${prodVal} + ${lengthOfArr} others</div>
                    `;
                }
            }
        }

        else {

            prodVal = orderArr[0]["order"].description
            invCard.innerHTML = `
                <div class="upper-hold">
                    <div class="res-title">${receipient}</div>
                    <div class="price-tot">${currency} ${total}</div>
                </div>
                <div class="prods">${prodVal} + ${lengthOfArr} others</div>
            `;
        }

    } catch (error) {
        console.log(error);
    }

    document.getElementById('results-append-here').append(invCard)
}