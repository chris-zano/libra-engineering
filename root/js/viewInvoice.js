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

if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", main);
else main();

function main() {
    if (localStorage.getItem("view-item") == null || localStorage.getItem("view-item") == undefined) {
        alert("Invalid Link - This invoice might have been deleted, please contact developer for more details");
    }
    else {
        const orderId = JSON.parse(localStorage.getItem("view-item")).trim();
        console.log(orderId);

        /*search firebase database for the invoice using this id */
        // create a spinner
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("spinner").classList.add("spinner");
        getInvoice(orderId);
    }
}

async function getInvoice(id) {
    const db = firebase.firestore();
    db.collection("invoices-main")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach(doc => {
                if (doc.id == id) {
                    /*
                        *id matches, fetch document and pass as arguement
                        *to "fill table function" 
                    */
                    createTable(doc.data());
                    return;
                }
            })
        })
        .catch(err => {
            if (err) {
                console.error(err.message);
            }
        })
}

function createTable(data) {

    //get address header from data
    const receipient = data.Address.receipient;
    const address = data.Address.address;
    const dateAndTime = data.Address.dateAndTime;
    const lpoNumber = data.Address.lpoNumber;

    const tHead = document.createElement("tr");
    tHead.classList.add("address-header");

    tHead.innerHTML = `   
        <td data-label="Receipient">${receipient}</td>
        <td data-label="Address">${address}</td>
        <td data-label="LPO_Number">${lpoNumber}</td>
        <td data-label="Date_and_Time">${dateAndTime}</td>
    `;

    document.getElementById("main_address_header").append(tHead);


    for (let order of data.Orders) {
        const qty = order.order.quantity;
        const des = order.order.description;
        const net = order.order.Amount;
        const currency = order.order.price.currency;
        const unit = order.order.price.amount;

        const tRow = document.createElement("tr");
        tRow.classList.add("row_order_item");

        tRow.innerHTML = `
            <td data-label="Quantity">${qty}</td>
            <td data-label="Description">${des}</td>
            <td data-label="Unit_Price">${currency} ${unit}</td>
            <td data-label="Net_Price">${currency} ${net}</td>
        `;

        document.getElementById("order_list").append(tRow);
        var total = data.total;
        document.getElementById("total").textContent =`${currency} ${total}` 
    }
    //remove spinner
    document.getElementById("spinner").classList.remove("spinner");
    document.getElementById("spinner").classList.add("hidden");
}