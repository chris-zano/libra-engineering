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

    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault()

        const merchForm = document.getElementsByClassName('merchandise-fill-form');
        if (merchForm[0].children.length == 0) {
            alert('Cannot save an empty form')
        }
        else {
            fetchInputs()
        }
    });

    callForAutoGenerateEventListener()

    document.getElementById('add-field-btn').addEventListener('click', addNewField)

    document.getElementById('delete-row-btn').addEventListener('click', (e) => {
        e.target.parentElement.parentElement.remove();
    })
}

function callForAutoGenerateEventListener() {
    const arrayFields = document.querySelectorAll('input');
    for (let f of arrayFields) {
        if (f.type == 'number') {
            f.addEventListener('change', generateNetPrice)
            console.log(f);
        }
    }
}

function updateInvoiceDatabase(invoice) {
    const db = firebase.firestore();
    db.collection("invoices-main").add(invoice)
        .then((docRef) => {
            alert("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            alert("Error adding document: ", error);
        });
}

function generateNetPrice() {
    const merchForm = document.getElementsByClassName('merchandise-fill-form');
    const limit = merchForm[0].children.length
    let sum = 0;

    console.log(merchForm);

    for (let i = 0; i < limit; i++) {

        const quantity = id(`quantity-${i}`).value
        const unitPrice = id(`unit-price-${i}`).value
        console.log(merchForm[0].children[i]);
        const netPrice = merchForm[0].children[i].querySelector('span')
        console.log(netPrice);

        netPrice.textContent = Number(quantity) * unitPrice

        sum = sum + (Number(quantity) * unitPrice)
    }

    document.getElementById('total').textContent = sum
    // document.getElementById('amount-in-words').textContent = towords(sum)
}



function fetchInputs() {
    //get address fields
    const receipient = document.getElementById('receipient').value;
    const lpoNumber = document.getElementById('lpo-number').value;
    const address = document.getElementById('address').value;
    const dateAndTime = document.getElementById('date').value;

    //get merchandise fields


    const merchForm = document.getElementsByClassName('merchandise-fill-form');
    const limit = merchForm[0].children.length

    const items = []
    for (let i = 0; i < limit; i++) {
        const quantity = id(`quantity-${i}`).value
        const description = id(`description-${i}`).value
        const unitPrice = id(`unit-price-${i}`).value
        const currency = id('currency').value


        items.push({
            order: {
                quantity: quantity,
                description: description,
                price: {
                    currency: currency,
                    amount: unitPrice
                },
                Amount: Number(quantity) * unitPrice
            }
        })
    }

    const Invoice = {
        Address: {
            receipient: receipient,
            lpoNumber: lpoNumber,
            address: address,
            dateAndTime: dateAndTime
        },
        Orders: items
    }
    Invoice.total = document.getElementById('total').textContent
    console.log(Invoice);
    generateNetPrice()
    setTimeout(()=>{
        updateInvoiceDatabase(Invoice)
    },1)
}

function addNewField() {
    // get the length of the table and set as the id of the field
    const merchForm = document.getElementsByClassName('merchandise-fill-form');
    const limit = merchForm[0].children.length
    const id = (Number(limit))
    //create a new card for invoice input and append to the form.

    const newField = document.createElement('div');
    newField.classList.add('parent');
    newField.classList.add('merchandise-clickable');
    newField.setAttribute('id', id);

    newField.innerHTML = `
        <div>
            <label for="quantity-${id}">Quantity</label>
            <input type="number" name="quantity" class="quantity" id="quantity-${id}" required>
        </div>
        <div>
            <label for="description-${id}">description</label>
            <input type="text" name="description" id="description-${id}" required>
        </div>
        <div>
            <label for="unit-price-${id}">
                Unit Price
            </label>

            <input type="number" name="unit-price" id="unit-price-${id}" required>
        </div>
        <div>
            <label for="net-price-${id}">Net Price: </label>
            <span id="net-price-${id}">autogenerated</span>
        </div>
        <div>
            <button type="button" id="delete-row-btn">Delete row</button>
        </div>
    `;
    document.getElementById('merchandise-fill-form').append(newField);
    callForAutoGenerateEventListener()
}


function id(id) {
    return document.getElementById(id)
}